import { cn } from "@/lib/utils";
import type { GitHubLanguages } from "@/types/github";

// Solid, theme-friendly palette (no gradients); cycles if there are many languages.
const PALETTE = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
];

/**
 * Language usage as a single proportional bar plus a legend. Percentages are
 * derived from the aggregated language counts — no invented data.
 */
export function LanguageBar({ languages }: { languages: GitHubLanguages }) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label="Language usage distribution"
      >
        {entries.map(([lang, count], i) => (
          <span
            key={lang}
            className={cn("h-full", PALETTE[i % PALETTE.length])}
            style={{ width: `${(count / total) * 100}%` }}
            aria-hidden
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {entries.map(([lang, count], i) => (
          <li
            key={lang}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <span
              className={cn("size-2.5 rounded-full", PALETTE[i % PALETTE.length])}
              aria-hidden
            />
            <span className="text-foreground">{lang}</span>
            <span>{Math.round((count / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
