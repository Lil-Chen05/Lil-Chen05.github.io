# lil-chen05.github.io

Personal portfolio and digital hub for **Jerry Chen** (McGill, B.Sc. Honours Computer Science, Minor Statistics). Projects, experiences, courses, and a feed of short notes and longer posts.

Live at **[lil-chen05.github.io](https://lil-chen05.github.io)**.

## Stack

- [Astro](https://astro.build/) + [MDX](https://mdxjs.com/) for content
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`, no config file — theme lives in `src/styles/global.css`)
- Content collections with Zod-validated frontmatter
- Deployed to GitHub Pages via GitHub Actions on every push to `main`

## Running locally

Requires Node `>=22.12.0`.

```sh
npm install
npm run dev      # localhost:4321
npm run build    # production build to ./dist
npm run preview  # serve the built site
```

Type-check Astro + content collection schemas:

```sh
npm run astro check
```

## Structure

```
src/
├── components/          # Astro components (NoteEntry, ProjectCard, etc.)
├── content/             # MDX content
│   ├── notes/           # short posts
│   ├── blog/            # long-form posts
│   ├── projects/        # project write-ups
│   └── courses/         # course list
├── content.config.ts    # collection schemas (Zod)
├── layouts/             # Layout.astro (nav + footer + SEO + anti-FOUC theme script)
├── pages/               # file-based routes
├── styles/global.css    # design tokens + Tailwind @theme block
└── lib/                 # activity signal + plant stage helpers
```

## Theming

Light/dark are CSS-variable inversions (`--bg`, `--text`, `--accent`, `--border`, `--surface`, `--muted`). The theme toggle flips a `data-theme` attribute on `<html>` and persists to `localStorage`. No `dark:` utilities anywhere.

## Content

- **Notes + blog** render together on the `/feed` page, sorted by date. Notes are short and inline; blog posts click through to their own page.
- **Projects** use frontmatter fields for hero, gallery, stack, status, and outbound links (`github`, `demo`, `devpost`, `paper`). Adding an image is a drop-in to `public/images/projects/<slug>/` plus a frontmatter line.
- **Courses** are grouped by category on the `/courses` page.
- **Experiences** (research + internships) is a hand-authored Astro page under `src/pages/experiences/`.

## Deployment

Push to `main`. GitHub Actions builds and deploys to GitHub Pages. Do not push to `gh-pages` or commit `dist/`.
