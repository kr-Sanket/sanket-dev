import { getGitHubData } from "@/features/github/github.service";
import { getCertifications, getProjects } from "@/lib/content";
import { siteConfig } from "@/data/site.config";
import type { DashboardMetric } from "@/types/common";

interface DashboardMetricsOptions {
  /**
   * Include the live GitHub repository count. Defaults to true. The
   * recruiter route passes false so it stays pure SSG (the GitHub fetch
   * would otherwise pull that route into ISR) — which also drops the
   * weakest recruiter metric per the P2 review.
   */
  includeRepositories?: boolean;
}

/**
 * The dashboard metrics, derived — never hardcoded (except CGPA, which is
 * owner-attested data with no derivable source):
 * - CGPA        → `siteConfig.dashboard.cgpa` (value + label + icon)
 * - Projects    → count of `getProjects()` (the project JSON files)
 * - Repositories→ count of `getGitHubData().repos` (live, ISR-cached);
 *                 the tile is HIDDEN when the API yields nothing — showing
 *                 0 would misreport a fetch failure as a fact
 * - Certifications → count of `getCertifications().certifications`
 *
 * `siteConfig.dashboard` supplies labels/icons only for the derived
 * metrics; their config `value`s are dead placeholders.
 */
export async function getDashboardMetrics(
  options: DashboardMetricsOptions = {}
): Promise<DashboardMetric[]> {
  const { includeRepositories = true } = options;
  const { cgpa, projects, repositories, certifications } = siteConfig.dashboard;

  const [allProjects, github] = await Promise.all([
    getProjects(),
    includeRepositories ? getGitHubData() : Promise.resolve(null),
  ]);
  const certs = getCertifications().certifications;

  return [
    { ...cgpa },
    { ...projects, value: allProjects.length },
    ...(github && github.repos.length > 0
      ? [{ ...repositories, value: github.repos.length }]
      : []),
    { ...certifications, value: certs.length },
  ];
}
