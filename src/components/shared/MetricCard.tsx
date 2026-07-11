import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  /** Numeric or preformatted value (e.g. `8.69`, `"15+"`). */
  value: number | string;
  label: string;
  className?: string;
}

/**
 * Reusable metric tile for the Engineering Dashboard (and future metric strips).
 * Presentational and animation-ready: the value sits in its own element so an
 * `AnimatedCounter` can wrap it later without touching layout.
 */
export function MetricCard({ icon: Icon, value, label, className }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "gap-3 p-5 transition-colors hover:ring-foreground/20",
        className
      )}
    >
      <Icon className="size-5 text-muted-foreground" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <span
          data-slot="metric-value"
          className="font-mono text-3xl font-semibold tracking-tight tabular-nums text-foreground"
        >
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </Card>
  );
}
