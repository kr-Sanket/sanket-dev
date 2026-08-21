"use client";

import { useState } from "react";
import { ArchitectureCanvas } from "./ArchitectureCanvas";
import { NodeDetailPanel } from "./NodeDetailPanel";
import type { Project } from "@/types/project";

interface ArchitectureViewerProps {
  project: Project;
}

/**
 * Architecture Viewer: renders a project's architecture diagram — nodes
 * positioned by their authored `x`/`y` grid coordinates, connected by SVG
 * edges — entirely from the existing `project.architecture` data. A client
 * island (like `MentorChat`): it owns the node-selection state, which the
 * detail panel milestone will consume alongside the canvas. Content-only —
 * the page's Section wrapper supplies `Container`/`SectionHeader`. Detail
 * panel, zoom/pan and motion arrive in later milestones.
 */
export function ArchitectureViewer({ project }: ArchitectureViewerProps) {
  // Selected node id, or null. Lives here (not in the canvas) so the
  // 6.3 detail panel can render as a canvas sibling from the same state.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { diagram, edges } = project.architecture;
  if (diagram.length === 0) return null;

  const toggleNode = (id: string) =>
    setSelectedId((current) => (current === id ? null : id));
  const clearSelection = () => setSelectedId(null);

  // The ArchitectureNode schema has no category field, so the badge is
  // derived from the project's own techStack by label match — real data
  // only; nodes without a match simply show no badge.
  const categories: Record<string, string> = {};
  for (const node of diagram) {
    const match = project.techStack.find(
      (tech) => tech.name.toLowerCase() === node.label.toLowerCase()
    );
    if (match?.category) categories[node.id] = match.category;
  }

  const selectedNode = diagram.find((node) => node.id === selectedId) ?? null;

  return (
    // Diagram | panel side-by-side on desktop; panel stacks below on
    // tablet/mobile. minmax(0, …) keeps both columns overflow-safe.
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
      <ArchitectureCanvas
        nodes={diagram}
        edges={edges}
        categories={categories}
        label={`Architecture diagram for ${project.title}`}
        selectedId={selectedId}
        onToggleNode={toggleNode}
        onClearSelection={clearSelection}
      />
      <NodeDetailPanel
        node={selectedNode}
        category={selectedNode ? categories[selectedNode.id] : undefined}
      />
    </div>
  );
}
