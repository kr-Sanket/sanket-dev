# Implementation Status

> Snapshot comparing the current repository against **Architecture & Implementation Plan v2.0**.
> Generated: 2026-06-29. Updated: 2026-07-11 (Documentation Synchronization — see §14). Branch: `main`.

## TL;DR

**Phase 1 (Foundation) is complete** and **Phase 2 (homepage sections) is in progress** — the **Hero** (refined), the **Engineering Dashboard**, and the **Featured Projects** section are built and live on `/`. The repo is green on `npm run lint` and `npm run build`, with no Base UI console warnings. `layout.tsx` mounts the real font stack (**Inter + JetBrains Mono**), `ThemeProvider`, and `ViewModeProvider`, wrapping a `Navbar` + `<main>` + `Footer` shell; the `ThemeToggle` and `ViewModeToggle` are rendered in the `Navbar`, so **theme switching and Recruiter/Developer view mode both work end-to-end**. Reusable primitives exist (`Container`, `SectionHeader`, `MetricCard`, `ProjectCard`, `StatusBadge`). Data + content access layers are complete. What remains: the other homepage sections, project detail pages, feature modules, and the recruiter route.

**Overall completion: ~52%** (Phase 1 **100%**; **Phase 2 in progress — Hero + Dashboard + Featured Projects done**; data + content layers 100%; build/lint green; no Base UI warnings).

> ✅ **Validation blockers RESOLVED (Milestone 1.6).** The prior build/lint failures — Base UI `<TooltipTrigger asChild>` (ADR-002) and `react-hooks/set-state-in-effect` — have been fixed using correct Base UI (`render` prop) and React (`useSyncExternalStore`) patterns. No lint rules were disabled. See "Milestone 1.6" section below.

---

## 1. Phase Completion Matrix

| Phase | Title | Status | Est. % |
|---|---|---|---|
| **Phase 1** | Foundation (Days 1–2) | 🟢 Complete | 100% |
| **Phase 2** | Homepage Sections (Days 3–5) | 🟡 In progress — Hero + Dashboard + Featured Projects done | ~30% |
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
| Create utility functions | 🟢 | `cn()`, `loadProject/loadAllProjects/loadFeaturedProjects/loadProjectSlugs`, `metadata.ts`, `constants.ts`, `content.ts` (content access layer, Milestone 1.6) present. Foundation utilities complete; `recruiter.ts` (recruiter-view aggregation) and a `formatDate()` helper are deferred to their consuming phases (Phase 5/6), not Phase-1 blockers |

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
- `components/layout/ThemeToggle.tsx` ✔ (rendered in `Navbar` — theme switching works)
- `components/layout/ViewModeToggle.tsx` ✔ (custom segmented control; rendered in `Navbar` — Recruiter/Developer mode works)
- `app/globals.css` — Tailwind v4 `@theme` + token system ✔

**App shell (`src/app/`)**
- `layout.tsx` — Inter + JetBrains Mono via `next/font`, `ThemeProvider` + `ViewModeProvider` mounted, `Navbar`/`<main>`/`Footer` shell, `createMetadata()` ✔
- `page.tsx` — assembles `Hero` + `EngineeringDashboard` + `FeaturedProjects` ✔

**Layout components (`src/components/layout/`)**
- `Container`, `SectionHeader`, `Navbar`, `DesktopNav`, `MobileNav`, `Footer` ✔

**Shared components (`src/components/shared/`)**
- `MetricCard.tsx` — reusable metric tile (Milestone 3.1) ✔
- `ProjectCard.tsx` — reusable project card (Milestone 4.1) ✔
- `StatusBadge.tsx` — reusable, data-driven project-status pill (Milestone 4.1) ✔

**Homepage sections (`src/sections/`)**
- `Hero.tsx` ✔, `EngineeringDashboard.tsx` ✔, `FeaturedProjects.tsx` ✔

---

## 4. Planned Files That Are Missing

### App routes (`src/app/`)
- `not-found.tsx` (custom 404)
- `projects/[slug]/page.tsx` (dynamic project page + `generateStaticParams`)
- `recruiter/page.tsx` (2-Minute Recruiter View)
- `sitemap.ts`, `robots.ts` (Phase 6 SEO)

### Layout components (`src/components/layout/`) — ✅ **DONE (Milestone 2)**
- ~~`Navbar.tsx`, `Footer.tsx`, `SectionHeader.tsx`, `Container.tsx`~~ ✅ created (plus `DesktopNav.tsx`, `MobileNav.tsx`)

### Shared components (`src/components/shared/`) — 🟡 **partial**
- ~~`StatusBadge.tsx`~~ ✅ created (Milestone 4.1); plus `MetricCard.tsx` (3.1), `ProjectCard.tsx` (4.1) — not in the original plan list but present
- Still missing: `AnimatedCounter.tsx`, `ScrollReveal.tsx`, `TimelineItem.tsx`
- (`ViewModeToggle.tsx` exists but under `layout/`, not `shared/`)

### Homepage sections (`src/sections/`) — 🟡 **in progress (Milestones 3.1, 4.1)**
- ~~`Hero`~~ ✅, ~~`EngineeringDashboard`~~ ✅, ~~`FeaturedProjects`~~ ✅ created
- Still missing: `EngineeringTimeline`, `GitHubHub`, `CodingProfiles`, `CurrentMission`, `Skills`, `Leadership`, `Certifications`, `About`, `Contact`

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
| `app/page.tsx` | Assembles all homepage sections | Assembles `Hero` + `EngineeringDashboard` + `FeaturedProjects`; remaining sections pending (Phase 2 in progress) | 🟢 On track |
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

- Repo is **green**: `npm run lint` → exit 0; `npm run build` → exit 0 (compiled, TypeScript passed, static routes prerendered).
- `ThemeProvider` and `ViewModeProvider` are **mounted** in `layout.tsx`; `ThemeToggle` and `ViewModeToggle` are **rendered in the `Navbar`** — theme switching and Recruiter/Developer view mode are live (no longer dead code).
- `globals.css` imports `shadcn/tailwind.css` and `tw-animate-css`; both resolve under the installed versions (build is green).
- Fonts are **Inter + JetBrains Mono** via `next/font/google`, bound to `--font-sans` / `--font-mono` (Geist fully removed).
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

## 11. Milestone 3.1 — Hero & Engineering Dashboard (2026-07-01)

