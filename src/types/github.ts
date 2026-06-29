export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  message: string;
  createdAt: string;
}

export interface GitHubData {
  contributions: ContributionCalendar | null;
  repos: GitHubRepo[];
  languages: GitHubLanguages;
  events: GitHubEvent[];
}
