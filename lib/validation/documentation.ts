import { z } from "zod";

export const docCategorySchema = z.enum(["SOP", "ONBOARDING", "HANDOVER", "TECH_GUIDE", "POLICY"]);

export const createDocumentationSchema = z.object({
  title: z.string().min(3, "Title required").max(150).trim(),
  category: docCategorySchema.default("SOP"),
  wing: z.string().min(2).max(80).trim().default("All Wings"),
  author: z.string().min(2).max(80).trim().default("WDS Leadership"),
  docLink: z.string().url().max(300).optional(),
  contentMarkdown: z.string().max(10000).trim().optional(),
});

export type CreateDocumentationInput = z.infer<typeof createDocumentationSchema>;
