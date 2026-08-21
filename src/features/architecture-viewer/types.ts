import type { ArchitectureEdge } from "@/types/project";

/**
 * Grid extent of a diagram, derived from the maximum node `x`/`y`
 * coordinates in the project's architecture data.
 */
export interface DiagramGrid {
  cols: number;
  rows: number;
}

/**
 * An edge resolved to canvas coordinates: endpoints are the centers of the
 * source/target grid cells, expressed in percentage space (0–100) so the
 * SVG overlay stays aligned with the responsive CSS grid at any width.
 */
export interface PositionedEdge {
  edge: ArchitectureEdge;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
