import { existsSync } from "fs";
import path from "path";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FlaskConical,
  Hammer,
  ImageOff,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DualModeText } from "@/components/shared/DualModeText";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProject, getProjectSlugs } from "@/lib/content";
import { createProjectMetadata } from "@/lib/metadata";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GalleryImage, Project } from "@/types/project";

// Only slugs returned by `getProjectSlugs()` are built; `getProjectSlugs`
// excludes `planned` projects. `dynamicParams = false` makes any other slug
// (including a `planned` one) a 404 — planned projects never get a page.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  // Recruiter-depth overview is the stable, always-present description.
  return createProjectMetadata(project.title, project.overview.recruiter, slug);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  // Defensive guard in addition to `dynamicParams = false`.
  if (!project || project.status === "planned") notFound();

  const { architecture, challenges, lessonsLearned, futureImprovements } =
    project;
  const hasArchitecture = architecture.diagram.length > 0;
  const galleryImages = existingImages(project.gallery);

  return (
    <article className="pb-20">
      <ProjectHero project={project} />

      <div className="flex flex-col gap-16 sm:gap-20">
        {/* Overview — dual-mode (recruiter / developer) */}
        <Section id="overview" title="Overview" eyebrow="Summary">
          <DualModeText
            content={project.overview}
            className="max-w-3xl text-base leading-relaxed text-muted-foreground"
          />
        </Section>

        {/* Architecture — static layout only (no interactive viewer yet) */}
        {hasArchitecture && (
          <Section
            id="architecture"
            title="Architecture"
            eyebrow="How it fits together"
          >
            <ArchitectureView project={project} />
          </Section>
        )}

        {/* Challenges */}
        {challenges.length > 0 && (
          <Section id="challenges" title="Challenges" eyebrow="Problems solved">
            <div className="flex flex-col gap-6">
              {challenges.map((c) => (
                <Card key={c.title} className="gap-2 p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {c.title}
                  </h3>
                  <DualModeText
                    content={{ recruiter: c.recruiter, developer: c.developer }}
                    className="text-sm leading-relaxed text-muted-foreground"
                  />
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* Lessons Learned */}
        {lessonsLearned.length > 0 && (
          <Section
            id="lessons"
            title="Lessons Learned"
            eyebrow="What I took away"
          >
            <div className="flex flex-col gap-6">
              {lessonsLearned.map((l) => (
                <Card key={l.title} className="gap-2 p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {l.title}
                  </h3>
                  <DualModeText
                    content={{ recruiter: l.recruiter, developer: l.developer }}
                    className="text-sm leading-relaxed text-muted-foreground"
                  />
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* Future Improvements */}
        {futureImprovements.length > 0 && (
          <Section
            id="future"
            title="Future Improvements"
            eyebrow="What's next"
          >
            <ul className="flex max-w-3xl flex-col gap-3">
              {futureImprovements.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <ArrowRight
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Timeline */}
        <Section id="timeline" title="Timeline" eyebrow="Project evolution">
          <ProjectTimelineView project={project} />
        </Section>

        {/* Gallery — real images when present, tasteful placeholder otherwise */}
        <Section id="gallery" title="Gallery" eyebrow="A closer look">
          {galleryImages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.map((img) => (
                <div
                  key={img.src}
                  className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-foreground/10"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <GalleryPlaceholder />
          )}
        </Section>
      </div>
    </article>
  );
}

// ─── Hero ───

function ProjectHero({ project }: { project: Project }) {
  const { title, tagline, status, techStack, github } = project;
  const hasGithub = Boolean(github?.repoUrl);

  return (
    <header className="border-b border-border/60">
      <Container className="py-12 sm:py-16">
        <Link
          href={`/#${SECTION_IDS.projects}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to projects
        </Link>

        <div className="mt-8 flex flex-col items-start gap-4">
          <StatusBadge status={status} />

          <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            {tagline}
          </p>

          <StatusNote status={status} />

          {techStack.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <li key={tech.name}>
                  <Badge variant="secondary" className="font-mono">
                    {tech.name}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          {hasGithub && (
            <a
              href={github.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-4 h-10 px-4"
              )}
            >
              View on GitHub
              <ExternalLink />
            </a>
          )}
        </div>
      </Container>
    </header>
  );
}

/**
 * Status-driven context line. `in-progress` gets an explicit "Work in Progress"
 * note; `research` explains the intentionally partial page. Copy is UI text
 * keyed off status — not project content — so nothing is hardcoded per project.
 */
function StatusNote({ status }: { status: Project["status"] }) {
  if (status === "in-progress") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400">
        <Hammer className="size-4" aria-hidden />
        Work in Progress — some sections are still being documented.
      </div>
    );
  }
  if (status === "research") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-500">
        <FlaskConical className="size-4" aria-hidden />
        Active research — findings are still being documented.
      </div>
    );
  }
  return null;
}

// ─── Architecture (static) ───

function ArchitectureView({ project }: { project: Project }) {
  const { diagram, edges } = project.architecture;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {diagram.map((node) => (
          <Card key={node.id} className="gap-3 p-5">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-foreground/40"
                aria-hidden
              />
              <h3 className="font-heading text-base font-semibold text-foreground">
                {node.label}
              </h3>
            </div>
            <dl className="flex flex-col gap-2 text-sm">
              <NodeDetail label="Purpose" value={node.details.purpose} />
              <NodeDetail label="Why chosen" value={node.details.whyChosen} />
            </dl>
          </Card>
        ))}
      </div>

      {edges.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Connections
          </p>
          <ul className="flex flex-col gap-2">
            {edges.map((edge) => (
              <li
                key={`${edge.from}-${edge.to}-${edge.label}`}
                className="flex flex-wrap items-center gap-2 text-sm"
              >
                <span className="font-medium text-foreground">
                  {nodeLabel(project, edge.from)}
                </span>
                <ArrowRight
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
                <span className="font-medium text-foreground">
                  {nodeLabel(project, edge.to)}
                </span>
                <span className="text-muted-foreground">— {edge.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function NodeDetail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-muted-foreground">{value}</dd>
    </div>
  );
}

function nodeLabel(project: Project, id: string): string {
  return project.architecture.diagram.find((n) => n.id === id)?.label ?? id;
}

// ─── Timeline ───

function ProjectTimelineView({ project }: { project: Project }) {
  const { startDate, endDate, milestones } = project.timeline;

  return (
    <div className="max-w-2xl">
      <p className="mb-6 font-mono text-sm text-muted-foreground">
        {formatMonth(startDate)} — {endDate ? formatMonth(endDate) : "Present"}
      </p>
      {milestones.length > 0 && (
        <ol className="flex flex-col gap-0">
          {milestones.map((m, i) => (
            <li key={`${m.date}-${m.label}`} className="flex gap-4">
              {/* marker + connector */}
              <div className="flex flex-col items-center">
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full bg-foreground/60 ring-4 ring-background"
                  aria-hidden
                />
                {i < milestones.length - 1 && (
                  <span className="w-px flex-1 bg-border" aria-hidden />
                )}
              </div>
              <div className="pb-6">
                <p className="font-mono text-xs text-muted-foreground">
                  {formatMonth(m.date)}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {m.label}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Gallery placeholder ───

function GalleryPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
      <ImageOff className="size-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">Gallery coming soon</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Screenshots and diagrams for this project will appear here.
      </p>
    </div>
  );
}

// ─── Shared section wrapper ───

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} className="mb-6" />
        {children}
      </Container>
    </section>
  );
}

// ─── Helpers ───

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats a `YYYY-MM` string to `Mon YYYY`; passes anything else through. */
function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const idx = Number(month) - 1;
  return MONTHS[idx] ? `${MONTHS[idx]} ${year}` : value;
}

/**
 * Keep only gallery entries whose files actually exist under `public/`, so we
 * never render broken images for JSON that references not-yet-added assets.
 * Runs at build time (SSG) in this server component.
 */
function existingImages(gallery: GalleryImage[]): GalleryImage[] {
  return gallery.filter(
    (img) => img.src && existsSync(path.join(process.cwd(), "public", img.src))
  );
}
