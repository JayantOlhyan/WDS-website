import { z } from "zod";

export const assetCategorySchema = z.enum(["LOGOS", "POSTERS", "BRAND", "DOCUMENTS", "TEMPLATES"]);
export const assetTypeSchema = z.enum(["PNG", "SVG", "PDF", "FIGMA", "MD", "OTHER"]);

export const createAssetSchema = z.object({
  name: z.string().min(2, "Asset name required").max(100).trim(),
  category: assetCategorySchema.default("BRAND"),
  type: assetTypeSchema.default("PNG"),
  url: z.string().url("Valid asset URL required").max(500).trim(),
  owner: z.string().min(2, "Owner required").max(80).trim().default("WDS Design"),
  version: z.string().max(20).trim().optional().default("1.0"),
  description: z.string().max(2000).trim().optional(),
  projectId: z.string().max(100).trim().optional(),
  eventId: z.string().max(100).trim().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
