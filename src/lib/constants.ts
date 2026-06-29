// ─── Route Paths ───
export const ROUTES = {
  home: "/",
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}`,
  recruiter: "/recruiter",
} as const;

// ─── Section IDs (for scrollspy) ───
export const SECTION_IDS = {
  hero: "hero",
  projects: "projects",
  dashboard: "dashboard",
  timeline: "timeline",
  github: "github",
  codingProfiles: "coding-profiles",
  mission: "mission",
  skills: "skills",
  leadership: "leadership",
  certifications: "certifications",
  about: "about",
  contact: "contact",
} as const;

// ─── External URLs ───
export const EXTERNAL_URLS = {
  github: "https://github.com/kr-Sanket",
  linkedin: "https://linkedin.com/in/sanketkumar",
} as const;

// ─── Animation ───
export const ANIMATION = {
  staggerChildren: 0.1,
  duration: 0.5,
  ease: [0.25, 0.4, 0.25, 1] as readonly number[],
} as const;
