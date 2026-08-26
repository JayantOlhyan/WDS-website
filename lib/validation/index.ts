import { z } from "zod";

export * from "./tasks";
export * from "./projects";
export * from "./candidates";
export * from "./interviews";
export * from "./bugs";
export * from "./events";
export * from "./content";
export * from "./assets";
export * from "./faculty";
export * from "./resources";
export * from "./collegeInfo";

// Compatibility aliases
import { createTaskSchema, updateTaskSchema } from "./tasks";
import { createBugSchema, updateBugSchema } from "./bugs";

export const taskCreateSchema = createTaskSchema;
export const taskUpdateSchema = updateTaskSchema;
export const bugCreateSchema = createBugSchema;
export const bugUpdateSchema = updateBugSchema;

// Operations & Society Schemas for backward compatibility
export const createMemberSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().trim(),
  role: z.enum(["CORE", "LEAD", "MEMBER", "ALUMNI", "ADMIN"]).default("MEMBER"),
  wing: z.enum(["Technical Wing", "Design Wing", "Editorial Wing", "Core Operations"]).default("Technical Wing"),
  github: z.string().max(200).optional(),
  linkedin: z.string().max(200).optional(),
});

export const createMeetingSchema = z.object({
  title: z.string().min(3).max(150).trim(),
  date: z.string().min(4).max(50).trim(),
  participants: z.array(z.string()).min(1),
  agenda: z.string().min(3).max(2000).trim(),
  minutes: z.string().max(5000).optional(),
  actionItems: z.array(z.string()).optional(),
});

export const createIncidentSchema = z.object({
  website: z.string().min(3).max(200).trim(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  notes: z.string().max(2000).optional(),
  httpStatus: z.number().int().optional(),
});

export const createDocumentationSchema = z.object({
  title: z.string().min(3).max(150).trim(),
  category: z.enum(["SOP", "ARCHITECTURE", "RUNBOOK", "POLICY", "GUIDE"]),
  content: z.string().min(10).max(10000).trim(),
  author: z.string().min(2).max(80).trim(),
});
