import {
  Award,
  CheckCircle,
  GitCommitHorizontal,
  GraduationCap,
  Microscope,
  Rocket,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { getProjects, getProjectSlugs, getTimeline } from "@/lib/content";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

// Resolve the content layer's icon-name strings to lucide components.
// Unknown names fall back to a neutral commit glyph.
const EVENT_ICONS: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  rocket: Rocket,
  "check-circle": CheckCircle,
  microscope: Microscope,
  award: Award,
  shield: Shield,
};

/**
 * Engineering Timeline — the project-evolution journey, driven entirely by
 * `getTimeline()`. Alternating center rail on `lg`+, single left-rail column on
 * smaller screens. Async server component: it also loads projects so a related
 * event can show the real project title and link to its detail page (only when
 * a page exists — planned projects have none).
 */
export async function EngineeringTimeline() {
  const { events } = getTimeline();
  if (events.length === 0) return null;

  const [projects, linkableSlugs] = await Promise.all([
    getProjects(),
    getProjectSlugs(),
  ]);
  const titleBySlug = new Map(projects.map((p) => [p.slug, p.title]));
  const linkable = new Set(linkableSlugs);

  // Chronological order (oldest → newest). `YYYY-MM` sorts lexicographically;
  // Array.prototype.sort is stable, so same-month events keep authored order.
  const ordered = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section id={SECTION_IDS.timeline} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Journey"
          title="Engineering Timeline"
          description="Milestones along the way — projects shipped, skills gained, and recognition earned."
          className="mb-10"
        />

        <ol role="list" className="relative mx-auto max-w-4xl">
          {/* vertical rail — decorative */}
          <span
            aria-hidden
            className="absolute top-3 bottom-3 left-3 w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
          />

          {ordered.map((event, i) => {
            const slug = event.relatedProject;
            const relatedProject = slug
              ? {
                  title: titleBySlug.get(slug) ?? slug,
                  href: linkable.has(slug) ? ROUTES.project(slug) : undefined,
                }
              : null;

            return (
              <TimelineItem
                key={`${event.date}-${event.title}`}
                icon={EVENT_ICONS[event.icon] ?? GitCommitHorizontal}
                date={event.date}
                type={event.type}
                title={event.title}
                description={event.description}
                relatedProject={relatedProject}
                side={i % 2 === 0 ? "left" : "right"}
              />
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
