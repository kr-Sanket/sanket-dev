# Project Context — sanket.dev

> Orientation doc for future Claude sessions. Read this first, then `IMPLEMENTATION_STATUS.md`
> for what's built and `DECISIONS.md` for why things are the way they are.
> Source of truth for intent is the **Architecture & Implementation Plan v2.0** (provided by the owner).

## What this is

`sanket.dev` — a **production-grade engineering showcase platform** (explicitly *not* a generic portfolio). Inspired by Vercel / Linear / Stripe / GitHub. Owner: **Sanket Kumar**, CS student @ VIT. Focus areas: Software Engineering, DevOps, AI.

The differentiator is a set of **unique interactive features** layered on top of a data-driven content system:
1. **Project Mentor** — client-side hybrid search (Fuse.js fuzzy + pre-computed TF-IDF cosine), **no external AI API**.
2. **Architecture Viewer** — custom node/edge diagram (CSS grid + absolute cards + SVG edges) with a detail side-panel.
3. **Recruiter / Developer dual mode** — global view toggle that swaps content depth site-wide.
4. **Engineering Timeline** — vertical (desktop) / stacked (mobile) project-evolution timeline.
5. **2-Minute Recruiter View** (`/recruiter`) — a purpose-built executive-summary page (`noindex`).

## Core principle: data-driven, zero-DB

All content lives in **Git-versioned JSON / TS** under `src/data/`. Adding a project = adding one JSON file (+ timeline entries + images); the route, timeline, and recruiter view update automatically. No database. No CMS.

## Tech Stack (as actually installed)

| Layer | Tech | Notes |
|---|---|---|
| Framework | **Next.js 16.2.7**, App Router | ⚠️ Plan said 15 — repo is on 16. Treat App Router APIs as potentially changed; read `node_modules/next/dist/docs/` (per AGENTS.md). |
| Language | TypeScript 5 | Strict, path alias `@/*` → `src/*` |
| React | 19.2.4 | |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` in `globals.css`; no `tailwind.config.js` |
| Components | **shadcn/ui (v4) on Base UI** | `@base-ui/react`, **not** Radix. Style `base-nova`, baseColor `neutral`. Components are owned in `src/components/ui/`. |
| Animation | **Motion** (`motion/react`) | spring micro-anims, `whileInView`, respect `useReducedMotion` |
| Theme | **next-themes** | dark default, `attribute="class"` + `.dark` overrides (see DECISIONS) |
| Icons | **lucide-react** | |
| Fonts | `next/font/google` | Plan wants **Inter + JetBrains Mono**; layout currently still ships **Geist** (not yet swapped) |
| Search | **fuse.js** + hand-rolled TF-IDF | for Project Mentor |
| Utilities | clsx + tailwind-merge via `cn()` | |
| Hosting | Vercel (SSG + ISR) | |

## Rendering model

- **Everything is SSG** at build time from local JSON.
- **ISR** only for live integrations: GitHub (~1h revalidate), coding profiles (~6h).
- Server Components by default; client islands for interactivity (toggles, counters, heatmap, architecture viewer, mentor chat, timeline animation).

## Routes

| Route | Rendering | Source |
|---|---|---|
| `/` | SSG | all JSON data files (assembles every section) |
| `/projects/[slug]` | SSG + `generateStaticParams()` | `src/data/projects/[slug].json` — **excludes** `status: "planned"` |
| `/recruiter` | SSG, `noindex` | aggregated via `lib/recruiter.ts` |
| `not-found` | SSG | — |

## Directory map (intended)

```
src/
  app/            routes: layout, page, globals.css, not-found, projects/[slug], recruiter
  components/
    ui/           shadcn primitives (owned)
    layout/       Navbar, Footer, ThemeToggle, SectionHeader, Container
    shared/       AnimatedCounter, ScrollReveal, StatusBadge, TimelineItem, ViewModeToggle
    providers/    ThemeProvider, ViewModeProvider   (repo addition, not in original plan)
  sections/       one component per homepage section (Hero … Contact)
  features/       project-mentor, architecture-viewer, recruiter-view, github, coding-profiles
  data/           projects/*.json + skills/certs/leadership/mission/timeline/about/contact + site.config.ts
  lib/            utils(cn), projects(loaders), metadata(SEO), constants, recruiter
  hooks/          useViewMode, useReducedMotion, useIntersection
  types/          project, timeline, github, coding-profile, common
```

## Key data models (already typed in `src/types/`)

- **Project** (`project.ts`): slug, title, tagline, `status` (`completed | in-progress | research | planned`), featured, order, dual-mode `overview` (recruiter/developer), `architecture` (diagram nodes + edges), techStack, challenges, lessonsLearned, futureImprovements, gallery, github, `timeline` (milestones), `mentor` (knowledgeBase[] + greeting + fallback), `recruiterSummary`.
- **TimelineEvent** (`timeline.ts`): date, type, title, description, icon, relatedProject, optional status.
- **GitHubData** (`github.ts`): contribution calendar, repos, languages, events.
- **CodingProfile** (`coding-profile.ts`): leetcode/codechef/hackerrank + stats.
- **common.ts**: ViewMode, SkillCategory, Certification, LeadershipRole, MissionData, AboutData, ContactData, DashboardMetric.

## Dual-mode content pattern

Most content fields are objects `{ recruiter: string, developer: string }`. `ViewModeProvider` (React Context + `localStorage`, key `sanket-dev-view-mode`, **default `recruiter`**) drives which string renders. UI swap should crossfade via Motion `AnimatePresence`.

## Project status → UI behavior

| Status | Badge | Page behavior |
|---|---|---|
| `completed` | emerald | full page |
| `in-progress` | blue | full page, some "coming soon" |
| `research` | amber | partial page (overview + stack + research notes) |
| `planned` | muted | homepage card only; **no full page generated** |

## Owner-specific facts (from `site.config.ts`)

- GitHub username: **`kr-Sanket`** (answers the plan's open question)
- CGPA **8.69**, Projects **3**, Repositories **15**, Certifications **1**
- Email is still placeholder (`sanket@example.com`); resume at `/resume.pdf` (not yet added)
- The 3 planned projects: `devops-api`, `fruit-quality-detection`, `adaptive-cyber-defense`

## Current state (2026-06-29)

Foundation only. Toolchain + tokens + types + loaders + providers + all shadcn primitives exist, but `layout.tsx`/`page.tsx` are still Create-Next-App boilerplate, providers aren't mounted, and there are **no sections, features, hooks, or content JSON yet**. See `IMPLEMENTATION_STATUS.md`.

## Hard rules for working here

1. **Next.js 16, not 15.** Per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing layout/route/metadata code; don't trust training-data assumptions.
2. **shadcn is on Base UI**, not Radix — import patterns differ; add components via the shadcn CLI rather than hand-writing Radix.
3. **No external AI API** for the mentor — keep it client-side (Fuse.js + TF-IDF).
4. **Content is data, not code** — new projects/skills/etc. go in `src/data/`, never hardcoded into components.
5. Respect `useReducedMotion`; keep accessibility (ARIA, keyboard nav, contrast) in scope.
6. `/recruiter` must stay `noindex`.
