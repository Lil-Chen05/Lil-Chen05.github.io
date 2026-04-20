# PRD — Personal Portfolio Website

## Problem

Jerry Chen (McGill, CS) has a lot going on — academics, projects across SWE / AI / NLP research, hobbies, reading — but is too shy to post on LinkedIn. He needs a calmer, more personal place to document it all, that *also* doubles as a professional-grade portfolio when he links it from résumés and applications.

## Goals

1. **Document life and learning** with low activation energy (short posts, no performative pressure).
2. **Showcase technical work** across three skill tracks (SWE, AI development, NLP/LLM research) in a way recruiters and collaborators can quickly grok.
3. **Last for years** without breaking — static, simple, low-maintenance.
4. **Stay authentic** — warm, editorial, personal; no "AI slop" portfolio clichés.

## Non-goals

- A blog-centric site. Long-form posts are welcome but not the primary mode.
- A design showcase / frontend-flex. Jerry is not a frontend dev; no heavy animations or custom illustrations.
- Comments, analytics, or engagement mechanics on day 1.
- A job board / résumé PDF host (Jerry tailors résumés per application).

## Target audiences (ranked)

1. **Recruiters / hiring managers** skimming for evidence of skill across SWE / AI / NLP. Primary surface: `/projects` + `/about`.
2. **Peers & collaborators** (classmates, researchers, open-source contacts). Primary surface: `/projects`, `/notes`, `/blog`.
3. **Jerry himself** — a place to externalize thinking and build a record. Primary surface: `/notes`, `/life`.
4. **Strangers on the internet** who wander in from a link. Primary surface: `/` homepage.

## Day-1 feature list

| Feature | Scope |
|---|---|
| Homepage (`/`) | Hero (name, one-line bio, photo), featured projects (2–3), recent-notes feed (latest 5–10) |
| `/notes` | Chronological micro-post feed |
| `/projects` | Tagged project list, filterable by `swe` / `ai` / `nlp`; single-project pages with write-ups |
| `/about` | Bio, "What I work on" skills paragraph, contact & external links |
| Light/dark theme | Respects OS; user toggle; persists via localStorage |
| GitHub Pages deploy | Push to `main` → Action builds Astro site → deploys |
| Content collections | MDX files in `src/content/` with Zod-validated frontmatter |
| Responsive | Works cleanly down to 360px width |
| Accessibility | Lighthouse Accessibility ≥ 95 |
| SEO basics | Per-page `<title>`, meta description, OG image, sitemap |

## Deferred (post day-1, in order)

1. `/blog` — long-form posts (infrastructure ready, route added once Jerry has content)
2. `/courses` — university course reflections
3. `/life` — hobbies / reading / currently-learning (single page with subsections)
4. Analytics (Plausible or Umami)
5. Comments (Giscus)
6. RSS feed
7. Site search (Pagefind)
8. Custom domain

## Success criteria

- Jerry can publish a new note from a plain-text draft in under 10 minutes, without local setup, using only the GitHub web UI.
- A recruiter can land on `/` and identify Jerry's three skill tracks and see project examples within ~30 seconds.
- Lighthouse scores on the deployed site: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95.
- First Contentful Paint < 1.5s on a typical connection.
- The site still works six months later with zero maintenance beyond Jerry adding content.

## Constraints

- **Hosting:** GitHub Pages only (free, matches repo name).
- **Stack:** Astro + MDX + Tailwind. No Next.js, no CMS.
- **Jerry's skill level:** git/CLI comfort 2/5. Setup instructions must be copy-pasteable and explained.
- **Design constraints:** see `CLAUDE.md` — no utility soup, no clichéd portfolio patterns.

## Content authoring workflow

1. Jerry writes a plain-text draft (any editor).
2. LLM converts it to `.mdx` with correct frontmatter for the target collection.
3. Jerry drops the file into `src/content/<collection>/` via the GitHub web UI.
4. Push triggers the Action; site updates in ~2 minutes.

## Open questions (none blocking day 1)

- Font choice (serif body family — Fraunces, Source Serif, others?). Decide during implementation step 2.
- Accent color. Decide during implementation step 2.
- Exact homepage hero wording. Jerry will draft during seeding step.
