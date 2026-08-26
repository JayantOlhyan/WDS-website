import { z } from "zod";

export const contentPlatformSchema = z.enum(["INSTAGRAM", "LINKEDIN", "NEWSLETTER", "WEBSITE_BLOG"]);
export const contentTypeSchema = z.enum(["POST", "CAROUSEL", "REEL", "ARTICLE", "ANNOUNCEMENT"]);
export const contentStatusSchema = z.enum(["IDEA", "DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);

export const createContentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150).trim(),
  platform: contentPlatformSchema.default("INSTAGRAM"),
  type: contentTypeSchema.default("POST"),
  status: contentStatusSchema.default("DRAFT"),
  author: z.string().min(2, "Author is required").max(80).trim().default("WDS Content Lead"),
  projectId: z.string().max(100).optional(),
  eventId: z.string().max(100).optional(),
  publishDate: z.string().max(50).optional(),
  url: z.string().url("Invalid URL").max(500).optional().or(z.literal("")),
  caption: z.string().max(3000).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateContentSchema = createContentSchema.partial();

export const patchContentStageSchema = z.object({
  stage: contentStatusSchema,
});

export type CreateContentInput = z.infer<typeof createContentSchema>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;
export type PatchContentStageInput = z.infer<typeof patchContentStageSchema>;