**Scope:** Hero + Engineering Dashboard only — no other homepage sections. **Status: ✅ complete — repo green.**

### Files created (3)
- `src/sections/Hero.tsx` — headline (name/role/tagline/focus badges/CTAs) + a premium "Engineering Status" console panel. Consumes `siteConfig` and `getMission()` (server).
- `src/sections/EngineeringDashboard.tsx` — 4-metric grid from `siteConfig.dashboard`, maps icon-name strings → lucide icons (server).
- `src/components/shared/MetricCard.tsx` — reusable, presentational, animation-ready metric tile (takes a resolved `LucideIcon`).

### Files modified (2)
- `src/data/site.config.ts` — added an owner-editable `status` block (`availability`, `location`) for the Hero panel; keeps those values data-driven rather than hardcoded in the component.
- `src/app/page.tsx` — now renders `<Hero />` + `<EngineeringDashboard />` (replaced the shell placeholder).

### Design decisions
- **Data-driven, no fabrication:** Hero pulls `name`/`role`/`tagline`/`focusAreas`/`social` from `siteConfig` and "building"/"researching" from `getMission()`. `location`/`availability` didn't exist in the data layer, so they were added to `site.config.ts` (editable) instead of being hardcoded — `location: "India"` is factual for VIT; `availability` is a conventional editable default.
- **Premium engineering aesthetic (Vercel/Linear/Stripe):** generous whitespace, typographic hierarchy (large `tracking-tight` name, `font-mono` labels), a restrained top gradient, and a bordered "status console" panel with a live pulse dot — no decorative clutter.
- **Reuse over duplication:** built on `Container`, `SectionHeader`, `content.ts`, and shadcn `Card`/`Badge`/`Button`. Focus areas live on the left (badges); the panel avoids repeating them.
- **Base UI composition (ADR-002):** CTA `Button`s become links via the `render` prop, never `asChild`.
- **Animation-ready, not animated:** `MetricCard` isolates the value in its own element so an `AnimatedCounter` can wrap it later; no animation added yet (kept simple per scope).

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; compiled, TypeScript passed, 4 static routes prerendered ✅

### Remaining work
- Remaining homepage sections (FeaturedProjects, Timeline, Skills, Mission, Leadership, Certifications, About, Contact, GitHubHub, CodingProfiles).
- Project pages, feature modules, recruiter route; SEO files; content placeholders from Milestone 1.5.
- Future: `AnimatedCounter` for dashboard metrics; scrollspy for `DesktopNav` hash links.

## 12. Milestone 3.2 — Hero Refinement (2026-07-01)

**Scope:** refine the Hero only + fix its Base UI console warnings. Dashboard untouched (no spacing change needed). **Status: ✅ complete — repo green, console clean.**

### Files created
None.

### Files modified (3)
- `src/sections/Hero.tsx` — full refinement (see below).
- `src/components/layout/MobileNav.tsx` — added `nativeButton={false}` to the `SheetClose`→`Link` (same Base UI warning class; one-prop fix so the mobile menu is also warning-free).
- `IMPLEMENTATION_STATUS.md` — this update.

### Problems fixed — Base UI console warnings
- **Root cause:** button-like Base UI primitives (`Button`, `Dialog.Close`) rendering a non-`<button>` element via `render` while `nativeButton` defaulted to `true` → *"A component that acts as a button expected a native `<button>`…"*.
- **Hero fix (proper pattern):** CTAs are links, so they no longer go through the `Button` primitive — they render as `Link`/`<a>` styled with `buttonVariants()`. Semantic and warning-free.
- **MobileNav fix:** `SheetClose` must stay a `Dialog.Close` while rendering a `Link`, so it now sets `nativeButton={false}` — the composition pattern the warning itself prescribes.
- No warnings suppressed, no lint rules disabled.

### Design decisions (refinement)
- **Left hierarchy:** small intro ("Hi, I'm") → large identity (`name`, `text-5xl`/`6xl`) → mono role → tagline → focus badges → CTAs. Typography-led rhythm via graduated `mt-*` spacing, so the name is no longer the only dominant element.
- **Right panel = visual anchor:** replaced the table/row `<dl>` feel with a single `Card` containing grouped **status blocks** (Availability + Location as a 2-col pair, then Current Focus, Currently Building, Research). Header with a static "Active" dot + one full-width `Separator`. No gradients, no glassmorphism, no flashy animation, no heavy borders.
- **Panel data mapping (no fabrication, no duplication with left badges):** Current Focus ← `getMission().learning`; Currently Building ← `mission.building`; Research ← `mission.exploring`; Availability/Location ← `siteConfig.status`. Left focus badges remain the high-level disciplines (`focusAreas`).
- **CTA hierarchy:** Primary "View Projects" (solid), Secondary "GitHub" (outline, external), Tertiary "Resume" (ghost) — the resume link comes from `siteConfig.social.resume` (asset still a placeholder).
- **Layout/whitespace:** hero fills the viewport naturally on `lg` (`min-h-[calc(100svh-4rem)]`, vertically centered) and tightens padding; right column capped at `26rem` for left/right balance.
- **Accessibility / reduced motion:** single `<h1>`, discernible link text, external link `rel="noopener noreferrer"`, decorative dot `aria-hidden`, and no animations (reduced-motion-safe).

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; compiled, TypeScript passed, `/` prerendered ✅
- **Browser console** → free of the Base UI button-composition warnings (fixed by construction; verify via the screenshot steps).

## 13. Milestone 4.1 — Featured Projects Foundation (2026-07-11)

**Scope:** the Featured Projects homepage section + a reusable `ProjectCard` only. No project detail pages, timeline, or other sections. **Status: ✅ complete — repo green.**

### Files created (3)
- `src/components/shared/StatusBadge.tsx` — reusable project-status pill. Label + color are driven entirely by `siteConfig.projectStatuses` (emerald/blue/amber/muted), so it covers any `ProjectStatus` and stays data-driven. Quiet neutral pill with a colored leading dot (no loud color fills).
- `src/components/shared/ProjectCard.tsx` — reusable, presentational card for any `Project`: `StatusBadge`, title, tagline, recruiter impact (shown only when available), tech-stack chips (capped at 6 with a `+N` overflow badge), and a CTA. Single subtle hover interaction (ring lift), no gradients/motion.
- `src/sections/FeaturedProjects.tsx` — async server section; pulls `getFeaturedProjects()` from the content layer and renders each project through `ProjectCard` in a responsive grid.

