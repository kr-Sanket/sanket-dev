# Implementation Status

> Snapshot comparing the current repository against **Architecture & Implementation Plan v2.0**.
> Generated: 2026-06-29. Updated: 2026-07-01 (Milestone 2 — Application Shell). Branch: `main`.

## TL;DR

The **application shell is complete** and the repo is green on `npm run lint` and `npm run build`. `layout.tsx` now mounts the real font stack (Inter + JetBrains Mono), `ThemeProvider`, and `ViewModeProvider`, wrapping a `Navbar` + `<main>` + `Footer` shell. Reusable layout primitives (`Navbar`, `Footer`, `Container`, `SectionHeader`, plus `DesktopNav`/`MobileNav`) exist and are production-ready. The data layer + content access layer are in place. What remains: homepage sections, project pages, feature modules, and the recruiter route (all deferred by scope).

**Overall completion: ~40%** (Phase 1 ~95% — app shell done; **data + content layers 100%**; **build/lint green**; homepage sections/features/pages not started).

> ✅ **Validation blockers RESOLVED (Milestone 1.6).** The prior build/lint failures — Base UI `<TooltipTrigger asChild>` (ADR-002) and `react-hooks/set-state-in-effect` — have been fixed using correct Base UI (`render` prop) and React (`useSyncExternalStore`) patterns. No lint rules were disabled. See "Milestone 1.6" section below.

---

## 1. Phase Completion Matrix

| Phase | Title | Status | Est. % |
|---|---|---|---|
| **Phase 1** | Foundation (Days 1–2) | 🟡 Partial | ~65% |
| **Phase 2** | Homepage Sections (Days 3–5) | 🔴 Not started | 0% |
| **Phase 3** | Project Detail Pages (Days 6–8) | 🔴 Not started (groundwork only) | ~5% |
| **Phase 4** | Unique Features (Days 9–11) | 🔴 Not started | 0% |
| **Phase 5** | Integrations (Days 12–13) | 🔴 Not started (types only) | ~5% |
| **Phase 6** | Polish & Ship (Days 14–15) | 🔴 Not started (metadata helper only) | ~5% |

Legend: 🟢 Complete · 🟡 Partial · 🔴 Not started

---

## 2. Phase 1 — Foundation (Detailed)

| Task | Status | Notes |
|---|---|---|
| Initialize Next.js (TS + Tailwind + App Router) | 🟢 | **Deviation:** Next.js **16.2.7** (plan said 15), React **19.2.4** |
| Initialize shadcn/ui | 🟢 | **Deviation:** shadcn 4 on **Base UI** (`@base-ui/react`), not Radix; style `base-nova`, baseColor `neutral` |
| Configure Tailwind v4 `@theme` tokens in `globals.css` | 🟢 | Present and rich. **Deviation:** uses `oklch()` + `.dark` class instead of the plan's HSL + `[data-theme]` |
| Add shadcn components (Button, Card, Badge, Tooltip, Dialog, Sheet, Tabs, ScrollArea, Input, Toggle, Separator) | 🟢 | **All 11 present** in `src/components/ui/` |
| `next-themes` ThemeProvider + ThemeToggle | 🟢 | Both built **and now mounted** in `layout.tsx` (Milestone 2). Uses `attribute="class"` (not `data-theme`, per ADR-003) |
| Build Navbar + Footer | 🟢 | Built in Milestone 2 (`Navbar`, `Footer`, plus `DesktopNav`/`MobileNav`, `Container`, `SectionHeader`) |
| Set up TypeScript type definitions | 🟢 | `project.ts`, `timeline.ts`, `github.ts`, `coding-profile.ts`, `common.ts` all present and thorough |
| Create `site.config.ts` | 🟢 | Present, populated with real data (CGPA 8.69, GitHub `kr-Sanket`, etc.) |
| Create utility functions | 🟡 | `cn()`, `loadProject/loadAllProjects/loadFeaturedProjects/loadProjectSlugs`, `metadata.ts`, `constants.ts`, **`content.ts` (content access layer, Milestone 1.6)** present. **Missing:** `recruiter.ts`, `formatDate()` |

---

## 3. Files That Match the Architecture

These exist and conform (closely) to the plan:

