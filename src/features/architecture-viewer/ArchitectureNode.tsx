import {
  Boxes,
  Cloud,
  Container as ContainerIcon,
  Database,
  GitBranch,
  Globe,
  Server,
  Settings,
  Shield,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ArchitectureNode as ArchitectureNodeData } from "@/types/project";

// Resolve the data layer's icon-name strings to lucide components (the
// established pattern from EngineeringDashboard/Contact). Brand glyphs
// (e.g. "github") were removed from lucide-react, so unknown names fall
// back to a generic Boxes icon — never a missing/misleading icon.
const NODE_ICONS: Record<string, LucideIcon> = {
  boxes: Boxes,
  cloud: Cloud,
  container: ContainerIcon,
  database: Database,
  "git-branch": GitBranch,
  globe: Globe,
  server: Server,
  settings: Settings,
  shield: Shield,
  terminal: Terminal,
};

interface ArchitectureNodeProps {
  node: ArchitectureNodeData;
  /**
   * Optional category label (derived from the project's techStack by the
   * viewer — the ArchitectureNode schema itself has no category field).
   * The badge hides when no category is known; nothing is fabricated.
   */
  category?: string;
  /** Whether this node is the current selection. */
  selected: boolean;
  /** Toggle this node's selection (Enter/Space fire this via native click). */
  onToggle: () => void;
}

/**
 * A single diagram node: a toggle `<button>` (hence `aria-pressed`, not
 * `aria-selected`, which is invalid on buttons). Enter/Space work through
 * the native button click; Escape is handled by the canvas. Click stops
 * propagating so the canvas's background-click-to-clear doesn't undo the
 * toggle. A `<button>` cannot be the div-based `Card`, so it reuses the
 * same theme tokens (`bg-card`, `ring-foreground/10`, `rounded-xl`, shared
 * ring-lift hover) to stay visually identical to the card system.
 */
export function ArchitectureNode({
  node,
  category,
  selected,
  onToggle,
}: ArchitectureNodeProps) {
  const Icon = NODE_ICONS[node.icon] ?? Boxes;

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-selected={selected || undefined}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        "flex w-36 max-w-full flex-col items-center gap-2 rounded-xl bg-card p-3 text-center ring-1 ring-foreground/10 transition motion-reduce:transition-none",
        "hover:ring-foreground/20",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        "data-selected:-translate-y-0.5 data-selected:shadow-md data-selected:ring-2 data-selected:ring-foreground/60"
      )}
    >
      <span
        className="flex size-8 items-center justify-center rounded-lg bg-muted"
        aria-hidden
      >
        <Icon className="size-4 text-foreground" />
      </span>
      <span className="font-heading text-sm leading-snug font-semibold text-foreground">
        {node.label}
      </span>
      {category && (
        <Badge variant="outline" className="font-mono text-[10px] uppercase">
          {category}
        </Badge>
      )}
    </button>
  );
}