### Files modified (2)
- `src/app/page.tsx` — renders `<FeaturedProjects />` after the dashboard.
- `IMPLEMENTATION_STATUS.md` — this update.

### Design decisions
- **Data-driven, zero hardcoding (ADR-010):** the section consumes `getFeaturedProjects()`; the card is a pure function of a `Project`; status label/color come from `siteConfig.projectStatuses`. Adding/editing a featured project is still a JSON-only change.
- **Recruiter impact "when available":** two of three featured projects still carry placeholder `impact: "TODO: …"`. `ProjectCard` hides impact when it's empty or `TODO`-prefixed, so only devops-api surfaces a real impact line today — no fabricated metrics.
- **CTA is a placeholder by design:** `/projects/[slug]` isn't built yet, so cards render a quiet "Case study coming soon" label. `ProjectCard` accepts an optional `href`; enabling real links later is a one-line change in `FeaturedProjects`.
- **Premium, restrained aesthetic (Vercel/Linear/Stripe):** built on existing `Card`/`Badge`/`Container`/`SectionHeader`; mono tech chips, generous spacing, a single ring-lift hover. No flashy gradients or animations (reduced-motion-safe by construction).
- **Layout:** responsive grid — 1 col (mobile) → 2 (`md`) → 3 (`lg`); cards are equal-height (`h-full justify-between`) so the CTA row aligns across the row.
- **Base UI composition (ADR-002):** no `asChild`; the CTA is a `next/link` styled directly, and `StatusBadge` uses the `Badge` primitive's `render`-free span default.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; compiled, TypeScript passed, `/` prerendered ✅

### Remaining work
- Project detail pages (`/projects/[slug]`) — once built, pass `href={ROUTES.project(slug)}` in `FeaturedProjects` to activate card CTAs.
- Remaining homepage sections (Timeline, Skills, Mission, Leadership, Certifications, About, Contact, GitHubHub, CodingProfiles), feature modules, recruiter route, SEO files.
- Content placeholders from Milestone 1.5 (real `impact` for fruit-quality-detection & adaptive-cyber-defense; project images).

## 14. Milestone — Documentation Synchronization (2026-07-11)

**Scope:** documentation only — reconcile all project docs with the current repository. **No code, UI, features, or refactors.** The repository is the source of truth. **Status: ✅ complete — repo green.**

### Files modified (3)
- `IMPLEMENTATION_STATUS.md` — this file: Phase 1 marked **Complete**; Phase 2 progress updated through Hero + Dashboard + Featured Projects; removed stale claims (providers not mounted, layout/page as CNA boilerplate, Hero/Dashboard not implemented, Geist fonts); completion summary and current-state notes refreshed; milestone history (§8–§13) preserved intact.
- `PROJECT_CONTEXT.md` — replaced the stale "Current state" snapshot; corrected font info (Inter + JetBrains Mono active); updated the `/` route description to reflect the current homepage; architecture left unchanged.
- `DECISIONS.md` — updated statuses only: ADR-001 (Next.js 16) accepted; ADR-004 provider-mounting open item resolved; obsolete "Open Confirmations" entry removed. No history deleted.

### Files created (1)
- `ROADMAP.md` — new single source of truth for progress (Completed / Current / Next / Future). Concise; does not duplicate this file's detail.

### What changed vs. reality (verified against the repo)
- **Phase 1 = complete**; foundation utilities present (`recruiter.ts`/`formatDate()` deferred to their consuming phases, not Phase-1 blockers).
- **Live on `/`:** `Hero`, `EngineeringDashboard`, `FeaturedProjects`.
- **Providers mounted; toggles rendered in `Navbar`** — theme switching + Recruiter/Developer view mode work end-to-end.
- **Shared components present:** `MetricCard`, `ProjectCard`, `StatusBadge`.
- **Still absent (confirmed):** `src/hooks/`, `src/features/`, `lib/recruiter.ts`, project detail + recruiter routes, `not-found`/`sitemap`/`robots`, `public/images/**`, `public/resume.pdf`.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; compiled, TypeScript passed, `/` prerendered ✅

## 15. Milestone 4.2 — Project Detail Pages (2026-07-11)

**Scope:** SSG project detail pages at `/projects/[slug]` + activating the homepage `ProjectCard` CTAs. No interactive Architecture Viewer, no other sections, no component redesign. **Status: ✅ complete — repo green.**

### Files created (2)
- `src/app/projects/[slug]/page.tsx` — fully data-driven SSG detail page. `generateStaticParams()` reuses `getProjectSlugs()` (excludes `planned`); `export const dynamicParams = false` makes any non-generated slug (incl. `planned`) a 404; `generateMetadata()` uses `createProjectMetadata()`. Server component with a defensive `notFound()` guard (`!project || status === "planned"`). Sections: Hero (back-link, status badge, title, tagline, status note, tech stack, GitHub link when present), Overview, Architecture (static, node cards + connection list — **not** the interactive viewer), Challenges, Lessons Learned, Future Improvements, Timeline, Gallery. Empty sections are hidden gracefully.
- `src/components/shared/DualModeText.tsx` — the one client island: renders recruiter/developer copy from a `DualModeContent` pair via `useViewMode()`. Falls back to the other mode when the active one is a `TODO`/empty placeholder, so raw TODOs are never shown. Reused by Overview, Challenges, and Lessons.

### Files modified (2)
- `src/sections/FeaturedProjects.tsx` — passes `href={ROUTES.project(project.slug)}` to each `ProjectCard`, activating navigation to the new detail pages.
- `src/components/shared/ProjectCard.tsx` — CTA label text only: linked CTA now reads **"View Case Study"** (the no-`href` placeholder branch is unchanged). No structural/redesign changes.

