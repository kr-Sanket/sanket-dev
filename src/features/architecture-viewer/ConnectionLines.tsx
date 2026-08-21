import type { PositionedEdge } from "./types";

interface ConnectionLinesProps {
  edges: PositionedEdge[];
}

/**
 * SVG overlay drawing a straight line per edge between node cell centers.
 * Coordinates are percentage space (0–100) with `preserveAspectRatio="none"`
 * so lines track the responsive grid; `vectorEffect="non-scaling-stroke"`
 * keeps the stroke width constant despite the non-uniform scaling. Purely
 * decorative (the canvas provides a text alternative), hence `aria-hidden`.
 * No animation in this milestone.
 */
export function ConnectionLines({ edges }: ConnectionLinesProps) {
  if (edges.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 size-full text-border"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {edges.map(({ edge, x1, y1, x2, y2 }) => (
        <line
          key={`${edge.from}-${edge.to}-${edge.label}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
