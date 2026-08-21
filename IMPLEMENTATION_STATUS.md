# Implementation Status

> Snapshot comparing the current repository against **Architecture & Implementation Plan v2.0**.
> Generated: 2026-06-29. Updated: 2026-07-11 (§14) and **2026-08-21 (Pre-Relaunch Documentation Sync — see §42)**. Branch: `main`.

## TL;DR (current as of 2026-08-21)

**The platform is feature-complete and in launch preparation** — see `LAUNCH_BOARD.md` for the item-level board. All build phases shipped: full homepage (9 sections), SSG project pages, GitHub Hub + Coding Profiles (ISR), Recruiter View (`noindex`), Project Mentor (client-side hybrid search), and the **Architecture Viewer** (interactive diagram + selection + detail panel, §§27–30). Launch prep so far: P1–P4 product/engineering reviews; **Sprint 1 blockers closed** (real email/resume/LinkedIn, graduation + target roles, research-project impact statements, timeline refreshed to Aug 2026); **real certifications** (3, with credential URLs and issuer logos); **Sprint 2 SEO/production mostly done** (`robots.ts`, `sitemap.ts`, custom 404, build-generated OG/Twitter images, site-wide JSON-LD, `createMetadata` merge-bug fix). Repo green (`lint` + `build`, 12 routes). Remaining before launch: favicons/manifest, analytics decision, domain confirmation, `GITHUB_TOKEN`, image assets, owner-knowledge content — then Sprint 3 polish / Sprint 4 cleanup / Sprint 5 deploy.

> The paragraph below and the §1 Phase Matrix are the original 2026-06/07 snapshot, preserved as history — do not trust them for current status.

**[Historical]** Phase 1 (Foundation) complete; Phase 2 (homepage sections) in progress — Hero (refined), Engineering Dashboard, and Featured Projects live on `/`. **Overall completion then: ~52%.**

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

## 25. Milestone 5.3 — Recruiter View (`/recruiter`) (2026-07-12)

**Scope:** the private, `noindex` executive-summary route only. No homepage section was changed, no site redesign, no architecture change. **Status: ✅ complete — repo green.**

### Files created (2)
- `src/lib/recruiter.ts` — the recruiter page's **single data source**. `getRecruiterData()` aggregates the existing content layer (`getFeaturedProjects`, `getSkills`, `getTimeline`, `getLeadership`, `getCertifications`, `getAbout`, `getContact`) plus `site.config.ts` (identity, `status`, `dashboard`, `social`) into one typed `RecruiterData` object. It only selects/trims/orders — no data is duplicated or invented. Also exports `recruiterMetadata` (built via the shared `createMetadata`, forcing `robots: { index: false, follow: false }`).
- `src/app/recruiter/page.tsx` — async server component, SSG. Consumes **only** `lib/recruiter.ts`. Eight sections in order: **Hero** (name, role, About bio, availability, location, primary "Get in touch" CTA + GitHub/LinkedIn/Resume links) → **Key Metrics** (reuses `MetricCard`; CGPA/Projects/Repositories/Certifications) → **Featured Projects** (reuses `ProjectCard` with real detail links; recruiter `impact` surfaced by the card) → **Core Skills** (compact grouped cards, skills joined with `·` — no chip clouds) → **Timeline Highlights** (only `milestone`/`project-end`/`achievement` events) → **Leadership** (compact cards) → **Certifications** (compact cards, image-free) → **Contact** (simple CTA button row). `export const metadata = recruiterMetadata`.

### Files modified (2)
- `ROADMAP.md` — moved Recruiter View to Completed; refreshed Current/Next/Future (incl. `lib/recruiter.ts` now done).
- `IMPLEMENTATION_STATUS.md` — this entry.

### Design / reuse decisions
- **Aggregation-only data layer (no duplication):** the page never touches `content.ts`/JSON/`siteConfig` directly — it reads one shaped object from `recruiter.ts`. Featured projects use `getFeaturedProjects()` (already `order`-sorted, `featured`-filtered) rather than re-filtering `getProjects()`.
- **100% component reuse:** `Container`, `SectionHeader` (its `<h2>`), `MetricCard`, `ProjectCard`, `StatusBadge` (via `ProjectCard`), `Card`, `Badge`, `buttonVariants`, `cn`, `ROUTES.project`. No new shared/section component was introduced; the only new UI is the page's local `Section` wrapper + an icon-name→lucide map (same pattern as `EngineeringDashboard`/`Contact`, with a `Cpu` fallback).
- **`noindex` (ADR-011):** enforced in `recruiterMetadata` — the prerendered HTML carries `<meta name="robots" content="noindex, nofollow">`. No sitemap/robots wiring needed (Phase 6).
- **No fabrication:** recruiter `impact` still hidden by `ProjectCard` when it's a `TODO`/empty placeholder; cert date/credential and skill descriptions render only when present; the cert image is intentionally omitted in this compact view (asset doesn't exist).
- **Premium/minimal aesthetic:** section rhythm `py-16 sm:py-20`, header `mb-8`, `Card` `rounded-xl`, `1→2→3`/`2→4` grids, mono labels, shared ring-lift hover — consistent with the homepage. No gradients/glassmorphism/new animations.
- **Accessibility:** single `<h1>` (name) → section `<h2>` → card `<h3>`; timeline is a semantic `<ol role="list">`; decorative icons `aria-hidden`; external links `rel="noopener noreferrer"`; contact links carry descriptive `aria-label`s; responsive with no overflow.

### Architecture
No change. ADR-011 (SSG + `noindex` recruiter route) and ADR-010 (content-as-data via the access layer) were already settled and are honored here — hence **no `DECISIONS.md`/`PROJECT_CONTEXT.md` edit**.

### Validation
- **`npm run lint`** → exit 0, clean (no warnings) ✅
- **`npm run build`** → exit 0; **8 static routes**, `/recruiter` prerendered as **static (SSG)** ✅
- **Prerendered-HTML checks:** `<meta name="robots" content="noindex, nofollow">` present; `<h1>` = "Sanket Kumar"; seven `<h2>`s in order (Key Metrics → Featured Projects → Core Skills → Highlights → Leadership → Certifications → Get in touch); metric values 8.69 / 3 / 15 / 1; availability "Open to opportunities" + location "India"; all 3 featured projects; skills joined with `·`; hero CTAs resolve to `mailto:` + `/resume.pdf`. ✅

### Notes / remaining work
- Email (`sanket@example.com`) and `/resume.pdf` are still owner placeholders (site-wide) — the CTAs upgrade automatically when real values/assets land.
- No in-navbar link to `/recruiter` by design (private, link-shared). A dedicated recruiter-only layout (hide site nav) was **not** added — out of scope; the page lives within the standard app shell.
- Next: Phase 4 unique features (Project Mentor, Architecture Viewer) — see `ROADMAP.md`.

## 26. Milestone 5.4 — Project Mentor (2026-07-29)

**Scope:** finalize the already-implemented Project Mentor feature — verify against ADR-009, polish only where necessary, validate, and document. No rebuild, no Architecture Viewer work, no changes to completed sections. **Status: ✅ complete — repo green.**

### Files (feature, under `src/features/project-mentor/`)
- `tfidf.ts` — hand-rolled TF-IDF + cosine similarity (no NLP dependency): shared `tokenize` (lowercase, stop-words, light stemmer), smoothed IDF (`ln((1+N)/(1+df)) + 1`), length-normalized TF, precomputed L2 norms.
- `buildIndex.ts` — per-project index built once: Fuse instance (keys weighted question 0.4 / keywords 0.3 / topic 0.2 / answer 0.1, `ignoreLocation`, permissive threshold 0.6 — combined thresholding happens in `SearchEngine`) + TF-IDF model (keywords repeated in the document text as curated retrieval hints).
- `SearchEngine.ts` — hybrid ranking per ADR-009: `0.4 × Fuse similarity + 0.6 × TF-IDF cosine`, confidence threshold `0.25`, top-3 results, stable `search(query): SearchResult[]` API, `isEmpty` for empty knowledge bases.
- `MentorChat.tsx` — the client island: greeting, `role="log"` transcript in a `ScrollArea`, matched-topic badge on answers, input + submit, "Try asking" suggestion chips from the KB. Empty KB → header + the project's own `fallback` string, no input.
- `types.ts` — `SearchResult`, `MentorMessage`.

### Integration
- `src/app/projects/[slug]/page.tsx` mounts `<MentorChat>` in a "Project Mentor" section (after Overview) on **every** project page; empty knowledge bases degrade to the fallback card by design (verified in prerendered HTML for all 3 projects: devops-api renders the interactive chat, fruit-quality-detection and adaptive-cyber-defense render the fallback with no input/chips).

### Polish applied in this milestone (the only source changes)
1. **`SearchEngine.ts` — token-aware fuzzy half.** Fuse bitap-matches its *whole* pattern, so natural paraphrases ("why did you pick jenkins") scored ~0.09 fuzzy despite an exact keyword hit, and correct top-ranked matches fell just below the 0.25 threshold. The fuzzy similarity is now `max(full-query sim, mean per-token sim)` — token coverage recovers paraphrases while a single stray token can't carry an off-topic query past the threshold. ADR-009 unchanged: same weights (0.4/0.6), same threshold (0.25), same public API — this is internal to the fuzzy half.
2. **`MentorChat.tsx` — mount-scroll guard.** The transcript auto-scroll effect also ran on mount, and `scrollIntoView` scrolls *ancestor* containers — merely visiting a project page could jump the viewport toward the mentor card. Now skipped while only the greeting exists.
3. **`MentorChat.tsx` — valid list markup.** The scroll sentinel `<div>` moved out of the `<ol>` (only `<li>` is a valid list child).

