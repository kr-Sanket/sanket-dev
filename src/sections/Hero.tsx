import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Container } from "@/components/layout/Container";
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
    <section id={SECTION_IDS.hero} className="border-b border-border/60">
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
              <Badge key={area} variant="secondary">
                {area}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`#${SECTION_IDS.projects}`}
              className={cn(buttonVariants({ size: "lg" }), CTA_SIZE)}
            >
              View Projects
              <ArrowRight />
            </Link>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                CTA_SIZE
              )}
            >
              GitHub
              <ArrowUpRight />
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
  focus,
  building,
  research,
}: {
  availability: string;
  location: string;
  focus: string[];
  building?: string;
  research?: string;
}) {
  return (
    <Card className="w-full gap-0 p-0">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Engineering Status
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          Active
        </span>
      </div>

      <Separator />

      <div className="flex flex-col gap-6 p-5">
        <div className="grid grid-cols-2 gap-5">
          <StatusBlock label="Availability" value={availability} />
          <StatusBlock label="Location" value={location} />
        </div>

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
