import { z } from "zod";

export const resourceTypeSchema = z.enum([
  "DOCUMENTATION",
  "API_KEY",
  "DESIGN_SYSTEM",
  "INFRASTRUCTURE",
  "EXTERNAL_TOOL",
  "GUIDELINE",
]);

export const createResourceSchema = z.object({
  name: z.string().min(2, "Resource name required").max(100).trim(),
  type: resourceTypeSchema.default("DOCUMENTATION"),
  url: z.string().url("Valid resource URL required").max(500).trim(),
  description: z.string().max(2000).trim().optional(),
  owner: z.string().min(2, "Owner required").max(80).trim().default("WDS Core"),
  projectId: z.string().max(100).trim().optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
