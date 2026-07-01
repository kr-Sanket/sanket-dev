/**
 * Content access layer — the single entry point for all application content.
 *
 * Components should consume these helpers instead of importing JSON files or
 * the low-level loaders directly.
 *
 * - Projects are filesystem-backed and async (via `lib/projects.ts`), which
 *   preserves the "add a JSON file, zero code changes" scalability model.
 * - Flat site content is statically imported JSON, returned synchronously and
 *   strongly typed against the models in `src/types/`.
 */
import {
  loadAllProjects,
  loadFeaturedProjects,
  loadProject,
  loadProjectSlugs,
} from "@/lib/projects";
import type { Project } from "@/types/project";
import type { TimelineData } from "@/types/timeline";
import type {
  AboutData,
  CertificationsData,
  ContactData,
  LeadershipData,
  MissionData,
  SkillsData,
} from "@/types/common";

import skillsData from "@/data/skills.json";
import missionData from "@/data/mission.json";
import timelineData from "@/data/timeline.json";
import leadershipData from "@/data/leadership.json";
import certificationsData from "@/data/certifications.json";
import aboutData from "@/data/about.json";
import contactData from "@/data/contact.json";

// ─── Projects (filesystem-backed, async) ───

export function getProjects(): Promise<Project[]> {
  return loadAllProjects();
}

export function getProject(slug: string): Promise<Project | null> {
  return loadProject(slug);
}

export function getFeaturedProjects(): Promise<Project[]> {
  return loadFeaturedProjects();
}

/** Slugs of all non-`planned` projects — for `generateStaticParams`. */
export function getProjectSlugs(): Promise<string[]> {
  return loadProjectSlugs();
}

// ─── Site content (statically imported, strongly typed) ───

export function getSkills(): SkillsData {
  return skillsData;
}

export function getMission(): MissionData {
  return missionData;
}

export function getTimeline(): TimelineData {
  // `type` widens to `string` on JSON import (resolveJsonModule); the values
  // are validated union members, so the assertion is safe.
  return timelineData as TimelineData;
}

export function getLeadership(): LeadershipData {
  return leadershipData;
}

export function getCertifications(): CertificationsData {
  return certificationsData;
}

export function getAbout(): AboutData {
  return aboutData;
}

export function getContact(): ContactData {
  return contactData;
}
