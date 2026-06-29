// ─── Project Status ───
export type ProjectStatus = "completed" | "in-progress" | "research" | "planned";

// ─── Architecture Diagram ───
export interface ArchitectureNodeDetails {
  purpose: string;
  whyChosen: string;
  configNotes: string;
  lessonsLearned: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  details: ArchitectureNodeDetails;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label: string;
}

export interface ProjectArchitecture {
  diagram: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

// ─── Tech Stack ───
export interface TechStackItem {
  name: string;
  category: string;
  icon: string;
}

// ─── Dual-Mode Content ───
export interface DualModeContent {
  recruiter: string;
  developer: string;
}

// ─── Challenges / Lessons ───
export interface Challenge {
  title: string;
  recruiter: string;
  developer: string;
}

export interface Lesson {
  title: string;
  recruiter: string;
  developer: string;
}

// ─── Gallery ───
export interface GalleryImage {
  src: string;
  alt: string;
}

// ─── GitHub ───
export interface ProjectGitHub {
  repoUrl: string;
  repoName: string;
}

// ─── Timeline ───
export interface ProjectMilestone {
  date: string;
  label: string;
}

export interface ProjectTimeline {
  startDate: string;
  endDate: string | null;
  milestones: ProjectMilestone[];
}

// ─── Mentor Knowledge Base ───
export interface KnowledgeBaseEntry {
  id: string;
  topic: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export interface ProjectMentor {
  greeting: string;
  knowledgeBase: KnowledgeBaseEntry[];
  fallback: string;
}

// ─── Recruiter Summary ───
export interface RecruiterSummary {
  impact: string;
  outcome: string;
  skills: string[];
}

// ─── Full Project Model ───
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  thumbnail: string;
  coverImage: string;
  overview: DualModeContent;
  architecture: ProjectArchitecture;
  techStack: TechStackItem[];
  challenges: Challenge[];
  lessonsLearned: Lesson[];
  futureImprovements: string[];
  gallery: GalleryImage[];
  github: ProjectGitHub;
  timeline: ProjectTimeline;
  mentor: ProjectMentor;
  recruiterSummary: RecruiterSummary;
}
