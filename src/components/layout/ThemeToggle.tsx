"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const emptySubscribe = () => () => {};

// `false` during SSR and the first hydration render, `true` afterwards. Lets us
// avoid a hydration mismatch when reading the resolved theme without calling
// setState inside an effect (react-hooks/set-state-in-effect).
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          />
        }
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 transition-transform duration-300" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch to {theme === "dark" ? "light" : "dark"} mode</p>
      </TooltipContent>
    </Tooltip>
  );
}