### Design decisions
- **Next.js 16 route conventions (per AGENTS.md, verified in `node_modules/next/dist/docs/`):** `params` is `Promise<{ slug }>` and awaited; `generateStaticParams` returns `{ slug }[]`; `dynamicParams = false` is the hard guarantee that `planned` projects never render.
- **100% data-driven:** every value comes from project JSON via the existing loaders/`content.ts`; no hardcoded project content. Status-note and gallery-placeholder copy are UI text keyed off `status`, not per-project data.
- **Status behavior:** `completed` → full page; `in-progress` → full page + a "Work in Progress" note; `research` → partial page (empty sections auto-hide) + an "Active research" note; `planned` → never generated.
- **Architecture (static only):** node cards (label + purpose + why-chosen) and a `from → to — label` connection list, resolving node ids to labels. No interactive viewer (deferred to Phase 4). Hidden entirely when `diagram` is empty.
- **Gallery without broken images:** a build-time `existsSync` check under `public/` filters gallery entries to files that actually exist; if none do (current state — no assets yet), a tasteful dashed placeholder renders instead. Uses `next/image` for any real images.
- **Reuse + accessibility:** built on `Container`, `SectionHeader` (h2), `StatusBadge`, `Card`, `Badge`, `buttonVariants`, and theme tokens. Heading hierarchy is single `h1` (title) → `h2` (sections) → `h3` (nodes/challenges/lessons); links are keyboard-accessible; decorative icons/markers are `aria-hidden`; external GitHub link uses `rel="noopener noreferrer"`. No gradients/glassmorphism/flashy motion.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; **7 static routes** prerendered, including SSG `/projects/[slug]` for all 3 non-`planned` projects (`devops-api`, `fruit-quality-detection`, `adaptive-cyber-defense`) ✅
- **Rendered-HTML checks:** completed page shows all sections + architecture connections + GitHub link; research page correctly hides Architecture/Challenges/Lessons/Future and shows the research note + gallery placeholder; in-progress page shows the Work-in-Progress note; homepage CTAs now link to `/projects/*` and read "View Case Study". ✅
- **Planned exclusion:** guaranteed by `getProjectSlugs()` (filters `planned`) + `dynamicParams = false`; no `planned` project exists in the data today, so none is built.

### Notes / remaining work
- No `not-found.tsx` yet — non-generated slugs use Next's default 404 (custom 404 is Phase 6).
- Project image assets (`public/images/**`) still absent, so galleries currently render the placeholder by design.
- Interactive Architecture Viewer, Project Mentor, and the recruiter route remain Phase 4+.

## 16. Milestone 4.3 — Skills Section (2026-07-11)

**Scope:** the Skills homepage section + a reusable `SkillCategory` card only. No Timeline, no changes to project pages / Hero / Dashboard / Featured Projects, no integration work. **Status: ✅ complete — repo green.**

### Files created (2)
- `src/components/shared/SkillCategory.tsx` — reusable, presentational category card: icon + title (`<h3>`) + optional description (only shown when data provides one) + a wrapping `<ul>` of technology chips. Takes a resolved `LucideIcon` (same contract as `MetricCard`); chips reuse the project tech-stack `Badge` styling (`secondary`, `font-mono`) for a consistent system. Single subtle ring-lift hover.
- `src/sections/Skills.tsx` — server section; reads `getSkills()` and renders one `SkillCategory` per category in a responsive grid (1 → 2 → 3 cols). Maps icon-name strings → lucide components with a generic fallback (`Cpu`). Renders `null` when there are no categories.

### Files modified (1)
- `src/app/page.tsx` — mounts `<Skills />` directly after `<FeaturedProjects />`. No other homepage changes.

### Design decisions
- **100% data-driven, no invention:** categories, icons, and technologies all come from `skills.json` via `getSkills()`. `skills.json`'s `SkillCategory` type has **no description and no proficiency field**, so — per the brief — neither is displayed or fabricated. `SkillCategory` accepts an optional `description` for forward-compat, but the section passes none today.
- **Pure server component:** skills content isn't dual-mode, so no client island is needed (unlike the project overview / `DualModeText`).
- **Reuse over new UI:** built on `Container`, `SectionHeader` (its `<h2>`), `Card`, and `Badge`; icon-name→lucide mapping follows the existing `EngineeringDashboard` pattern.
- **Responsive, no overflow:** `flex flex-wrap gap-1.5` chips wrap cleanly; the grid collapses to a single column on mobile. No gradients, glassmorphism, or animation beyond the shared hover; reduced-motion-safe.
- **Accessibility:** section `<h2>` → category `<h3>`; technologies are a semantic `<ul>`/`<li>` list; the category icon is decorative (`aria-hidden`); no interactive elements added, so keyboard behavior is unchanged.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered (7 static routes total, unchanged set) ✅
- **Rendered-HTML checks:** all 5 categories present; **each of the 13 technologies appears exactly once within the `#skills` section** (no duplication); content matches `skills.json` exactly. ✅

### Notes / remaining work
- No proficiency indicator — intentionally omitted (not in the data). If proficiency is added to `skills.json` + the `SkillCategory` type later, the card can surface it without a section rewrite.
- Engineering Timeline is the next homepage section (see `ROADMAP.md`).

## 17. Milestone 4.4 — Engineering Timeline (2026-07-11)

**Scope:** the Engineering Timeline homepage section + a reusable `TimelineItem` only. No changes to Hero / Dashboard / Featured Projects / Skills / project pages; no GitHub or Recruiter-View work. **Status: ✅ complete — repo green.**

### Files created (2)
- `src/components/shared/TimelineItem.tsx` — reusable, presentational timeline entry: a marker dot on the rail + a `Card` with date (`<time>`), icon, humanized type badge, title (`<h3>`), description, and an optional related-project link. Alternates left/right at `lg`+ via a `side` prop; stacks to a single left-rail column below. Per-type accent (dot + quiet text) keyed off the **real** `TimelineEventType` union — no invented types. No motion; reduced-motion-safe.
- `src/sections/EngineeringTimeline.tsx` — async server section. Reads `getTimeline()`, sorts events chronologically (`YYYY-MM` lexical, stable), maps icon-name → lucide (fallback `GitCommitHorizontal`), and renders `TimelineItem`s inside an `<ol role="list">` with a decorative center/left rail. Also loads `getProjects()` + `getProjectSlugs()` so a related event shows the real project **title** and links to its detail page **only when a page exists** (planned projects have none).

### Files modified (1)
- `src/app/page.tsx` — mounts `<EngineeringTimeline />` directly after `<Skills />`. No other homepage changes.

