import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { getFeaturedProjects } from "@/lib/content";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * Featured Projects — the core of sanket.dev.
 *
 * Server component: pulls featured projects from the content layer (sorted by
 * `order`, filtered to `featured: true`) and renders each through the reusable
 * `ProjectCard`, linking to its SSG detail page via `ROUTES.project`.
 */
export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section id={SECTION_IDS.projects} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Selected work"
          title="Featured Projects"
          description="A focused look at what I've built and what I'm exploring — engineering depth over breadth."
          className="mb-8"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              href={ROUTES.project(project.slug)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
