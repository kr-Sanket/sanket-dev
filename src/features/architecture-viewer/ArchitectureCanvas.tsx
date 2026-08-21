import { ArchitectureNode } from "./ArchitectureNode";
import { ConnectionLines } from "./ConnectionLines";
import type { DiagramGrid, PositionedEdge } from "./types";
import type {
  ArchitectureEdge,
  ArchitectureNode as ArchitectureNodeData,
} from "@/types/project";

interface ArchitectureCanvasProps {
  nodes: ArchitectureNodeData[];
  edges: ArchitectureEdge[];
  /** node id → category label (derived by the viewer; badge hides if absent). */
  categories: Record<string, string>;
  /** Accessible name for the diagram group. */
  label: string;
  /** Currently selected node id, or null when nothing is selected. */
  selectedId: string | null;
  /** Toggle selection of a node (selecting a selected node clears it). */
  onToggleNode: (id: string) => void;
  /** Clear the selection (background click, Escape). */
  onClearSelection: () => void;
}

/** Center of grid cell `i` out of `count`, in percentage space (0–100). */
function cellCenter(i: number, count: number): number {
  return ((i + 0.5) / count) * 100;
}

/**
 * The diagram surface: a responsive CSS grid laid out from each node's
 * authored `x`/`y` coordinates, with an SVG underlay connecting cell
 * centers. Everything is percentage-based inside a bounded container —
 * no scrolling, no fixed pixel canvas. Zoom/pan/drag are explicitly out
 * of scope for this milestone.
 */
export function ArchitectureCanvas({
  nodes,
  edges,
  categories,
  label,
  selectedId,
  onToggleNode,
  onClearSelection,
}: ArchitectureCanvasProps) {
  const grid: DiagramGrid = {
    cols: Math.max(...nodes.map((n) => n.x)) + 1,
    rows: Math.max(...nodes.map((n) => n.y)) + 1,
  };

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const nodeLabel = (id: string) => byId.get(id)?.label ?? id;

  // Resolve edges to cell-center endpoints; edges referencing unknown node
  // ids are skipped (data tolerance) rather than crashing the page.
  const positionedEdges: PositionedEdge[] = edges.flatMap((edge) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return [];
    return [
      {
        edge,
        x1: cellCenter(from.x, grid.cols),
        y1: cellCenter(from.y, grid.rows),
        x2: cellCenter(to.x, grid.cols),
        y2: cellCenter(to.y, grid.rows),
      },
    ];
  });

  return (
    // Pointer users clear the selection by clicking the canvas background
    // (node buttons stop propagation); keyboard users press Escape, which
    // bubbles here from the focused node — focus itself is not moved.
    <div
      role="group"
      aria-label={label}
      onClick={onClearSelection}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClearSelection();
      }}
      className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-6"
    >
      {/* This wrapper is exactly the grid's box, so the SVG percentage
          space and the grid cell centers stay in the same coordinates. */}
      <div className="relative">
        <ConnectionLines edges={positionedEdges} />

        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
            gridAutoRows: "minmax(7.5rem, auto)",
          }}
        >
          {nodes.map((node) => (
            <div
              key={node.id}
              className="flex min-w-0 items-center justify-center p-2"
              style={{
                gridColumnStart: node.x + 1,
                gridRowStart: node.y + 1,
              }}
            >
              <ArchitectureNode
                node={node}
                category={categories[node.id]}
                selected={node.id === selectedId}
                onToggle={() => onToggleNode(node.id)}
              />
            </div>
          ))}
        </div>

        {/* Edge labels, pinned to each line's midpoint. Decorative — the
            sr-only list below carries the same information as text. */}
        {positionedEdges
          .filter(({ edge }) => edge.label)
          .map(({ edge, x1, y1, x2, y2 }) => (
            <span
              key={`${edge.from}-${edge.to}-${edge.label}`}
              aria-hidden
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-background px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-muted-foreground ring-1 ring-border"
              style={{ left: `${(x1 + x2) / 2}%`, top: `${(y1 + y2) / 2}%` }}
            >
              {edge.label}
            </span>
          ))}
      </div>

      {/* Text alternative for the drawn connections (screen readers). */}
      {positionedEdges.length > 0 && (
        <ul className="sr-only">
          {positionedEdges.map(({ edge }) => (
            <li key={`${edge.from}-${edge.to}-${edge.label}`}>
              {nodeLabel(edge.from)} connects to {nodeLabel(edge.to)}
              {edge.label ? `: ${edge.label}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
