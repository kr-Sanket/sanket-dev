/**
 * Hand-rolled TF-IDF + cosine similarity — no external NLP/ML dependency.
 *
 * This is the "semantic" half of the Project Mentor's hybrid ranking (ADR-009).
 * It runs entirely client-side over a small (5–15 entry) per-project knowledge
 * base, so the naive `Map`-based vectors are more than fast enough and there is
 * no need for sparse-matrix machinery.
 */

/**
 * Common English words that carry no topical signal. Dropped before indexing so
 * question phrasing ("what", "how", "was") doesn't dominate the similarity.
 */
const STOP_WORDS = new Set([
  "a", "an", "and", "the", "is", "are", "was", "were", "be", "been", "being",
  "of", "to", "in", "on", "for", "with", "at", "by", "from", "as", "into",
  "what", "which", "who", "whom", "how", "why", "when", "where", "does", "do",
  "did", "this", "that", "these", "those", "it", "its", "you", "your", "i",
  "me", "my", "we", "our", "or", "if", "so", "than", "then", "about", "can",
  "could", "would", "should", "will", "used", "use",
]);

/**
 * Very light inflectional stemmer. Collapses common suffixes so query wording
 * matches differently-inflected knowledge-base text (e.g. `monitored` /
 * `monitoring` → `monitor`, `hardest` → `hard`, `containers` → `container`).
 * Conservative by design; applied identically to documents and queries, so
 * consistency (not linguistic perfection) is what matters.
 */
function stem(token: string): string {
  if (token.length <= 3) return token;
  if (token.endsWith("ing") && token.length > 5) return token.slice(0, -3);
  if (token.endsWith("est") && token.length > 4) return token.slice(0, -3);
  if (token.endsWith("ed") && token.length > 4) return token.slice(0, -2);
  if (token.endsWith("ies") && token.length > 4) return token.slice(0, -3) + "y";
  if (token.endsWith("s") && !token.endsWith("ss") && token.length > 3) {
    return token.slice(0, -1);
  }
  return token;
}

/**
 * Lowercase, split on non-alphanumerics, drop stop-words and 1-char tokens,
 * then stem. Shared by both index building and query vectorization so the two
 * sides always live in the same term space.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    .map(stem);
}

/** A term-weight vector plus its precomputed L2 norm. */
export interface TfidfVector {
  weights: Map<string, number>;
  norm: number;
}

/** The fitted model: per-term IDF and one TF-IDF vector per document. */
export interface TfidfModel {
  idf: Map<string, number>;
  documents: TfidfVector[];
}

function termFrequencies(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  // Normalize by document length so long entries aren't unfairly favored.
  const total = tokens.length || 1;
  const tf = new Map<string, number>();
  for (const [term, count] of counts) tf.set(term, count / total);
  return tf;
}

function l2norm(weights: Map<string, number>): number {
  let sum = 0;
  for (const w of weights.values()) sum += w * w;
  return Math.sqrt(sum);
}

/**
 * Fit a TF-IDF model over the given documents (already-joined text per KB
 * entry). Uses smoothed IDF `ln((1 + N) / (1 + df)) + 1` so terms never get a
 * zero or negative weight.
 */
export function buildTfidfModel(docs: string[]): TfidfModel {
  const tokenized = docs.map(tokenize);
  const n = tokenized.length;

  // Document frequency per term.
  const df = new Map<string, number>();
  for (const tokens of tokenized) {
    for (const term of new Set(tokens)) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [term, freq] of df) {
    idf.set(term, Math.log((1 + n) / (1 + freq)) + 1);
  }

  const documents: TfidfVector[] = tokenized.map((tokens) => {
    const tf = termFrequencies(tokens);
    const weights = new Map<string, number>();
    for (const [term, value] of tf) {
      weights.set(term, value * (idf.get(term) ?? 0));
    }
    return { weights, norm: l2norm(weights) };
  });

  return { idf, documents };
}

/** Project a query string into the model's TF-IDF space. */
export function vectorizeQuery(model: TfidfModel, query: string): TfidfVector {
  const tokens = tokenize(query);
  const tf = termFrequencies(tokens);
  const weights = new Map<string, number>();
  for (const [term, value] of tf) {
    const idf = model.idf.get(term);
    // Terms unseen at fit time contribute nothing (idf undefined → skip).
    if (idf !== undefined) weights.set(term, value * idf);
  }
  return { weights, norm: l2norm(weights) };
}

/** Cosine similarity in `[0, 1]` (all weights are non-negative). */
export function cosineSimilarity(a: TfidfVector, b: TfidfVector): number {
  if (a.norm === 0 || b.norm === 0) return 0;
  // Iterate the smaller vector for the dot product.
  const [small, large] = a.weights.size <= b.weights.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [term, weight] of small.weights) {
    const other = large.weights.get(term);
    if (other !== undefined) dot += weight * other;
  }
  return dot / (a.norm * b.norm);
}
