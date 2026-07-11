import type { ContributionCalendar } from "@/types/github";

/**
 * Static contribution heatmap (weeks × days), colored by the calendar's own
 * per-day colors from the GitHub API. Only rendered when contribution data is
 * available (a token is configured). The grid scrolls within its own container
 * on narrow screens so the page itself never overflows horizontally.
 */
export function ContributionHeatmap({
  calendar,
}: {
  calendar: ContributionCalendar;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto pb-1">
        <div
          className="flex gap-1"
          role="img"
          aria-label={`${calendar.totalContributions} contributions in the last year`}
        >
          {calendar.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.contributionDays.map((day) => (
                <span
                  key={day.date}
                  title={`${day.contributionCount} contribution${
                    day.contributionCount === 1 ? "" : "s"
                  } on ${day.date}`}
                  className="size-2.5 rounded-[2px]"
                  style={{ backgroundColor: day.color }}
                  aria-hidden
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        {calendar.totalContributions} contributions in the last year
      </p>
    </div>
  );
}
