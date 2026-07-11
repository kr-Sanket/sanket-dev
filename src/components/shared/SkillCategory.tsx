import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkillCategoryProps {
  /** Resolved lucide icon for this category (the section maps icon-name → component). */
  icon: LucideIcon;
  /** Category title (rendered as an `<h3>` beneath the section's `<h2>`). */
  name: string;
  /** Technologies in this category — rendered as chips. */
  skills: string[];
  /** Optional short description — only shown when the data actually provides one. */
  description?: string;
  className?: string;
}

/**
 * Reusable skill-category card: icon + title + (optional) description + a
 * wrapping list of technology chips. Presentational and animation-ready; a
 * single subtle ring-lift hover matches `MetricCard`/`ProjectCard`. Chips reuse
 * the same `Badge` styling as the project tech stack for a consistent system.
 */
export function SkillCategory({
  icon: Icon,
  name,
  skills,
  description,
  className,
}: SkillCategoryProps) {
  return (
    <Card
      className={cn(
        "h-full gap-4 p-5 transition-colors hover:ring-foreground/20",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          aria-hidden
        >
          <Icon className="size-4" />
        </span>
        <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
          {name}
        </h3>
      </div>

      {description && (
        <p className="text-sm text-pretty text-muted-foreground">{description}</p>
      )}

      {skills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li key={skill}>
              <Badge variant="secondary" className="font-mono">
                {skill}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
