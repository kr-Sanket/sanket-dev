// ─── View Mode ───
export type ViewMode = "recruiter" | "developer";

// ─── Skill Categories ───
export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

// ─── Certifications ───
export interface Certification {
  title: string;
  issuer: string;
  date: string;
  image: string;
  url: string;
}

export interface CertificationsData {
  certifications: Certification[];
}

// ─── Leadership ───
export interface LeadershipRole {
  title: string;
  organization: string;
  institution: string;
  period: string;
  description: string;
}

export interface LeadershipData {
  roles: LeadershipRole[];
}

// ─── Mission ───
export interface MissionData {
  learning: string[];
  building: string[];
  exploring: string[];
}

// ─── About ───
export interface AboutData {
  bio: string;
  highlights: string[];
}

// ─── Contact ───
export interface ContactLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface ContactData {
  links: ContactLink[];
}

// ─── Dashboard Metric ───
export interface DashboardMetric {
  value: number;
  label: string;
  icon: string;
}
