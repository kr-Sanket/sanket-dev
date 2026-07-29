import type { KnowledgeBaseEntry } from "@/types/project";
import {
  buildIndex,
  type MentorIndex,
} from "@/features/project-mentor/buildIndex";
import {
  cosineSimilarity,
  tokenize,
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

    const fuzzyByIndex = this.fuzzySimilarities(trimmed);

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

  /**
   * Fuzzy similarity per entry index, in `[0, 1]`. Fuse bitap-matches its whole
   * pattern, so a natural-language question ("why did you pick jenkins") scores
   * poorly against short fields even when one word is an exact keyword hit. To
   * fix that, each entry gets the best of:
   *
   * - the full-query similarity (favors queries close to an authored question),
   * - the mean of per-token similarities (token coverage — favors queries whose
   *   content words match, while a single stray token can't carry an off-topic
   *   query past the threshold).
   *
   * Fuse similarity = `1 - score` (Fuse: 0 best … 1 worst). Tokens reuse the
   * TF-IDF `tokenize` so both halves share one vocabulary discipline.
   */
  private fuzzySimilarities(query: string): Map<number, number> {
    const fullQuery = new Map<number, number>();
    for (const result of this.index.fuse.search(query)) {
      if (result.refIndex !== undefined) {
        fullQuery.set(result.refIndex, 1 - (result.score ?? 1));
      }
    }

    const tokens = tokenize(query);
    const tokenSums = new Map<number, number>();
    for (const token of tokens) {
      for (const result of this.index.fuse.search(token)) {
        if (result.refIndex !== undefined) {
          tokenSums.set(
            result.refIndex,
            (tokenSums.get(result.refIndex) ?? 0) + (1 - (result.score ?? 1))
          );
        }
      }
    }

    const combined = new Map<number, number>();
    const tokenCount = tokens.length || 1;
    for (const i of new Set([...fullQuery.keys(), ...tokenSums.keys()])) {
      combined.set(
        i,
        Math.max(fullQuery.get(i) ?? 0, (tokenSums.get(i) ?? 0) / tokenCount)
      );
    }
    return combined;
  }
}
