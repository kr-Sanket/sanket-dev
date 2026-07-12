import { Boxes, Code2, Target } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { Card } from "@/components/ui/card";
import { SECTION_IDS } from "@/lib/constants";
import { getCodingProfiles, totalProblemsSolved } from "./codingProfiles.service";
import { ProfileCard } from "./ProfileCard";

/**
 * Coding Profiles — competitive-programming presence, driven by the resilient
 * `codingProfiles.service` (ISR, 6h). Async server component. Reuses the shared
 * `MetricCard` for aggregate tiles (mirroring the GitHub Hub summary) and shows
 * a graceful placeholder when no usernames are configured. Never fabricates.
 */
export async function CodingProfiles() {
  const { profiles } = await getCodingProfiles();
  const solved = totalProblemsSolved(profiles);

  return (
    <section
      id={SECTION_IDS.codingProfiles}
      className="border-b border-border/60"
    >
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Problem solving"
          title="Coding Profiles"
          description="Competitive programming across the platforms I practice on."
          className="mb-8"
        />

        {profiles.length === 0 ? (
          <UnavailablePlaceholder />
        ) : (
          <div className="flex flex-col gap-10">
            {/* Aggregate summary — reuses MetricCard (only shows derivable values) */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricCard icon={Boxes} value={profiles.length} label="Platforms" />
              {solved > 0 && (
                <MetricCard icon={Target} value={solved} label="Problems Solved" />
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <ProfileCard key={profile.platform} profile={profile} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function UnavailablePlaceholder() {
  return (
    <Card className="flex flex-col items-center gap-3 p-10 text-center">
      <Code2 className="size-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">
        Coding profiles coming soon
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Competitive-programming profiles will appear here once configured.
      </p>
    </Card>
  );
}
