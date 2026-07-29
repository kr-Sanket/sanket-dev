import Fuse, { type FuseOptionKey } from "fuse.js";
import type { KnowledgeBaseEntry } from "@/types/project";
import { buildTfidfModel, type TfidfModel } from "@/features/project-mentor/tfidf";

/**
 * The precomputed search index for one project's knowledge base: the entries,
 * a Fuse instance (fuzzy half) and a TF-IDF model (semantic half). Built once
 * per project and reused across queries.
 */
export interface MentorIndex {
  entries: KnowledgeBaseEntry[];
  fuse: Fuse<KnowledgeBaseEntry>;
  tfidf: TfidfModel;
}

/**
 * The searchable text for one entry. Keywords are repeated so an exact keyword
 * hit weighs more in the TF-IDF space (the JSON authors curate keywords
 * specifically as retrieval hints).
 */
function entryDocument(entry: KnowledgeBaseEntry): string {
  const keywords = entry.keywords.join(" ");
  return [entry.question, entry.topic, keywords, keywords, entry.answer].join(
    " "
  );
}

/** Fuse fields and weights — the question and curated keywords matter most. */
const FUSE_KEYS: FuseOptionKey<KnowledgeBaseEntry>[] = [
  { name: "question", weight: 0.4 },
  { name: "keywords", weight: 0.3 },
  { name: "topic", weight: 0.2 },
  { name: "answer", weight: 0.1 },
];

export function buildIndex(entries: KnowledgeBaseEntry[]): MentorIndex {
  const fuse = new Fuse(entries, {
    keys: FUSE_KEYS,
    includeScore: true,
    // Permissive: we want scores for many candidates and do our own combined
    // thresholding in SearchEngine, rather than letting Fuse pre-filter.
    threshold: 0.6,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });

  const tfidf = buildTfidfModel(entries.map(entryDocument));

  return { entries, fuse, tfidf };
}