**Config / tooling**
- `components.json` — shadcn config (with Base UI deviations noted)
- `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`
- `package.json` — includes `fuse.js`, `motion`, `next-themes`, `clsx`, `tailwind-merge`, `lucide-react`

**Types (`src/types/`)** — all match
- `project.ts` (Project, ArchitectureNode/Edge, KnowledgeBaseEntry, RecruiterSummary, ProjectTimeline, etc.)
- `timeline.ts` (TimelineEvent, TimelineEventType, TimelineData)
- `github.ts` (ContributionCalendar, GitHubRepo, GitHubData, …)
- `coding-profile.ts` (CodingProfile, CodingProfilesData)
- `common.ts` (ViewMode, SkillCategory, Certification, LeadershipRole, MissionData, AboutData, ContactData, DashboardMetric)

**Lib (`src/lib/`)**
- `utils.ts` — `cn()` ✔
- `projects.ts` — loaders ✔ (named differently than plan; see §5)
- `metadata.ts` — `createMetadata()` / `createProjectMetadata()` SEO helpers ✔
- `constants.ts` — ROUTES, SECTION_IDS, EXTERNAL_URLS, ANIMATION ✔

**Data (`src/data/`)**
- `site.config.ts` — matches plan's §4.4, plus a `navLinks` extension

**UI primitives (`src/components/ui/`)** — all match
- `button`, `card`, `badge`, `tooltip`, `dialog`, `sheet`, `tabs`, `scroll-area`, `separator`, `toggle`, `input`

**Theming / state**
- `providers/ThemeProvider.tsx` — next-themes wrapper ✔
- `providers/ViewModeProvider.tsx` — React Context + `localStorage` ✔ (matches the state strategy)
- `components/layout/ThemeToggle.tsx` ✔
- `components/layout/ViewModeToggle.tsx` ✔ (built as a custom segmented control rather than shadcn `Toggle`)
- `app/globals.css` — Tailwind v4 `@theme` + token system ✔

---

## 4. Planned Files That Are Missing

### App routes (`src/app/`)
- `not-found.tsx` (custom 404)
- `projects/[slug]/page.tsx` (dynamic project page + `generateStaticParams`)
- `recruiter/page.tsx` (2-Minute Recruiter View)
- `sitemap.ts`, `robots.ts` (Phase 6 SEO)

### Layout components (`src/components/layout/`) — ✅ **DONE (Milestone 2)**
- ~~`Navbar.tsx`, `Footer.tsx`, `SectionHeader.tsx`, `Container.tsx`~~ ✅ created (plus `DesktopNav.tsx`, `MobileNav.tsx`)

### Shared components (`src/components/shared/`) — **entire folder missing**
- `AnimatedCounter.tsx`, `ScrollReveal.tsx`, `StatusBadge.tsx`, `TimelineItem.tsx`
- (`ViewModeToggle.tsx` exists but under `layout/`, not `shared/`)

### Homepage sections (`src/sections/`) — **entire folder missing**
- `Hero`, `FeaturedProjects`, `EngineeringDashboard`, `EngineeringTimeline`, `GitHubHub`, `CodingProfiles`, `CurrentMission`, `Skills`, `Leadership`, `Certifications`, `About`, `Contact`

### Feature modules (`src/features/`) — **entire folder missing**
- `project-mentor/` — `MentorChat`, `SearchEngine.ts`, `tfidf.ts`, `buildIndex.ts`, `types.ts`
- `architecture-viewer/` — `ArchitectureViewer`, `ArchitectureNode`, `ArchitectureEdge`, `NodeDetailPanel`, `types.ts`
- `recruiter-view/` — `RecruiterProfile/Projects/Skills/Metrics/Timeline/CTA`
- `github/` — `ContributionHeatmap`, `RepoCard`, `LanguageBar`, `ActivityFeed`, `github.service.ts`
- `coding-profiles/` — `ProfileCard`, `StatsDisplay`, `codingProfiles.service.ts`

### Hooks (`src/hooks/`) — **entire folder missing**
- `useViewMode.ts` (currently co-located in `ViewModeProvider.tsx`), `useReducedMotion.ts`, `useIntersection.ts`

### Lib
- `recruiter.ts` (recruiter data aggregation)

