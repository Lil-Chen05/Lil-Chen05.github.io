import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.enum(["swe", "ai", "nlp", "school"])),
    featured: z.boolean().optional(),
    links: z
      .object({
        github: z.string().url().optional(),
        demo: z.string().url().optional(),
        devpost: z.string().url().optional(),
        paper: z.string().url().optional(),
      })
      .optional(),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/courses" }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    term: z.string(),
    rating: z.number().min(0).max(5).optional(),
  }),
});

export const collections = { notes, blog, projects, courses };
