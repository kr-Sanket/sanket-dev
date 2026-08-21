import type { DashboardMetric } from "@/types/common";
import type { CodingProfileLink } from "@/types/coding-profile";

export const siteConfig = {
  name: "Sanket Kumar",
  brand: "sanket.dev",
  title: "Sanket Kumar — Software Engineer",
  description:
    "Building intelligent systems, automating workflows, and solving engineering problems.",
  tagline:
    "Building intelligent systems, automating workflows, and solving engineering problems.",
  url: "https://sanket.dev",

  role: "Computer Science Student @ VIT",
  focusAreas: ["Software Engineering", "DevOps", "Artificial Intelligence"],

  social: {
    github: "https://github.com/kr-Sanket",
    linkedin: "https://www.linkedin.com/in/sanket-kumar-515bb228a/",
    email: "kumarsanket.jsr82@gmail.com",
    resume: "/resume.pdf",
  },

  githubUsername: "kr-Sanket",

  // Profile status shown in the Hero status panel and Recruiter View.
  // Owner-editable. `graduation` is a display string; `targetRoles` lists the
  // roles actively sought (rendered joined or as a list by each surface).
  status: {
    availability: "Open to full-time opportunities",
    location: "India",
    graduation: "May 2027",
    targetRoles: ["Software Engineer", "Backend Engineer", "DevOps Engineer"],
  },

  // Coding profiles — owner-editable, the single source of truth for the
  // Coding Profiles section (static link cards, no fetched stats — ADR-015).
  // An empty array hides the section entirely.
  codingProfiles: [
    {
      platform: "LeetCode",
      username: "SANKET_2912",
      url: "https://leetcode.com/u/SANKET_2912/",
      description: "Algorithmic problem solving and interview preparation.",
      icon: "leetcode",
      brandColor: "#FFA116",
    },
    {
      platform: "GeeksforGeeks",
      username: "kumarsankgkax",
      url: "https://www.geeksforgeeks.org/profile/kumarsankgkax",
      description: "Computer science fundamentals and programming practice.",
      icon: "geeksforgeeks",
      brandColor: "#2F8D46",
    },
  ] satisfies readonly CodingProfileLink[],

  // Dashboard metric definitions. Only CGPA's `value` is authoritative
  // (owner-attested, no derivable source). The other `value`s are dead
  // placeholders — real counts are derived in `lib/metrics.ts` from the
  // projects/certifications data and the live GitHub API.
  dashboard: {
    cgpa: { value: 8.69, label: "CGPA", icon: "graduation-cap" } as DashboardMetric,
    projects: { value: 0, label: "Projects", icon: "folder-kanban" } as DashboardMetric,
    repositories: { value: 0, label: "Repositories", icon: "git-branch" } as DashboardMetric,
    certifications: { value: 0, label: "Certifications", icon: "award" } as DashboardMetric,
  },

  projectStatuses: {
    completed: { label: "Completed", color: "emerald" },
    "in-progress": { label: "In Progress", color: "blue" },
    research: { label: "Research", color: "amber" },
    planned: { label: "Planned", color: "muted" },
  },

  navLinks: [
    { label: "Projects", href: "#projects" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "GitHub", href: "#github" },
    { label: "Skills", href: "#skills" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
