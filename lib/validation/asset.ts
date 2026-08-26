import { z } from "zod";

export const assetCategorySchema = z.enum(["LOGOS", "POSTERS", "BRAND", "DOCUMENTS", "TEMPLATES"]);
export const assetFormatSchema = z.enum(["PNG", "SVG", "PDF", "FIGMA", "MD"]);

export const createAssetSchema = z.object({
  name: z.string().min(2, "Asset name required").max(100).trim(),
  category: assetCategorySchema,
  format: assetFormatSchema,
  url: z.string().url("Valid asset URL required").max(500).trim(),
  project: z.string().max(80).trim().optional(),
  owner: z.string().min(2, "Owner required").max(80).trim().default("WDS Design"),
  notes: z.string().max(500).trim().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
