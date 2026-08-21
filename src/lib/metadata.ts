import type { Metadata } from "next";
import { siteConfig } from "@/data/site.config";

/**
 * The build-generated OG image route (`app/opengraph-image.tsx`). Declared
 * here as the default for every page because child segments that export
 * their own metadata replace the parent `openGraph`/`twitter` objects
 * wholesale, losing the root file-convention injection. Resolved against
 * `metadataBase`.
 */
const SHARED_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
};

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
  // `openGraph`/`twitter` are merged key-by-key above; they must be excluded
  // from the final top-level spread, which would otherwise REPLACE the merged
  // objects wholesale (dropping defaults like siteName and images).
  const { openGraph, twitter, ...rest } = overrides ?? {};

  return {
    title: overrides?.title ?? siteConfig.title,
    description: overrides?.description ?? siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: (overrides?.title as string) ?? siteConfig.title,
      description: (overrides?.description as string) ?? siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.brand,
      type: "website",
      images: [SHARED_OG_IMAGE],
      ...(openGraph ?? {}),
    },
    twitter: {
      card: "summary_large_image",
      title: (overrides?.title as string) ?? siteConfig.title,
      description: (overrides?.description as string) ?? siteConfig.description,
      images: [SHARED_OG_IMAGE],
      ...(twitter ?? {}),
    },
    robots: {
      index: true,
      follow: true,
    },
    ...rest,
  };
}

/**
 * Site-wide JSON-LD (schema.org): one `@graph` with Person + WebSite,
 * rendered once from the root layout. Every value is reused from
 * `siteConfig` — nothing is fabricated, and fields without trustworthy
 * data (e.g. a real headshot for Person.image) are simply not emitted.
 * The email is included because it is already intentionally public
 * (rendered on the Contact section, Footer, and Recruiter View).
 */
export function getStructuredData(): Record<string, unknown> {
  const personId = `${siteConfig.url}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        email: `mailto:${siteConfig.social.email}`,
        sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
        knowsAbout: [...siteConfig.focusAreas],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.brand,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: { "@id": personId },
      },
    ],
  };
}

/**
 * Serialized JSON-LD for a `<script type="application/ld+json">` tag.
 * `<` is escaped per the Next.js JSON-LD guide to prevent HTML injection
 * (defense in depth — the payload is our own config, not user input).
 */
export function getStructuredDataJson(): string {
  return JSON.stringify(getStructuredData()).replace(/</g, "\\u003c");
}

export function createProjectMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  return createMetadata({
    title: `${title} — ${siteConfig.brand}`,
    description,
    openGraph: {
      url: `${siteConfig.url}/projects/${slug}`,
      type: "article",
    },
  });
}
