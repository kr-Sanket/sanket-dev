import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Main section heading (rendered as an `<h2>`). */
  title: string;
  /** Optional supporting copy shown beneath the title. */
  description?: string;
  /** Small uppercase label shown above the title (e.g. a section kicker). */
  eyebrow?: string;
  /** Alignment of the header block. */
  align?: "left" | "center";
  /** Optional id on the heading — useful for in-page anchors / scrollspy. */
  id?: string;
  className?: string;
}

/**
 * Consistent heading block for all homepage/detail sections.
 */
export function SectionHeader({
  title,
  description,
  eyebrow,
  align = "left",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-sm text-muted-foreground sm:text-base",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
