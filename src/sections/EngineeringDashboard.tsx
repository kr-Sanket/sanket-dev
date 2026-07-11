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
import { siteConfig } from "@/data/site.config";
import { SECTION_IDS } from "@/lib/constants";

// Resolve the content layer's icon-name strings to lucide components.
const METRIC_ICONS: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "folder-kanban": FolderKanban,
  "git-branch": GitBranch,
  award: Award,
};

export function EngineeringDashboard() {
  const metrics = Object.values(siteConfig.dashboard);

  return (
    <section id={SECTION_IDS.dashboard} className="border-b border-border/60">
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
