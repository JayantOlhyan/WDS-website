import { z } from "zod";

export const createMeetingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150).trim(),
  date: z.string().min(4, "Date required").max(50).trim(),
  participants: z.array(z.string().max(80)).min(1, "At least one participant required"),
  agenda: z.string().min(5, "Agenda required").max(2000).trim(),
  decisions: z.string().max(3000).trim().optional(),
  actionItems: z.string().max(3000).trim().optional(),
  project: z.string().max(80).trim().optional(),
  followUpDate: z.string().max(50).optional(),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
