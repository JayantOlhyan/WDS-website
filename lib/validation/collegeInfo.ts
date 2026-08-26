import { z } from "zod";

export const collegeCategorySchema = z.enum([
  "ACADEMICS",
  "ADMINISTRATION",
  "FACILITIES",
  "SOCIETY_POLICY",
  "AFFILIATION",
  "GENERAL",
]);

export const updateCollegeInfoSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  category: collegeCategorySchema.optional(),
  value: z.string().min(1, "Value cannot be empty").max(5000).trim().optional(),
  source: z.string().max(300).trim().optional(),
});

export type UpdateCollegeInfoInput = z.infer<typeof updateCollegeInfoSchema>;
