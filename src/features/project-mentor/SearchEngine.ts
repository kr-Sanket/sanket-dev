import type { KnowledgeBaseEntry } from "@/types/project";
import {
  buildIndex,
  type MentorIndex,
} from "@/features/project-mentor/buildIndex";
import {
  cosineSimilarity,
  vectorizeQuery,
} from "@/features/project-mentor/tfidf";
import type { SearchResult } from "@/features/project-mentor/types";

/**
 * Hybrid ranking weights (ADR-009): fuzzy (Fuse.js) 0.4 + semantic (TF-IDF
 * cosine) 0.6. They sum to 1, so the combined confidence stays in `[0, 1]`.
 */
export const MENTOR_WEIGHTS = { fuse: 0.4, tfidf: 0.6 } as const;

/**
 * Minimum combined confidence for a match to be shown (ADR-009). Below this the
 * caller shows the project's static fallback message instead of a weak answer.
 */
export const CONFIDENCE_THRESHOLD = 0.25;

/** How many ranked results `search` returns at most. */
const MAX_RESULTS = 3;

/**
 * Client-side hybrid search over a single project's knowledge base.
 *
 * Combines Fuse.js fuzzy matching with a hand-rolled TF-IDF cosine similarity
 * (ADR-009) — no external AI/API. The public surface is a stable
 * `search(query): SearchResult[]`, so the ranking internals (or a future
 * Transformers.js upgrade) can change without touching callers.
 */
export class SearchEngine {
  private readonly index: MentorIndex;

  constructor(entries: KnowledgeBaseEntry[]) {
    this.index = buildIndex(entries);
  }

  /** True when there is no knowledge base to search (empty project mentor). */
  get isEmpty(): boolean {
    return this.index.entries.length === 0;
  }

  /**
   * Rank knowledge-base entries against `query`, strongest first. Returns only
   * entries at or above `CONFIDENCE_THRESHOLD` (empty when nothing is
   * confident enough — the caller then uses the fallback).
   */
  search(query: string): SearchResult[] {
    const trimmed = query.trim();
    if (!trimmed || this.isEmpty) return [];

    // Fuzzy half: Fuse score is 0 (best) … 1 (worst) → similarity = 1 - score.
    const fuzzyByIndex = new Map<number, number>();
    for (const result of this.index.fuse.search(trimmed)) {
      if (result.refIndex !== undefined) {
        fuzzyByIndex.set(result.refIndex, 1 - (result.score ?? 1));
      }
    }

    // Semantic half: cosine similarity of the query vs. each entry vector.
    const queryVector = vectorizeQuery(this.index.tfidf, trimmed);

    const ranked: SearchResult[] = this.index.entries.map((entry, i) => {
      const fuzzy = fuzzyByIndex.get(i) ?? 0;
      const semantic = cosineSimilarity(
        queryVector,
        this.index.tfidf.documents[i]
      );
      const score =
        MENTOR_WEIGHTS.fuse * fuzzy + MENTOR_WEIGHTS.tfidf * semantic;
      return { entry, score };
    });

    return ranked
      .filter((r) => r.score >= CONFIDENCE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);
  }
}
