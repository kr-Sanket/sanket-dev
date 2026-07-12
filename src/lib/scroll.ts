/**
 * Imperatively scroll to an in-page section referenced by a hash href
 * (e.g. `"#projects"`). Returns `true` when it handled the scroll (the target
 * element exists), so callers can `preventDefault()` on the originating click.
 *
 * Why this exists: a native `<a href="#projects">` — and Next's `<Link>` — only
 * scrolls to a fragment when the URL fragment *changes*. Once `location.hash`
 * already equals the target, re-clicking the same nav item (or the Hero CTA)
 * resolves to the same URL, so no navigation fires and nothing scrolls, no
 * matter where the user has since scrolled. Scrolling imperatively runs on
 * every click regardless of the current hash or scroll position — the fix.
 *
 * Smooth by default; respects `prefers-reduced-motion`. The URL hash is updated
 * via `history.replaceState` so links stay shareable without a page reload, a
 * Next navigation, or re-triggering native fragment scrolling.
 */
export function scrollToHash(href: string): boolean {
  if (typeof document === "undefined" || !href.startsWith("#")) return false;

  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return false;

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  window.history.replaceState(null, "", href);
  return true;
}
