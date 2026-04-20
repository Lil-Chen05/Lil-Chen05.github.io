import { execSync } from "node:child_process";
import { getCollection } from "astro:content";

const WINDOW_DAYS = 60;
const DAY_MS = 86_400_000;

const POINTS = {
  note: 10,
  blog: 50,
  projectCommit: 20,
  aboutCommit: 5,
} as const;

export interface ActivitySummary {
  score: number; // 0..100
  lastActivity: Date | null; // most recent contributing event
}

function decayedPoints(date: Date, points: number, now: Date): number {
  const age = (now.getTime() - date.getTime()) / DAY_MS;
  if (age < 0) return points; // future-dated content counts full
  if (age >= WINDOW_DAYS) return 0;
  return points * (1 - age / WINDOW_DAYS);
}

function commitDatesForPath(path: string): Date[] {
  try {
    const out = execSync(`git log --format=%cI -- "${path}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((s) => new Date(s));
  } catch {
    return [];
  }
}

function gitLsFiles(glob: string): string[] {
  try {
    const out = execSync(`git ls-files -- "${glob}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

export async function computeActivity(): Promise<ActivitySummary> {
  const now = new Date();
  let total = 0;
  let mostRecent: Date | null = null;

  const mark = (d: Date) => {
    if (!mostRecent || d.getTime() > mostRecent.getTime()) mostRecent = d;
  };

  // Notes + blog: frontmatter dates
  const notes = await getCollection("notes");
  for (const n of notes) {
    const d = n.data.date;
    const pts = decayedPoints(d, POINTS.note, now);
    if (pts > 0) {
      total += pts;
      mark(d);
    }
  }

  // Blog collection is intentionally empty right now; skip to avoid
  // Astro's empty-collection warning. Re-enable when the first post lands.
  // const blog = await getCollection("blog");
  // for (const b of blog) {
  //   const d = b.data.date;
  //   const pts = decayedPoints(d, POINTS.blog, now);
  //   if (pts > 0) { total += pts; mark(d); }
  // }

  // Projects: git commits touching each project file (creation + updates)
  const projectFiles = gitLsFiles("src/content/projects/*.mdx");
  for (const file of projectFiles) {
    for (const d of commitDatesForPath(file)) {
      const pts = decayedPoints(d, POINTS.projectCommit, now);
      if (pts > 0) {
        total += pts;
        mark(d);
      }
    }
  }

  // About: commits touching the about page
  for (const d of commitDatesForPath("src/pages/about.astro")) {
    const pts = decayedPoints(d, POINTS.aboutCommit, now);
    if (pts > 0) {
      total += pts;
      mark(d);
    }
  }

  const score = Math.max(0, Math.min(100, Math.round(total)));
  return { score, lastActivity: mostRecent };
}

export function daysSince(date: Date | null, now = new Date()): number | null {
  if (!date) return null;
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / DAY_MS));
}

export function tendedLabel(days: number | null): string {
  if (days === null) return "Not tended yet";
  if (days === 0) return "Tended today";
  if (days === 1) return "Tended 1 day ago";
  return `Tended ${days} days ago`;
}
