# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This file is authoritative: anything here overrides default assistant behavior.

## What this project is

A personal portfolio + digital hub for Jerry Chen (McGill CS). Static site built with **Astro + MDX**, styled with **Tailwind CSS v4**, hosted on **GitHub Pages** at `https://lil-chen05.github.io`. Design reference: warm/editorial like joshwcomeau.com, timeline-organized like maggieappleton.com — **without** heavy animations or long-essay density. Design brief lives in `DESIGN.md`; day-1 scope in `docs/PRD.md`.

## Commands

Node `>=22.12.0` required (see `package.json` engines).

- `npm run dev` — local dev server at `localhost:4321`
- `npm run build` — production build to `./dist/` (run this before asking Jerry to push)
- `npm run preview` — serve the built site locally
- `npm run astro check` — type-check Astro + content collection schemas (no dedicated test suite; this is the main correctness gate)
- `npm run astro -- --help` — Astro CLI help

There is no linter, test runner, or formatter configured. `astro check` is the de-facto verification step.

## Architecture

**Astro content collections** are the backbone. Four collections are declared in `src/content.config.ts` (note: root of `src/`, not `src/content/config.ts`) using the `glob` loader + Zod schemas:

- `notes/` — `title`, `date`, `tags?`
- `blog/` — `title`, `date`, `description`, `tags?`
- `projects/` — `title`, `date`, `description`, `tags: ("swe"|"ai"|"nlp"|"school")[]`, `featured?`, `links?: { github?, demo?, devpost?, paper? }`
- `courses/` — `code`, `title`, `term`, `rating?: 0–5`

MDX files live under `src/content/<collection>/`. If you add a field, **update the Zod schema** in `src/content.config.ts` — otherwise the build fails. Page routes under `src/pages/<collection>/` query the collection with `getCollection()` and render via `PostLayout.astro` / collection-specific components.

**Single layout.** `src/layouts/Layout.astro` wraps every page with `<Nav>` + `<main>` + `<Footer>`, sets SEO/OG meta, and contains the **anti-FOUC theme script** (inline `<script is:inline>` that sets `document.documentElement.dataset.theme` from `localStorage` or `prefers-color-scheme` before first paint). Accepts `title`, `description`, `noindex`, `wide` props. `wide` swaps `max-w-prose` for `max-w-5xl`.

**Theming is CSS-variable driven, not `dark:` utilities.** Tokens (`--bg`, `--text`, `--accent`, `--border`, etc.) are defined in `src/styles/global.css`, exposed to Tailwind v4 via `@theme inline { --color-*: var(--*) }`, and swapped by `:root[data-theme="dark"]`. `ThemeToggle.astro` flips `data-theme` and persists to `localStorage`. **Do not add `dark:` classes** — add or adjust a CSS variable instead.

**Tailwind v4** is wired via `@tailwindcss/vite` (see `astro.config.mjs`) and `@import "tailwindcss"` in `global.css`. There is **no `tailwind.config.*` file** — all theme config lives in the `@theme` block of `global.css`. (If older CLAUDE.md guidance references `tailwind.config.mjs`, treat the CSS `@theme` block as the equivalent.)

**Integrations** (`astro.config.mjs`): `@astrojs/mdx`, `@astrojs/sitemap` (filter excludes `/blog` and `/life` from the sitemap).

**Deployment.** Push to `main` → GitHub Actions (`.github/workflows/`) builds on Node 20 and deploys to GitHub Pages. Do **not** manually push to `gh-pages` or commit `dist/`. The Action owns deployment.

**Misc.** `src/lib/activity.ts` + `plant.ts` back the `ActivityPlant.astro` homepage widget (content-derived activity signal, not GitHub contribution graph). `public/` holds static assets (favicon, OG image, photos).

## Authoring workflow

Jerry writes in plain text. The LLM's job is to convert that text into a valid `.mdx` file with correct frontmatter for the target collection, place it in the right folder, and **preserve Jerry's voice** — do not rewrite into marketing copy.

## Tailwind constraints (non-negotiable)

1. **No utility soup.** If a `class` list exceeds ~6 utilities, or the same combination repeats in 2+ places, extract a component or an `@apply`-ed class in `global.css`.
2. **Extract components for repeated patterns.** Existing examples: `NoteEntry`, `ProjectCard`, `PostLayout`, `TagPill`.
3. **Typography and spacing first.** No gratuitous gradients, drop shadows, glow, blur, glassmorphism, or decorative blobs. A border + well-chosen padding beats a shadow.
4. **Theme via CSS variables only** (see Architecture). No `dark:` utilities.

## Component discipline

- Do not create components prematurely.
- Extract only when a pattern is reused or clearly improves readability.
- Prefer simple, readable markup over unnecessary abstraction.

## Forbidden portfolio clichés

Do not generate any of these without Jerry's explicit request:

- "Hi, I'm X 👋" hero with waving emoji
- Animated gradient blobs / mesh gradients
- Stat counters ("10+ projects", "3 years experience")
- "Tech Stack" icon grids (logo walls of tools)
- Timeline with dots-and-vertical-line decoration
- Typewriter-effect taglines
- "Let's build something amazing together" CTAs
- Faux-3D tilt cards on hover
- Scroll-jacking, parallax, or section-snap scrolling
- AI-generated filler copy ("passionate developer seeking opportunities")

## Code style

- **Astro components** (`.astro`) for everything. Only introduce a client-side framework (React/Preact) if truly needed for interactivity — not for presentation.
- **TypeScript** for `src/content.config.ts` and any `.ts` utilities. Use Zod schemas for content-collection validation.
- **File names:** PascalCase for components (`NoteEntry.astro`), kebab-case for page routes and content files (`my-first-note.mdx`).
- **No default exports** in `.ts` utility files; named exports only.
- **Client JS:** `<script is:inline>` only when essential (e.g., the anti-FOUC theme script). Otherwise keep JS out.
- **Accessibility:** every interactive element has a focus state; every image has meaningful `alt`; headings form a valid outline.

## Commits

- Conventional-ish, short, lower-case: `feat: add projects page`, `fix: theme toggle flash`, `content: add note on final exams`.
- One logical change per commit. No "misc" dumps.
- Never commit `dist/`, `node_modules`, or `.env*`.

## Working with Jerry

- Jerry's git/CLI comfort is 2/5. Prefer explicit, copy-pasteable commands and explain what each does.
- When suggesting UI choices, show alternatives and recommend — don't silently pick.
- Match the editorial tone. If a design feels "AI slop"-ish, pare it back.
- Don't expand scope. Day-1 scope is `docs/PRD.md`; anything else is a later iteration.
