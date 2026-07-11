# Architectural Decisions Log

> Records the significant decisions baked into this codebase, including **deviations** from
> Architecture & Implementation Plan v2.0 that are already present in the repo. Newest concerns first.
> Status: ✅ Settled · ⚠️ Deviation from plan (intentional or de-facto) · ❓ Needs owner confirmation.

---

## ADR-001 — Next.js 16 instead of the planned 15  ✅

**Context.** The plan specifies Next.js 15. `package.json` pins `next@16.2.7` (with `eslint-config-next@16.2.7`), React `19.2.4`.

**Decision.** **Accepted:** build on Next.js 16. Multiple milestones (Application Shell, Hero, Dashboard, Featured Projects) have shipped on 16 with a green lint/build, so this is the settled project baseline.

**Consequences.**
- App Router, metadata, caching/ISR, and `generateStaticParams` APIs may differ from Next 15 docs and from model training data. `AGENTS.md` explicitly warns "This is NOT the Next.js you know" and mandates reading `node_modules/next/dist/docs/` before writing code.
- Plan sections that cite Next 15 behavior (ISR defaults, route handlers) must be validated against installed docs, not assumed.

**Action.** Treat the installed version as authoritative; keep the plan's *intent* but verify each App Router API against local docs.

---

## ADR-002 — shadcn/ui on Base UI, not Radix  ⚠️

**Context.** Plan describes shadcn/ui generically (historically Radix-backed). The repo uses `@base-ui/react` with `shadcn@4`, `components.json` style `base-nova`, baseColor `neutral`, `iconLibrary: lucide`.

**Decision.** Use the Base UI flavor of shadcn/ui.

**Consequences.**
- Primitive import paths and composition differ from Radix-era shadcn snippets; copy-pasting old examples will break.
- Add/update components via the shadcn CLI so generated code matches the installed registry/style.
- All 11 planned primitives are already generated: button, card, badge, tooltip, dialog, sheet, tabs, scroll-area, separator, toggle, input.

---

## ADR-003 — Theme via `class` + `.dark` + oklch, not `data-theme` + HSL  ⚠️

**Context.** Plan §9 specifies `attribute="data-theme"`, a `[data-theme="light"]` override block, and **HSL** token values. The repo ships `next-themes` with `attribute="class"`, a `.dark { … }` override block, and **oklch** token values (the current shadcn default).

**Decision.** Follow the shadcn default: class-based dark mode + oklch tokens. Dark is the default theme; `enableSystem` is on; `disableTransitionOnChange` set.

**Consequences.**
- Internally consistent and idiomatic for current shadcn, but the plan's CSS examples are now **stale** — do not reintroduce `[data-theme]` selectors or HSL triplets.
- Any component referencing theme tokens should use the semantic CSS variables (`--background`, `--primary`, …) already defined in `globals.css`, not raw colors.

**Note.** `globals.css` also imports `tw-animate-css` and `shadcn/tailwind.css`; the plan's primary-blue accent (`220 70% 55%`) is **not** currently applied — tokens are neutral/grayscale. Revisit if a brand accent is desired.

---

## ADR-004 — `providers/` folder; provider extracted from layout  ✅

**Context.** Plan shows `ThemeProvider`/`ViewModeProvider` mounted inline in the root layout and lists no `providers/` directory.

**Decision.** Keep providers as dedicated client components under `src/components/providers/` (`ThemeProvider.tsx`, `ViewModeProvider.tsx`).

**Consequences.** Cleaner separation; keeps `layout.tsx` server-friendly. **Resolved (Milestone 2):** both providers are now mounted in `layout.tsx` (`ThemeProvider` → `ViewModeProvider`), and the `ThemeToggle`/`ViewModeToggle` render in the `Navbar` — theme switching and Recruiter/Developer view mode are live.

---

## ADR-005 — `useViewMode` co-located in its provider  ✅

**Context.** Plan lists `hooks/useViewMode.ts` as a standalone file.

**Decision.** Export `useViewMode()` from `ViewModeProvider.tsx` alongside the context.

**Consequences.** One less file; hook and context can't drift. If `src/hooks/` is later created for `useReducedMotion`/`useIntersection`, consider re-exporting for consistency — not required.

---

## ADR-006 — ViewMode default is `recruiter`; storage key fixed  ✅

**Context.** Plan didn't pin an initial view mode.

**Decision.** Default to **`recruiter`** mode, persisted in `localStorage` under `sanket-dev-view-mode`.

**Consequences.** First-time visitors see recruiter-depth content first (aligns with the "executive summary" positioning). SSR renders `recruiter`, then hydration reconciles from storage — guard against hydration mismatch when wiring UI.

---

## ADR-007 — Custom segmented `ViewModeToggle` under `layout/`, not shadcn `Toggle` in `shared/`  ✅

**Context.** Plan places `ViewModeToggle` in `components/shared/` built on shadcn `Toggle`.

**Decision.** Hand-built segmented pill control (Briefcase/Code2 icons, animated active state) living in `components/layout/`.

**Consequences.** Better affordance for a two-option switch than a binary toggle. Minor structural divergence from the plan's folder layout; harmless.

---

## ADR-008 — Project loader API differs from plan  ⚠️

**Context.** Plan's `lib/projects.ts` lists `loadProject`, `loadAllProjects`, `loadByStatus`.

**Decision.** Implemented `loadProject`, `loadAllProjects`, `loadFeaturedProjects`, `loadProjectSlugs`. `loadAllProjects` sorts by `order`; `loadProjectSlugs` filters out `planned` (feeds `generateStaticParams`). **No `loadByStatus`.**

**Consequences.** Covers current needs. Add `loadByStatus` if status-filtered views (e.g. research-only listing) are introduced.

---

## ADR-009 — No external AI API for Project Mentor  ✅ (carried from plan)

**Context.** A "mentor" Q&A per project could tempt an LLM call.

**Decision.** Pure client-side **hybrid search**: Fuse.js (fuzzy, weight 0.4) + pre-computed **TF-IDF cosine** (semantic, weight 0.6), threshold 0.25, static fallback message. `fuse.js` is already a dependency; TF-IDF to be hand-rolled.

**Consequences.** Zero API cost/keys, ~0 bundle/init overhead vs. transformer embeddings, fast on small (5–15 entry) KBs. `SearchEngine` must expose a stable `search(query): SearchResult[]` so a Transformers.js upgrade is drop-in later.

---

## ADR-010 — Content is data, not code; zero-DB  ✅ (carried from plan)

**Decision.** All content as Git-versioned JSON/TS under `src/data/`. Adding a project = one JSON file (+ timeline + images); routes/timeline/recruiter view derive automatically.

**Consequences.** No DB/CMS. Strong typing via `src/types/` is the contract — keep JSON in sync with types. `status: "planned"` projects render as homepage cards only and get no detail page.

---

## ADR-011 — SSG everywhere; ISR only for live integrations  ✅ (carried from plan)

**Decision.** All pages SSG from local JSON. ISR reserved for GitHub (~1h) and coding profiles (~6h), with JSON fallbacks when third-party/unofficial APIs fail.

**Consequences.** Fast, cache-friendly, resilient. `/recruiter` is SSG and **`noindex`** (private link). GitHub uses authenticated requests (`GITHUB_TOKEN`) to dodge rate limits.

---

## Open Confirmations (❓)

- **ADR-003:** Accept neutral/grayscale tokens, or restore the planned blue primary accent?
- Owner contact email and `resume.pdf` are still placeholders.

_(Resolved: **ADR-001** — Next.js 16 accepted as the project baseline; **ADR-004** — providers mounted.)_