### Data content (`src/data/`) — ✅ **DONE (Milestone 1.5)**
- ~~`projects/*.json` (devops-api, fruit-quality-detection, adaptive-cyber-defense)~~ ✅ created
- ~~`skills.json`, `certifications.json`, `leadership.json`, `mission.json`, `timeline.json`, `about.json`, `contact.json`~~ ✅ created

### Public assets
- `public/images/` (projects, certifications, og), `public/resume.pdf`
- Only default Next SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) exist

---

## 5. Files That Differ From the Architecture

| File / Area | Plan | Actual | Severity |
|---|---|---|---|
| `app/layout.tsx` | Inter + JetBrains Mono via `next/font`; mounts ThemeProvider + ViewModeProvider + Navbar/Footer; real metadata | ✅ **Done (Milestone 2)** — Inter + JetBrains Mono, providers mounted, `Navbar`/`<main>`/`Footer` shell, `createMetadata()`, `suppressHydrationWarning` | 🟢 Resolved |
| `app/page.tsx` | Assembles all homepage sections | Minimal shell placeholder (dogfoods `Container` + `SectionHeader`); real sections deferred to Phase 2 | 🟢 Interim |
| Next.js version | 15 | **16.2.7** | 🟡 Medium (App Router APIs differ; see AGENTS.md note) |
| shadcn engine | Radix-based primitives | **Base UI** (`@base-ui/react`), shadcn 4, style `base-nova` | 🟡 Medium |
| Theme attribute | `attribute="data-theme"`, `[data-theme="light"]` overrides, HSL tokens | `attribute="class"`, `.dark` overrides, **oklch** tokens (shadcn default) | 🟡 Medium (consistent internally, but doc is now stale) |
| ThemeProvider location | Implied inline in root layout | Extracted to `components/providers/ThemeProvider.tsx` | 🟢 Low (cleaner) |
| `ViewModeToggle` | shadcn `Toggle`, under `components/shared/` | Custom segmented button, under `components/layout/` | 🟢 Low |
| `useViewMode` | Standalone `hooks/useViewMode.ts` | Co-located inside `ViewModeProvider.tsx` | 🟢 Low |
| Project loaders | `loadProject`, `loadAllProjects`, `loadByStatus` | `loadProject`, `loadAllProjects`, `loadFeaturedProjects`, `loadProjectSlugs` (no `loadByStatus`) | 🟢 Low |
| `providers/` folder | Not in plan's structure | New folder holding both providers | 🟢 Low (sensible) |
| `site.config.ts` | As specified | Adds `navLinks`; default ViewMode is `recruiter` | 🟢 Low |
| Default theme wiring | `enableSystem` + dark default | Matches (`defaultTheme="dark" enableSystem`) | 🟢 Low |

---

## 6. Build / Health Notes

- `.next/` build artifacts exist, so the scaffold compiles.
- The providers and toggles are **dead code** until mounted in `layout.tsx` — `ViewModeToggle`/`ThemeToggle` are not rendered anywhere.
- `globals.css` imports `shadcn/tailwind.css` and `tw-animate-css` — confirm these resolve under the installed versions during the next real build.
- **AGENTS.md is authoritative:** this is Next.js 16 with breaking changes — read `node_modules/next/dist/docs/` before writing route/layout code. Do not assume Next 15 App Router APIs.

---

## 8. Milestone 1.5 — Content Foundation (2026-06-29)

**Scope:** data layer only (no UI, sections, layout, or features). **Status: ✅ complete.**

### Files created (10)
- `src/data/projects/devops-api.json` — **fully populated** from the architecture spec §4.1 (owner-authored). GitHub username corrected to `kr-Sanket` per `site.config.ts`.
- `src/data/projects/fruit-quality-detection.json` — partial; placeholders for unverified details (see below).
- `src/data/projects/adaptive-cyber-defense.json` — partial; placeholders for unverified details (see below).
- `src/data/skills.json`, `mission.json`, `timeline.json`, `leadership.json`, `certifications.json`, `about.json`, `contact.json`

### Source-of-truth discipline
Content was drawn **only** from: the architecture spec, `site.config.ts`, the existing TS types, and `timeline.json`'s own spec example. Nothing technical was invented. Where facts were unavailable, a clear placeholder / empty array was used instead of fabricated content.

