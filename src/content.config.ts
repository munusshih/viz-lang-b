import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const weeks = defineCollection({
  // Load Markdown and MDX files in the `src/content/weeks/` directory.
  loader: glob({ base: "./src/content/weeks", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(), // Optional description that can include markdown
      longDescription: z.string().optional(), // Optional long description with markdown support
      lecture: z.string().optional(), // Optional lecture content in markdown format
      // Optional flag to indicate this markdown file should NOT be generated as a standalone page.
      // If set to `false` the content can still be rendered in listings or embedded views.
      page: z.boolean().optional(),
      week: z.number(), // Week number for ordering
      image: z.string().optional(), // Optional image path
      imageMeta: z.string().optional(), // Optional image metadata/caption
      heroImage: image().optional(),
    }),
});

const projects = defineCollection({
  // Load Markdown and MDX files in the `src/content/projects/` directory.
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  // Optional frontmatter for ordering/titles.
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    page: z.boolean().optional(),
  }),
});

export const collections = { weeks, projects };
