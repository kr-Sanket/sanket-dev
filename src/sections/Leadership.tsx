import { Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getLeadership } from "@/lib/content";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Leadership — roles from `getLeadership()`, rendered as cards that visually
 * complement Skills / About (same `Card` + grid + icon language). Pure server
 * component (leadership content isn't dual-mode).
 *
 * Cards are composed from the existing `Card`/`Badge` primitives rather than a
 * new shared component — a single-purpose card used only here doesn't warrant
 * one. Every field is guarded so missing values hide gracefully.
 */
export function Leadership() {
  const { roles } = getLeadership();

  if (roles.length === 0) return null;

  return (
    <section id={SECTION_IDS.leadership} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Beyond code"
          title="Leadership & Community"
          className="mb-8"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const affiliation = [role.organization, role.institution]
              .filter(Boolean)
              .join(" · ");

            return (
              <Card
                key={`${role.title}-${role.organization}`}
                className="h-full gap-3 p-5 transition-colors hover:ring-foreground/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                      aria-hidden
                    >
                      <Users className="size-4" />
                    </span>
                    <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                      {role.title}
                    </h3>
                  </span>
                  {role.period && (
                    <Badge
                      variant="outline"
                      className="shrink-0 font-mono text-muted-foreground"
                    >
                      {role.period}
                    </Badge>
                  )}
                </div>

                {affiliation && (
                  <p className="text-sm font-medium text-foreground">
                    {affiliation}
                  </p>
                )}

                {role.description && (
                  <p className="text-sm text-pretty text-muted-foreground">
                    {role.description}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
