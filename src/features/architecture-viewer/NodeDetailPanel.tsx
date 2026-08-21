import { MousePointerClick } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ArchitectureNode, ArchitectureNodeDetails } from "@/types/project";

interface NodeDetailPanelProps {
  /** The currently selected node, or null when nothing is selected. */
  node: ArchitectureNode | null;
  /** techStack-derived category for the selected node (badge hides if absent). */
  category?: string;
}

const DETAIL_FIELDS: ReadonlyArray<{
  key: keyof ArchitectureNodeDetails;
  label: string;
}> = [
  { key: "purpose", label: "Purpose" },
  { key: "whyChosen", label: "Why Chosen" },
  { key: "configNotes", label: "Configuration Notes" },
  { key: "lessonsLearned", label: "Lessons Learned" },
];

// Same guard convention as ProjectCard/DualModeText: unauthored fields are
// empty strings (or TODO placeholders) in the data and must never surface.
function hasContent(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && !/^TODO\b/i.test(trimmed);
}

/**
 * Detail panel for the Architecture Viewer: shows the selected node's
 * `details` from the existing schema, hiding any empty field entirely.
 * The wrapper element persists across selection changes as a polite live
 * region, so screen readers hear updates without focus ever moving.
 */
export function NodeDetailPanel({ node, category }: NodeDetailPanelProps) {
  return (
    <aside
      aria-live="polite"
      aria-label="Component details"
      className="min-w-0"
    >
      {node ? (
        <NodeDetails node={node} category={category} />
      ) : (
        <EmptyState />
      )}
    </aside>
  );
}

function NodeDetails({
  node,
  category,
}: {
  node: ArchitectureNode;
  category?: string;
}) {
  const fields = DETAIL_FIELDS.filter(({ key }) =>
    hasContent(node.details[key])
  );

  return (
    <Card className="gap-4 p-5">
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {node.label}
        </h3>
        {category && (
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {category}
          </Badge>
        )}
      </div>

      {fields.length > 0 && (
        <dl className="flex flex-col gap-3 text-sm">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <dt className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="mt-0.5 leading-relaxed text-muted-foreground">
                {node.details[key]}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center">
      <MousePointerClick
        className="size-5 text-muted-foreground"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">
        Select a component to inspect its role in the architecture.
      </p>
    </div>
  );
}
