import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { siteConfig } from "@/data/site.config";
import { SECTION_IDS } from "@/lib/constants";
import { ProfileCard } from "./ProfileCard";

/**
 * Coding Profiles — static, config-driven profile links (ADR-015). Pure
 * server component reading `siteConfig.codingProfiles`; no fetching, no
 * statistics, nothing fabricated. When no profiles are configured the
 * section disappears entirely (no placeholder).
 */
export function CodingProfiles() {
  const profiles = siteConfig.codingProfiles;
  if (profiles.length === 0) return null;

  return (
    <section
      id={SECTION_IDS.codingProfiles}
      className="border-b border-border/60"
    >
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Problem solving"
          title="Coding Profiles"
          description="Where I practice algorithms and computer science fundamentals."
          className="mb-8"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profiles.map((profile) => (
            <ProfileCard key={profile.platform} profile={profile} />
          ))}
        </div>
      </Container>
    </section>
  );
}
