import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimelineEventType } from "@/types/timeline";

/**
 * Subtle per-type accent, using the same palette approach as `StatusBadge`
 * (colored dot + quiet text, no loud fills). Keyed by the real `timeline.json`
 * event-type union — no invented types.
 */
const ACCENT: Record<TimelineEventType, { dot: string; text: string }> = {
  "project-start": { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400" },
  "project-end": {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  milestone: {
    dot: "bg-violet-500",
    text: "text-violet-700 dark:text-violet-400",
  },
  achievement: {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-500",
  },
  learning: { dot: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-400" },
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** `YYYY-MM` → `Mon YYYY`; passes anything else through unchanged. */
function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const idx = Number(month) - 1;
  return MONTHS[idx] ? `${MONTHS[idx]} ${year}` : value;
}

/** Humanize an event type slug, e.g. `project-start` → `Project Start`. */
function humanizeType(type: string): string {
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface TimelineItemProps {
  /** Resolved lucide icon (the section maps icon-name → component). */
  icon: LucideIcon;
  /** Raw `YYYY-MM` date; rendered in a semantic `<time>`. */
  date: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  /**
   * Related project, when the event references one. `href` is set only when a
   * detail page actually exists for it (planned projects have none).
   */
  relatedProject?: { title: string; href?: string } | null;
  /** Which side of the center rail the card sits on at `lg`+ (alternating). */
  side: "left" | "right";
}

/**
 * One entry in the Engineering Timeline. Presentational and reusable: a marker
 * dot on the rail plus a `Card` with date/icon, type badge, title, description,
 * and optional related-project link. Alternates left/right at `lg`+, stacks to
 * a single left-rail column below. No motion; reduced-motion-safe.
 */
export function TimelineItem({
  icon: Icon,
  date,
  type,
  title,
  description,
  relatedProject,
  side,
}: TimelineItemProps) {
  const accent = ACCENT[type];

  return (
    <li className="relative pl-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pl-0">
      {/* marker on the rail — decorative */}
      <span
        aria-hidden
        className={cn(
          "absolute top-3 left-3 size-3 -translate-x-1/2 rounded-full ring-4 ring-background lg:left-1/2",
          accent.dot
        )}
      />

      <div
        className={cn(
          "pb-8 lg:pb-12",
          side === "left" ? "lg:col-start-1 lg:pr-12" : "lg:col-start-2 lg:pl-12"
        )}
      >
        <Card className="gap-3 p-5 transition-colors hover:ring-foreground/20">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                aria-hidden
              >
                <Icon className="size-4" />
              </span>
              <time dateTime={date} className="font-mono text-xs text-muted-foreground">
                {formatMonth(date)}
              </time>
            </span>
            <Badge variant="outline" className={cn("shrink-0", accent.text)}>
              {humanizeType(type)}
            </Badge>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {relatedProject &&
            (relatedProject.href ? (
              <Link
                href={relatedProject.href}
                className="group/rel inline-flex w-fit items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {relatedProject.title}
                <ArrowUpRight className="size-3.5 transition-transform group-hover/rel:translate-x-0.5 group-hover/rel:-translate-y-0.5" />
              </Link>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {relatedProject.title}
              </span>
            ))}
        </Card>
      </div>
    </li>
  );
}
