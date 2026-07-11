import { siteConfig } from "@/data/site.config";
import type {
  ContributionCalendar,
  GitHubData,
  GitHubEvent,
  GitHubLanguages,
  GitHubRepo,
} from "@/types/github";

/**
 * GitHub data service — the single, reusable source of GitHub content.
 *
 * - Username comes only from `siteConfig.githubUsername` (single source of truth).
 * - ISR per ADR-011: every request revalidates every hour (`next.revalidate`).
 * - Resilient by construction: any failure returns a typed empty `GitHubData`
 *   (the fallback shape defined by `github.ts`) — never throws, never fabricates
 *   statistics. Callers render graceful placeholders when data is empty.
 * - `GITHUB_TOKEN`, when present, raises rate limits and unlocks the (GraphQL-only)
 *   contribution calendar; without it, `contributions` is `null` and hidden.
 */

const API = "https://api.github.com";
const REVALIDATE = 3600; // 1 hour (ADR-011)
const MAX_REPOS = 100; // one page covers this profile comfortably

/** Typed empty fallback — used whenever live data can't be obtained cleanly. */
const EMPTY_DATA: GitHubData = {
  contributions: null,
  repos: [],
  languages: {},
  events: [],
};

// ─── Raw API shapes (only the fields we consume) ───

interface RawRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

interface RawEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
}

// ─── Low-level fetch ───

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sanket-dev",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** GET a REST endpoint; returns `null` on any non-OK response or network error. */
async function ghGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: buildHeaders(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── Mappers (raw → typed domain models) ───

function mapRepos(raw: RawRepo[] | null): GitHubRepo[] {
  if (!raw) return [];
  return raw
    .filter((r) => !r.fork)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        b.pushed_at.localeCompare(a.pushed_at)
    )
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
    }));
}

/** Aggregate each repo's primary language into a `{ language: repoCount }` map. */
function aggregateLanguages(repos: GitHubRepo[]): GitHubLanguages {
  const languages: GitHubLanguages = {};
  for (const repo of repos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] ?? 0) + 1;
    }
  }
  return languages;
}

/** Human-readable line for a real event type (describes the event; not fabricated). */
function eventMessage(type: string): string {
  switch (type) {
    case "PushEvent":
      return "Pushed commits";
    case "CreateEvent":
      return "Created a repository or branch";
    case "PullRequestEvent":
      return "Opened or updated a pull request";
    case "PullRequestReviewEvent":
      return "Reviewed a pull request";
    case "IssuesEvent":
      return "Opened or updated an issue";
    case "IssueCommentEvent":
      return "Commented on an issue";
    case "WatchEvent":
      return "Starred a repository";
    case "ForkEvent":
      return "Forked a repository";
    case "ReleaseEvent":
      return "Published a release";
    default:
      return type.replace(/Event$/, "");
  }
}

function mapEvents(raw: RawEvent[] | null): GitHubEvent[] {
  if (!raw) return [];
  return raw.map((e) => ({
    id: e.id,
    type: e.type,
    repo: e.repo?.name ?? "",
    message: eventMessage(e.type),
    createdAt: e.created_at,
  }));
}

// ─── Contribution calendar (GraphQL — requires a token) ───

const CONTRIBUTIONS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount color }
          }
        }
      }
    }
  }
`;

interface RawContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: {
      date: string;
      contributionCount: number;
      color: string;
    }[];
  }[];
}

async function fetchContributions(
  login: string
): Promise<ContributionCalendar | null> {
  // The contribution calendar is only exposed via the authenticated GraphQL API.
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { ...buildHeaders(), "Content-Type": "application/json" },
      next: { revalidate: REVALIDATE },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login },
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: RawContributionCalendar;
          };
        };
      };
    };
    const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    return {
      totalContributions: cal.totalContributions,
      weeks: cal.weeks.map((w) => ({
        contributionDays: w.contributionDays.map((d) => ({
          date: d.date,
          contributionCount: d.contributionCount,
          color: d.color,
        })),
      })),
    };
  } catch {
    return null;
  }
}

// ─── Public API ───

/**
 * Fetch all GitHub data for the configured user. Never throws — returns a typed
 * empty `GitHubData` if the username is missing or every request fails.
 */
export async function getGitHubData(): Promise<GitHubData> {
  const login = siteConfig.githubUsername;
  if (!login) return EMPTY_DATA;

  const [reposRaw, eventsRaw, contributions] = await Promise.all([
    ghGet<RawRepo[]>(`/users/${login}/repos?per_page=${MAX_REPOS}&sort=updated`),
    ghGet<RawEvent[]>(`/users/${login}/events/public?per_page=30`),
    fetchContributions(login),
  ]);

  const repos = mapRepos(reposRaw);
  return {
    contributions,
    repos,
    languages: aggregateLanguages(repos),
    events: mapEvents(eventsRaw),
  };
}

/** Total stars across the given repositories. */
export function totalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, r) => sum + r.stars, 0);
}

/** `true` when no live data could be obtained (used to show a placeholder). */
export function isGitHubDataEmpty(data: GitHubData): boolean {
  return (
    data.repos.length === 0 &&
    data.events.length === 0 &&
    data.contributions === null &&
    Object.keys(data.languages).length === 0
  );
}

/** Format an ISO timestamp as e.g. `Mar 3, 2025`; empty string if unparseable. */
export function formatShortDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
