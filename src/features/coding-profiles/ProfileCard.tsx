import { ChefHat, Code2, ExternalLink, Terminal, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CodingProfile } from "@/types/coding-profile";
import { StatsDisplay } from "./StatsDisplay";

// Platform display metadata — no brand glyphs exist in lucide, so use neutral,
// sensible icons. Keeps the same card language as the GitHub feature.
const PLATFORM: Record<
  CodingProfile["platform"],
  { label: string; icon: LucideIcon }
> = {
  leetcode: { label: "LeetCode", icon: Code2 },
  codechef: { label: "CodeChef", icon: ChefHat },
  hackerrank: { label: "HackerRank", icon: Terminal },
};

export function ProfileCard({ profile }: { profile: CodingProfile }) {
  const { label, icon: Icon } = PLATFORM[profile.platform];

  return (
    <Card className="h-full gap-4 p-5 transition-colors hover:ring-foreground/20">
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          aria-hidden
        >
          <Icon className="size-4" />
        </span>
        <div className="flex flex-col">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            {label}
          </h3>
          <span className="font-mono text-xs break-words text-muted-foreground">
            @{profile.username}
          </span>
        </div>
      </div>

      <StatsDisplay stats={profile.stats} />

      <a
        href={profile.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${label} profile of ${profile.username}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-auto w-fit"
        )}
      >
        View profile
        <ExternalLink />
      </a>
    </Card>
  );
}
