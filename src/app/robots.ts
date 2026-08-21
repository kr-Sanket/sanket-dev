import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site.config";

/**
 * robots.txt (Next.js metadata route). Crawling is allowed everywhere —
 * `/recruiter` is intentionally NOT disallowed here: it opts out of indexing
 * via its own `noindex` metadata (ADR-011), and crawlers must be able to
 * fetch the page to see that directive.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
