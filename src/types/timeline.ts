export type TimelineEventType =
  | "project-start"
  | "project-end"
  | "milestone"
  | "achievement"
  | "learning";

export interface TimelineEvent {
  date: string;
  type: TimelineEventType;
  title: string;
  description: string;
  icon: string;
  relatedProject: string | null;
  status?: string;
}

export interface TimelineData {
  events: TimelineEvent[];
}
