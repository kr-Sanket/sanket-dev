# CLAUDE_START.md

> **Single entry point for every Claude session on this repo.** Read this file +
> `ROADMAP.md` and you have enough to work. For deeper detail, follow the links:
> `ROADMAP.md` = roadmap source of truth · `IMPLEMENTATION_STATUS.md` = historical
> per-milestone detail · `DECISIONS.md` = architectural history (ADRs) ·
> `PROJECT_CONTEXT.md` = extended architecture · `AGENTS.md` = hard tooling rules.

---

## 1. Project Overview

- **What it is:** `sanket.dev` — a production-grade **engineering showcase platform** (deliberately *not* a generic portfolio) for **Sanket Kumar**, a CS student @ VIT (focus: Software Engineering, DevOps, AI). Aesthetic inspired by Vercel / Linear / Stripe / GitHub.
- **Target audience:** recruiters (fast executive summary) **and** engineers (deep technical detail) — served by a site-wide **Recruiter/Developer dual-mode** toggle.
- **Core philosophy:** **data-driven, zero-DB.** All content is Git-versioned JSON/TS in `src/data/`. Adding a project = one JSON file; routes/timeline/recruiter view derive automatically. The differentiators are **unique interactive features** layered on that content: client-side Project Mentor (no external AI), Architecture Viewer, dual-mode, Engineering Timeline, Recruiter View.

## 2. Current Progress

- **Completed:** Foundation → Application Shell → **entire Homepage** (Hero, Engineering Dashboard, Featured Projects, Skills, Engineering Timeline, About, Leadership, Certifications, Contact) → SSG project detail pages (`/projects/[slug]`) → **GitHub Hub** (ISR) → **Coding Profiles** (ISR). Theme switching + Recruiter/Developer view mode work end-to-end.
- **Current milestone:** **Recruiter View** (`/recruiter`, `noindex`) — an executive-summary page. *Awaiting owner approval before starting.*
- **Approximate completion:** **~75–80%.** Homepage and both live integrations are done; what remains is the recruiter route, the two remaining unique features, and Phase 6 polish/ship.

> The `~52%` figure and Phase Matrix inside `IMPLEMENTATION_STATUS.md §1` are historical/stale — trust `ROADMAP.md` for current status.

## 3. Current Architecture

- **Tech stack:** Next.js **16.2.7** (App Router) · React **19.2.4** · TypeScript 5 (strict, `@/*`→`src/*`) · Tailwind **v4** (CSS-first `@theme` in `globals.css`, no config file, oklch tokens) · **shadcn v4 on Base UI** (`@base-ui/react`, *not* Radix) · `next-themes` (dark default, `.dark` class) · `motion` · `lucide-react` · `fuse.js` (Mentor).
- **Rendering strategy:** **SSG everywhere** from local JSON. **ISR only** for live integrations (GitHub ~1h, Coding Profiles ~6h). Server Components by default; **client islands only** for interactivity (toggles, dual-mode text).
- **Data-driven architecture:** content lives as typed JSON in `src/data/`, accessed **only** through the `src/lib/content.ts` façade (+ project loaders). Types in `src/types/` are the contract. No DB, no CMS.
- **Folder philosophy:** `sections/` = one component per homepage section; `features/` = self-contained integrations; `components/{ui,layout,shared,providers}` layered by reuse scope; `lib/` = access/util layer; `data/` = the content.

## 4. Repository Structure

```
src/
  app/          routes: layout.tsx, page.tsx, globals.css, projects/[slug]/page.tsx
  components/
    ui/         shadcn-on-Base-UI primitives (owned; 11 of them)
    layout/     Navbar, Footer, Container, SectionHeader, Theme/ViewMode toggles
    shared/     reusable presentational: ProjectCard, StatusBadge, MetricCard,
                SkillCategory, TimelineItem, DualModeText
    providers/  ThemeProvider, ViewModeProvider (mounted in layout.tsx)
  sections/     one component per homepage section (Hero … Contact)
  features/     github/ + coding-profiles/ (each: service + presentational parts)
  lib/          content.ts (façade), projects.ts (loaders), metadata.ts, constants.ts, utils.ts (cn)
  data/         projects/*.json + skills/timeline/about/leadership/certs/contact/mission JSON + site.config.ts
  types/        project, timeline, github, coding-profile, common
```

**Not yet present** (planned): `features/{project-mentor,architecture-viewer,recruiter-view}/`, `app/{recruiter,not-found,sitemap,robots}`, `src/hooks/`, `lib/recruiter.ts`, shared `AnimatedCounter`/`ScrollReveal`, `public/images/**` + `resume.pdf`.

## 5. Engineering Rules

