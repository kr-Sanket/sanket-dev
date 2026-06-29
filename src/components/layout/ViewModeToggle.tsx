"use client";

import { useViewMode } from "@/components/providers/ViewModeProvider";
import { Briefcase, Code2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ViewModeToggle() {
  const { mode, toggle } = useViewMode();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggle}
          className="relative flex h-9 items-center gap-0.5 rounded-full border border-border bg-muted/50 p-0.5 text-xs font-medium transition-colors cursor-pointer"
          aria-label={`Switch to ${mode === "recruiter" ? "developer" : "recruiter"} mode`}
        >
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300 ${
              mode === "recruiter"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Briefcase className="h-3 w-3" />
            <span className="hidden sm:inline">Recruiter</span>
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300 ${
              mode === "developer"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Code2 className="h-3 w-3" />
            <span className="hidden sm:inline">Developer</span>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {mode === "recruiter"
            ? "Viewing high-level overview"
            : "Viewing technical details"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
