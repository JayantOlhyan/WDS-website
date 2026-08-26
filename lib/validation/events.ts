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
  name: z.string().min(3, "Event name must be at least 3 characters").max(120).trim().optional(),
  title: z.string().min(3, "Event title must be at least 3 characters").max(120).trim().optional(),
  description: z.string().min(5, "Description must be at least 5 characters").max(3000).trim(),
  status: eventStageSchema.default("PLANNING"),
  stage: eventStageSchema.optional(),
  date: z.string().min(4, "Date is required").max(50).trim(),
  venue: z.string().min(2, "Venue is required").max(100).trim(),
  lead: z.string().min(2, "Lead is required").max(80).trim().default("WDS Events Lead"),
  projectId: z.string().max(100).trim().optional(),
  registrationUrl: z.string().url("Invalid URL").max(300).optional().or(z.literal("")),
  expectedAttendance: z.number().int().positive().default(50),
}).refine((data) => data.name || data.title, {
  message: "Either name or title is required",
  path: ["name"],
});

export const updateEventSchema = z.object({
  name: z.string().min(3).max(120).trim().optional(),
  title: z.string().min(3).max(120).trim().optional(),
  description: z.string().min(5).max(3000).trim().optional(),
  status: eventStageSchema.optional(),
  stage: eventStageSchema.optional(),
  date: z.string().min(4).max(50).trim().optional(),
  venue: z.string().min(2).max(100).trim().optional(),
  lead: z.string().min(2).max(80).trim().optional(),
  projectId: z.string().max(100).trim().optional(),
  registrationUrl: z.string().url().max(300).optional().or(z.literal("")),
  expectedAttendance: z.number().int().positive().optional(),
});

export const patchEventStageSchema = z.object({
  stage: eventStageSchema,
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PatchEventStageInput = z.infer<typeof patchEventStageSchema>;