### Validation performed
- **JSON syntax:** all 10 files parse (`node` JSON.parse) ✅
- **Type conformance:** a temporary typed-import file run through `tsc --noEmit` confirmed every file is assignable to its interface. The **only** diagnostics were the known `resolveJsonModule` literal-widening false positives on the `status` / `type` union fields — all other fields (including nested `architecture`, `mentor`, `recruiterSummary`) matched. The 6 flat files produced zero diagnostics. Temp file removed afterward. ✅
- **Union value check:** runtime assertion confirmed every `status` and timeline `type` is a valid union member. ✅
- **`npm run lint`:** ❌ 2 errors — both **pre-existing**, in untouched files (`ThemeToggle.tsx`, `ViewModeProvider.tsx`). Not introduced by the data layer.
- **`npm run build`:** ❌ fails at TypeScript typecheck on **pre-existing** `ThemeToggle.tsx` `asChild` error. Next reports "✓ Compiled successfully" first — the data layer does not break compilation.

### Placeholders / TODOs left for future milestones
- **fruit-quality-detection** & **adaptive-cyber-defense:** `overview.developer` = `"TODO: ..."`; `architecture.diagram`/`edges`, `challenges`, `lessonsLearned`, `futureImprovements`, `gallery`, `mentor.knowledgeBase` = empty; `github.repoUrl`/`repoName` = `""`; `recruiterSummary.impact` = `"TODO: add measurable impact once available"`.
- **devops-api:** `architecture.diagram` contains only the two spec-defined nodes (`github`, `jenkins`) and the one valid edge; remaining nodes/edges (docker, terraform, junit, grafana, prometheus) await the owner's full diagram data. Gallery + thumbnail/cover image files referenced but not yet present in `/public/images`.
- **certifications.json:** AWS cert `date` and `url` left `""` (unknown). Image file not yet present.
- **contact.json:** email is the placeholder `sanket@example.com` (inherited from `site.config.ts`).
- **Assets:** no `/public/images/**` or `/public/resume.pdf` yet — all referenced paths are forward-looking.

### Out-of-scope items surfaced (need a decision next milestone)
The mandated `npm run build` / `npm run lint` cannot go green without editing UI files, which this milestone explicitly forbade. The two pre-existing issues to fix in a UI milestone:
1. Replace `<TooltipTrigger asChild>` usage with the Base UI-compatible pattern in `ThemeToggle.tsx` and `ViewModeToggle.tsx` (ADR-002).
2. Resolve `react-hooks/set-state-in-effect` in `ThemeToggle.tsx` and `ViewModeProvider.tsx` (e.g. lazy initializer / `useSyncExternalStore`).

## 9. Milestone 1.6 — Foundation Hardening (2026-07-01)

**Scope:** eliminate build/lint blockers + add the content access layer. No new features, no UI, no redesign. **Status: ✅ complete — repo is green.**

### Files created (1)
- `src/lib/content.ts` — the single content access point. Projects delegate to the existing async filesystem loaders (`getProjects`, `getProject`, `getFeaturedProjects`, `getProjectSlugs`), preserving zero-code project adds. Flat site content is statically imported and strongly typed (`getSkills`, `getMission`, `getTimeline`, `getLeadership`, `getCertifications`, `getAbout`, `getContact`).

### Files modified (4)
- `src/components/layout/ThemeToggle.tsx` — `<TooltipTrigger asChild>` → `render` prop; `mounted` setState-in-effect → `useSyncExternalStore` hydration check.
- `src/components/layout/ViewModeToggle.tsx` — `<TooltipTrigger asChild>` → `render` prop (spans forwarded as children).
- `src/components/providers/ViewModeProvider.tsx` — localStorage read moved from a setState-in-effect to a `useSyncExternalStore` store (localStorage is the source of truth). Public API (`mode`/`setMode`/`toggle`/`useViewMode`) unchanged.
- `IMPLEMENTATION_STATUS.md` — this update.

### Problems fixed
1. **Base UI `asChild` incompatibility (build blocker, ADR-002).** Base UI (`@base-ui/react` 1.5.0) has no `asChild`; composition uses the `render` prop (verified against the installed `TooltipTrigger` types). Fixed in both toggles.
2. **`react-hooks/set-state-in-effect` (lint errors ×2).** Replaced the effect-based patterns with `useSyncExternalStore` — the idiomatic pattern for reading external/persisted state and hydration status. No rules disabled, no `eslint-disable`, no hacks.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → ✅ compiled, TypeScript passed, 4 static routes prerendered (`/`, `/_not-found`)

