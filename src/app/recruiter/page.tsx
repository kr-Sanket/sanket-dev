import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  Award,
  Brain,
  Code,
  Cpu,
  Database,
  Download,
  FolderKanban,
  GitBranch,
  GraduationCap,
  Mail,
  Server,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getRecruiterData, recruiterMetadata } from "@/lib/recruiter";

export const metadata = recruiterMetadata;

/** Icon-name → lucide, for metric tiles and skill groups (falls back to `Cpu`). */
const ICON_MAP: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "folder-kanban": FolderKanban,
  "git-branch": GitBranch,
  award: Award,
  code: Code,
  server: Server,
  database: Database,
  brain: Brain,
  activity: Activity,
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Formats a `YYYY-MM` string to `Mon YYYY`; passes anything else through. */
function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const idx = Number(month) - 1;
  return MONTHS[idx] ? `${MONTHS[idx]} ${year}` : value;
}

export default async function RecruiterPage() {
  const {
    hero,
    metrics,
    featuredProjects,
    skillGroups,
    timelineHighlights,
    leadership,
    certifications,
    contactLinks,
  } = await getRecruiterData();

  return (
    <div className="pb-20">
      {/* ── 1. Hero ── */}
      <header className="border-b border-border/60">
        <Container className="py-16 sm:py-20">
          <span className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Recruiter Overview
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            {hero.name}
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            {hero.role}
          </p>
          <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
            {hero.bio}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                Availability
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {hero.availability}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                Location
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {hero.location}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={hero.primaryCta.href}
              className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
            >
              {hero.primaryCta.label}
              <Mail />
            </a>
            {hero.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 px-4"
                )}
              >
                {link.label}
                {link.external ? <ArrowUpRight /> : <Download />}
              </a>
            ))}
          </div>
        </Container>
      </header>

      <div className="flex flex-col gap-16 py-16 sm:gap-20 sm:py-20">
        {/* ── 2. Key Metrics ── */}
        {metrics.length > 0 && (
          <Section eyebrow="At a glance" title="Key Metrics">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  icon={ICON_MAP[metric.icon] ?? Cpu}
                  value={metric.value}
                  label={metric.label}
                />
              ))}
            </div>
          </Section>
        )}

        {/* ── 3. Featured Projects ── */}
        {featuredProjects.length > 0 && (
          <Section eyebrow="Selected work" title="Featured Projects">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  href={ROUTES.project(project.slug)}
                />
              ))}
            </div>
          </Section>
        )}

        {/* ── 4. Core Skills ── */}
        {skillGroups.length > 0 && (
          <Section eyebrow="Toolkit" title="Core Skills">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group) => {
                const Icon = ICON_MAP[group.icon] ?? Cpu;
                return (
                  <Card key={group.name} className="gap-2.5 p-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                        aria-hidden
                      >
                        <Icon className="size-4" />
                      </span>
                      <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                        {group.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {group.skills.join(" · ")}
                    </p>
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── 5. Timeline Highlights ── */}
        {timelineHighlights.length > 0 && (
          <Section eyebrow="Trajectory" title="Highlights">
            <ol className="flex max-w-2xl flex-col gap-0" role="list">
              {timelineHighlights.map((event, i) => (
                <li key={`${event.date}-${event.title}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="mt-1.5 size-2.5 shrink-0 rounded-full bg-foreground/60 ring-4 ring-background"
                      aria-hidden
                    />
                    {i < timelineHighlights.length - 1 && (
                      <span className="w-px flex-1 bg-border" aria-hidden />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatMonth(event.date)}
                    </p>
                    <h3 className="mt-0.5 text-sm font-semibold text-foreground">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* ── 6. Leadership ── */}
        {leadership.length > 0 && (
          <Section eyebrow="Beyond code" title="Leadership">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.map((role) => {
                const affiliation = [role.organization, role.institution]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <Card key={role.title} className="gap-2 p-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                        aria-hidden
                      >
                        <Users className="size-4" />
                      </span>
                      <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                        {role.title}
                      </h3>
                    </div>
                    {affiliation && (
                      <p className="text-sm font-medium text-foreground">
                        {affiliation}
                      </p>
                    )}
                    {role.period && (
                      <Badge variant="outline" className="w-fit font-mono">
                        {role.period}
                      </Badge>
                    )}
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── 7. Certifications ── */}
        {certifications.length > 0 && (
          <Section eyebrow="Credentials" title="Certifications">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <Card key={cert.title} className="gap-2 p-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                      aria-hidden
                    >
                      <Award className="size-4" />
                    </span>
                    <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                      {cert.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  {cert.date && (
                    <Badge variant="outline" className="w-fit font-mono">
                      {cert.date}
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* ── 8. Contact ── */}
        {contactLinks.length > 0 && (
          <Section eyebrow="Next step" title="Get in touch">
            <div className="flex flex-wrap gap-3">
              {contactLinks.map((link) => {
                const external = link.url.startsWith("http");
                const isMail = link.url.startsWith("mailto:");
                const ActionIcon = external
                  ? ArrowUpRight
                  : isMail
                    ? Mail
                    : Download;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={`${link.platform} — ${link.label}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-10 px-4"
                    )}
                  >
                    {link.platform}
                    <ActionIcon />
                  </a>
                );
              })}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── Shared section wrapper ───

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} className="mb-8" />
        {children}
      </Container>
    </section>
  );
}
