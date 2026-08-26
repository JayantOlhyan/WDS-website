import { z } from "zod";

export const incidentSeveritySchema = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
export const incidentStatusSchema = z.enum(["DETECTED", "INVESTIGATING", "IDENTIFIED", "RESOLVED"]);

export const createIncidentSchema = z.object({
  title: z.string().min(3, "Title required").max(150).trim().default("Service Disruption"),
  website: z.string().min(2, "Website target required").max(200).trim(),
  severity: incidentSeveritySchema.default("HIGH"),
  assignedTo: z.string().max(80).trim().default("Technical Lead"),
  notes: z.string().min(3, "Incident description/notes required").max(2000).trim(),
  httpStatus: z.number().int().optional(),
});

export const updateIncidentSchema = z.object({
  status: incidentStatusSchema,
  notes: z.string().max(2000).trim().optional(),
  rootCause: z.string().max(2000).trim().optional(),
  resolution: z.string().max(2000).trim().optional(),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>;
