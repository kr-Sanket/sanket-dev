"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ViewMode } from "@/types/common";

interface ViewModeContextValue {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  toggle: () => void;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "sanket-dev-view-mode";
const DEFAULT_MODE: ViewMode = "recruiter";

// localStorage-backed store. The persisted view mode is read via
// useSyncExternalStore (the correct pattern for external state) rather than a
// setState-in-effect, keeping SSR-safe and lint-clean. Source of truth is
// localStorage; same-tab writes notify subscribers manually.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ViewMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "developer" || stored === "recruiter"
    ? stored
    : DEFAULT_MODE;
}

function getServerSnapshot(): ViewMode {
  return DEFAULT_MODE;
}

function persist(mode: ViewMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  listeners.forEach((listener) => listener());
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMode = useCallback((newMode: ViewMode) => {
    persist(newMode);
  }, []);

  const toggle = useCallback(() => {
    persist(getSnapshot() === "recruiter" ? "developer" : "recruiter");
  }, []);

  return (
    <ViewModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