### Architecture changes
None. Data models, folder structure, and the Base-UI/oklch/class-based decisions (ADR-002/003) are unchanged. `content.ts` is an additive façade over existing loaders + data.

### Remaining technical debt
- `layout.tsx` / `page.tsx` still Create-Next-App boilerplate; `ThemeProvider`/`ViewModeProvider` still not mounted (Phase-1 wiring, deferred by scope).
- Fonts still Geist (plan wants Inter + JetBrains Mono).
- Content placeholders/TODOs from Milestone 1.5 remain (see §8).
- No consumers use `content.ts` yet — wiring happens when sections/pages are built.

## 10. Milestone 2 — Application Shell (2026-07-01)

**Scope:** permanent layout shell only — no homepage sections, feature UI, project pages, or recruiter page. **Status: ✅ complete — repo green.**

### Files created (6)
- `src/components/layout/Container.tsx` — centered `max-w-7xl` wrapper with responsive padding (server).
- `src/components/layout/SectionHeader.tsx` — reusable eyebrow/title/description heading block for all future sections (server).
- `src/components/layout/Navbar.tsx` — sticky top bar shell; nav driven from `site.config.ts` (server).
- `src/components/layout/DesktopNav.tsx` — desktop nav with active-state architecture via `usePathname` (client).
- `src/components/layout/MobileNav.tsx` — mobile drawer using Base UI Sheet; links are `SheetClose`→`Link` so tapping navigates + dismisses (client).
- `src/components/layout/Footer.tsx` — consumes `getContact()` from the content layer + site metadata (server).

### Files modified (3)
- `src/app/layout.tsx` — replaced CNA boilerplate: Inter + JetBrains Mono via `next/font` (bound to `--font-sans` / `--font-mono`), mounted `ThemeProvider` → `ViewModeProvider`, `Navbar`/`<main id="main">`/`Footer` shell, `createMetadata()`, `suppressHydrationWarning` (required by next-themes class strategy).
- `src/app/page.tsx` — replaced CNA boilerplate with a minimal shell placeholder (uses `Container` + `SectionHeader`); real homepage sections deferred to Phase 2.
- `src/app/globals.css` — one line: `--font-mono` now maps to the `--font-mono` CSS var (set by JetBrains Mono) instead of the stale `--font-geist-mono`.

### Architecture decisions
- **Base UI composition throughout** (ADR-002): mobile menu, triggers, and close buttons use the `render` prop, never `asChild`.
- **Server shell + client islands** (per PROJECT_CONTEXT): `Navbar`/`Footer`/`Container`/`SectionHeader` are server components; `DesktopNav`/`MobileNav`/toggles are the only client pieces.
- **Nav is config-driven**: `Navbar` reads `siteConfig.navLinks`; links are currently in-page hash anchors, so `DesktopNav`'s active-state logic is wired for route links and left as the future scrollspy hook point for hashes.
- **Icon fallback**: lucide-react 1.17.0 removed the `Github`/`Linkedin` brand glyphs, so the footer maps `mail`/`file-text` to real icons and falls back to `ExternalLink` — no misleading or missing icons.
- **No new data models, no redesign**; `content.ts` gained its first consumer (`Footer`).

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; compiled, TypeScript passed, 4 static routes prerendered ✅

### Remaining work
- Homepage sections (Hero → Contact), project detail pages, feature modules (mentor, architecture viewer, github, coding profiles), recruiter page — all Phase 2+.
- `not-found.tsx`, `sitemap.ts`, `robots.ts`, per-route OG images (SEO, Phase 6).
- Content placeholders/TODOs from Milestone 1.5 (empty architecture/mentor for research projects, empty repo URLs, cert date/url, placeholder email, missing `/public/images` + `resume.pdf`).
- `DesktopNav` scrollspy for hash links (once sections exist).

## 7. See Also

- `PROJECT_CONTEXT.md` — condensed architecture for future sessions
- `DECISIONS.md` — architectural decisions & deviations log
