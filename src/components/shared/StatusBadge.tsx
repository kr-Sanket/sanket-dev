import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site.config";
import type { ProjectStatus } from "@/types/project";

/**
 * Reusable project-status pill. Label + color are driven entirely by
 * `siteConfig.projectStatuses`, so the status model stays data-driven and this
 * component works for any current or future `ProjectStatus`.
 *
 * A small leading dot carries the color; the pill itself stays neutral/quiet to
 * match the restrained, engineering-focused aesthetic (no loud gradients).
 */

// Semantic color per status — tuned for both light and dark themes.
const DOT_STYLES: Record<ProjectStatus, string> = {
  completed: "bg-emerald-500",
  "in-progress": "bg-blue-500",
  research: "bg-amber-500",
  planned: "bg-muted-foreground",
};

const TEXT_STYLES: Record<ProjectStatus, string> = {
  completed: "text-emerald-700 dark:text-emerald-400",
  "in-progress": "text-blue-700 dark:text-blue-400",
  research: "text-amber-700 dark:text-amber-500",
  planned: "text-muted-foreground",
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label } = siteConfig.projectStatuses[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 bg-background/60", TEXT_STYLES[status], className)}
    >
      <span
        className={cn("size-1.5 rounded-full", DOT_STYLES[status])}
        aria-hidden
      />
      {label}
    </Badge>
  );
}
