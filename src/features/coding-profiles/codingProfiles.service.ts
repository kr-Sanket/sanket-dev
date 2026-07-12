import { siteConfig } from "@/data/site.config";
import type { CodingProfile, CodingProfilesData } from "@/types/coding-profile";

/**
 * Coding-profiles data service — the single, reusable source of competitive-
 * programming data. Mirrors the GitHub service's resilience model (ADR-011):
 *
 * - Usernames come only from `siteConfig.codingProfiles` (single source of truth).
 * - ISR: fetches revalidate every 6 hours (`next.revalidate`).
 * - Never throws, never fabricates: a failed/absent stats fetch yields an empty
 *   `stats: {}` (the card then shows just the profile link); an unconfigured
 *   platform is omitted entirely.
 *
 * Only LeetCode exposes a usable (unofficial, unauthenticated) stats endpoint.
 * CodeChef and HackerRank have no reliable public stats API, so they render as
 * link-only profiles rather than inventing numbers.
 */

const REVALIDATE = 21600; // 6 hours (ADR-011)

type Platform = CodingProfile["platform"];

const PROFILE_URL: Record<Platform, (username: string) => string> = {
  leetcode: (u) => `https://leetcode.com/u/${u}/`,
  codechef: (u) => `https://www.codechef.com/users/${u}`,
  hackerrank: (u) => `https://www.hackerrank.com/profile/${u}`,
};

// ─── LeetCode (unofficial public GraphQL) ───

const LEETCODE_QUERY = `
  query($username: String!) {
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
    }
    userContestRanking(username: $username) { rating }
  }
`;

interface LeetCodeResponse {
  data?: {
    matchedUser?: {
      profile?: { ranking?: number };
      submitStatsGlobal?: {
        acSubmissionNum?: { difficulty: string; count: number }[];
      };
    } | null;
    userContestRanking?: { rating?: number } | null;
  };
}

async function fetchLeetCodeStats(
  username: string
): Promise<CodingProfile["stats"]> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "sanket-dev",
        Referer: "https://leetcode.com",
      },
      next: { revalidate: REVALIDATE },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username } }),
    });
    if (!res.ok) return {};
    const json = (await res.json()) as LeetCodeResponse;
    const user = json.data?.matchedUser;
    if (!user) return {};

    const stats: CodingProfile["stats"] = {};
    const solved = user.submitStatsGlobal?.acSubmissionNum?.find(
      (x) => x.difficulty === "All"
    )?.count;
    if (typeof solved === "number") stats.problemsSolved = solved;

    const ranking = user.profile?.ranking;
    if (typeof ranking === "number" && ranking > 0) {
      stats.ranking = `#${ranking.toLocaleString("en-US")}`;
    }

    const contest = json.data?.userContestRanking?.rating;
    if (typeof contest === "number" && contest > 0) {
      stats.contestRating = Math.round(contest);
    }

    return stats;
  } catch {
    return {};
  }
}

async function fetchStats(
  platform: Platform,
  username: string
): Promise<CodingProfile["stats"]> {
  switch (platform) {
    case "leetcode":
      return fetchLeetCodeStats(username);
    // No reliable public stats API — link-only (no fabricated numbers).
    case "codechef":
    case "hackerrank":
    default:
      return {};
  }
}

// ─── Public API ───

/**
 * Build the configured coding profiles. Only platforms with a non-empty username
 * are included; each attempts a stats fetch (empty on failure/unsupported).
 * Never throws.
 */
export async function getCodingProfiles(): Promise<CodingProfilesData> {
  const configured = Object.entries(siteConfig.codingProfiles) as [
    Platform,
    string,
  ][];

  const profiles = await Promise.all(
    configured
      .filter(([, username]) => username.trim() !== "")
      .map(async ([platform, username]) => {
        const stats = await fetchStats(platform, username);
        return {
          platform,
          username,
          profileUrl: PROFILE_URL[platform](username),
          stats,
        } satisfies CodingProfile;
      })
  );

  return { profiles };
}

/** Sum of solved problems across profiles that report it (0 if none do). */
export function totalProblemsSolved(profiles: CodingProfile[]): number {
  return profiles.reduce((sum, p) => sum + (p.stats.problemsSolved ?? 0), 0);
}
