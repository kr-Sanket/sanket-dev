import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { HashLink } from "@/components/shared/HashLink";
import { HeroAmbientScene } from "@/components/shared/HeroAmbientScene";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site.config";
import { getMission } from "@/lib/content";
import { SECTION_IDS } from "@/lib/constants";

const CTA_SIZE = "h-10 px-5";

export function Hero() {
  const { name, role, tagline, focusAreas, social, status } = siteConfig;
  const mission = getMission();

  return (
    <section
      id={SECTION_IDS.hero}
      className="relative isolate overflow-hidden border-b border-border/60"
    >
      {/* Ambient hero scene (Phase 2.6) — three art-directed soft lights
          with a few px of cursor parallax. Replaces the Phase-2 single top
          wash, whose shading role the scene's neutral light absorbs. */}
      <HeroAmbientScene />
      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16 lg:py-0">
        {/* ── Left: identity — small intro → name → role → tagline → focus → CTAs ── */}
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium text-muted-foreground">
            Hi, I&apos;m
          </p>
          <h1 className="mt-1 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            {name}
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">{role}</p>
          <p className="mt-5 max-w-md text-lg text-pretty text-muted-foreground">
            {tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              // Outline over `secondary`: the 0.97 secondary fill washed out
              // against the Phase-1 off-white page; a hairline chip stays quiet
              // but legible on both themes.
              <Badge key={area} variant="outline" className="bg-card/60">
                {area}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <HashLink
              href={`#${SECTION_IDS.projects}`}
              className={cn(buttonVariants({ size: "lg" }), CTA_SIZE, "group")}
            >
              View Projects
              <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </HashLink>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                CTA_SIZE,
                "group"
              )}
            >
              GitHub
              <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
            </a>
            {social.resume && (
              <a
                href={social.resume}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "h-10 px-4"
                )}
              >
                Resume
                <Download />
              </a>
            )}
          </div>
        </div>

        {/* ── Right: engineering status panel — the visual anchor ── */}
        <EngineeringStatusPanel
          availability={status.availability}
          location={status.location}
          graduation={status.graduation}
          seeking={status.targetRoles.join(" · ")}
          focus={mission.learning}
          building={mission.building[0]}
          research={mission.exploring[0]}
        />
      </Container>
    </section>
  );
}

function EngineeringStatusPanel({
  availability,
  location,
  graduation,
  seeking,
  focus,
  building,
  research,
}: {
  availability: string;
  location: string;
  graduation: string;
  seeking: string;
  focus: string[];
  building?: string;
  research?: string;
}) {
  return (
    // The hero's visual anchor: one step more elevation than the site's
    // standard card (deeper ambient shadow, light only) plus a quiet
    // console-style title bar. Dark keeps its tonal system.
    <Card className="w-full gap-0 p-0 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_12px_32px_-12px_rgb(0_0_0/0.12)] dark:shadow-none">
      <div className="flex items-center justify-between bg-muted/40 px-5 py-4">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Engineering Status
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
          </span>
          Active
        </span>
      </div>

      <Separator />

      <div className="flex flex-col gap-6 p-5">
        <div className="grid grid-cols-2 gap-5">
          <StatusBlock label="Availability" value={availability} />
          <StatusBlock label="Location" value={location} />
          <StatusBlock label="Graduation" value={graduation} />
        </div>

        {seeking && <StatusBlock label="Seeking" value={seeking} />}

        <StatusBlock label="Current Focus">
          <ul className="flex flex-col gap-1.5">
            {focus.map((item) => (
              <li key={item} className="text-sm text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </StatusBlock>

        {building && <StatusBlock label="Currently Building" value={building} />}
        {research && <StatusBlock label="Research" value={research} />}
      </div>
    </Card>
  );
}

function StatusBlock({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {value ? (
        <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
      ) : (
        <div className="mt-1.5">{children}</div>
      )}
    </div>
  );
}
