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
- **Theme switching** and **Recruiter/Developer view mode** — both working (toggles in `Navbar`).
- **Documentation Synchronization** — docs reconciled with the repository.

## 🚧 Current Milestone

- **Phase 2 — Homepage Sections (continuation).** Next up: **Engineering Timeline**, then the remaining sections. Awaiting owner approval before starting.

## 📋 Next Milestones

- Remaining homepage sections: Timeline, Current Mission, Skills, Leadership, Certifications, About, Contact.
- **Phase 3 — Project Detail Pages** (`/projects/[slug]` via `generateStaticParams`); activate `ProjectCard` CTAs.
- Shared components still needed: `AnimatedCounter`, `ScrollReveal`, `TimelineItem`.

## 🔮 Future

- **Phase 4 — Unique Features:** Project Mentor (client-side Fuse.js + TF-IDF), Architecture Viewer, Recruiter View (`/recruiter`, `noindex`).
- **Phase 5 — Integrations:** GitHub Hub + Coding Profiles (ISR), `lib/recruiter.ts` aggregation.
- **Phase 6 — Polish & Ship:** `not-found`, `sitemap.ts`, `robots.ts`, OG images, real assets (`public/images/**`, `resume.pdf`), accessibility + performance pass.
