import { z } from "zod";

export const eventStageSchema = z.enum([
  "IDEA",
  "PLANNING",
  "ANNOUNCED",
  "REGISTRATION",
  "LIVE",
  "COMPLETED",
  "ARCHIVED",
]);

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120).trim(),
  description: z.string().min(5, "Description must be at least 5 characters").max(2000).trim(),
  stage: eventStageSchema.default("PLANNING"),
  date: z.string().min(4, "Date is required").max(50).trim(),
  venue: z.string().min(2, "Venue is required").max(100).trim(),
  lead: z.string().min(2, "Lead is required").max(80).trim().default("WDS Lead"),
  expectedAttendance: z.number().int().positive().default(50),
  registrationLink: z.string().url().max(300).optional(),
});

export const patchEventStageSchema = z.object({
  stage: eventStageSchema,
  notes: z.string().max(1000).trim().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type PatchEventStageInput = z.infer<typeof patchEventStageSchema>;
