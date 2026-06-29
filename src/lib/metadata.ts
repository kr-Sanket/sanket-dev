import type { Metadata } from "next";
import { siteConfig } from "@/data/site.config";

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
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
      ...(overrides?.openGraph ?? {}),
    },
    twitter: {
      card: "summary_large_image",
      title: (overrides?.title as string) ?? siteConfig.title,
      description: (overrides?.description as string) ?? siteConfig.description,
      ...(overrides?.twitter ?? {}),
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
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
