/**
 * Twitter/X card image — identical to the Open Graph image, exposed through
 * the `twitter-image` convention so an explicit `twitter:image` tag is
 * emitted (rather than relying on X's og:image fallback), matching the
 * existing `summary_large_image` card declaration in `lib/metadata.ts`.
 */
export { default, alt, size, contentType } from "./opengraph-image";
