# sanket.dev Roadmap

> Single source of truth for project progress. Concise by design — see
> `IMPLEMENTATION_STATUS.md` for per-milestone detail and `DECISIONS.md` for the why.
> Last synced: 2026-07-11.

## ✅ Completed

- **Phase 1 — Foundation** — Next.js 16 + TS + Tailwind v4, shadcn on Base UI (11 primitives), types, `site.config.ts`, project loaders + `lib/content.ts`.
- **Content Foundation (1.5)** — all project + site JSON in `src/data/`.
- **Foundation Hardening (1.6)** — Base UI / React lint + build blockers cleared; content access layer added.
- **Application Shell (2)** — `layout.tsx` with Inter + JetBrains Mono, providers mounted, `Navbar` / `<main>` / `Footer`.
- **Hero + Engineering Dashboard (3.1, 3.2)** — live on `/`, refined.
- **Featured Projects (4.1)** — reusable `ProjectCard` + `StatusBadge`, data-driven from the content layer.
- **Project Detail Pages (4.2)** — SSG `/projects/[slug]` via `generateStaticParams` + `dynamicParams=false`; status-aware, graceful section hiding; `ProjectCard` CTAs activated.
- **Skills (4.3)** — `Skills` section + reusable `SkillCategory` card, driven entirely by `getSkills()`.
- **Engineering Timeline (4.4)** — `EngineeringTimeline` section + reusable `TimelineItem` (alternating center rail on desktop, stacked on mobile), driven entirely by `getTimeline()`.
- **About (4.5)** — `About` section (read-optimized bio + highlights), driven entirely by `getAbout()`.
- **Leadership (4.6)** — `Leadership` section (role cards), driven entirely by `getLeadership()`.
- **Certifications (4.7)** — `Certifications` section (cert cards with graceful image/date/url handling), driven entirely by `getCertifications()`.
- **Contact (4.8)** — `Contact` closing section (link cards, icon fallback, scheme-aware CTAs), driven entirely by `getContact()`.
- **🏁 Homepage — COMPLETE.** All homepage sections shipped: Hero, Engineering Dashboard, Featured Projects, Skills, Engineering Timeline, About, Leadership, Certifications, Contact. (Current-mission content is surfaced in the Hero status panel via `getMission()`, so no separate section is needed.)
- **GitHub Hub (5.1)** — live, ISR-cached (`revalidate=3600`) GitHub section under `src/features/github/`: reusable `github.service.ts`, profile summary, repo cards, language usage, activity feed, and a token-gated contribution heatmap; graceful fallback placeholder on API failure.
- **Coding Profiles (5.2)** — ISR-cached (`revalidate=21600`) section under `src/features/coding-profiles/`: resilient `codingProfiles.service.ts` (LeetCode stats; CodeChef/HackerRank link-only), `ProfileCard` + `StatsDisplay`, `MetricCard` aggregate tiles; usernames from `siteConfig.codingProfiles`; graceful placeholder when unconfigured.
- **Theme switching** and **Recruiter/Developer view mode** — both working (toggles in `Navbar`).
- **Documentation Synchronization** — docs reconciled with the repository.

## 🚧 Current Milestone

- **Recruiter View** (`/recruiter`, `noindex`) — a purpose-built executive-summary page. Awaiting owner approval before starting.

## 📋 Next Milestones

- Unique features: **Project Mentor** (client-side Fuse.js + TF-IDF) and **Architecture Viewer**.
- Phase 6 polish: `not-found`, `sitemap.ts`, `robots.ts`, OG images, real assets.
- Shared components still needed: `AnimatedCounter`, `ScrollReveal`.

## 🔮 Future

- **Phase 4 — Unique Features:** Project Mentor (client-side Fuse.js + TF-IDF), Architecture Viewer, Recruiter View (`/recruiter`, `noindex`).
- **Phase 5 — Integrations:** GitHub Hub + Coding Profiles (ISR), `lib/recruiter.ts` aggregation.
- **Phase 6 — Polish & Ship:** `not-found`, `sitemap.ts`, `robots.ts`, OG images, real assets (`public/images/**`, `resume.pdf`), accessibility + performance pass.