### Design decisions
- **100% data-driven, no invention:** every event's date/type/title/description/icon/related-project comes from `timeline.json` via `getTimeline()`. Event-type accents/labels are keyed off the actual union (`project-start`, `project-end`, `milestone`, `achievement`, `learning`) — the brief's example list (project/leadership/research) was **not** used because those aren't the types in the data.
- **Layout:** alternating cards around a centered rail on `lg`+ (CSS grid, `grid-cols-2` + `gap-x-12`, marker on the center line); a single left-rail stacked column below `lg`. No horizontal scroll, no overflow (each card is bounded by its grid column; text/badges wrap).
- **Ordering:** oldest → newest, matching the authored data; `sort` is stable so the two same-month (`2025-06`) events keep authored order.
- **Graceful fields:** description renders only when present; related-project renders only when set, and only as a link when a detail page exists (else a plain label). Pure server component — timeline content isn't dual-mode.
- **Reuse + accessibility:** built on `Container`, `SectionHeader` (`h2`), `Card`, `Badge`, theme tokens, and the established icon-map pattern. Semantic `<ol>/<li>` structure with `role="list"`, `h2` → `h3` hierarchy, `<time dateTime>` for dates, keyboard-accessible related links (`next/link`), and `aria-hidden` on the rail and marker dots. No gradients/glassmorphism.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered (7 static routes total, unchanged set) ✅
- **Rendered-HTML checks:** all 6 events present; chronological order verified (`2024-08 → 2025-01 → 2025-04 → 2025-05 → 2025-06 → 2025-06`); type badges humanized (`Milestone`, `Project Start`, `Project End`, `Achievement`); related links point to `/projects/*` and display the resolved project title; decorative elements are `aria-hidden`. ✅

### Notes / remaining work
- `learning` and `project`/`leadership`/`research` styles: `learning` has an accent defined for forward-compat though no `learning` event exists yet; the brief's other example types aren't in the union and were intentionally not added.
- About is the next homepage section (see `ROADMAP.md`).

## 18. Milestone 4.5 — About Section (2026-07-11)

