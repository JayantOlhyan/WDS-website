import { z } from "zod";

export const projectStatusSchema = z.enum(["ACTIVE", "MAINTENANCE", "COMPLETED", "PLANNING"]);
export const projectWingSchema = z.enum(["Technical Wing", "Design Wing", "Editorial Wing", "Core Operations"]);

export const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").trim(),
  description: z.string().min(5, "Description must be at least 5 characters").max(1000).trim(),
  status: projectStatusSchema.default("ACTIVE"),
  lead: z.string().min(2, "Lead is required").max(80).trim(),
  wing: projectWingSchema.default("Technical Wing"),
  websiteUrl: z.string().url().max(300).optional(),
  githubUrl: z.string().url().max(300).optional(),
  techStack: z.array(z.string().max(40)).max(15).optional(),
  deploymentPlatform: z.enum(["VERCEL", "NETLIFY", "AWS", "GITHUB_PAGES", "COLLEGE_SERVER"]).default("VERCEL"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
