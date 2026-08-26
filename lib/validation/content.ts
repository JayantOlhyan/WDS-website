import { z } from "zod";

export const contentPlatformSchema = z.enum(["INSTAGRAM", "LINKEDIN", "NEWSLETTER", "WEBSITE_BLOG"]);
export const contentTypeSchema = z.enum(["POST", "CAROUSEL", "REEL", "ARTICLE", "ANNOUNCEMENT"]);
export const contentStageSchema = z.enum(["IDEA", "DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);

export const createContentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150).trim(),
  platform: contentPlatformSchema,
  contentType: contentTypeSchema.default("POST"),
  stage: contentStageSchema.default("DRAFT"),
  author: z.string().min(2, "Author is required").max(80).trim().default("WDS Creator"),
  reviewer: z.string().max(80).trim().optional(),
  scheduledDate: z.string().max(50).optional(),
  caption: z.string().max(2000).optional(),
  assetUrl: z.string().url().max(500).optional(),
  project: z.string().max(80).optional(),
});

export const patchContentStageSchema = z.object({
  stage: contentStageSchema,
  reviewer: z.string().max(80).optional(),
  caption: z.string().max(2000).optional(),
});

export type CreateContentInput = z.infer<typeof createContentSchema>;
export type PatchContentStageInput = z.infer<typeof patchContentStageSchema>;
