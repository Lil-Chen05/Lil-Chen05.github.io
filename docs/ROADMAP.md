# Implementation Roadmap

Each numbered step is an **approval gate** — Jerry reviews the result before the next step begins. Steps are small on purpose so nothing ships unseen.

Legend: ☐ not started · ◐ in progress · ☑ done

---

## Step 1 — Scaffold

☐ Initialize Astro project in-place (`npm create astro@latest -- --template minimal`, TypeScript strict, no sample content).
☐ Add integrations: `@astrojs/mdx`, `@astrojs/tailwind`, `@astrojs/sitemap`.
☐ Install Fontsource for chosen serif + sans families.
☐ Commit baseline `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `.gitignore`.
☐ Verify: `npm run dev` serves `http://localhost:4321` with a placeholder page.

**Approval gate:** Jerry sees the local dev server work.

---

## Step 2 — Typography, theme, layout shell, content collections

☐ Pick serif body + sans display font (show 2–3 options).
☐ Pick single accent color (show 3 options light + dark).
☐ Define CSS variables in `src/styles/global.css` (`--color-bg`, `--color-text`, `--color-muted`, `--color-accent`, `--color-border`) for both themes.
☐ Wire Tailwind tokens in `tailwind.config.mjs` to read those CSS variables.
☐ Build `src/components/Layout.astro` — HTML shell, meta tags, anti-FOUC theme script, font imports.
☐ Build `Nav.astro`, `Footer.astro`, `ThemeToggle.astro`.
☐ Define `src/content/config.ts` with Zod schemas for `notes`, `blog`, `projects`, `courses`.
☐ Create placeholder entries (1 per collection) to prove the pipeline.

**Approval gate:** Jerry sees the layout shell on a blank page with working theme toggle.

---

## Step 3 — Homepage (`/`)

☐ Hero: name + one-line bio + photo (photo slot, actual image swapped in at Step 8).
☐ "Featured projects" section — pulls projects with `featured: true` (max 3).
☐ "Recent notes" section — pulls latest 5 notes sorted by date.
☐ No CTAs, no stat counters. Just content.

**Approval gate:** Homepage looks right with placeholder content.

---

## Step 4 — `/projects`

☐ Index page: grid of `ProjectCard`s.
☐ Client-side tag filter: `All / SWE / AI / NLP`.
☐ `[slug].astro` dynamic route for single-project pages using `PostLayout`.
☐ Empty state: friendly copy if no projects match the filter.

**Approval gate:** Jerry can filter the placeholder projects by tag.

---

## Step 5 — `/notes`

☐ Index page: chronological list of `NoteCard`s (title, date, excerpt, tags).
☐ `[slug].astro` for individual notes (uses `PostLayout`).
☐ Pagination **deferred** until Jerry has ~30+ notes.
## Notes content style

Notes are:
- short (3–10 sentences typically)
- informal but thoughtful
- allowed to be incomplete or exploratory
- closer to a journal/log than a blog post

Do not turn notes into polished essays or corporate writing.

**Approval gate:** Placeholder notes render correctly.

---

## Step 6 — `/about`

☐ Bio (1–2 paragraphs, Jerry's own words).
☐ "What I work on" paragraph covering SWE / AI / NLP tracks.
☐ Contact & external links (email, GitHub, LinkedIn if Jerry wants).
☐ No skills-as-logos grid.
- Avoid generic marketing CTAs.
- Navigation itself should be the primary action.

**Approval gate:** `/about` reads like Jerry, not like an AI.

---

## Step 7 — Deploy

☐ Create `.github/workflows/deploy.yml` using the official Astro + Pages recipe.
☐ Set `site: "https://lil-chen05.github.io"` in `astro.config.mjs`.
☐ In GitHub repo settings → Pages → source = GitHub Actions.
☐ Push to `main`; verify Action passes and site is live.
☐ Spot-check every route in production; confirm theme toggle persists across reloads.

**Approval gate:** `https://lil-chen05.github.io` loads and works.

---

## Step 8 — Seed content

☐ Upload profile photo to `public/images/`.
☐ Write 2–3 real project entries (Jerry drafts text → LLM formats to MDX).
☐ Write 1 starter note.
☐ Write real `/about` bio.
☐ Set `featured: true` on the 2–3 projects Jerry wants on the homepage.

**Approval gate:** Site has real content, is shareable.

---

## Step 9 — Polish

☐ Favicon (SVG, single letter or minimal mark).
☐ Default OG image for social sharing.
☐ Custom 404 page (warm tone, link back to `/`).
☐ Per-page `<title>` and meta descriptions audited.
☐ Run Lighthouse on the deployed site; address any Perf/A11y/SEO issue below 95.
☐ Tab through every page with keyboard only; confirm focus states visible.

**Approval gate:** Lighthouse ≥ 95 across the board.

---

## Step 10 — Extra sections (only after core ships)

In this order, one at a time with its own approval gate:

☐ `/blog` — long-form list + `[slug]`. Same pattern as `/notes`.
☐ `/courses` — list of university courses with reflections.
☐ `/life` — single page with subsections: Hobbies, Reading, Currently Learning.

---

## Post-launch backlog (no order)

- Analytics (Plausible / Umami)
- Giscus comments
- RSS feed
- Pagefind search
- Custom domain
