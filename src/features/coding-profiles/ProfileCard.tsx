import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PLATFORM_ICONS } from "./icons";
import type { CodingProfileLink } from "@/types/coding-profile";

interface ProfileCardProps {
  profile: CodingProfileLink;
}

/**
 * One coding-profile card: official platform glyph (monochrome by default,
 * official brand color on hover via the `--brand` CSS variable), platform
 * name, @username, description, and a "View Profile" action. The whole card
 * is a single link opening the profile in a new tab; the inner button is
 * presentational (a nested anchor would be invalid). Hover: subtle lift +
 * slightly deeper light-only shadow + arrow nudge — all reduced-motion-safe.
 */
export function ProfileCard({ profile }: ProfileCardProps) {
  const Icon = PLATFORM_ICONS[profile.icon];

  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${profile.platform} profile — @${profile.username} (opens in a new tab)`}
      style={{ "--brand": profile.brandColor } as CSSProperties}
      className="group block h-full rounded-xl focus-visible:outline-none"
    >
      <Card
        className={cn(
          "h-full gap-3 p-5 transition motion-reduce:transition-none",
          "group-hover:-translate-y-0.5 group-hover:ring-foreground/20 motion-reduce:group-hover:translate-y-0",
          "group-hover:shadow-[0_2px_4px_rgb(0_0_0/0.05),0_10px_24px_-8px_rgb(0_0_0/0.1)] dark:group-hover:shadow-none",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring/50"
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted"
            aria-hidden
          >
            {Icon && (
              <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-[var(--brand)] motion-reduce:transition-none" />
            )}
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {profile.platform}
            </h3>
            <span className="truncate font-mono text-xs text-muted-foreground">
              @{profile.username}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{profile.description}</p>

        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-1 w-fit"
          )}
        >
          View Profile
          <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </span>
      </Card>
    </a>
  );
}
