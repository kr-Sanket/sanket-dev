# LAUNCH_BOARD.md

> Launch plan consolidating the four product/engineering reviews (P1 DevOps page,
> P2 Recruiter View, P3 sparse-data pages, P4 final engineering audit — 2026-08-21).
> Tags: **[owner]** = data/asset only, no code · **[code]** = implementation work ·
> **[both]** = code that needs owner input.
> Sprints are ordered by launch impact; nothing in Sprint 3–4 blocks launch.

## 📊 Status at a glance (synced 2026-08-21)

- **✅ Completed:** Sprint 1 core blockers (email · resume · LinkedIn · GitHub · graduation + target roles · research impact · site-wide timeline refresh) · real certifications + issuer logos · Sprint 2: robots.ts, sitemap.ts, not-found.tsx, OG/Twitter images (+ metadata merge fix), JSON-LD.
- **🔨 In progress:** *(nothing mid-flight — every started task was finished and validated.)*
- **🚧 Blocked (owner input/assets needed):** domain confirmation (`https://sanket.dev`) · analytics yes/no · `GITHUB_TOKEN` in deploy env · project/certificate image assets · FQD/ACD developer overviews + fresh project milestones · §28 architecture questionnaire · coding-profile usernames.
- **⏸ Deferred (improve, don't block):** all of Sprint 3 (UX polish) and Sprint 4 (engineering cleanup) — item lists below.
- **⏳ Remaining before launch:** favicon set + web manifest [code] → the owner-blocked items above → Sprint 5 (deploy + production verification + v1.0).

**TL;DR for a fresh session:** the only launch-gating *code* task left is favicons/manifest; everything else gating launch needs the owner. Sprint 3/4 items are safe pickup work anytime.

## Sprint 1 — Launch Blockers (conversion funnel + credibility)

*The site's purpose is getting contacted; every item here currently breaks that.*

- [x] **Real email** — ✅ Sprint 1.2: `kumarsanket.jsr82@gmail.com` in `site.config.ts` + `contact.json`; verified across all prerendered pages (no placeholder remains). [owner]
- [x] **Resume** — ✅ Sprint 1.2: owner placed `public/resume.pdf` (verified: real PDF, 139 KB); all Resume CTAs activated automatically, no code change. [owner]
- [x] **Graduation date** — ✅ Sprint 1.1: `siteConfig.status.graduation` ("May 2027") surfaced in the Hero status panel and recruiter `<dl>`. [both]
- [x] **Target role** — ✅ Sprint 1.1: `status.targetRoles` (Software Engineer · Backend Engineer · DevOps Engineer) shown as "Seeking" on both surfaces; availability sharpened to "Open to full-time opportunities". [owner]
- [x] **Research project impact** — ✅ Sprint 1.3: honest value statements in `recruiterSummary.impact` for both projects ("Automates visual fruit-quality classification…", "Investigates how machine learning can help network defenses adapt…") — derived strictly from existing data, no metrics invented; now rendered on homepage + recruiter cards. [owner]
- [ ] **Research project developer overviews** — still open: real developer-mode `overview` text needs owner knowledge (model architecture/dataset for FQD; threat model/techniques for ACD). TODO strings remain in data but are never rendered. [owner]
- [x] **Fresh timeline signal (site-wide)** — ✅ Sprint 1.4: 4 documented 2026 events added to `timeline.json` from git/doc history (portfolio start, homepage + integrations, recruiter view + mentor, architecture viewer); homepage timeline and recruiter Highlights now end Aug 2026. [code]
- [ ] **Fresh milestones for FQD project timeline** — partially resolved by the 2026-08-22 verified-dates correction: ACD's start is now Mar 2026 (recent — staleness resolved); FQD's only milestone is Feb 2025 (hackathon start) with nothing since — a recent progress milestone still needs owner knowledge. DevOps API's removed intermediate milestones can also be re-added with real dates. [owner]
- [x] **Verify LinkedIn URL** — ✅ owner provided the production URL (`linkedin.com/in/sanket-kumar-515bb228a`); applied to `siteConfig.social` + `contact.json`; old URL verified gone from every prerendered page. [owner]

## Sprint 2 — Production (SEO + deployment hygiene)

*Phase 6 from the roadmap; the P4 audit's launch-gating list.*

- [x] **robots.ts** — ✅ Task 2.1: `src/app/robots.ts` (MetadataRoute API) — allow all, sitemap URL from `siteConfig.url`; `/recruiter` stays crawlable so its `noindex` meta is seen. [code]
- [x] **sitemap.ts** — ✅ Task 2.2: `src/app/sitemap.ts` — `/` + 3 non-planned project pages via `getProjectSlugs()` (same source as `generateStaticParams`, can't drift); `/recruiter` + 404 excluded; `lastModified` deliberately omitted (no trustworthy per-page source). robots.txt sitemap reference now valid. [code]
- [x] **not-found.tsx** — ✅ Task 2.3: `src/app/not-found.tsx` — mono "Error 404" eyebrow, h1, short explanation, Home + Projects CTAs in the standard button idiom; renders inside the root layout (Navbar/Footer preserved); covers unmatched routes and `notFound()` project slugs. [code]
- [x] **OG images** — ✅ Task 2.4: build-generated `opengraph-image.tsx` + `twitter-image.tsx` (ImageResponse, all copy from `siteConfig`); `createMetadata` now carries the image as the site-wide default, so `summary_large_image` is truthful on every page. Also fixed a latent `createMetadata` bug where openGraph overrides clobbered the merged object (project pages had lost `og:site_name`). [code]
- [ ] **Domain + metadataBase** — confirm `https://sanket.dev` is the real production URL or update `siteConfig.url`. [owner]
- [ ] **GITHUB_TOKEN in deploy env** — unlocks the contribution heatmap (GraphQL-only). [owner]
- [ ] **Favicon set + web manifest** — modern icons beyond `favicon.ico`. [code]
- [ ] **Analytics decision** — Vercel Analytics (zero-config fit) or explicitly none. [both]
- [x] **Structured data (JSON-LD)** — ✅ Task 2.5: site-wide Person + WebSite `@graph` (one block, root layout, server-rendered), all values from `siteConfig`; per-project schemas deliberately deferred until real artifacts (repo metadata/images) justify them. [code]
- [ ] **Real image assets** — `public/images/**` (project thumbnails/covers, `pipeline.webp`, `grafana.webp`, certificate photos); everything renders automatically once files exist. *(Issuer logos ✅ shipped in Sprint X.X — `ibm.svg` + `geeksforgeeks.svg` now render on cert cards.)* [owner]
- [x] **Cert date + credential URL** — ✅ Sprint 1.X: placeholder AWS cert removed; 3 real certifications added (2× IBM Career Education Program with dates + credential URLs, GeeksforGeeks Java undated per source), newest first; dashboard metric updated 1 → 3. Credential IDs not stored (schema has no field — noted for a future schema decision if wanted). [owner]

## Sprint 3 — UX Polish (from P1/P2/P3 reviews)

**Project detail pages (P1, P3):**
- [ ] Surface `recruiterSummary` (impact/outcome/skills) as a stat strip under the project hero — data exists, never rendered on the page. [code]
- [ ] Reorder sections: Overview → Architecture → Challenges → Lessons → Timeline → Mentor → Future → Gallery (comprehension before conversation; Timeline before Future). [code]
- [ ] Closing CTA row (GitHub / back to projects / contact) so pages stop ending on the gallery placeholder. [code]
- [ ] Hide Gallery entirely when `gallery` data is empty (placeholder only for referenced-but-missing files). [code]
- [ ] Demote/collapse the Mentor when its knowledge base is empty (P3: empty state currently gets slot #2). [code]
- [ ] Viewer affordance: "Select a component for details" hint + pointer cursor; on mobile, indicate/scroll to the panel after selection. [code]
- [ ] Mentor credibility caption: "Client-side hybrid search (Fuse.js + TF-IDF) — no external AI." [code]
- [ ] Status-aware card CTA: "View Progress" / "View Research" instead of "View Case Study" for non-completed projects. [code]
- [ ] Promote 1–2 mentor KB stories (Docker cache invalidation, Terraform state drift) into devops-api `challenges`. [owner]
- [ ] Answer the §28 architecture questionnaire (whyChosen/lessons for JUnit 5, Prometheus, Grafana; deployment target; runtime/app node + monitoring edges). [owner]
- [ ] Differentiate research-project taglines from their titles. [owner]

**Recruiter View (P2):**
- [ ] Capability-led role line + bio that names the proof (pipeline, 80% deployment-time cut). [owner]
- [ ] Swap Highlights before Core Skills; merge/demote the single-cert section. [code]
- [ ] Surface leadership `description` (already in data, already shown on homepage). [code]
- [ ] Metrics fixes: "8.69 / 10" CGPA scale, singular "Certification", reconsider "Repositories". [code]
- [ ] Reconcile the Kubernetes claim (skill vs. future improvement). [owner]

**Site-wide:**
- [ ] Skip-to-content link onto existing `#main`. [code]
- [ ] Move Coding Profiles directly after GitHub Hub in the homepage flow (existing roadmap item). [code]
- [x] Coding-profile usernames — ✅ 2026-08-22: real LeetCode + GeeksforGeeks profiles as static link cards (ADR-015); placeholder removed, stats service retired. [owner]

## Sprint 4 — Engineering Cleanup (from P4 audit)

- [ ] Consolidate the contact-data duplication: `siteConfig.social` and `contact.json` carry the same email/GitHub/LinkedIn/resume values (found in Sprint 1.2) — derive one from the other. [code]
- [ ] Remove (or repoint) the unused `EXTERNAL_URLS` constant in `lib/constants.ts` — zero consumers and it still carries the OLD LinkedIn URL (stale-data footgun, found in Task 2.2). [code]

- [ ] Commit the mentor behavioral suite as a real test file; add minimal CI (lint, build, tests). [code]
- [ ] Build-time schema validation of `src/data/**` so malformed JSON fails the build, not the page. [code]
- [ ] Extract `lib/format.ts` (formatMonth/MONTHS duplicated in project + recruiter pages; third variant in github.service). [code]
- [ ] Shared icon-name→lucide map utility (currently re-declared 5× with divergent fallbacks). [code]
- [ ] Narrow `ArchitectureViewer`'s client prop from full `Project` to architecture/techStack/title (RSC payload duplication). [code]
- [ ] Remove unused `motion` dependency (or start using it for the planned micro-animations); move `shadcn` CLI to devDependencies. [code]
- [ ] `.env.example` documenting `GITHUB_TOKEN`. [code]
- [ ] Viewer icon map: add `gauge` + a github-appropriate glyph so JUnit 5/Grafana/GitHub stop falling back to Boxes. [code]

## Sprint 5 — Launch

- [ ] Deploy to Vercel; connect domain; confirm HTTPS + www redirect. [owner]
- [ ] Set `GITHUB_TOKEN`; verify heatmap renders in production. [both]
- [ ] Full content pass in production: no placeholder text anywhere, all links resolve, resume downloads. [owner]
- [ ] Verify `/recruiter` is `noindex` in production HTML and absent from the live sitemap. [code]
- [ ] Lighthouse pass (perf/a11y/SEO ≥ 90) on `/`, one project page, `/recruiter`; fix regressions. [code]
- [ ] Cross-device smoke test: nav scroll, theme + view-mode toggles, mentor Q&A, viewer selection/panel, mobile drawer. [both]
- [ ] Confirm analytics receiving events (if adopted). [both]
- [ ] Update ROADMAP/IMPLEMENTATION_STATUS to mark Phase 6 complete; tag `v1.0`. [code]

---

**Suggested order of attack:** Sprint 1 is almost entirely owner data and unblocks everything reputationally; Sprints 2 and 4 are parallelizable code work; Sprint 3 can ship incrementally per item. Launch gate = Sprints 1 + 2 complete; 3 and 4 improve, not block.