### Validation (behavioral suite, real `devops-api` knowledge base)
- **23/23 cases pass:** all 5 exact KB questions rank their own entry first; 9 paraphrase/keyword queries ("hardest part of the project?", "how do containers work here", "grafana prometheus observability", …) match the correct entry; 6 off-topic probes ("what is the meaning of life", "react hooks best practices", …) plus empty/whitespace queries all fall below threshold → honest fallback. **No query ever returned a wrong answer** (precision preserved by construction — fallback over weak matches).
- **Invariants checked per query:** scores descending, all ≥ 0.25, ≤ 3 results; empty-KB engine returns `isEmpty` + no results.
- **Known limitation (accepted):** a single-token typo with zero corpus overlap ("why terrafrom") returns the fallback — TF-IDF has no signal for unseen terms and the fuzzy half alone can't clear the ADR threshold. The fallback copy explicitly lists valid topics, which is the intended honest behavior.

### ADR-009 conformance
Fuse.js fuzzy (0.4) + hand-rolled TF-IDF cosine (0.6) ✅ · threshold 0.25 ✅ · static per-project fallback ✅ · zero external AI/API ✅ · stable `search()` surface for a future Transformers.js swap ✅. **No architectural change → no `DECISIONS.md`/`PROJECT_CONTEXT.md` edit.**

### Accessibility / UX (verified in code + prerendered HTML)
- Transcript is `<ol role="log" aria-live="polite">` with an accessible per-project label; section `h2` → card `h3`; decorative icons `aria-hidden`; input and submit carry descriptive `aria-label`s; suggestion chips are real `<button>`s with `focus-visible` rings; Base UI `ScrollArea` viewport is keyboard-focusable/scrollable.
- Reduced-motion safe: no animations; auto-scroll uses default (instant) `scrollIntoView`.
- Theme-consistent: semantic tokens only (`muted`, `foreground`, `border`); no gradients/glassmorphism; standard `Card` + section rhythm; responsive (`max-w-2xl` column, wrapping chips, `h-72` transcript).

### Validation (repo)
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes, all 3 `/projects/[slug]` pages prerendered ✅
- **Prerendered-HTML checks:** mentor section + greeting on all 3 pages; interactive form + chips only where the KB is populated; fallback copy only where it's empty. ✅

### Notes / remaining work
- fruit-quality-detection & adaptive-cyber-defense knowledge bases are empty (owner content, Milestone 1.5 placeholders) — the chat upgrades automatically when entries are authored, no code change.
- Next: **Architecture Viewer** — the last Phase 4 unique feature (see `ROADMAP.md`).

## 27. Milestone 6.1 — Architecture Viewer Foundation (2026-08-21)

**Scope:** the viewer foundation only — diagram canvas, nodes, and SVG connection lines from the existing `project.architecture` data, replacing the static architecture rendering on `/projects/[slug]`. **No** detail panel, node details, click behavior, zoom/pan/drag, animation, or mobile drawer. **Status: ✅ complete — repo green.**

