import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

/** Max tech-stack chips shown before collapsing the rest into a "+N" badge. */
const MAX_TECH = 6;

/**
 * Placeholder impact values from partially-authored projects start with "TODO".
 * Treat those (and empties) as "no impact available yet".
 */
function getImpact(project: Project): string | null {
  const impact = project.recruiterSummary?.impact?.trim();
  if (!impact || impact.toUpperCase().startsWith("TODO")) return null;
  return impact;
}

interface ProjectCardProps {
  project: Project;
  /**
   * Destination for the card's CTA. Omit while the project detail route isn't
   * built yet — the card then renders a non-interactive placeholder CTA so the
   * layout is final and enabling links later is a one-prop change.
   */
  href?: string;
  className?: string;
}

/**
 * Reusable, presentational card for any `Project`. Clean and engineering-focused
 * with a single subtle hover interaction (ring lift) — no gradients or motion.
 */
export function ProjectCard({ project, href, className }: ProjectCardProps) {
  const { title, tagline, status, techStack } = project;
  const impact = getImpact(project);
  const shownTech = techStack.slice(0, MAX_TECH);
  const overflow = techStack.length - shownTech.length;

  return (
    <Card
      className={cn(
        "h-full justify-between gap-0 p-5 transition-colors hover:ring-foreground/20",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header: status + title + tagline */}
        <div className="flex flex-col gap-3">
          <StatusBadge status={status} />
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="text-sm text-pretty text-muted-foreground">{tagline}</p>
          </div>
        </div>

        {/* Recruiter impact — only when available */}
        {impact && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <TrendingUp
              className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
            <p className="text-sm font-medium text-foreground">{impact}</p>
          </div>
        )}

        {/* Tech stack */}
        {shownTech.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {shownTech.map((tech) => (
              <li key={tech.name}>
                <Badge variant="secondary" className="font-mono">
                  {tech.name}
                </Badge>
              </li>
            ))}
            {overflow > 0 && (
              <li>
                <Badge variant="outline" className="font-mono text-muted-foreground">
                  +{overflow}
                </Badge>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* CTA — link when a route exists, otherwise a quiet placeholder */}
      <div className="mt-6 border-t border-border/60 pt-4">
        {href ? (
          <Link
            href={href}
            className="group/cta inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            View Case Study
            <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Case study coming soon
          </span>
        )}
      </div>
    </Card>
  );
}