**Scope:** the About homepage section only. No changes to Hero / Dashboard / Featured Projects / Skills / Timeline / project pages; no Leadership or Contact work. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/sections/About.tsx` — read-optimized bio + highlights, driven entirely by `getAbout()`. Pure server component (About content isn't dual-mode). Two-column on `lg`+ (bio left at a comfortable measure, highlights right); stacked on mobile (bio then highlights). Highlights are a semantic `<ul>` of compact `Card`s, each with a decorative check icon.

### Files modified (1)
- `src/app/page.tsx` — mounts `<About />` directly after `<EngineeringTimeline />`. No other homepage changes.

### Design decisions
- **100% data-driven, no invention:** bio and highlights come from `about.json` via `getAbout()`. The `AboutData` model is `{ bio, highlights }` — there is **no** personal-interests or closing-statement field, so (per the brief's "only if already present" / "never invent content") neither is rendered. Every field is guarded so an empty value hides gracefully; the section returns `null` if both are empty.
- **Readability over decoration:** bio is `text-lg leading-relaxed` capped at `max-w-2xl` (~comfortable line length); generous whitespace; no oversized graphics. Highlights use small check-marked cards rather than large tiles.
- **Reuse:** built on `Container`, `SectionHeader` (its `<h2>`), and `Card`; theme tokens and the established spacing/typography. No `Badge` used (highlights read better as check-marked rows). No gradients/glassmorphism; only the shared ring-lift hover.
- **Accessibility:** section `<h2>` → a subtle `<h3>` "Highlights"; highlights are a real `<ul>/<li>` list; paragraph bio; decorative check icons are `aria-hidden`; no interactive elements added, so keyboard behavior is unchanged.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered (7 static routes total, unchanged set) ✅
- **Rendered-HTML checks:** full bio rendered verbatim from JSON; all 4 highlights present; header present; structure is 1 `<h3>` + a 4-item `<ul>`; decorative icons `aria-hidden`. ✅

### Notes / remaining work
- No interests/closing-statement — intentionally omitted (not in the data/type). If added to `about.json` + `AboutData` later, the section can surface them with guards, no rewrite.
- Leadership is the next homepage section (see `ROADMAP.md`).

## 19. Milestone 4.6 — Leadership Section (2026-07-11)

**Scope:** the Leadership homepage section only. No changes to any previously completed section or component; no Certifications/Contact work. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/sections/Leadership.tsx` — role cards driven entirely by `getLeadership()`. Pure server component (leadership content isn't dual-mode). Responsive grid (1 → 2 → 3 cols) matching Skills; each card shows an icon + title (`<h3>`), a `period` badge, a joined `organization · institution` affiliation line, and the description — every field guarded so empties hide gracefully. Returns `null` when there are no roles.

### Files modified (1)
- `src/app/page.tsx` — mounts `<Leadership />` directly after `<About />`. No other homepage changes.

### Reuse decision
- **No new shared component.** Per the "prefer reuse" directive, the role card is composed inline from the existing `Card` + `Badge` primitives (same header/icon/grid language as `SkillCategory`/`ProjectCard`). A single-purpose card used only in this section offered no architectural benefit as a standalone shared component.

### Design decisions
- **100% data-driven, no invention:** title/organization/institution/period/description all come from `leadership.json` via `getLeadership()`. Affiliation is `[organization, institution].filter(Boolean).join(" · ")`, so a missing side collapses cleanly; period renders only when present.
- **Visually complements Skills/About/Timeline:** same `Card` grid, the muted rounded icon box (`Users`), the `SectionHeader` `h2`, and shared spacing/typography. `period` uses an outline mono `Badge` consistent with the timeline/date styling. No gradients/glassmorphism; only the shared ring-lift hover.
- **Accessibility:** section `<h2>` → role `<h3>`; readable card layout; decorative icon `aria-hidden`; responsive with no overflow (grid columns bound each card; text wraps).

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered (7 static routes total, unchanged set) ✅
- **Rendered-HTML checks:** all fields of the role rendered from JSON; affiliation joined as `Geospatial Club · VIT`; header + eyebrow present (ampersand HTML-escaped); one `<h3>` role title; decorative icon `aria-hidden`. ✅

### Notes / remaining work
- Certifications is the next homepage section (see `ROADMAP.md`).

## 20. Milestone 4.7 — Certifications Section (2026-07-11)

**Scope:** the Certifications homepage section only. No changes to any previously completed section or component; no Contact work. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/sections/Certifications.tsx` — cert cards driven entirely by `getCertifications()`. Pure server component. Responsive grid (1 → 2 → 3 cols) matching Skills/Leadership; each card shows an image (or placeholder), title (`<h3>`), issuer, a `date` badge, and a "View credential" link. Every field guarded so missing values hide gracefully; returns `null` when there are no certs.

### Files modified (1)
- `src/app/page.tsx` — mounts `<Certifications />` directly after `<Leadership />`. No other homepage changes.

### Reuse decision
- **No new shared component.** Per the "prefer reuse" directive, cards are composed inline from existing `Card` + `Badge` + `buttonVariants`, and image existence uses the same build-time `existsSync` guard established by the project-detail gallery (Milestone 4.2). A single-purpose card offered no architectural benefit as a standalone shared component.

### Design decisions
- **100% data-driven, no invention:** title/issuer/date/image/url all come from `certifications.json` via `getCertifications()`.
- **Graceful sparse-data handling (the milestone's core):**
  - **Missing image file →** a tasteful placeholder panel (`aspect-video`, muted bg, centered `Award` icon) — never a broken image. The `image` path is checked against `public/` at build with `existsSync`; the current cert's asset doesn't exist yet, so the placeholder renders.
  - **Empty `date` →** the date `Badge` is not rendered.
  - **Empty `url` →** the "View credential" button is not rendered.
  - No `TODO`/placeholder strings ever surface (verified in the rendered HTML).
- **Visual consistency (checklist verified):** section rhythm `py-16 sm:py-20` + header `mb-8`; grid `gap-4` at `1→2→3` cols; `Card` `rounded-xl`; `SectionHeader` `h2` → card `h3 font-heading text-base font-semibold`; shared `hover:ring-foreground/20`; image-flush card uses `p-0/gap-0` outer + `p-5/gap-3` inner content (same convention as `ProjectCard`/gallery). No gradients/glassmorphism.
- **Accessibility:** `h2` → `h3` hierarchy; real images get descriptive alt (`"{title} — {issuer} certificate"`); the placeholder icon is `aria-hidden`; the credential link is keyboard-accessible with `rel="noopener noreferrer"`; responsive with no overflow.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered (7 static routes total, unchanged set) ✅
- **Rendered-HTML checks:** title + issuer rendered from JSON; no broken image (absent file → placeholder panel); empty URL → no credential button; no `TODO` text; header present; one `<h3>`. ✅

### Notes / remaining work
- When the cert image (`public/images/certifications/…`) and the AWS `date`/`url` are added to the data/assets, the card upgrades automatically (real image, date badge, credential button) with no code change.
- Contact is the next homepage section (see `ROADMAP.md`).

## 21. Milestone 4.8 — Contact Section (2026-07-11)

**Scope:** the Contact homepage section only — the final homepage section. No changes to any previously completed section or component; no GitHub-integration work. **Status: ✅ complete — repo green. 🏁 Homepage complete.**

### Files created (1)
- `src/sections/Contact.tsx` — closing-CTA section, driven entirely by `getContact()`. Pure server component. Renders every link as a card (platform icon + platform `<h3>` + label + external-link button) in a responsive grid (1 → 2 → 4 cols). Returns `null` when there are no links.

### Files modified (1)
- `src/app/page.tsx` — mounts `<Contact />` directly after `<Certifications />`. **This completes the homepage** (Hero → Dashboard → Featured Projects → Skills → Timeline → About → Leadership → Certifications → Contact). No other homepage changes.

### Reuse decision
- **No new shared component.** Cards are composed inline from existing `Card` + `buttonVariants`, and the icon mapping reuses the **Footer's** established `ICON_MAP` + `?? ExternalLink` fallback pattern. No architectural benefit to a standalone component.

### Design decisions
- **100% data-driven, no invention:** platform/url/icon/label all come from `contact.json` via `getContact()`. No closing prose is invented — the section uses an eyebrow + title header only (matching the description-less headers already used by Dashboard/Leadership/Certifications), since `contact.json` has no copy field.
- **Icon fallback (verified):** `github`/`linkedin` are **not** exported by the installed lucide-react (brand glyphs removed — see ADR/Footer note), so they are intentionally not imported/mapped and fall back to `ExternalLink`; any unknown icon name does too. The build passes without importing the removed glyphs.
- **Scheme-aware link semantics (generic UI copy, not fabricated content):** `http` → "Visit" + `ArrowUpRight`, opens in a new tab with `target="_blank" rel="noopener noreferrer"`; `mailto:` → "Send email" + `Mail` (same tab, no rel); local (`/resume.pdf`) → "Download" + `Download` (same tab). Buttons carry an `aria-label` (`"{cta} — {platform}"`).
- **Visual consistency (checklist verified):** section rhythm `py-16 sm:py-20` + header `mb-8`; `Card` `rounded-xl`; `SectionHeader` `h2` → card `h3 font-heading text-base font-semibold`; icon box `size-8` / icon `size-4`; shared `hover:ring-foreground/20`; `gap-4` grid. The closing band uses `lg:grid-cols-4` (fits the 4 links on one row — the same 4-col precedent as the Engineering Dashboard). No gradients/glassmorphism.
- **Accessibility:** `h2` → `h3` hierarchy; platform icons `aria-hidden`; descriptive link `aria-label`s; keyboard-accessible; external links use `rel="noopener noreferrer"`; responsive with no overflow (`break-words` on long labels).

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered (7 static routes total, unchanged set) ✅
- **Rendered-HTML checks:** all 4 links (platform + label + url) rendered from JSON; exactly 2 external links carry `rel="noopener noreferrer"` (GitHub, LinkedIn); `mailto`/local resume are non-external; CTAs "Visit"/"Send email"/"Download" present; 4 `<h3>` platform headings; header present. ✅

### Notes / remaining work
- Email (`sanket@example.com`) and the `resume.pdf` asset remain owner placeholders (per Milestone 1.5); links render correctly and upgrade automatically when the real values/assets land — no code change.
- **Homepage is feature-complete.** Next is Phase 5 integrations (GitHub Hub, Coding Profiles) and the unique features — see `ROADMAP.md`.

## 22. Milestone 5.1 — GitHub Hub (Live Integration) (2026-07-11)

**Scope:** the GitHub Hub feature only (first Phase 5 live integration). No Coding Profiles / Recruiter View / Architecture Viewer / Project Mentor work; no changes to completed sections. **Status: ✅ complete — repo green, live data verified.**

### Files created (6, under `src/features/github/`)
- `github.service.ts` — reusable, server-only data service. `getGitHubData(): Promise<GitHubData>` fetches repos + public events (REST) and the contribution calendar (GraphQL, token-gated) concurrently, maps raw → typed domain models, aggregates primary languages, and **never throws** (returns a typed empty `GitHubData` on any failure). Also exports `totalStars`, `isGitHubDataEmpty`, and `formatShortDate`. Username is read **only** from `siteConfig.githubUsername`.
- `RepoCard.tsx`, `LanguageBar.tsx`, `ActivityFeed.tsx`, `ContributionHeatmap.tsx` — presentational feature components (all server components).
- `GitHubHub.tsx` — async server section that orchestrates the above; profile summary **reuses the shared `MetricCard`**; each sub-block hides when empty; full-failure shows a graceful placeholder.

### Files modified (1)
- `src/app/page.tsx` — mounts `<GitHubHub />` after `<Contact />`. No other homepage changes.

### Repository-health / reuse decisions
- **Reused:** `MetricCard` (summary tiles), `Container`, `SectionHeader`, `Card`, `buttonVariants`, `cn`, and `siteConfig`. No duplicate stat-tile or layout component was introduced.
- **New abstractions (justified):** there was no GitHub code to extend, so a feature `github.service.ts` (encapsulates fetch/ISR/mapping/fallback) and the presentational components are net-new. `formatShortDate` lives in the service and is reused by `RepoCard` + `ActivityFeed`; no shared date util existed to reuse (the component-local `formatMonth` handles `YYYY-MM`, not ISO timestamps), so a feature-scoped helper is correct rather than a premature shared util.
- **Types unchanged:** `src/types/github.ts` was **not** modified. `GitHubData` has no `profile` field, so the "profile summary" is derived from the typed data (repo count, total stars, language count, contributions when available) — no type redesign.

### Architectural decisions
- **ISR per ADR-011 (Next 16 verified in `node_modules/next/dist/docs/`):** `fetch` is uncached by default; each request sets `next: { revalidate: 3600 }`. This scopes revalidation to the feature — the build now reports `/` with **Revalidate 1h** (ISR) while the homepage change stays limited to mounting the section. Cache Components is **not** enabled, so the "previous model" (`next.revalidate`) applies.
- **Auth-optional:** `GITHUB_TOKEN` is used when present (higher rate limits; unlocks the GraphQL contribution calendar). Without it, REST endpoints still work and `contributions` is `null` → the heatmap and its tile hide gracefully. No token is committed.
- **Graceful fallback, no fabrication:** on any failure the service returns an empty `GitHubData` (the fallback shape from `github.ts`); `GitHubHub` detects this via `isGitHubDataEmpty` and renders an "unavailable" placeholder with a profile link — never zeros, never broken layout, never fake stats.
- **Server components only:** no client islands (no interactivity required).

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered as **ISR (Revalidate 1h)**; 7 routes total ✅
- **Live data verified (sandbox had network):** real repos rendered for `kr-Sanket` (`sanket-dev`, `Adaptive-Firewall-System`, `Hot_Reload`, `java-todo-api`), plus Repositories/Total Stars/Languages tiles, language legend, and Recent Activity. Contributions tile/heatmap correctly **absent** (no token). Username sourced from `siteConfig`; external links carry `rel="noopener noreferrer"`. ✅
- **Fallback path** implemented and correct (placeholder + profile link); not triggered here because the live fetch succeeded.

### Notes / remaining limitations
- **Contribution heatmap requires `GITHUB_TOKEN`** (GraphQL-only); hidden until one is configured in the deploy environment.
- **Language stats** are computed from each repo's *primary* language (repo counts), not per-repo byte breakdowns — accurate and honest, but coarser than GitHub's byte-level stats (would need N extra `/languages` calls).
- **Repo/star counts** reflect fetched non-fork public repos (one 100-item page — sufficient for this profile).
- Live values are baked at build and refresh on the 1h ISR cycle.
- Coding Profiles is the next milestone (see `ROADMAP.md`).

## 23. Milestone 5.2 — Coding Profiles (2026-07-11)

**Scope:** the Coding Profiles feature only (Phase 5 live integration). No Recruiter View / Project Mentor / Architecture Viewer work; no changes to completed sections. **Status: ✅ complete — repo green.**

### Files created (4, under `src/features/coding-profiles/`)
- `codingProfiles.service.ts` — resilient, server-only data service. `getCodingProfiles(): Promise<CodingProfilesData>` builds a `CodingProfile` for each configured (non-empty) username, deriving `profileUrl` and fetching stats concurrently. **LeetCode** stats come from its unofficial public GraphQL endpoint (problems solved, ranking, contest rating); **CodeChef/HackerRank** have no reliable public API, so they are link-only (empty stats, no fabricated numbers). Never throws — any failure yields `stats: {}`. Also exports `totalProblemsSolved`.
- `StatsDisplay.tsx` — renders only the stat fields that exist as value/label pairs (plain elements, not nested cards); renders nothing when there are no stats.
- `ProfileCard.tsx` — per-platform card (neutral platform icon + label `<h3>` + `@username` + `StatsDisplay` + external "View profile" button).
- `CodingProfiles.tsx` — async server section; **reuses the shared `MetricCard`** for aggregate tiles (Platforms, Problems Solved), renders a `ProfileCard` grid, and shows a graceful placeholder when no usernames are configured.

### Files modified (2)
- `src/data/site.config.ts` — added an owner-editable `codingProfiles` block (`leetcode`/`codechef`/`hackerrank`, empty by default) — the single source of truth for usernames (mirrors the existing `status` owner-editable block). No type change; additive.
- `src/app/page.tsx` — mounts `<CodingProfiles />` after `<GitHubHub />`. No other homepage changes.

### Repository-health / reuse decisions
- **Reused:** `MetricCard` (aggregate tiles — same reuse as GitHub Hub), `Container`, `SectionHeader`, `Card`, `buttonVariants`, `cn`, `siteConfig`, `SECTION_IDS`. The fetch/ISR/never-throw idioms mirror `github.service.ts` (same patterns, platform-specific endpoints) — no duplicated fetch utility was extracted since the two services target different APIs and share no request shape.
- **New abstractions (justified):** `codingProfiles.service.ts` (distinct data source — cannot extend the GitHub service without coupling unrelated APIs) and the 3 presentational components (distinct responsibilities). `MetricCard` is reused at the section level rather than nested inside `ProfileCard` (which would create double-card borders); `StatsDisplay` uses plain elements for the per-card stats — documented in `StatsDisplay.tsx`.
- **Types unchanged:** `src/types/coding-profile.ts` was not modified.

### Architectural decisions
- **ISR per ADR-011:** each fetch sets `next: { revalidate: 21600 }` (6h). The homepage's reported page-level `revalidate` remains **1h** because Next uses the minimum across all page fetches (GitHub Hub's 3600s); the coding service still declares 6h correctly per the milestone.
- **Username source:** only `siteConfig.codingProfiles`; empty values omit a platform entirely (no link, no card).
- **Graceful fallback, no fabrication:** unconfigured → section placeholder; configured but stats unavailable → link-only card; failed fetch → empty stats. No solved counts or ratings are ever invented.
- **Server components only** — no client islands.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; `/` prerendered as ISR (Revalidate 1h); 7 routes total ✅
- **Placeholder path (current state — no usernames configured):** section header renders + "Coding profiles coming soon" placeholder; no platform URLs, usernames, or stat labels leaked (nothing fabricated); section ordered after GitHub Hub. ✅
- **Populated path (verified via a temporary config edit, then reverted):** a `ProfileCard` rendered with the platform label, the config-derived profile URL (`hackerrank.com/profile/<user>`), the `MetricCard` "Platforms" aggregate tile, and the external "View profile" button — with no fabricated stats for the link-only platform. Config restored to empty afterward. ✅

### Notes / remaining limitations
- **Usernames are empty owner placeholders** (like the existing email/resume placeholders); the section shows a placeholder until the owner fills in `siteConfig.codingProfiles`. Then LeetCode auto-populates stats and all platforms show link cards.
- **LeetCode uses an unofficial endpoint** (no official public API); if it changes/blocks requests, the card degrades to link-only (no crash). **CodeChef/HackerRank** are link-only by design (no reliable public stats API — no fabrication).
- Live values are baked at build and refresh on the 6h ISR cycle.
- Recruiter View is the next milestone (see `ROADMAP.md`).

## 24. Milestone 5.1.5 — Navigation & Homepage Flow Refinement (2026-07-12)

**Scope:** UX polish only — fix the in-page navigation bug, reorder the homepage sections, and confirm navbar↔section consistency. **No new features, no redesign, no architecture changes, no new sections.** **Status: ✅ complete — repo green.**

### Root cause (navigation bug)
Navbar items and the Hero "View Projects" CTA were `<Link href="#section">` anchors. Native browsers — and Next's `<Link>` — only scroll to a fragment when the URL fragment **changes** (confirmed in `node_modules/next/dist/docs/.../components/link.md`). First click set `location.hash` and scrolled; after the user manually scrolled away, the hash still matched the target, so re-clicking the same item resolved to the same URL → **no navigation fired → no scroll**. That is why "clicking the same navbar item again often did nothing."

### Fix (proper browser/Next solution — no reloads, no timeouts)
- **`src/lib/scroll.ts` (new):** `scrollToHash(href)` finds the target by id and calls `element.scrollIntoView` **imperatively on every click**, so it scrolls regardless of the current hash/scroll position. Smooth by default; respects `prefers-reduced-motion` (`behavior: "auto"` when reduced). Updates the URL via `history.replaceState` — shareable, no reload, no Next navigation, no native re-scroll.
- **`src/components/shared/HashLink.tsx` (new):** a `next/link` wrapper that intercepts hash hrefs (`preventDefault` + `scrollToHash`) and lets route hrefs fall through to normal navigation.
- **Sticky-header offset:** `html { scroll-pt-16 }` (4rem = navbar `h-16`) in `globals.css` so anchored sections land below the sticky header — the offset the Next docs recommend for `scrollIntoView`/hash nav.

### Files created (2)
- `src/lib/scroll.ts`, `src/components/shared/HashLink.tsx`.

### Files modified (5)
- `src/components/layout/DesktopNav.tsx` — `Link` → `HashLink` (active-state logic unchanged).
- `src/components/layout/MobileNav.tsx` — now a **controlled** Sheet: hash taps close the drawer, then scroll from Base UI's `onOpenChangeComplete` (fires after the close animation, once the scroll lock is released) — event-driven, not a timeout. Plain `Link`s replace the `SheetClose`→`Link` pattern, so the prior `nativeButton={false}` workaround is no longer needed.
- `src/sections/Hero.tsx` — "View Projects" CTA `Link` → `HashLink` (unused `Link` import removed).
- `src/app/page.tsx` — **section reorder** (see below).
- `src/app/globals.css` — added `scroll-pt-16` to `html`.

### Homepage order change (Issue #2)
Before: Hero → Dashboard → Projects → Skills → Timeline → About → Leadership → Certifications → Contact → **GitHub** → CodingProfiles (GitHub Hub was stranded near the bottom).
After: **Hero → Dashboard → Projects → GitHub → Skills → Timeline → About → Leadership → Certifications → Contact**. Coding Profiles is parked after the defined flow (a code comment marks it); the next milestone moves it directly after GitHub Hub, per the brief. Only the render order in `page.tsx` changed — no section was redesigned, respaced, or re-typographed.

### Navbar consistency (Issue #3)
`siteConfig.navLinks` order kept as-is (Projects, Dashboard, GitHub, Skills, About, Contact). Verified every item resolves to an existing section id after the reorder: `#projects`→`projects`, `#dashboard`→`dashboard`, `#github`→`github`, `#skills`→`skills`, `#about`→`about`, `#contact`→`contact`. No config change was needed.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 7 static routes, `/` still ISR (Revalidate 1h) ✅
- **Prerendered-HTML checks:** section `id` order is `hero, dashboard, projects, github, skills, timeline, about, leadership, certifications, contact, coding-profiles`; all 6 navbar hash hrefs resolve to present ids. ✅
- **Client-bundle check:** the shipped chunks contain the handler (`scrollIntoView`, `replaceState`, `prefers-reduced-motion`) — the interception is wired on the client, not dead server code. ✅
- **Interactive click-through** (repeatably clicking each item / the Hero CTA from multiple scroll positions) is by-construction correct given the docs-confirmed root cause; it requires a browser and is left as the owner-run manual checklist.

### Accessibility / constraints preserved
Links stay real anchors with hash hrefs (keyboard/right-click/open-in-new-tab intact); smooth scrolling preserved but downgraded to instant under `prefers-reduced-motion`; no new animations; no feature-module changes; no spacing/typography edits beyond the scroll offset.

## 7. See Also

- `ROADMAP.md` — single source of truth for milestone progress
- `PROJECT_CONTEXT.md` — condensed architecture for future sessions
- `DECISIONS.md` — architectural decisions & deviations log
