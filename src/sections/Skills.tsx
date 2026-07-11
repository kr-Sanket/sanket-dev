import {
  Activity,
  Brain,
  Code,
  Cpu,
  Database,
  Server,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SkillCategory } from "@/components/shared/SkillCategory";
import { getSkills } from "@/lib/content";
import { SECTION_IDS } from "@/lib/constants";

// Resolve the content layer's icon-name strings to lucide components.
// Same pattern as EngineeringDashboard; unknown names fall back to a generic icon.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  code: Code,
  server: Server,
  database: Database,
  brain: Brain,
  activity: Activity,
};

/**
 * Skills & Technologies — a grid of skill-category cards, driven entirely by
 * `getSkills()` (categories, icons, and technologies all come from
 * `skills.json`). Pure server component: skills content isn't dual-mode.
 */
export function Skills() {
  const { categories } = getSkills();

  if (categories.length === 0) return null;

  return (
    <section id={SECTION_IDS.skills} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Capabilities"
          title="Skills & Technologies"
          description="The languages, tools, and platforms I build with day to day."
          className="mb-8"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <SkillCategory
              key={category.name}
              icon={CATEGORY_ICONS[category.icon] ?? Cpu}
              name={category.name}
              skills={category.skills}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