### Files created (5, under `src/features/architecture-viewer/`)
- `ArchitectureViewer.tsx` — entry point; takes a `Project`, returns `null` for empty diagrams, derives per-node category labels from the project's own `techStack` (label match — the `ArchitectureNode` schema has no category field; nothing invented), and renders the canvas. Content-only like `MentorChat` — the page's `Section` wrapper supplies `Container`/`SectionHeader`.
- `ArchitectureCanvas.tsx` — responsive CSS grid sized from the authored node `x`/`y` coordinates (`cols = maxX+1`, `rows = maxY+1`); resolves edges to cell-center endpoints in percentage space; renders the SVG underlay, node cells, midpoint edge labels, and an `sr-only` connections list. Bounded rounded container (`bg-muted/20`), no scrolling. Edges referencing unknown node ids are skipped, not crashed on.
- `ArchitectureNode.tsx` — focusable `<button>` node card (card theme tokens: `bg-card`, `ring-foreground/10`, `rounded-xl`, shared ring-lift hover; a `<button>` can't be the div-based `Card`): muted icon box (icon-name → lucide map with `Boxes` fallback; lucide has no brand glyphs), label, optional outline mono category `Badge`, `data-selected` styling placeholder. No click handler yet by design.
- `ConnectionLines.tsx` — `aria-hidden` SVG overlay (`viewBox 0 0 100 100`, `preserveAspectRatio="none"`) drawing one `<line>` per edge with `vectorEffect="non-scaling-stroke"`; no animation.
- `types.ts` — `DiagramGrid`, `PositionedEdge` (edge + percentage-space endpoints).

### Files modified (3)
- `src/app/projects/[slug]/page.tsx` — the Architecture section now mounts `<ArchitectureViewer project={project} />`; the static `ArchitectureView`/`NodeDetail`/`nodeLabel` helpers were removed (the `hasArchitecture` guard is unchanged). **Note:** node `details` (purpose/whyChosen) are no longer rendered — they return with the detail-panel milestone.
- `ROADMAP.md`, `IMPLEMENTATION_STATUS.md` — this update.

### Data audit (schema used exactly as-is)
- `ArchitectureNode` = `{ id, label, icon, x, y, details{purpose, whyChosen, configNotes, lessonsLearned} }`; `ArchitectureEdge` = `{ from, to, label }`. No schema changes.
- **devops-api:** 2 nodes (`github` @ 0,0 · `jenkins` @ 0,1), 1 edge (`Webhook Trigger`) — the plan's remaining nodes (docker, terraform, junit, grafana, prometheus) are still unauthored (Milestone 1.5 placeholder).
- **fruit-quality-detection / adaptive-cyber-defense:** `diagram`/`edges` empty → no Architecture section renders (unchanged behavior).

### Design decisions
- **All server components** — no interactivity ships in this milestone, so no client island yet; selection will introduce one later.
- **Percentage-space alignment:** SVG endpoints and grid cell centers share the same coordinate math inside one wrapper (grid has no `gap`; spacing comes from per-cell padding), so lines track nodes at any width with zero JS measurement.
- **No fabrication:** category badge only where a techStack label matches (Jenkins → `ci-cd`; GitHub has none → badge hidden); edge label rendered only when non-empty.
- **Accessibility:** diagram is `role="group"` with a project-specific `aria-label`; nodes are real keyboard-focusable buttons with visible `focus-visible` rings (repo idiom); lines/edge labels are decorative (`aria-hidden`) with an `sr-only` "X connects to Y: label" list as the text alternative.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes, all 3 project pages prerendered ✅
- **Prerendered-HTML checks (devops-api):** architecture section + `aria-label` group present; exactly 2 node buttons (GitHub, Jenkins); 1 SVG line with `non-scaling-stroke`; "Webhook Trigger" midpoint label; `ci-cd` badge on Jenkins only; sr-only connections list; grid placement (`repeat(1, …)`, row 2). Other two projects: no architecture section. ✅

### Notes / remaining work
- Node `details` are currently unreachable in the UI — the **detail panel + selection** milestone should land next.
- Full devops-api diagram data (5 more nodes + edges) and the two research-project diagrams are owner content.

## 28. Milestone 6.1.5 — Architecture Data Authoring (2026-08-21)

**Scope:** data only — expand `devops-api.json`'s architecture diagram so it becomes the Architecture Viewer's reference implementation. **No** UI, detail panel, interactions, or animations. Schema used exactly as-is. **Status: ✅ complete — repo green.**

### Files modified (3)
- `src/data/projects/devops-api.json` — architecture block only (see below).
- `ROADMAP.md`, `IMPLEMENTATION_STATUS.md` — this update.

### What changed (2 nodes / 1 edge → 7 nodes / 5 edges, 3×3 grid)
- **Nodes added:** `junit` (JUnit 5), `docker`, `terraform`, `prometheus`, `grafana` — exactly the five nodes Milestone 1.5 recorded as spec-defined but unauthored. **Every detail sentence is recomposed from text already in this file** (overview.developer, the Jenkins-reliability challenge, the IaC lesson, and the 5 mentor knowledge-base answers) — no technology or fact was invented.
- **Nodes improved:** `jenkins` gained the documented Docker-in-Docker executor rationale (KB), Slack notifications + try-catch-finally + 12→6min parallel tests (challenge), and the reliability/idempotency lesson (KB). `github` unchanged.
- **Edges added:** `jenkins→junit` ("Test"), `jenkins→docker` ("Docker Build"), `jenkins→terraform` ("Terraform Apply") — the documented Jenkinsfile stage names — and `prometheus→grafana` ("Metrics", per the KB monitoring answer). **The monitoring pair is deliberately not connected to the pipeline**: no existing text documents that link (see questionnaire).
- **Positions reorganized** for a left-to-right/top-down flow: row 0 GitHub→Jenkins, row 1 the three pipeline fan-out stages, row 2 the monitoring pair.
- **Honest gaps kept empty (`""`), not filled:** `whyChosen` + `lessonsLearned` for JUnit 5, Prometheus, and Grafana — no source text explains those choices. The future detail panel must hide empty fields (the old static view already did).
- **Icons:** mapped names where semantically honest (`container`, `cloud`, `database`, `shield`); `github`/`gauge` fall back to the viewer's generic icon until its icon map is extended (a later UI change, out of scope here).

### Owner questionnaire (blocking full detail-panel content)
1. **JUnit 5** — why JUnit 5 (vs. TestNG/Spock)? Any testing-specific lessons? Coverage/test-count worth citing? *(whyChosen/lessonsLearned empty.)*
2. **Prometheus** — why Prometheus (vs. CloudWatch etc.)? Where does it run (EC2 via Terraform? separate host)? Lessons? *(whyChosen/lessonsLearned empty.)*
3. **Grafana** — why Grafana? Where hosted? Where do alerts go (Slack webhook like the pipeline?)? Lessons? *(whyChosen/lessonsLearned empty.)*
4. **Deployment path** — where are Docker images stored (Docker Hub? ECR?) and where do containers run (the Terraform-provisioned EC2?)? *(Needed for docker/terraform → runtime edges.)*
5. **Topology** — should a deployed-app/AWS-runtime node exist so the Health Check stage target and Prometheus's scrape target are visible? Terraform → AWS edge? *(Monitoring is currently a disconnected island — reflects missing data, not reality.)*
6. **Other projects** — fruit-quality-detection & adaptive-cyber-defense have zero architecture data; full authoring needed from the owner.

### Validation
- **JSON checks:** parses; all 7 nodes conform to the `ArchitectureNode` shape; all 5 edges reference valid node ids; no duplicate grid cells; grid 3×3. ✅
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes prerendered ✅
- **Prerendered-HTML checks (devops-api):** 7 node buttons (all labels), 5 SVG lines, all 5 edge labels, 3-column grid, techStack category badges (Jenkins `ci-cd`, Docker `devops`, Terraform `infrastructure`), 5 sr-only connection entries. ✅

### Notes
- Three same-row edge labels ("Test" / "Docker Build" / "Terraform Apply") may crowd on very narrow viewports — a viewer-side consideration for a later milestone, not a data problem.
- Next: **6.2 — detail panel & selection**, which now has 4 fully-populated reference nodes (GitHub, Jenkins, Docker, Terraform) plus 3 partially-populated ones to exercise its empty-field handling.

## 29. Milestone 6.2 — Architecture Viewer Selection (2026-08-21)

**Scope:** node selection only — no detail panel, node-information UI, drawer, zoom/pan/drag, or animations beyond subtle state transitions. No viewer redesign. **Status: ✅ complete — repo green.**

### Files modified (5)
- `src/features/architecture-viewer/ArchitectureViewer.tsx` — now `"use client"` (the MentorChat client-island pattern; prop contract unchanged: still receives a `Project`). Owns the selection state: `selectedId: string | null`, `toggleNode` (re-selecting clears), `clearSelection`. State lives here — not in the canvas — so the 6.3 detail panel can render as a canvas sibling from the same state.
- `src/features/architecture-viewer/ArchitectureCanvas.tsx` — new props `selectedId` / `onToggleNode` / `onClearSelection`. The canvas root clears selection on background click and on Escape (bubbling from the focused node — focus itself never moves). Passes `selected` + `onToggle` to each node.
- `src/features/architecture-viewer/ArchitectureNode.tsx` — the button is now a real toggle: `onClick` stops propagation (so background-clear doesn't undo it) and toggles; **`aria-pressed`** reflects selection (`aria-selected` is invalid on buttons). Selected styling upgraded from the 6.1 placeholder: `ring-2 ring-foreground/60` + `shadow-md` + `-translate-y-0.5` lift, with `transition motion-reduce:transition-none`. Hover stays the subtle shared ring-lift.
- `ROADMAP.md`, `IMPLEMENTATION_STATUS.md` — this update.

### Interaction model
- **Click / Enter / Space** on a node → toggle selection (Enter/Space work through the native `<button>` click; no custom key handling needed on nodes).
- **Click canvas background** → clear.
- **Escape** (anywhere inside the canvas, e.g. on a focused node) → clear; focus remains where it was.
- **Tab** moves focus between nodes natively; exactly one node can be selected at a time; SSR renders no selection (`aria-pressed="false"` on all nodes, no `data-selected` attribute).

### Architecture / design decisions
- **Client boundary = the viewer** (per PROJECT_CONTEXT's client-island list, which always included the architecture viewer). Canvas/node components need no directive — they join the client graph through the viewer. No new components, no duplicated logic; `types.ts` and `ConnectionLines` untouched.
- **`aria-pressed` over `aria-selected`:** the nodes are toggle buttons; `aria-selected` is only valid on roles like `option`/`tab`, which would misrepresent the widget.
- **Reduced motion:** the only "animation" is the CSS transition on the selection lift/ring, disabled under `motion-reduce`.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes prerendered ✅
- **Prerendered-HTML checks (devops-api):** 7 node buttons all `aria-pressed="false"`, zero `data-selected` attributes (no phantom selection), 7 labels + 5 SVG lines intact. **Client bundle** contains the selection wiring (`stopPropagation`, `Escape`, `data-selected`). ✅

### Notes / remaining work
- Selection currently has no visible consumer beyond the node styling — by design; **6.3 (detail panel)** consumes `selectedId` next.
- Owner questionnaire from §28 still open (empty `whyChosen`/`lessonsLearned` on JUnit 5, Prometheus, Grafana; deployment-path/topology questions).

## 30. Milestone 6.3 — Architecture Viewer Detail Panel (2026-08-21)

**Scope:** the detail panel only — consumes the existing 6.2 selection state and the existing `node.details` schema. No viewer redesign, no zoom/pan/drag, no schema change. **Status: ✅ complete — repo green. 🏁 Architecture Viewer planned scope (diagram + selection + detail panel) complete — Phase 4 unique features done.**

### Files created (1)
- `src/features/architecture-viewer/NodeDetailPanel.tsx` — an `<aside aria-label="Component details" aria-live="polite">` that **persists across selection changes** (content swaps inside it), so screen readers hear updates politely and focus never moves. Two states:
  - **Selected node:** `Card` with the node label (`<h3>`, continuing the section's `h2` hierarchy), the techStack-derived category `Badge` (outline, mono, uppercase — same as the node card), and a `<dl>` of Purpose / Why Chosen / Configuration Notes / Lessons Learned using the established mono-uppercase `dt` + muted `dd` styling (the same language the pre-6.1 static view used).
  - **Empty selection:** dashed-border placeholder (the gallery-placeholder pattern) — "Select a component to inspect its role in the architecture." No animation.

### Files modified (3)
- `src/features/architecture-viewer/ArchitectureViewer.tsx` — resolves `selectedNode` from the existing `selectedId` and renders canvas + panel in a responsive layout: `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]` (diagram | panel) with `items-start`; stacked `flex-col` below `lg`. `minmax(0, …)` keeps both columns overflow-safe.
- `ROADMAP.md`, `IMPLEMENTATION_STATUS.md` — this update.

### Design decisions
- **Empty-field discipline:** fields are filtered by the same guard convention as `ProjectCard`/`DualModeText` — empty/whitespace or `TODO`-prefixed values hide the entire field (no "N/A"/"Coming soon" ever). JUnit 5 / Prometheus / Grafana (empty `whyChosen`/`lessonsLearned` pending §28 owner answers) therefore show only their populated fields; a hypothetical all-empty node would show just title + badge.
- **Panel sits outside the canvas**, so clicking it does not trigger the canvas's background-click-to-clear — reading details can't accidentally dismiss them. Escape still clears from within the canvas.
- **No hardcoded content:** everything rendered comes from `node.details`, the node label, and the derived category; field headings are UI text, not data.
- **Reuse:** `Card`, `Badge`, theme tokens, gallery-placeholder pattern, existing `dt`/`dd` styling. `buttonVariants` was not needed — the panel contains no actions in this milestone.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes prerendered ✅
- **Prerendered-HTML checks (devops-api):** live-region aside present; SSR shows the empty-state placeholder text; no detail content leaked while nothing is selected; layout grid class present; canvas intact (7 buttons, 5 lines). **Client bundle** contains the field labels + placeholder copy (panel renders client-side on selection). ✅

### Notes / remaining work
- The Architecture Viewer is feature-complete for its planned scope. Remaining depth is **data**: the §28 owner questionnaire (pure JSON edits, no code) and the two research projects' empty diagrams.
- Next up per the roadmap: move Coding Profiles directly after GitHub Hub in the homepage flow, then Phase 6 polish (`not-found`, `sitemap`, `robots`, OG images, real assets, a11y/perf pass).

## 31. Sprint 1.1 — Graduation Date & Target Roles (2026-08-21)

**Scope:** surface owner-provided graduation date and target roles on the Homepage Hero and Recruiter View, from one shared data source. Launch-blocker items from `LAUNCH_BOARD.md` Sprint 1 (P2 review: graduation + role intent are the top facts recruiters need). **Status: ✅ complete — repo green. Owner data confirmed directly (not assumed).**

### Files modified (6)
- `src/data/site.config.ts` — `status` block extended: `graduation: "May 2027"`, `targetRoles: ["Software Engineer", "Backend Engineer", "DevOps Engineer"]`; `availability` sharpened to `"Open to full-time opportunities"` (captures the owner's full-time intent). Single source of truth — no value duplicated anywhere.
- `src/sections/Hero.tsx` — Engineering Status panel: "Graduation" `StatusBlock` added to the existing 2-col grid (Availability · Location · Graduation) plus a full-width "Seeking" block with roles joined `" · "` (the recruiter-page skills idiom). Rendered via the existing `StatusBlock` — no new UI primitives.
- `src/lib/recruiter.ts` — `RecruiterHero` gains `graduation: string` + `targetRoles: string[]`; `buildHero()` passes them through from `siteConfig.status` (spread to unfreeze the `as const` tuple).
- `src/app/recruiter/page.tsx` — hero status `<dl>` extended: Availability · Location · Graduation · Seeking (roles joined `" · "`; block hidden if the array is ever empty).
- `LAUNCH_BOARD.md` — Sprint 1 items ticked; `ROADMAP.md` — completed entry.

### Design decisions
- **Extend `siteConfig.status`** — it was already the owner-editable profile-status block consumed by exactly these two surfaces; adding fields there keeps both surfaces reading one source (zero duplication, per the milestone constraint).
- **Display-ready strings, structured roles:** `graduation` is a display string (matching `availability`/`location`); `targetRoles` is an array so each surface chooses its rendering (both currently join with `·`).
- **Full-time intent lives in `availability`** rather than a separate employment-type field — one line, no schema ceremony; roles stay clean in `targetRoles`.
- **No hardcoded strings:** "Graduation"/"Seeking" are UI labels (like "Availability"); all values come from config.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes prerendered ✅
- **Prerendered-HTML checks (both `/` and `/recruiter`):** "Graduation" + "May 2027" present; "Seeking" + "Software Engineer · Backend Engineer · DevOps Engineer" present; "Open to full-time opportunities" replaces the old availability everywhere. Recruiter `<dl>` label order: Availability · Location · Graduation · Seeking. ✅

## 32. Sprint 1.2 — Contact Funnel (2026-08-21)

**Scope:** replace the placeholder contact email with the owner's real address across the shared data; no component/styling/architecture changes. **Status: ✅ complete — repo green. Owner provided the email directly; resume/LinkedIn remain owner-pending.**

### Files modified (4)
- `src/data/site.config.ts` — `social.email` → `kumarsanket.jsr82@gmail.com` (feeds the recruiter "Get in touch" mailto CTA).
- `src/data/contact.json` — Email link `url` (`mailto:`) + `label` updated to match (feeds the homepage Contact section, Footer, and recruiter "Get in touch" section).
- `LAUNCH_BOARD.md` — email ticked; resume/LinkedIn status annotated; contact-data duplication added to Sprint 4.
- `ROADMAP.md` — completed entry.

### Findings / decisions
- **Two data sources, not one:** email/GitHub/LinkedIn/resume live in both `siteConfig.social` and `contact.json` (duplication inherited from Milestone 1.5). Both were updated in lockstep this sprint; **consolidation deferred to Sprint 4** (architecture change out of this data-only scope).
- **Partial owner answers handled safely:** GitHub URL unchanged (owner was asked to correct only if different; it's also live-API-verified since 5.1); LinkedIn kept but still flagged unverified; resume not ready → all existing graceful handling retained (`social.resume` conditional CTAs unchanged).
- **Zero hardcoding:** components untouched — every consumer picked up the new value automatically via the content layer.

### Validation
- **`npm run lint`** → exit 0, clean ✅
- **`npm run build`** → exit 0; 8 routes prerendered ✅
- **Prerendered-HTML sweep (all 8 pages):** `sanket@example.com` appears nowhere; new address present as both `mailto:` href and visible label on `/` (Contact section + Footer) and `/recruiter` (hero CTA + Get in touch). ✅

### Remaining (owner)
- ~~`public/resume.pdf`~~ ✅ **Resolved same day:** owner placed the file (verified real PDF, 139 KB); all Resume CTAs activated automatically with zero code changes.
- GitHub URL: owner confirmed no change (`github.com/kr-Sanket`).
- ~~LinkedIn URL~~ ✅ **Resolved same day:** owner provided `https://www.linkedin.com/in/sanket-kumar-515bb228a/` — applied to both `siteConfig.social.linkedin` and the `contact.json` link (URL + display label). Old URL verified absent from all prerendered pages; new URL present site-wide (footer on every page, homepage Contact, recruiter hero + Get in touch). **Sprint 1.2 contact funnel is now fully closed: email ✅ resume ✅ GitHub ✅ LinkedIn ✅.**

## 33. Sprint 1.3 — Research Project Impact Statements (2026-08-21)

**Scope:** replace the two `recruiterSummary.impact` TODO placeholders with honest recruiter-facing value statements. Data-only; no schema change, no components touched. **Status: ✅ complete — repo green.**

### Files modified (4)
- `src/data/projects/fruit-quality-detection.json` — `impact`: "Automates visual fruit-quality classification from images using a CNN".
- `src/data/projects/adaptive-cyber-defense.json` — `impact`: "Investigates how machine learning can help network defenses adapt to evolving threats".
- `LAUNCH_BOARD.md` (impact ticked; developer-overview follow-up split out), `ROADMAP.md`.

### Honesty audit (full inventory performed first)
Sources checked: both projects' `recruiterSummary`/`overview`/`challenges`/`lessons`/`futureImprovements`/metadata, plus `mission.json` and `timeline.json`. Available facts: FQD = CNN image classification of fruit quality (Python/TensorFlow/OpenCV, in progress since 2025-05); ACD = research into ML-adaptive network defense (since 2025-06). **No datasets, models, results, or deployments exist anywhere** — so both statements use the value register (Automates…/Investigates…) describing what the project does/explores. Zero metrics, zero outcomes, zero fabrication; every word traceable to `overview`, `techStack`, or `mission.json`. Owner input was not needed for this register (it *is* needed for developer overviews — left open on the launch board).

### Behavior change
`ProjectCard` hides TODO-prefixed impact, so both cards previously showed no impact line; they now render the statements on the **homepage** Featured Projects and the **Recruiter View** (verified in prerendered HTML). Project detail pages don't render `recruiterSummary` (P1 finding, unchanged); the remaining TODO strings (developer overviews) appear only in the RSC payload, never as visible text (verified).

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 8 routes ✅
- **Prerendered checks:** both impact lines present on `/` and `/recruiter`; visible-text TODO sweep across all 8 pages clean. ✅

## 34. Sprint 1.4 — Timeline Refresh (2026-08-21)

**Scope:** refresh `src/data/timeline.json` with recent milestones so the journey no longer appears to stop in June 2025 (P2/P3 review finding). Data-only; no schema or component changes. **Status: ✅ complete — repo green. Nothing invented — every entry is anchored to git history and this document.**

### Files modified (3)
- `src/data/timeline.json` — 4 events appended (6 → 10 total).
- `LAUNCH_BOARD.md` (site-wide timeline ticked; per-project FQD/ACD milestones split out as still owner-pending), `ROADMAP.md`.

### Events added (source-anchored)
| Date | Type | Title | Source |
|---|---|---|---|
| 2026-06 | project-start | Portfolio Platform — sanket.dev | Initial commit 2026-06-02; foundation docs 2026-06-29 |
| 2026-07 | milestone | Portfolio Homepage & Live Integrations | Commits + §§10–23 (homepage complete, SSG project pages, GitHub Hub ISR — 2026-07-11/12) |
| 2026-07 | milestone | Recruiter View & Project Mentor Shipped | Commits 2026-07-29; §§25–26 |
| 2026-08 | milestone | Architecture Viewer Shipped | §§27–30 (6.1–6.3, 2026-08-21) |

### Design decisions
- **Recruiter View + Mentor combined into one event** — both shipped in the same 2026-07 commits; keeps the portfolio-build entries (4) from outnumbering the life events (6).
- **Portfolio start typed `project-start`** so the recruiter Highlights filter (milestone/project-end/achievement) keeps it out — highlights stay outcome-only, as designed in 5.3.
- **`relatedProject: null`** for all four — the portfolio isn't a project JSON, so no link/title resolution is attempted.
- Mapped icons only (`rocket`, `check-circle`); factual descriptions in the data's existing voice, no marketing language.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 8 routes ✅
- **Prerendered checks:** homepage timeline renders all 10 events chronologically (2024-08 → 2026-08, all four new titles present); recruiter Highlights now 6 entries (Aug 2024 · Apr 2025 · Jun 2025 · Jul 2026 ×2 · Aug 2026) with the `project-start` portfolio entry correctly excluded. ✅

### Remaining (owner)
- FQD/ACD per-project `timeline.milestones` still show only their 2025 "started" entries — recent progress milestones require owner knowledge.

## 35. Launch Task 2.1 — robots.ts (2026-08-21)

**Scope:** `robots.txt` metadata route only (first Phase 6 / Sprint 2 production item). **Status: ✅ complete — repo green.**

### Files created (1)
- `src/app/robots.ts` — Next 16 `MetadataRoute.Robots` convention (verified in `node_modules/next/dist/docs/.../metadata/robots.md`): `userAgent: "*"`, `allow: "/"`, `sitemap: ${siteConfig.url}/sitemap.xml`. URL comes from `siteConfig.url` (the same canonical source `metadataBase` uses) — nothing hardcoded.

### Files modified (2)
- `LAUNCH_BOARD.md` (ticked), `ROADMAP.md`.

### Design decisions
- **`/recruiter` is NOT disallowed in robots** (per ADR-011 and the task requirement): its exclusion mechanism is the page-level `noindex, nofollow` meta, and a robots disallow would *prevent* crawlers from ever seeing that directive. robots.ts carries no per-page rules.
- Static metadata route (no request-time APIs) → cached/prerendered at build.
- The referenced `/sitemap.xml` ships in Task 2.2 — the URL is declared now per the task requirement.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; **9 routes** incl. `○ /robots.txt` ✅
- **Generated output verified:** `User-Agent: *` / `Allow: /` / `Sitemap: https://sanket.dev/sitemap.xml`. ✅
- **No metadata behavior changed:** `/recruiter` still emits `noindex, nofollow`; public pages still emit their standard robots meta. ✅

## 36. Launch Task 2.2 — sitemap.ts (2026-08-21)

**Scope:** the sitemap metadata route only. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/app/sitemap.ts` — Next 16 `MetadataRoute.Sitemap` convention (verified in installed docs), async, build-time static. Entries: `siteConfig.url` (homepage) + every non-`planned` project page built from `getProjectSlugs()` + `ROUTES.project()` — the identical source/helper pair `generateStaticParams` and the app's links use, so slug discovery isn't duplicated and the sitemap cannot drift from the actually-built routes.

### Files modified (2)
- `LAUNCH_BOARD.md` (ticked; new Sprint 4 item below), `ROADMAP.md`.

### Design decisions
- **Exclusions by construction:** `/recruiter` (noindex, ADR-011) and `/_not-found` are simply never generated from the sources used; no denylist to maintain.
- **`lastModified` omitted deliberately** (requirement 8 fallback): no trustworthy per-page source exists — git checkout mtimes are meaningless in CI, project `timeline` dates describe the work rather than the page, and emitting the build date would falsely claim sitewide changes on every deploy. The field is optional per the sitemap protocol; omission is the honest choice.
- `changeFrequency`/`priority` also omitted — ignored by major crawlers; keeps the route minimal.

### Incidental finding
- `EXTERNAL_URLS` in `lib/constants.ts` has **zero consumers** and still carries the pre-Sprint-1.2 LinkedIn URL — added to the Sprint 4 cleanup list (stale-data footgun; not touched here, out of scope).

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; **10 routes** incl. `○ /sitemap.xml` ✅
- **Generated XML verified:** exactly 4 `<loc>` entries — homepage + devops-api + fruit-quality-detection + adaptive-cyber-defense; no recruiter, no 404. `robots.txt`'s `Sitemap: https://sanket.dev/sitemap.xml` now resolves to a real route. ✅

## 37. Launch Task 2.3 — Custom not-found.tsx (2026-08-21)

**Scope:** the custom 404 page only. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/app/not-found.tsx` — root not-found convention (verified in `node_modules/next/dist/docs/.../file-conventions/not-found.md`): handles unmatched routes **and** `notFound()` thrown by the project route's guard (`dynamicParams = false` + defensive check), so unknown project slugs now get the branded page instead of Next's default.

### Design decisions
- **Design-system reuse only:** `Container`, `buttonVariants` (primary `size lg h-10 px-5` / outline `px-4` — the exact hero CTA idiom), mono uppercase eyebrow ("Error 404"), `tracking-tight text-balance` h1, muted `text-pretty` body. No new components, no animation, no gradients.
- **Rendered inside the root layout** (not `global-not-found`) — Navbar and Footer stay, so a lost visitor keeps full site navigation.
- **CTAs:** "Back to Homepage" → `ROUTES.home`; "View Projects" → `/#${SECTION_IDS.projects}` (no `/projects` index route exists — this is the same target the project pages' back-link uses). Plain `next/link` (cross-route hash navigation; `HashLink` is for same-page clicks).
- **Copy:** professional, engineering-plain ("This route doesn't resolve to anything — the page may have moved, or the URL has a typo."). No jokes, no mascots.
- **Accessibility:** single `h1` under the layout's structure; real links (keyboard/right-click intact) with the shared focus-visible styles from `buttonVariants`; centered block responsive by construction (`max-w-md`, wrap-friendly button row, `min-h-[60svh]` vertical centering).

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 10 routes, `/_not-found` prerendered ✅
- **Prerendered checks:** exactly one `h1` ("Page not found"); eyebrow, explanation, both CTAs with correct hrefs; `<nav>`/`<footer>`/layout shell present. Existing routes unaffected (route table unchanged apart from the already-present `/_not-found`). ✅

## 38. Launch Task 2.4 — Open Graph Images (2026-08-21)

**Scope:** production OG/Twitter card images via the App Router metadata API; metadata updated only where necessary. **Status: ✅ complete — repo green. The P4 "metadata over-promises" mismatch is closed.**

### Files created (2)
- `src/app/opengraph-image.tsx` — build-time `ImageResponse` (convention verified in installed docs): 1200×630 PNG, exports `alt`/`size`/`contentType`. Every string from `siteConfig` (brand, availability, role, name, tagline, focusAreas, domain). Design mirrors the site: flat `#0a0a0a`, letter-spaced uppercase eyebrow, green status dot (the hero status-panel idiom), 92px name, muted tagline, hairline bottom rule. Hex equivalents of the dark tokens (satori can't resolve CSS variables); default bundled font (no font assets introduced).
- `src/app/twitter-image.tsx` — re-exports the OG module so an explicit `twitter:image` tag backs the existing `summary_large_image` card (not relying on X's og:image fallback).

### Files modified (3)
- `src/lib/metadata.ts` — (1) `SHARED_OG_IMAGE` (`/opengraph-image`, 1200×630, alt) added as the default `openGraph.images`/`twitter.images` in `createMetadata`. Necessary because Next's metadata resolution replaces a parent's `openGraph` object wholesale when a child exports its own — the root file-convention injection only reached `/`. (2) **Latent bug fixed:** the final top-level `...overrides` spread was replacing the merged `openGraph` object entirely for any caller passing openGraph overrides — project pages had silently lost `og:site_name` (and would have lost images). Overrides are now destructured; `openGraph`/`twitter` merge key-by-key, the rest spreads at top level.
- `LAUNCH_BOARD.md` (ticked), `ROADMAP.md`.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; **12 routes** incl. `○ /opengraph-image` + `○ /twitter-image` ✅
- **Per-page meta sweep:** every real page (`/`, 3 project pages, `/recruiter`, 404) emits **exactly one** `og:image` and one `twitter:image` (homepage/404 get the hash-busted URL via file-convention priority; metadata-declared pages get the stable `/opengraph-image` URL — same route). `og:site_name` restored on project pages. Recruiter `noindex` unchanged. ✅
- **Visual check of the generated PNG:** on-brand — dark, typographic, recruiter-readable, no gradients/glass/neon. ✅

## 39. Launch Task 2.5 — JSON-LD Structured Data (2026-08-21)

**Scope:** schema.org JSON-LD from existing shared data only; no libraries, no fabrication. **Status: ✅ complete — repo green.**

### Files modified (4)
- `src/lib/metadata.ts` — `getStructuredData()` (the schema object) + `getStructuredDataJson()` (serialized with `<` → `<` per the Next JSON-LD guide — defense in depth; the payload is own config). Centralized in the existing SEO module alongside `createMetadata`.
- `src/app/layout.tsx` — renders the single `<script type="application/ld+json">` in `<body>` (server component — zero client JS).
- `LAUNCH_BOARD.md` (ticked), `ROADMAP.md`.

### Schema decisions
- **`@graph` of Person + WebSite** with `@id` cross-referencing (`/#person`, `/#website`; WebSite.publisher → Person) — one block, no duplicate schemas anywhere.
- **Person fields, all from `siteConfig`:** name, url, jobTitle (`role`), description, `email` (included because it's already intentionally public — Contact/Footer/Recruiter render it), `sameAs` [GitHub, LinkedIn], `knowsAbout` (`focusAreas`). **Omitted:** `image` (no real headshot exists — the OG card is branding, not a person photo), affiliation/alumniOf (VIT exists only inside the role display string; structuring it would be parsing, not reusing).
- **Considered and deferred:** `ProfilePage` (homepage-only placement would break the centralized single-block design for marginal gain) and per-project `SoftwareSourceCode`/`WebPage` (worth adding when project pages have richer artifacts; today they'd mostly duplicate title/description already in OG tags). Reasoning recorded per the task.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Per-page sweep:** exactly **one** JSON-LD block on every real page, parsing as valid JSON with `@graph` types `[Person, WebSite]`. Deep value check: name/jobTitle/email (`kumarsanket.jsr82@gmail.com`)/sameAs (incl. the new LinkedIn URL)/knowsAbout all match shared config; no `image` field; publisher `@id` reference correct. **OG/Twitter metadata unchanged** (still exactly one image tag each). ✅

## 40. Sprint 1.X — Real Certifications (2026-08-21)

**Scope:** replace the placeholder AWS certification with the owner's 3 real certificates, values verbatim. Data-only; schema and UI untouched. **Status: ✅ complete — repo green.**

### Files modified (4)
- `src/data/certifications.json` — AWS placeholder removed; 3 real certs added newest-first: **Devops, Agile & Design Thinking** (IBM Career Education Program, "July 21, 2026", credential URL), **DevOps Fundamentals** (same issuer, "June 30, 2025", credential URL), **Java Programming** (GeeksforGeeks, `date: ""` — none determinable per the task, placed last, PDF credential URL). All `image` fields `""` (no assets exist; no placeholder images introduced — the section's existing Award panel handles it).
- `src/data/site.config.ts` — `dashboard.certifications.value` 1 → 3 (**directly derived consistency fix**: the metric renders on the homepage Dashboard and recruiter Key Metrics and would otherwise be false).
- `LAUNCH_BOARD.md` (ticked), `ROADMAP.md`.

### Decisions / task-rule applications
- **Credential IDs NOT stored** — the `Certification` schema (`title/issuer/date/image/url`) has no ID field, and the task forbids schema changes (rule 7). Recorded here should the owner want an ID field later (schema + UI change).
- **Dates stored verbatim** ("July 21, 2026") — the UI renders `date` raw in the mono badge; no format invented. Java cert date left `""` → badge hidden by the existing guard.
- **Ordering = data order** (the section renders the array as-is): dated certs newest-first, undated last, per the task.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** homepage section shows exactly the 3 titles in order with both dates, 3 "View credential" links (correct hrefs, `target="_blank" rel="noopener noreferrer"`), Award placeholder panels (no broken images); recruiter Certifications shows all 3; "AWS Certified" absent from both pages; metric **3** on both surfaces. ✅

## 41. Sprint X.X — Certification Issuer Logos (2026-08-21)

**Scope:** replace the generic Award icon in cert-card headers with issuer logos, data-driven with graceful fallback. **Status: ✅ complete — repo green. Logo assets provided by the owner and verified on disk.**

### Files modified (5)
- `src/types/common.ts` — `Certification` gains optional `logo?: string` (additive; no breaking change).
- `src/data/certifications.json` — `logo` on all 3 certs: IBM ×2 → `/images/certifications/ibm.svg`, GeeksforGeeks → `/images/certifications/geeksforgeeks.svg` (owner-supplied files, present).
- `src/sections/Certifications.tsx` — visual area priority: certificate `image` (unchanged) → **issuer logo** → Award fallback. Logo renders via `next/image` `fill` + `object-contain` in an `h-20` (80px, within the 70–90px spec) centered box with `px-10` whitespace — never cropped or stretched. `imageExists()` widened to accept `undefined` and guards the logo at build time, so a missing file falls back to the Award icon automatically.
- `LAUNCH_BOARD.md` (assets item annotated), `ROADMAP.md`.

### Design decisions
- **Light plate behind logos (`bg-white`), both themes** — required to support the logos: IBM's official mark is fill `#000000` and would vanish on the dark theme's muted panel; recoloring/inverting brand marks is off-brand. The plate is the standard "brand asset box" pattern; the Award fallback panel keeps its original `bg-muted/50`.
- **Fully data-driven:** the component only checks `cert.logo` existence — zero issuer-name conditionals; any future cert opts in via JSON alone.
- **Accessibility:** logo `alt` = issuer name (per task); the fallback panel's decorative icon stays `aria-hidden`.
- **Recruiter view untouched** (its compact, image-free cards are an unrelated section per task rule 11).

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** 3 logo `<img>` tags (2× ibm.svg, 1× geeksforgeeks.svg), each with issuer-name alt and `object-contain`, on 3 light plates; zero Award icons in the section (all certs have logos); fallback branch verified present in code for future logo-less certs. ✅

## 42. Documentation Synchronization — Pre-Relaunch (2026-08-21)

**Scope:** documentation only — reconcile every doc with the repository after the launch-preparation work (§§31–41). No application code touched. **Status: ✅ complete.**

### Objective
A brand-new Claude session reading `CLAUDE_START.md` (+ `ROADMAP.md` + `LAUNCH_BOARD.md`) must be able to resume with full, accurate context: what shipped during launch prep, what remains, what's owner-blocked, and which caveats matter.

### Files updated (7)
- `CLAUDE_START.md` — header doc-map now includes `LAUNCH_BOARD.md`; §2 rewritten for the current state (Architecture Viewer complete, Sprint 1/certs/Sprint 2 shipped, 12 routes, launch-prep phase); §4 present/absent lists corrected; §8 roadmap summary rebuilt with safe-next-tasks vs owner-blocked split **plus a new "Known caveats" list** (metadata merge semantics, parent-openGraph replacement, dead `EXTERNAL_URLS`, contact-data duplication, viewer prop width, IBM black-logo plate); §9/§10 now direct sessions to the launch board.
- `ROADMAP.md` — Current Milestone → launch-prep phase; Next Milestones rebuilt from the launch board (Sprint 2 remainder, owner content, Sprint 3/4); Phase 6 marked in-progress with shipped items ticked. All completed history preserved.
- `IMPLEMENTATION_STATUS.md` — header + TL;DR replaced with the current state (original TL;DR preserved as marked history); this §42 entry appended. §§31–41 were written incrementally at implementation time and were verified accurate.
- `LAUNCH_BOARD.md` — status-at-a-glance summary added up top (Completed / In Progress / Blocked-owner / Deferred / Remaining); all item ticks verified against the repo.
- `DECISIONS.md` — ADR-012 (SEO surface strategy: robots allow-all + page-level noindex, sitemap from `getProjectSlugs`, no `lastModified`), ADR-013 (OG image generation + shared-image-in-`createMetadata` + the merge fix), ADR-014 (JSON-LD: centralized Person+WebSite `@graph`, field-emission policy). Open Confirmations updated (email/resume resolved; ADR-003 accent question still open).
- `README.md` — Create-Next-App boilerplate replaced with a real project overview (stack, structure, doc map, commands). First real content since scaffold.
- `PROJECT_CONTEXT.md` — surgical corrections only: owner-facts block updated (real email/LinkedIn/resume, certs 1→3, graduation + target roles added) and the 2026-07-11 "Current state" section banner-marked as a superseded historical snapshot pointing to `CLAUDE_START.md` §2 + `LAUNCH_BOARD.md`. Architecture content untouched.

### Verification (repo ↔ docs)
- Route table (12), file tree (viewer feature, SEO routes, resume.pdf, cert logos), data values (email, LinkedIn, graduation, certs ×3, timeline ×10 events, impact statements) all cross-checked against the docs during this pass — no doc claims a feature that doesn't exist; no shipped feature is undocumented.
- Repo untouched by this pass except documentation files; `npm run lint` / `npm run build` state unchanged from §41 (green, 12 routes).

## 43. UI Polish Sprint 1 — Visual Foundation, Light Theme (2026-08-21)

**Scope:** Phase 1 of the UI-polish roadmap (full review + phased roadmap recorded in the session report): light-theme depth only — page/card plane separation, card elevation, section rhythm. No layout, typography, spacing, or dark-theme identity changes. **Status: ✅ complete — repo green.**

### Root cause (review finding)
Light theme had `--background` **and** `--card` at `oklch(1 0 0)` with zero shadows — every surface on one plane, separated only by 10%-black hairlines (hence "flat, documentation-like"). Dark already separates tonally (page 0.145 / card 0.205).

### Files modified (7)
- `src/app/globals.css` — light `--background` → `oklch(0.985 0 0)` (compiles to `#fafafa`); `--card` stays white. Dark block untouched.
- `src/components/ui/card.tsx` — quiet two-layer shadow (`0 1px 2px rgb(0 0 0/0.04), 0 3px 10px -2px rgb(0 0 0/0.06)`) + `dark:shadow-none` (dark separates tonally by design). Every Card consumer site-wide (MetricCard, ProjectCard, mentor, viewer panel, cert/skill/leadership cards, recruiter cards) inherits the elevation.
- Section bands `bg-muted/60 dark:bg-muted/15` on **Dashboard, GitHub Hub, Timeline, Leadership, Contact** (`EngineeringDashboard/GitHubHub/EngineeringTimeline/Leadership/Contact`.tsx) — alternating ~`#f5f5f5` bands on the `#fafafa` page in light; near-imperceptible matching lift in dark for cross-theme structural consistency.

### Design decisions
- **Mirror the dark theme's depth model instead of inventing a new one:** off-white page + white shadowed cards = the light equivalent of 0.145/0.205. No gradients, glass, or decoration.
- **Shadows in light only** — dark's tonal card contrast is its elevation system; stacking shadows there would muddy it.
- **Alternation via existing section elements** (they already carry full-width `border-b` separators) — zero layout/spacing change; recruiter/project pages inherit background + card elevation but keep band-free flow (their own rhythm; candidate for a later phase).
- **Contrast checked:** `muted-foreground` (#737373-ish) on `#fafafa` ≈ 4.6:1 — still AA for body text; band areas put text on white cards.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Compiled-output checks:** `--background:#fafafa` (+ lab fallback) in light, `#0a0a0a` dark unchanged; card shadow + `dark:shadow-none` utilities present; band utilities (`bg-muted/60`, dark `/15`) present; homepage HTML shows bands on exactly dashboard/github/timeline/leadership/contact and nowhere else; all cards carry the shadow class. ✅

## 44. UI Polish Sprint — Phase 2: Hero Refinement (2026-08-21)

**Scope:** Hero only — class-level refinement; zero layout/typography/spacing/content/responsiveness changes. Builds on the Phase-1 depth model (§43). **Status: ✅ complete — repo green.**

### Review findings addressed
1. Hero was the only homepage zone with **no background treatment** post-Phase-1 (flat opening viewport while siblings have bands).
2. The Engineering Status panel — the documented "visual anchor" — read as just another card once Phase 1 equalized all cards.
3. `secondary` focus badges (0.97 fill) **washed out against the new 0.985 page**.
4. Static "Active" dot undercut the live-console metaphor.
5. CTAs had color-only hover — no micro-response.

### Files modified (3)
- `src/sections/Hero.tsx` —
  - **Top wash:** decorative `aria-hidden` radial vignette (`h-80`, `-z-10`, section `relative isolate overflow-hidden`): light `rgb(0 0 0/0.04)`, dark `rgb(255 255 255/0.05)` — barely-there, bounded, no mesh/large gradient.
  - **Status panel as anchor:** one step more elevation than the standard card (`0 12px 32px -12px /0.12` ambient, light only, `dark:shadow-none`) + a `bg-muted/40` console-style title bar; "Active" dot now `animate-pulse motion-reduce:animate-none`.
  - **Focus badges:** `secondary` → `outline` with `bg-card/60` (legible on the off-white page, still quiet, both themes).
  - **CTA micro-response:** arrow icons nudge on hover (`group` + `transition-transform group-hover:translate-x-0.5`, GitHub arrow also `-translate-y-0.5`), fully `motion-reduce`-guarded.
- `ROADMAP.md`, `IMPLEMENTATION_STATUS.md` (this entry).

### Design decisions
- Every change is additive class-work on existing elements — no new components/abstractions; the 3.2 hero structure, grid, and heading scale are untouched (verified in prerendered HTML).
- Dark theme identity preserved: wash becomes the faint standard dark glow; shadows stay off (`dark:shadow-none`); title bar + pulse read identically in both themes.
- All motion (arrow nudge, pulse) is decorative, tiny, and disabled under `prefers-reduced-motion`.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** wash div (radial, aria-hidden, `-z-10`, `isolate`) present; outline badges with `bg-card/60`; CTA `group-hover` transitions with ≥3 `motion-reduce:` guards; panel deep shadow + `bg-muted/40` title bar + guarded pulse; hero grid + `text-5xl/sm:text-6xl` unchanged. ✅

## 45. UI Polish Sprint — Phase 2.5: Ambient Background Interaction (2026-08-21)

**Scope:** one ambient cursor-responsive background system — a single reusable client component, mounted once. No other visuals touched. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/components/shared/AmbientBackground.tsx` — `"use client"`. A viewport-fixed, clipped (`fixed inset-0 -z-10 overflow-hidden`), non-interactive (`pointer-events-none`, `aria-hidden`) layer containing one 60rem (~960px) radial light. Colors reuse the hero-wash neutral family: **light** `rgb(0 0 0/0.035)` center → transparent 70% (reads as diffuse depth on the off-white page); **dark** `rgb(255 255 255/0.02)` (even more restrained, per spec). Soft edge comes from the gradient stops — no blur filter, no extra GPU cost.

### Files modified (2)
- `src/app/layout.tsx` — mounts `<AmbientBackground />` as the first body child with a "one line to remove" comment. Behind body content by stacking (negative z child paints above the body background, below in-flow content): **opaque cards occlude the light; the `/60`–`/15` section bands let it half-diffuse through** — literally light under the paper planes.
- `ROADMAP.md` + this entry.

### Motion & performance architecture
- **cursor → target refs → exponential lerp → transform.** `mousemove` (passive) only writes plain locals; a rAF loop applies `translate3d(x,y,0)` + `opacity` (compositor-only properties, `will-change` hinted). Position lerp `0.06`/frame = the mandated organic lag; exponential interpolation by construction has no snap/spring/bounce.
- **Zero React state, zero re-renders** — the component renders once; all animation is direct style mutation.
- **Self-suspending loop:** when position deltas < 0.05px and opacity settles, the rAF chain stops; any input restarts it. An idle page runs no frames.
- **Graceful exit:** `documentElement mouseleave` fades `targetOpacity → 0` through the same lerp.
- **Guards:** skipped entirely on coarse pointers (`pointer: fine` check — touch devices ship the div at opacity 0 and attach nothing); `prefers-reduced-motion` ignores input *and* fades the light out, including live OS-setting changes via the media-query `change` listener.

### Design decisions
- Single-responsibility system: no listeners anywhere else in the app; deleting the one layout line disables everything.
- Neutral colors only (the existing black/white wash family) — no blobs/aurora/mesh/particles/color.
- Initial SSR state is `opacity-0` — no hydration flash, invisible until the first pointer movement.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** ambient container SSR'd with `opacity-0`, 60rem light, `will-change`, both theme gradients (0.035 / 0.02); mounted before all content. **Client bundle** contains the rAF loop, `translate3d`, `pointer: fine`, `prefers-reduced-motion`, and `mouseleave` wiring. ✅

## 46. Ambient Background — Phase 2.5.1 Tuning Pass (2026-08-21)

**Scope:** visual tuning of §45's ambient system only — architecture (single component, ref-only state, self-suspending rAF, compositor-only mutation, all guards) unchanged. **Status: ✅ complete — repo green.**

### What was tuned (all in `AmbientBackground.tsx`)
| Parameter | Before | After | Why |
|---|---|---|---|
| Light size | 60rem (960px) | **84rem (1344px)** atmosphere field | Too small for the hero; spec target 1200–1500px — larger + softer |
| Falloff | single stop → transparent 70% (linear-ish) | **eased multi-stop** (center → 40% alpha at 45% → transparent 80%) | Dissolves invisibly into the page — no perceptible edge |
| Light strength | black 3.5% center | **black 5% → 2% → 0** | 3.5% averaged ~1% over the field — imperceptible on desktop; 5% center reads as atmosphere, not spotlight |
| Dark strength | white 2% | **white 3% → 1.2% → 0** | Same feel-parity bump, still more restrained than light |
| Interpolation | 0.06 single rate | **0.045 field / 0.09 core** | Slower field = longer, perceivable organic drift; still exponential (no snap/spring/bounce) |
| Second layer | — | **36rem core, black 2% / white 1.5%, transparent 75%, faster lag** | Permitted by spec: same neutral palette, different size + lag, extremely low opacity. The **differential drift** between layers is what makes the ambience felt without any layer becoming a visible blob |

### Color experiment (documented per task)
- **White illumination:** rejected — the page is `#fafafa`; pure-white light can shift it ≤1.5%, physically too weak.
- **Warm neutral:** rejected — introduces chroma into a deliberately 0-chroma design system.
- **Winner:** existing neutral black/white family at higher strength with eased falloff.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered/bundle checks:** two layers SSR'd (`84rem` + `36rem`, both `opacity-0` + `will-change`), eased stops (45%/80%), light 0.05/0.02 + dark 0.03/0.015 gradients, dual lerp rates in the client bundle. Guards (`pointer: fine`, reduced-motion, `mouseleave`) untouched. ✅

## 47. Phase 2.6 — Ambient Hero Scene (2026-08-21)

**Scope:** an art-directed, hero-scoped ambient scene (three soft lights + gentle cursor parallax). No homepage redesign; hero layout/typography/content verified unchanged. **Status: ✅ complete — repo green.**

### Files created (1)
- `src/components/shared/HeroAmbientScene.tsx` — `"use client"`. Absolute `inset-0 -z-10 overflow-hidden` layer inside the hero (which is already `relative isolate`), containing three gradient lights (soft edges via radial stops — **no blur filters, zero filter cost**):
  1. **Warm white** (`rgb(255 247 235)/0.55` light · `/0.04` dark) — 50rem, upper-left, behind the identity column.
  2. **Soft blue-gray** (slate `rgb(148 163 184)/0.09` light · `/0.07` dark) — 44rem, right, the cool plane the Engineering Status panel floats above (its Phase-2 elevated shadow now has a field to cast onto).
  3. **Neutral gray** (`rgb(0 0 0)/0.03` light · white `/0.02` dark) — 56rem, low center-left, grounding the composition and absorbing the former Phase-2 top-wash role.

### Files modified (3)
- `src/sections/Hero.tsx` — the Phase-2 single top-wash div replaced by `<HeroAmbientScene />` (the scene's neutral light carries its shading function); import added. Nothing else touched.
- `ROADMAP.md` + this entry.

### Parallax (not chasing)
Lights are **position-fixed**; the cursor only offsets them: normalized viewport position (−0.5…0.5) × per-light depth factors **[14, −18, 9] px max** (within the 10–20px spec; opposing signs create depth), heavily lerped (0.05/frame) via the established ref-only, self-suspending rAF pattern writing compositor-only `translate3d`. Passive listener; skipped on coarse pointers (scene renders **statically** — "premium before any interaction" holds on touch); `prefers-reduced-motion` disables parallax and drifts lights back to rest (live setting changes handled). This is the app's second and only other mouse listener, single-responsibility like `AmbientBackground` (global trailing light vs. hero-scoped parallax — different jobs, kept separate deliberately).

### Design rationale
Palette is exactly the brief's three tones — warmth behind the person, a desaturated cool slate behind the engineering console, neutral ground — at opacities that read as *atmosphere*, not color (no saturation, mesh, aurora, particles, glass). The site remains unmistakably neutral sanket.dev; the blue-gray is a shadow-tone, not a "cyber" blue.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** scene container + exactly 3 lights (6 gradient classes incl. dark variants), `will-change-transform` ×3, old wash removed, hero grid/typography classes unchanged; parallax depths + normalization in the client bundle. ✅

## 48. Design System v1.0 Established (2026-08-21)

**Scope:** documentation — `DESIGN_SYSTEM.md`, the product's visual constitution. No application code touched. **Status: ✅ complete.**

### Files created (1)
- `DESIGN_SYSTEM.md` (repo root) — Version 1.0. Not a styling guide (deliberately contains no implementation detail — no class names, frameworks, or tokens): it governs *visual decisions* the way `DECISIONS.md` governs technical ones. Chapters: Purpose · Visual North Star ("designed to build trust, not impress through spectacle; the interface disappears behind the work") · Design Philosophy (engineering over decoration, light over color, depth over effects, content over animation, calm over excitement, purpose over trends, evidence over marketing) · Brand Personality (and explicit anti-registers: not flashy / cyberpunk / startup-hype / gaming) · **Material Language** (Canvas → Section → Paper → Elevated Paper → Floating Surface → Overlay — every surface must belong to exactly one) · Lighting Philosophy (illuminated not decorated; temperature guides attention; shadows = elevation only; theme-native depth cues) · Color Philosophy (color is expensive; semantic-only: status/charts/architecture/metrics/GitHub) · Typography Philosophy (type as primary interface; whitespace load-bearing; no marketing copy) · Motion Philosophy (physics; everything settles; reduced-motion users get the complete product) · Signature Components (Status Panel, Architecture Viewer, Project Mentor, Dual Mode, GitHub Hub — with *why* each earns the polish budget) · **Things We Never Do** (permanent list; amendments must be written) · Design Review Checklist (7 questions; one honest "no" = stop) · Closing Statement.

### Notes
- The document codifies the visual language actually built through Phases 1–2.6 (depth model, lighting system, chroma discipline) and the principles distilled from the reference-image analysis — it records reality, it doesn't invent future features.
- Written in the `DECISIONS.md`/`CLAUDE_START.md` register; intended to be read alongside them (ADRs = engineering constitution, this = visual constitution).

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅ (no code changed — confirms docs-only).

## 49. Coding Profiles — Real Profile Cards (2026-08-22)

**Scope:** replace the "coming soon" placeholder with two real, config-driven profile cards (ADR-015). **Status: ✅ complete — repo green.**

### Files created (1) / modified (4) / deleted (2)
- **Created** `features/coding-profiles/icons.tsx` — official LeetCode + GeeksforGeeks glyphs (Simple Icons path data; lucide has no brand marks), `currentColor` fill.
- **Modified** `src/data/site.config.ts` — `codingProfiles` is now `CodingProfileLink[]` (platform, username, url, description, icon key, brandColor) holding the owner's two real profiles (LeetCode `SANKET_2912` · GfG `kumarsankgkax`, values verbatim); `src/types/coding-profile.ts` — new `CodingProfileLink` (old fetching shapes removed); `ProfileCard.tsx` — full rewrite (see below); `CodingProfiles.tsx` — sync server component; **empty config → section returns `null`** (placeholder removed entirely).
- **Deleted** `codingProfiles.service.ts` + `StatsDisplay.tsx` (superseded; no fabricated or fetched stats anywhere).

### Card design (design-system conformant)
Whole card is one link (`target="_blank" rel="noopener noreferrer"`, descriptive aria-label); the "View Profile ↗" button is a presentational `buttonVariants` span (nested anchors are invalid). Muted icon box + platform `h3` + mono `@username` + description. **Hover:** subtle lift (`-translate-y-0.5`) + slightly deeper light-only shadow (`dark:group-hover:shadow-none` — dark stays tonal) + ring step + **logo transitions from monochrome to the official brand color** via a per-card `--brand` CSS variable (chroma spent only on hover, per the color budget) + arrow nudges right. Keyboard: `group-focus-visible` ring on the card. All motion `motion-reduce`-guarded. Grid 1 → 2 columns.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** placeholder gone; exactly 2 card links with correct URLs/usernames/descriptions; both official glyph paths inline; `--brand:#FFA116`/`#2F8D46` vars; 2 "View Profile" buttons; all hover classes (lift/shadow/brand/arrow); noopener ×2; ≥6 motion-reduce guards. ✅

## 50. Verified Timeline & Leadership Correction (2026-08-22)

**Scope:** owner-verified date corrections across the site timeline, leadership role, and the three project JSONs' own timelines. Data-only. **Status: ✅ complete — repo green. All dates below are owner-provided facts, superseding the earlier data.**

### Corrected facts (old → new)
| Event | Old | Verified |
|---|---|---|
| B.Tech start (CSE — Data Science, VIT Vellore) | 2024-08 | **2023-08** |
| Senior Core Member appointed | 2025-06 | **2025-01** (role **completed**: Jan–Dec 2025, not ongoing) |
| Fruit Quality Detection started | 2025-05 | **2025-02** (during a hackathon) |
| DevOps To-Do API started | 2025-01 | **2025-05** |
| DevOps To-Do API completed | 2025-04 | **2025-07** |
| Adaptive Cyber Defense research started | 2025-06 | **2026-03** |

### Files modified (7)
- `src/data/timeline.json` — the six verified events (existing content-true descriptions retained where they didn't conflict; owner wording used for the new facts), followed by the four git-verified portfolio events (2026-06 → 2026-08, unchanged — non-conflicting and they preserve the recency signal). 10 events, chronological.
- `src/data/leadership.json` — `period`: "2025 — Present" → **"Jan 2025 — Dec 2025"** (completed role).
- `src/data/projects/devops-api.json` — `timeline` 2025-01/2025-04 → **2025-05/2025-07**. ⚠️ The two intermediate milestones ("CI/CD pipeline operational" @2025-02, "Dockerized + Terraform deployed" @2025-03) were **removed, not re-dated** — their true months inside the corrected May–July window are unknowable and inventing dates is forbidden. Owner can re-add them with real dates (JSON-only).
- `src/data/projects/fruit-quality-detection.json` — start **2025-02**; milestone label now "Project started during a hackathon" (owner's fact).
- `src/data/projects/adaptive-cyber-defense.json` — start **2026-03**.
- `ROADMAP.md`, `LAUNCH_BOARD.md` (freshness item re-annotated: ACD's verified 2026-03 start resolves its staleness; FQD remains the one project without a recent milestone).

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** homepage timeline = 10 events, strictly chronological (2023-08 → 2026-08), all corrected titles present, old dates absent; **recruiter Highlights** correctly re-filtered (Aug 2023 · Jan 2025 · Jul 2025 · Jul 2026 ×2 · Aug 2026); leadership badge "Jan 2025 — Dec 2025"; project pages show May–Jul 2025 (devops), Feb 2025 + hackathon (FQD), Mar 2026 (ACD). ✅

### Consistency notes
- Graduation "May 2027" (Sprint 1.1) + B.Tech start 2023-08 = a standard 4-year program ✓.
- `about.json`'s "Senior Core Member, Geospatial Club" highlight is tenseless and remains true for a completed role — unchanged.
- Historical doc entries (§8, §34) retain the old dates as records of what was believed at the time; this entry is the correction of record.

## 51. Skills & Technologies Refresh (2026-08-22)

**Scope:** owner-provided current skill set replaces the old five categories; data + icon-map keys only, UI untouched. **Status: ✅ complete — repo green.**

### Files modified (4)
- `src/data/skills.json` — 7 categories, owner's lists verbatim: Languages (Java, Python, C, C++, JavaScript) · Web Technologies (HTML, CSS, React.js, Angular, Node.js, Django) · Backend (Java, Node.js, Django, REST APIs) · DevOps & Infrastructure (Docker, Jenkins, Terraform, Ansible, Git, Grafana) · AI & ML (TensorFlow, PyTorch, OpenCV) · Databases (Oracle SQL, MySQL, Firebase) · Computer Science (DSA, OOP, Compiler Design, OS, AI, Cloud Computing). **Removed:** Kubernetes, AWS, Spring Boot (per owner) — plus TypeScript and the Observability category (Prometheus dropped; Grafana moved into DevOps), which followed from the owner's exhaustive list.
- `src/sections/Skills.tsx` + `src/app/recruiter/page.tsx` — icon maps extended with `globe`/`container`/`cpu` (Web Technologies, DevOps, Computer Science) and stale `activity` removed, so **both surfaces resolve identical icons** (no Cpu-fallback drift between pages).
- `ROADMAP.md`.

### Notes
- Reuses the existing `SkillCategory` card and 1→2→3 grid unchanged; 7 cards = 3+3+1 rows on desktop. No proficiency bars/percentages (verified absent).
- **Consistency effects:** removing Kubernetes resolves the P2 review's "K8s listed as skill but only a future improvement in projects" credibility wrinkle. Spring Boot/AWS remain visible on the devops-api project page via its `techStack` — correct: project pages document what a project used; the skills section claims current capabilities.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes ✅
- **Prerendered checks:** homepage shows exactly the 7 categories in order with every listed skill present and none missing; Kubernetes/AWS/Spring Boot/Prometheus/TypeScript absent from the section; no `%` anywhere in it; recruiter Core Skills shows all 7 groups with the same removals. ✅

## 52. Engineering Dashboard — Derived Metrics Refactor (2026-08-22)

**Scope:** every dashboard count now derives from its single source of truth; no hardcoded numbers (CGPA excepted — owner-attested, no derivable source). **Status: ✅ complete — repo green.**

### Files created (1) / modified (4)
- **Created** `src/lib/metrics.ts` — `getDashboardMetrics(options?)`: the one derivation point both surfaces consume (no duplicated counts anywhere). `siteConfig.dashboard` now supplies labels/icons only for derived metrics (its placeholder `value`s documented as dead).
- **Modified** `src/sections/EngineeringDashboard.tsx` — async pure summary layer over the helper; UI unchanged (same MetricCard grid/band). `src/lib/recruiter.ts` — `buildMetrics()` now async over the shared helper with `includeRepositories: false`. `src/data/site.config.ts` — dashboard comment + dead placeholder values. `ROADMAP.md`.

### Metric sources (exact)
| Metric | Source |
|---|---|
| CGPA | `siteConfig.dashboard.cgpa.value` (owner-attested config) |
| Projects | `getProjects().length` — count of `src/data/projects/*.json` |
| Repositories | `getGitHubData().repos.length` — live GitHub API (ISR 1h, fetch deduped with the GitHub Hub); **tile hidden when the API yields nothing** (a fake 0 would misreport failure as fact) |
| Certifications | `getCertifications().certifications.length` — `certifications.json` |

### Notable outcomes
- **The hardcoded repo count was wrong:** config said 15; the live count of non-fork public repos is **4**. The refactor replaced a false number with the truth — exactly why derived metrics matter.
- **Recruiter Key Metrics drops Repositories** — deliberate: including it would require the GitHub fetch, pulling `/recruiter` from pure SSG into ISR (ADR-011 keeps it SSG), and the P2 review had already called it the weakest recruiter metric. Recruiter now shows CGPA · Projects · Certifications, all derived/shared.
- SSR preserved throughout; homepage ISR unchanged (1h); GitHub failure path = hidden tile (grid handles 3 items), matching the site's no-fabrication fallback convention.

### Validation
- **`npm run lint`** → exit 0 ✅ · **`npm run build`** → exit 0; 12 routes, `/recruiter` still `○` static, `/` still 1h ISR ✅
- **Prerendered checks:** dashboard tiles = 8.69 CGPA · 3 Projects · **4 Repositories (live)** · 3 Certifications; recruiter = CGPA/Projects/Certifications only. ✅

## 7. See Also

- `ROADMAP.md` — single source of truth for milestone progress
- `PROJECT_CONTEXT.md` — condensed architecture for future sessions
- `DECISIONS.md` — architectural decisions & deviations log
