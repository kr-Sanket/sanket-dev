# sanket.dev

Production-grade **engineering showcase platform** for Sanket Kumar (CS @ VIT — Software Engineering, DevOps, AI). Deliberately not a generic portfolio: a data-driven, zero-database site with unique interactive features, aimed at both recruiters (fast executive summary) and engineers (deep technical detail).

## Highlights

- **Data-driven, zero-DB** — all content is Git-versioned JSON/TS in `src/data/`, accessed through the `src/lib/content.ts` façade. Adding a project = one JSON file; routes, timeline, sitemap, and recruiter view derive automatically.
- **Recruiter / Developer dual mode** — a site-wide toggle that swaps content depth.
- **Project Mentor** — client-side hybrid-search Q&A per project (Fuse.js + hand-rolled TF-IDF). No external AI API.
- **Architecture Viewer** — interactive architecture diagrams (CSS grid + SVG edges) with node selection and a detail panel, rendered entirely from project data.
- **Live integrations** — GitHub Hub (ISR ~1h) and Coding Profiles (ISR ~6h) with graceful fallbacks.
- **2-minute Recruiter View** — private `noindex` executive summary at `/recruiter`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 (CSS-first `@theme`, oklch) · shadcn on **Base UI** (not Radix) · next-themes · lucide-react · Fuse.js. SSG everywhere; ISR only for live data. Server Components by default with minimal client islands.

## Development

```bash
npm run dev     # local dev server
npm run lint    # must stay green (exit 0)
npm run build   # must stay green (exit 0) — prerenders all routes
```

## Repository map

```
src/
  app/          routes: /, /projects/[slug], /recruiter, 404, robots, sitemap, OG images
  components/   ui (shadcn-on-Base-UI) · layout · shared · providers
  sections/     one component per homepage section
  features/     github · coding-profiles · project-mentor · architecture-viewer
  lib/          content façade, loaders, metadata/SEO, recruiter aggregation, utils
  data/         all site content (JSON + site.config.ts)
  types/        the data contracts
```

## Documentation (read in this order for full context)

| File | Purpose |
|---|---|
| `CLAUDE_START.md` | Single entry point — current state, rules, caveats |
| `ROADMAP.md` | Progress source of truth |
| `LAUNCH_BOARD.md` | Launch-prep board — what's left before launch |
| `IMPLEMENTATION_STATUS.md` | Per-milestone history with validation evidence |
| `DECISIONS.md` | Architectural decision records (ADRs) |
| `PROJECT_CONTEXT.md` | Extended architecture reference |
| `AGENTS.md` | Hard tooling rules (Next.js 16 — read installed docs first) |
