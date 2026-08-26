import { z } from "zod";

export const bugSeveritySchema = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
export const bugPrioritySchema = z.enum(["P0", "P1", "P2", "P3"]);
export const bugStatusSchema = z.enum(["OPEN", "TRIAGED", "IN_PROGRESS", "RESOLVED", "DUPLICATE", "INVALID"]);

export const createBugSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150).trim(),
  description: z.string().max(2000).trim().optional(),
  website: z.string().min(2, "Website or portal is required").max(200).trim(),
  severity: bugSeveritySchema.default("MEDIUM"),
  priority: bugPrioritySchema.default("P2"),
  status: bugStatusSchema.default("OPEN"),
  reporter: z.string().min(2, "Reporter handle is required").max(80).trim(),
  externalId: z.string().max(100).trim().optional(),
  assignedTo: z.string().max(80).trim().optional(),
  reproductionSteps: z.string().max(2000).trim().optional(),
  browserDevice: z.string().max(200).trim().optional(),
  screenshotUrl: z.string().url().max(500).optional(),
});

export const bugUpdateSchema = z.object({
  title: z.string().min(3).max(150).trim().optional(),
  description: z.string().max(2000).trim().optional(),
  severity: bugSeveritySchema.optional(),
  priority: bugPrioritySchema.optional(),
  status: bugStatusSchema.optional(),
  assignedTo: z.string().max(80).trim().optional(),
  resolutionNotes: z.string().max(2000).trim().optional(),
  resolvedDate: z.string().max(50).optional(),
});

export const bugHuntWebhookSchema = z.object({
  bugId: z.string().min(1, "bugId is required").max(100).trim(),
  title: z.string().min(3).max(150).trim(),
  website: z.string().min(2).max(200).trim(),
  severity: bugSeveritySchema,
  reporterHandle: z.string().min(2).max(80).trim(),
  description: z.string().max(2000).trim().optional(),
  reproductionSteps: z.string().max(2000).trim().optional(),
});

export type CreateBugInput = z.infer<typeof createBugSchema>;
export type BugUpdateInput = z.infer<typeof bugUpdateSchema>;
export type BugHuntWebhookInput = z.infer<typeof bugHuntWebhookSchema>;
