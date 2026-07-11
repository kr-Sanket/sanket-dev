import { Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { getAbout } from "@/lib/content";
import { SECTION_IDS } from "@/lib/constants";

/**
 * About — a read-optimized bio plus a short list of highlights, driven entirely
 * by `getAbout()`. Pure server component (About content isn't dual-mode).
 *
 * The `AboutData` model is `{ bio, highlights }` — there is no interests or
 * closing-statement field, so none is rendered or invented. Every field is
 * guarded so an empty value hides gracefully.
 */
export function About() {
  const { bio, highlights } = getAbout();

  if (!bio && highlights.length === 0) return null;

  return (
    <section id={SECTION_IDS.about} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader eyebrow="About" title="About Me" className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          {/* Biography — comfortable measure, readability over decoration */}
          {bio && (
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
              {bio}
            </p>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Highlights
              </h3>
              <ul className="flex flex-col gap-3">
                {highlights.map((item) => (
                  <li key={item}>
                    <Card className="flex-row items-center gap-3 p-4 transition-colors hover:ring-foreground/20">
                      <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                        aria-hidden
                      >
                        <Check className="size-3.5" />
                      </span>
                      <span className="text-sm font-medium text-pretty text-foreground">
                        {item}
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
