import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site.config";
import { ROUTES } from "@/lib/constants";
import { getProjectSlugs } from "@/lib/content";

/**
 * sitemap.xml (Next.js metadata route), generated at build time.
 *
 * Indexable pages only: the homepage and every non-`planned` project page —
 * `getProjectSlugs()` is the same source `generateStaticParams` uses, so the
 * sitemap can never drift from the actually-built routes. `/recruiter` is
 * excluded (noindex, ADR-011); `/_not-found` is not a page.
 *
 * `lastModified` is intentionally omitted: there is no trustworthy per-page
 * source for it (git checkout mtimes are meaningless in CI, and project
 * timeline dates describe the work, not the page). Emitting the build date
 * would falsely claim every page changed on every deploy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();

  return [
    { url: siteConfig.url },
    ...slugs.map((slug) => ({
      url: `${siteConfig.url}${ROUTES.project(slug)}`,
    })),
  ];
}
