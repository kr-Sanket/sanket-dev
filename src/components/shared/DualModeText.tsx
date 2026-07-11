"use client";

import { useViewMode } from "@/components/providers/ViewModeProvider";
import { cn } from "@/lib/utils";
import type { DualModeContent } from "@/types/project";

/**
 * Renders the recruiter- or developer-depth string from a `DualModeContent`
 * pair, reacting to the global view mode (`ViewModeProvider`). This is the one
 * client island the detail page needs — everything else stays server-rendered.
 *
 * Graceful fallback: partially-authored projects use `"TODO: …"` placeholders
 * for the developer copy. When the active mode's text is a TODO placeholder (or
 * empty), we fall back to the other mode's text rather than exposing a raw TODO;
 * if neither is real, nothing renders.
 */

function isPlaceholder(value: string | undefined): boolean {
  const v = value?.trim();
  return !v || v.toUpperCase().startsWith("TODO");
}

function resolve(
  content: DualModeContent,
  mode: "recruiter" | "developer"
): string | null {
  const primary = content[mode]?.trim();
  if (!isPlaceholder(primary)) return primary!;
  const other = mode === "recruiter" ? content.developer : content.recruiter;
  return isPlaceholder(other) ? null : other.trim();
}

interface DualModeTextProps {
  content: DualModeContent;
  className?: string;
}

export function DualModeText({ content, className }: DualModeTextProps) {
  const { mode } = useViewMode();
  const text = resolve(content, mode);
  if (!text) return null;
  return <p className={cn("text-pretty", className)}>{text}</p>;
}
