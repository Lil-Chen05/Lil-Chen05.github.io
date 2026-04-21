# DESIGN.md — Context for Claude Design

This doc is handed to Claude Design to give it the shape, tone, and constraints of the site. Use it alongside a live walkthrough or screenshots — this file is the written half of the brief.

## What the site is

Personal portfolio + digital hub for **Jerry Chen** (McGill, B.Sc. Honours Computer Science, minor Stats). Three tracks of work: **SWE**, **AI**, **NLP research**. The site is also a place to journal progress — notes, courses, eventually blog posts and a "life" section.

Live at: `lil-chen05.github.io` (GitHub Pages).

## Target tone

**Editorial, warm, print-inspired.** References:
- `joshwcomeau.com` — for warmth, typographic confidence, craftsmanship
- `maggieappleton.com` — for timeline/garden organization and quiet density

We want that feeling **without** heavy animations, long essays, or decorative flourish. Think magazine column, not marketing page.

## Hard constraints (non-negotiable)

From `CLAUDE.md` in the repo — these override any generic portfolio instincts:

### Forbidden portfolio clichés
- "Hi, I'm X 👋" hero with waving emoji
- Animated gradient blobs / mesh gradients
- Stat counters ("10+ projects", "3 years experience")
- Tech-stack icon grids (logo walls)
- Timeline with dots-and-vertical-line decoration
- Typewriter taglines
- "Let's build something amazing together" CTAs
- Faux-3D tilt cards on hover
- Scroll-jacking, parallax, section-snap scrolling
- AI-generated filler copy

### Visual discipline
- No gratuitous gradients, drop shadows, glow, blur, glassmorphism, decorative blobs
- **A border + well-chosen padding beats a shadow.** Typography and spacing first.
- Animations only when they carry meaning. The Activity Plant's breathing pulse at stage 10 is the current ceiling for motion.
- Respect `prefers-reduced-motion`.

### Tailwind discipline
- No utility soup. If a class list exceeds ~6 utilities, or repeats in 2+ places, extract a component or `@apply`.
- Theming via CSS variables (see below), **not** sprinkled `dark:` utilities.

## Design tokens

Defined in `src/styles/global.css`. Light + dark are inversions of the same warm palette:

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fbfaf7` (warm off-white) | `#141413` (near-black warm) |
| `--surface` | `#f4f2ed` (cream) | `#1c1c1a` |
| `--text` | `#1f1f1e` | `#e8e6e1` |
| `--muted` | `#6b6b66` | `#8f8e87` |
| `--accent` | `#4a6f4c` (forest green) | `#8fbf8f` (sage) |
| `--border` | `#e5e3de` | `#2a2a27` |

**Type:**
- Serif: **Fraunces** (400, 400-italic, 600) — body + headings
- Sans: **Inter** (400, 500, 600) — nav, meta labels ("Selected projects" etc.), captions
- Base: 17px / 1.65, antialiased

**Link style:** underlined in accent green, underline thickens on hover (no color jumps).

## Layout system

- Default content column: `max-w-prose` (≈65ch)
- Homepage is `wide`: `max-w-5xl` with a two-column split on `≥1024px` (main content + sticky aside for the Activity Plant). Below 1024px it collapses to single column and the plant disappears.
- Nav is centered text links with a theme toggle pinned right (sun/moon icon — sun in dark mode, moon in light).
- Footer: small copyright + icon links (email, GitHub, LinkedIn, Devpost).

## Site map + current state

| Route | State | Notes |
|---|---|---|
| `/` | Live | Hero (photo + 2-line bio), Selected projects, Recent notes, Activity Plant aside |
| `/about` | Live | Long-form bio, three tracks, Elsewhere icons |
| `/projects` | Live | Filterable by tag (`swe`, `ai`, `nlp`) |
| `/projects/<slug>` | Live | 3 real projects: sustainify, expenseintel, the-bench |
| `/notes` | Live | Short-form posts (one so far: `hello-world`) |
| `/courses` | Live but nearly empty | Term/course list |
| `/blog` | Scaffolded, hidden from nav, noindex, excluded from sitemap |
| `/life` | Same as blog |
| `/404` | Live | |

## Content collections

All MDX with Zod-validated frontmatter (`src/content.config.ts`):

- **notes**: `title`, `date` (ISO), `tags?: string[]`
- **blog**: `title`, `date`, `description`, `tags?: string[]`
- **projects**: `title`, `date`, `tags: ("swe"|"ai"|"nlp")[]`, `featured?: boolean`, `description`, `links?: { github?, demo?, paper? }`
- **courses**: `code`, `title`, `term`, `rating?: number`

Projects are filterable/taggable; notes are chronological; courses are grouped by term.

## The Activity Plant (just shipped)

Right-aside on the homepage (≥1024px only). Renders an inline SVG plant with 10 gradual stages driven by a 0–100 score computed at build time from:
- Notes frontmatter dates (10 pts each)
- Project file git-log commits (20 pts each)
- `about.astro` git-log commits (5 pts each)
- 60-day rolling window, linear decay
- Site redeploys daily via GitHub Actions cron so decay reflects without manual pushes.

The plant sits in a "windowsill" card (surface background, subtle inner border line at base, rounded corners), with an italic serif caption below and a small `?` help popover. **Its visual language is the benchmark** for what warmth + restraint should look like elsewhere on the site.

## What I'm asking Claude Design to do

Look at the site as a whole and propose layout/format improvements. Specifically interested in:

1. **Hero / homepage above-the-fold** — is the photo + 2-line bio the right first impression? Should the plant be visible earlier, or is the current "reward you for scrolling to it on desktop" fine?
2. **Project index and project detail pages** — the card grid and detail template haven't had a design pass since early scaffolding. Could they be more editorial?
3. **Notes + (future) blog index** — these are chronological right now; should there be any lightweight grouping (by month, by tag)?
4. **Courses page** — currently very spare. What's the right template for "list of courses I've taken with a one-line take on each"?
5. **Overall visual rhythm** — section headers are uppercase Inter labels (`SELECTED PROJECTS`, `ELSEWHERE`). Is that motif working, or is it getting monotonous?
6. **Dark mode parity** — any places the dark palette feels muddy or loses hierarchy?

## What's NOT in scope for this pass

- Content rewriting (next session handles content)
- The Activity Plant itself (just shipped, is the design anchor)
- Animation systems / scroll behavior / any motion beyond what's already there
- Swapping the type system or palette wholesale — refinements welcome, replacements are not

## About the author (for tone calibration)

Undergraduate, writes in plain direct sentences, doesn't want marketing gloss. Plays competitive soccer (Inter Montreal), cares about fashion and sustainability and food. Comfortable saying "I'm figuring out where to put my time." The site should read like that sentence, not like a LinkedIn headline.
