"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cursor-responsive background — two very large, very faint radial
 * lights (different sizes, different lag) that trail the cursor with heavy
 * interpolation, sitting behind all content ("light diffusing underneath
 * paper"). The whole system lives in this one component, mounted once in
 * the root layout; deleting that one line disables it entirely.
 *
 * Performance contract:
 * - zero React state — mousemove only writes refs; a rAF loop mutates
 *   `transform`/`opacity` directly (compositor-only properties)
 * - the loop self-suspends once position/opacity settle, so an idle page
 *   runs no animation frames at all
 * - skipped entirely on coarse pointers (nothing to follow on touch)
 * - `prefers-reduced-motion`: input is ignored and the light fades out,
 *   including when the OS setting changes mid-session
 */

// Two layers at different lag rates: the slow atmosphere field and a
// smaller, slightly quicker core. Their differential drift is what makes
// the ambience perceptible — neither layer alone reads as a spotlight.
const LERP_ATMOSPHERE = 0.045; // large field — long, visible organic drift
const LERP_CORE = 0.09; // small core — leads the field
const LERP_OPACITY = 0.08; // fade in/out
const SETTLE_POSITION = 0.05; // px — below this the loop suspends
const SETTLE_OPACITY = 0.001;

export function AmbientBackground() {
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const atmosphere = atmosphereRef.current;
    const core = coreRef.current;
    if (!atmosphere || !core) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Animation state lives in plain locals — never in React state.
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let ax = targetX;
    let ay = targetY;
    let cx = targetX;
    let cy = targetY;
    let targetOpacity = 0;
    let opacity = 0;
    let frame = 0;
    let running = false;

    const tick = () => {
      ax += (targetX - ax) * LERP_ATMOSPHERE;
      ay += (targetY - ay) * LERP_ATMOSPHERE;
      cx += (targetX - cx) * LERP_CORE;
      cy += (targetY - cy) * LERP_CORE;
      opacity += (targetOpacity - opacity) * LERP_OPACITY;

      const o = opacity.toFixed(3);
      atmosphere.style.transform = `translate3d(${ax}px, ${ay}px, 0) translate(-50%, -50%)`;
      atmosphere.style.opacity = o;
      core.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      core.style.opacity = o;

      const settled =
        Math.abs(targetX - ax) < SETTLE_POSITION &&
        Math.abs(targetY - ay) < SETTLE_POSITION &&
        Math.abs(targetX - cx) < SETTLE_POSITION &&
        Math.abs(targetY - cy) < SETTLE_POSITION &&
        Math.abs(targetOpacity - opacity) < SETTLE_OPACITY;

      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: MouseEvent) => {
      if (reduced.matches) return;
      targetX = event.clientX;
      targetY = event.clientY;
      targetOpacity = 1;
      wake();
    };

    // Fade out gracefully when the cursor leaves the page.
    const onLeave = () => {
      targetOpacity = 0;
      wake();
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        targetOpacity = 0;
        wake();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    reduced.addEventListener("change", onReducedChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      reduced.removeEventListener("change", onReducedChange);
    };
  }, []);

  return (
    // Fixed, clipped, non-interactive, behind all content (cards occlude it;
    // the semi-transparent section bands let it diffuse through).
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Atmosphere field: very large, eased multi-stop falloff so the
          light dissolves invisibly into the page. Tuning pass 2.5.1: white
          illumination was rejected (≤1.5% possible effect on the #fafafa
          page) and warm tints rejected (foreign chroma in a 0-chroma
          system) — the existing neutral at higher strength won. */}
      <div
        ref={atmosphereRef}
        className="absolute top-0 left-0 size-[84rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_0_0/0.05),rgb(0_0_0/0.02)_45%,transparent_80%)] opacity-0 will-change-[transform,opacity] dark:bg-[radial-gradient(closest-side,rgb(255_255_255/0.03),rgb(255_255_255/0.012)_45%,transparent_80%)]"
      />
      {/* Core: smaller, extremely faint, slightly quicker — the differential
          drift against the field is what makes the ambience felt. */}
      <div
        ref={coreRef}
        className="absolute top-0 left-0 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_0_0/0.02),transparent_75%)] opacity-0 will-change-[transform,opacity] dark:bg-[radial-gradient(closest-side,rgb(255_255_255/0.015),transparent_75%)]"
      />
    </div>
  );
}
