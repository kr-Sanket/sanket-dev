import type { KnowledgeBaseEntry } from "@/types/project";

/**
 * A knowledge-base entry ranked by the hybrid search engine. `score` is the
 * combined confidence in `[0, 1]` (see `SearchEngine`), where higher is a
 * stronger match.
 */
export interface SearchResult {
  entry: KnowledgeBaseEntry;
  score: number;
}

/** A single line in the mentor transcript. */
export interface MentorMessage {
  id: number;
  role: "user" | "mentor";
  text: string;
  /**
   * For a mentor answer that came from the knowledge base, the source entry —
   * used to surface the matched topic. Absent for the greeting and the
   * fallback response (nothing was matched).
   */
  source?: KnowledgeBaseEntry;
}
