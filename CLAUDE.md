# CLAUDE.md — Project Rules for `lil-chen05.github.io`

This file is loaded by Claude Code in this repo. It is authoritative: anything here overrides default assistant behavior.

## What this project is

A personal portfolio + digital hub for Jerry Chen (McGill CS). Static site built with **Astro + MDX**, styled with **Tailwind CSS**, hosted on **GitHub Pages**. Design reference: warm/editorial like joshwcomeau.com, timeline-organized like maggieappleton.com — **without** heavy animations or long-essay density.

## Authoring workflow (important)

Jerry writes in plain text. The LLM's job is to convert that text into a valid `.mdx` file with correct frontmatter for the target content collection, then place it in the right folder. Preserve Jerry's voice — do not rewrite content into marketing copy.

## Tailwind constraints (non-negotiable)

1. **No utility soup.** If a `class` list exceeds ~6 utilities, or the same combination repeats in 2+ places, extract a component or an `@apply`-ed class.
2. **Extract components for repeated patterns.** Examples: `NoteCard`, `ProjectCard`, `PostLayout`, `TagPill`.
3. **Typography and spacing first.** No gratuitous gradients, drop shadows, glow, blur, glassmorphism, or decorative blobs. A border + well-chosen padding beats a shadow.
4. **Theming via CSS variables**, defined in `src/styles/global.css` (e.g. `--color-bg`, `--color-text`, `--color-accent`). Do **not** sprinkle `dark:` utilities across components; map Tailwind tokens to the variables in `tailwind.config.mjs` and let them switch via a `data-theme` attribute or `.dark` class on `<html>`.

## Component discipline

- Do not create components prematurely.
- Extract components only when a pattern is reused or clearly improves readability.
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
- **TypeScript** for `src/content/config.ts` and any `.ts` utilities. Use Zod schemas for content collection validation.
- **File names:** PascalCase for components (`NoteCard.astro`), kebab-case for page routes and content files (`my-first-note.mdx`).
- **Imports:** absolute via the `~` or `@` alias where configured; otherwise relative.
- **No default exports** in `.ts` utility files; named exports only.
- **Client JS:** use `<script>` tags in Astro components with `is:inline` only when essential (e.g., the anti-FOUC theme script). Otherwise keep JS out.
- **Accessibility:** every interactive element has a focus state; every image has meaningful `alt` text; headings form a valid outline.

## Content collection frontmatter (MDX)

Every content file starts with YAML frontmatter. Schemas are defined in `src/content/config.ts` — if you add a new field, update the schema.

- **notes/**: `title`, `date` (ISO), `tags?: string[]`
- **blog/**: `title`, `date`, `description`, `tags?: string[]`
- **projects/**: `title`, `date`, `tags: ("swe"|"ai"|"nlp")[]`, `featured?: boolean`, `description`, `links?: { github?: string; demo?: string; paper?: string }`
- **courses/**: `code`, `title`, `term`, `rating?: number`

## Commits

- Conventional-ish, short, lower-case: `feat: add projects page`, `fix: theme toggle flash`, `content: add note on final exams`.
- One logical change per commit. No "misc" dumps.
- Never commit build output (`dist/`), `node_modules`, or `.env*`.

## Deployment

- Deployment is automatic: push to `main` → GitHub Actions builds with Node 20 → deploys to GitHub Pages.
- Do not manually push to `gh-pages` or `docs/` for Pages. The Action owns deployment.
- Before asking Jerry to push, always run `npm run build` locally and fix any errors.

## Working with Jerry

- Jerry's git/CLI comfort is a 2/5. Prefer explicit, copy-pasteable commands. Explain what each command does.
- When suggesting UI choices, show the alternatives and recommend — don't just pick silently.
- Match the editorial tone. If a design feels "AI slop"-ish, pare it back.
- Don't expand scope. Day-1 scope is in `docs/PRD.md`; anything else is a later iteration.
