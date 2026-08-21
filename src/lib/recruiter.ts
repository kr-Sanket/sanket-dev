/**
 * Recruiter View aggregation layer.
 *
 * The `/recruiter` page consumes ONLY this module for its content, so all
 * shaping/derivation lives here rather than in the page. Everything is pulled
 * from the existing content layer (`lib/content.ts`) and `site.config.ts` — no
 * data is duplicated or invented; this file only selects, trims, and orders
 * what the executive-summary page needs.
 */
import type { Metadata } from "next";
import {
  getAbout,
  getCertifications,
  getContact,
  getFeaturedProjects,
  getLeadership,
  getSkills,
  getTimeline,
} from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site.config";
import type { Project } from "@/types/project";
import type {
  Certification,
  ContactLink,
  LeadershipRole,
  SkillCategory,
} from "@/types/common";
import type { TimelineEvent, TimelineEventType } from "@/types/timeline";

// ─── Shapes ───

export interface RecruiterCta {
  label: string;
  href: string;
  external: boolean;
}

export interface RecruiterHero {
  name: string;
  role: string;
  bio: string;
  availability: string;
  location: string;
  /** Expected graduation, display-ready (e.g. "May 2027"). */
  graduation: string;
  /** Roles actively sought; the page renders them joined. */
  targetRoles: string[];
  /** Prominent lead action (contact). */
  primaryCta: RecruiterCta;
  /** Secondary quick links; only those with a real destination are included. */
  links: RecruiterCta[];
}

export interface RecruiterMetric {
  value: number | string;
  label: string;
  /** Icon-name string, resolved to a lucide icon by the page. */
  icon: string;
}

export interface RecruiterData {
  hero: RecruiterHero;
  metrics: RecruiterMetric[];
  featuredProjects: Project[];
  skillGroups: SkillCategory[];
  timelineHighlights: TimelineEvent[];
  leadership: LeadershipRole[];
  certifications: Certification[];
  contactLinks: ContactLink[];
}

/**
 * Timeline event types considered "major" enough for the recruiter highlights —
 * degree milestones, shipped projects, and achievements. In-progress
 * `project-start` / `learning` entries are intentionally excluded to keep the
 * highlights to the standout moments only.
 */
const HIGHLIGHT_TYPES: ReadonlySet<TimelineEventType> = new Set([
  "milestone",
  "project-end",
  "achievement",
]);

/** Hero identity + lead CTAs, sourced from config + the About bio. */
function buildHero(): RecruiterHero {
  const { name, role, social, status } = siteConfig;
  const { bio } = getAbout();

  const links: RecruiterCta[] = [
    { label: "GitHub", href: social.github, external: true },
    { label: "LinkedIn", href: social.linkedin, external: true },
  ];
  if (social.resume) {
    links.push({ label: "Resume", href: social.resume, external: false });
  }

  return {
    name,
    role,
    bio,
    availability: status.availability,
    location: status.location,
    graduation: status.graduation,
    targetRoles: [...status.targetRoles],
    primaryCta: {
      label: "Get in touch",
      href: `mailto:${social.email}`,
      external: false,
    },
    links,
  };
}

/** The four headline metrics, in a fixed executive order. */
function buildMetrics(): RecruiterMetric[] {
  const { cgpa, projects, repositories, certifications } = siteConfig.dashboard;
  return [cgpa, projects, repositories, certifications].map((m) => ({
    value: m.value,
    label: m.label,
    icon: m.icon,
  }));
}

/** Newest-relevant-first is not needed; keep chronological like the homepage. */
function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregate everything the recruiter page renders. Async because featured
 * projects are filesystem-backed.
 */
export async function getRecruiterData(): Promise<RecruiterData> {
  const featuredProjects = await getFeaturedProjects();

  const timelineHighlights = sortByDate(
    getTimeline().events.filter((e) => HIGHLIGHT_TYPES.has(e.type))
  );

  return {
    hero: buildHero(),
    metrics: buildMetrics(),
    featuredProjects,
    skillGroups: getSkills().categories,
    timelineHighlights,
    leadership: getLeadership().roles,
    certifications: getCertifications().certifications,
    contactLinks: getContact().links,
  };
}

/**
 * Metadata for the private recruiter page. Uses the shared helper but forces
 * `noindex` — this is a private, link-shared executive summary (ADR-011).
 */
export const recruiterMetadata: Metadata = createMetadata({
  title: `Recruiter Overview — ${siteConfig.brand}`,
  description: `A two-minute executive summary of ${siteConfig.name} — key metrics, featured projects, skills, and how to get in touch.`,
  robots: { index: false, follow: false },
});
