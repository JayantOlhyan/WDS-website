import { z } from "zod";

export const projectStatusSchema = z.enum(["ACTIVE", "MAINTENANCE", "COMPLETED", "PLANNING"]);
export const projectWingSchema = z.enum(["Technical Wing", "Design Wing", "Editorial Wing", "Core Operations"]);

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(100).trim(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").max(2000).trim(),
  status: projectStatusSchema.default("ACTIVE"),
  type: z.string().max(50).optional().default("WEB_APPLICATION"),
  lead: z.string().min(2, "Lead is required").max(80).trim().default("WDS Tech Lead"),
  wing: projectWingSchema.default("Technical Wing"),
  websiteUrl: z.string().url("Invalid website URL").max(300).optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").max(300).optional().or(z.literal("")),
  techStack: z.array(z.string().max(40)).max(15).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
