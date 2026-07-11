import { Activity } from "lucide-react";
import type { GitHubEvent } from "@/types/github";
import { formatShortDate } from "./github.service";

const MAX_EVENTS = 8;

/**
 * Recent public activity. Each row describes a real event (type → message) with
 * its repo and date. Renders nothing when there are no events.
 */
export function ActivityFeed({ events }: { events: GitHubEvent[] }) {
  if (events.length === 0) return null;
  const recent = events.slice(0, MAX_EVENTS);

  return (
    <ul className="flex flex-col divide-y divide-border/60">
      {recent.map((event) => (
        <li key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
            aria-hidden
          >
            <Activity className="size-3.5" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm text-foreground">{event.message}</span>
            {(event.repo || event.createdAt) && (
              <span className="font-mono text-xs break-words text-muted-foreground">
                {[event.repo, formatShortDate(event.createdAt)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
