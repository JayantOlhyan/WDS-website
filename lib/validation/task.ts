import { z } from "zod";

export const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
]);

export const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export const createTaskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters").max(150).trim(),
  description: z.string().max(1000).trim().optional(),
  status: taskStatusSchema.default("TODO"),
  priority: taskPrioritySchema.default("MEDIUM"),
  project: z.string().min(1, "Project is required").max(100).trim(),
  assignee: z.string().min(1, "Assignee is required").max(100).trim(),
  dueDate: z.string().max(50).trim().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  blockedBy: z.string().max(150).trim().optional(),
  relatedBugId: z.string().max(100).trim().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(3).max(150).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  project: z.string().max(100).trim().optional(),
  assignee: z.string().max(100).trim().optional(),
  dueDate: z.string().max(50).trim().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  blockedBy: z.string().max(150).trim().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
