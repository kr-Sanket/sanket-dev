import type { CodingProfile } from "@/types/coding-profile";

/**
 * Renders the available statistics for a coding profile as compact value/label
 * pairs. Only stats that exist are shown (no fabricated zeros); renders nothing
 * when no stats are available — the card then relies on its profile link.
 *
 * Plain elements (not nested `MetricCard`s) to avoid double-card borders inside
 * `ProfileCard`; the aggregate `MetricCard` tiles live at the section level.
 */

type Stats = CodingProfile["stats"];

// Order + labels for the optional stat fields defined by the type.
const STAT_FIELDS: { key: keyof Stats; label: string }[] = [
  { key: "problemsSolved", label: "Solved" },
  { key: "rating", label: "Rating" },
  { key: "contestRating", label: "Contest Rating" },
  { key: "ranking", label: "Ranking" },
  { key: "badges", label: "Badges" },
  { key: "streak", label: "Streak" },
];

export function StatsDisplay({ stats }: { stats: Stats }) {
  const present = STAT_FIELDS.filter(({ key }) => stats[key] !== undefined);
  if (present.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-3">
      {present.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-0.5">
          <dt className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {label}
          </dt>
          <dd className="font-mono text-lg font-semibold tabular-nums text-foreground">
            {typeof stats[key] === "number"
              ? (stats[key] as number).toLocaleString("en-US")
              : stats[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
