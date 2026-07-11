import type { DashboardMetric } from "@/types/common";

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
    linkedin: "https://linkedin.com/in/sanketkumar",
    email: "sanket@example.com",
    resume: "/resume.pdf",
  },

  githubUsername: "kr-Sanket",

  // Profile status shown in the Hero status panel. Owner-editable.
  status: {
    availability: "Open to opportunities",
    location: "India",
  },

  dashboard: {
    cgpa: { value: 8.69, label: "CGPA", icon: "graduation-cap" } as DashboardMetric,
    projects: { value: 3, label: "Projects", icon: "folder-kanban" } as DashboardMetric,
    repositories: { value: 15, label: "Repositories", icon: "git-branch" } as DashboardMetric,
    certifications: { value: 1, label: "Certifications", icon: "award" } as DashboardMetric,
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