- **Reuse over duplication** — compose from existing `ui`/`shared`/`layout` components before creating new ones.
- **Build must stay green** — `npm run build` → exit 0 (no source milestone ships otherwise).
- **Lint must stay green** — `npm run lint` → exit 0. **Never** disable rules or add `eslint-disable`; fix the root cause.
- **Everything comes from JSON** — content is data, never hardcoded into components (ADR-010).
- **Prefer Server Components** — client islands only where interactivity truly requires it.
- **ISR only where appropriate** — SSG by default; ISR reserved for live third-party data, always with a graceful fallback (ADR-011).
- **Never fabricate data** — missing content = clear placeholder or graceful hide, never invented facts/metrics.
- **Next.js 16, not 15** — read `node_modules/next/dist/docs/` before writing route/layout/metadata code (`AGENTS.md`).

## 6. Design Rules

- **Premium engineering aesthetic** — Vercel/Linear/Stripe: generous whitespace, strong typographic hierarchy, `font-mono` labels.
- **No gradients. No glassmorphism.** No decorative clutter, no heavy borders.
- **Consistent spacing** — section rhythm `py-16 sm:py-20`, header `mb-8`, `Card` `rounded-xl`, grids `1→2→3` cols.
- **Reuse existing components** and preserve visual consistency (`SectionHeader` `h2` → card `h3`, shared ring-lift hover only).
- **Accessibility always in scope** — semantic headings, `aria-hidden` on decorative elements, keyboard nav, `rel="noopener noreferrer"` on external links, respect `useReducedMotion`.

## 7. Things That Must Never Change

- **shadcn on Base UI** (not Radix) — composition via the `render` prop, **never `asChild`** (ADR-002).
- **Data-driven, zero-DB architecture** — all content in `src/data/`, accessed via `content.ts` (ADR-010).
- **Recruiter page stays `noindex`** (`/recruiter`, private link) (ADR-011).
- **Project Mentor stays client-side** — Fuse.js + hand-rolled TF-IDF, **no external AI API** (ADR-009).
- **Feature-based architecture** — integrations self-contained under `src/features/*`.
- **Theme = class-based + oklch tokens** (not `data-theme`/HSL) (ADR-003).

## 8. Current Roadmap

*(summary — `ROADMAP.md` is the source of truth)*

- **Completed:** Foundation, Application Shell, full Homepage (9 sections), Project detail pages, GitHub Hub, Coding Profiles, theme + view-mode toggles.
- **Current:** Recruiter View (`/recruiter`, `noindex`) — awaiting owner approval.
- **Next:** unique features — Project Mentor (Fuse.js + TF-IDF) and Architecture Viewer; shared `AnimatedCounter` + `ScrollReveal`.
- **Future (Phase 6 polish & ship):** `not-found.tsx`, `sitemap.ts`, `robots.ts`, per-route OG images, real assets (`public/images/**`, `resume.pdf`), accessibility + performance pass, `lib/recruiter.ts` aggregation.

## 9. Standard Workflow

Every milestone follows the same loop:

1. **Read first:** `CLAUDE_START.md` (this file) + `ROADMAP.md`. Consult `IMPLEMENTATION_STATUS.md` / `DECISIONS.md` only for the specific area you're touching.
2. **Inspect the repo:** the relevant `sections/`, `features/`, `components/`, `data/`, `types/`, and any Next.js 16 doc under `node_modules/next/dist/docs/` for route/metadata work.
3. **Health check (baseline):** confirm `npm run lint` and `npm run build` are green *before* starting, and review `git status` for uncommitted work.
4. **Implement:** narrow scope to the one milestone. Reuse existing components; keep content in JSON; Server Components by default; follow the Engineering + Design rules above. No architecture changes without an ADR.
5. **Validate:** `npm run lint` (exit 0) + `npm run build` (exit 0); check rendered HTML / behavior for the change; verify no unrelated files changed.
6. **Update docs:** tick the item in `ROADMAP.md`; append a milestone section to `IMPLEMENTATION_STATUS.md`; add an ADR to `DECISIONS.md` only if a real decision/deviation was made.
7. **Final report:** concise summary — files created/modified, decisions, validation results, remaining work.

## 10. Quick Startup Prompt

> Paste this into any new Claude session:

```
We are continuing work on "sanket.dev", an existing production project.

First, read CLAUDE_START.md and ROADMAP.md to rebuild context. Consult
IMPLEMENTATION_STATUS.md (history), DECISIONS.md (ADRs), and PROJECT_CONTEXT.md
only for the area you're touching.

This is Next.js 16 (not 15) with shadcn on Base UI — read
node_modules/next/dist/docs/ before writing any route/layout/metadata code.

Follow the Standard Workflow in CLAUDE_START.md §9. Honor the Engineering Rules
(§5), Design Rules (§6), and the "Never Change" list (§7): data-driven/zero-DB,
Base UI (render prop, never asChild), Server Components by default, ISR only for
live data, never fabricate content, keep lint + build green.

Today's milestone: <STATE THE MILESTONE>.

Do not change architecture or unrelated files. When done: run npm run lint and
npm run build, update ROADMAP.md + IMPLEMENTATION_STATUS.md, and give a short report.
```
