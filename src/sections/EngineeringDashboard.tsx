import {
  Award,
  FolderKanban,
  GitBranch,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { getDashboardMetrics } from "@/lib/metrics";
import { SECTION_IDS } from "@/lib/constants";

// Resolve the content layer's icon-name strings to lucide components.
const METRIC_ICONS: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "folder-kanban": FolderKanban,
  "git-branch": GitBranch,
  award: Award,
};

/**
 * Engineering Dashboard — a pure summary layer over `getDashboardMetrics()`:
 * every count is derived from its single source of truth (project files,
 * certifications data, live GitHub API); only CGPA is owner-attested config.
 * Async server component; the GitHub-backed tile hides itself when the API
 * yields nothing rather than reporting a fake zero.
 */
export async function EngineeringDashboard() {
  const metrics = await getDashboardMetrics();

  return (
    <section
      id={SECTION_IDS.dashboard}
      className="border-b border-border/60 bg-muted/60 dark:bg-muted/15"
    >
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="At a glance"
          title="Engineering Dashboard"
          className="mb-8"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              icon={METRIC_ICONS[metric.icon] ?? FolderKanban}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
