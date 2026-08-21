"use client";

import { useEffect, useRef } from "react";

/**
 * Art-directed ambient scene behind the Hero: three very large, very soft
 * light sources (warm white behind the identity column, soft blue-gray
 * behind the Engineering Status panel, faint neutral ground light). The
 * lights are position-fixed within the hero and only *parallax* a few
 * pixels with the cursor — they never chase it (that's the global
 * AmbientBackground's job). Soft edges come from radial-gradient stops,
 * not blur filters, so there is no filter cost.
 *
 * Same performance/accessibility contract as AmbientBackground:
 * ref-only state, one self-suspending rAF loop, compositor-only
 * transforms, passive listener, skipped on coarse pointers, parallax
 * disabled (scene stays, static) under prefers-reduced-motion.
 */

/** Max parallax offset per light in px (spec: 10–20px), sign = direction. */
const DEPTHS = [14, -18, 9] as const;
const LERP = 0.05;
const SETTLE = 0.05;

export function HeroAmbientScene() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const layers = Array.from(root.children) as HTMLElement[];
    // Normalized cursor position, -0.5 … 0.5 on each axis.
    let targetX = 0;
    let targetY = 0;
    const xs = layers.map(() => 0);
    const ys = layers.map(() => 0);
    let frame = 0;
    let running = false;

    const tick = () => {
      let settled = true;
      layers.forEach((layer, i) => {
        const depth = DEPTHS[i] ?? 0;
        xs[i] += (targetX * depth - xs[i]) * LERP;
        ys[i] += (targetY * depth - ys[i]) * LERP;
        layer.style.transform = `translate3d(${xs[i]}px, ${ys[i]}px, 0)`;
        if (
          Math.abs(targetX * depth - xs[i]) > SETTLE ||
          Math.abs(targetY * depth - ys[i]) > SETTLE
        ) {
          settled = false;
        }
      });
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
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      wake();
    };

    // Reduced motion (incl. live changes): drift the lights back to rest.
    const onReducedChange = () => {
      if (reduced.matches) {
        targetX = 0;
        targetY = 0;
        wake();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    reduced.addEventListener("change", onReducedChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      reduced.removeEventListener("change", onReducedChange);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Warm white — upper-left, behind the identity column. */}
      <div className="absolute -top-40 left-[4%] size-[50rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_247_235/0.55),transparent_70%)] will-change-transform dark:bg-[radial-gradient(closest-side,rgb(255_240_220/0.04),transparent_70%)]" />
      {/* Soft blue-gray — right, the cool plane the status panel floats over. */}
      <div className="absolute top-[16%] right-[-14%] size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(148_163_184/0.09),transparent_70%)] will-change-transform dark:bg-[radial-gradient(closest-side,rgb(148_163_184/0.07),transparent_70%)]" />
      {/* Neutral gray — low center-left, grounds the composition (absorbs
          the former Phase-2 top-wash role at the opposite pole). */}
      <div className="absolute bottom-[-35%] left-[30%] size-[56rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_0_0/0.03),transparent_72%)] will-change-transform dark:bg-[radial-gradient(closest-side,rgb(255_255_255/0.02),transparent_72%)]" />
    </div>
  );
}
