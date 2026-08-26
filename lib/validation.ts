import { z } from "zod";

export * from "./validation/index";

export const ALLOWED_BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Computer Science & Engineering (Shift 2)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical & Automation Engineering (MAE)",
  "Other / Applied Sciences",
] as const;

export const EXPERIENCE_LEVELS = [
  "Complete Beginner",
  "Basic Knowledge",
  "Some Projects",
  "Comfortable",
  "Real-world",
] as const;

export const TIME_COMMITMENTS = [
  "2–4 hours / week",
  "4–8 hours / week",
  "8–12 hours / week",
  "12+ hours / week",
] as const;

export const WINGS = [
  "Technical Wing",
  "Design & UI/UX Wing",
  "Content & Editorial Wing",
  "Events & Operations Wing",
] as const;

export const TASK_PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

export const BUG_SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
export const BUG_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export const RECRUITMENT_STAGES = [
  "RECEIVED",
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
] as const;

// 1. Recruitment Application Submission Schema
export const recruitmentApplicationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(80, "Full Name must not exceed 80 characters")
    .trim(),
  enrollmentNo: z
    .string()
    .regex(/^[0-9]{11}$/, "Enrollment Number must be exactly 11 digits")
    .trim(),
  branch: z.enum(ALLOWED_BRANCHES),
  section: z
    .string()
    .min(1, "Section/Shift is required")
    .max(20, "Section must not exceed 20 characters")
    .trim(),
  collegeEmail: z
    .string()
    .email("Please provide a valid email address")
    .max(120, "Email must not exceed 120 characters")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be a valid 10-digit mobile number")
    .trim(),
  interests: z
    .array(z.string().max(40))
    .min(1, "Please select at least one technical or creative interest")
    .max(10, "You can select up to 10 interests"),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  githubUrl: z
    .string()
    .max(200, "URL too long")
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\//.test(val), {
      message: "GitHub URL must start with http:// or https://",
    }),
  linkedinUrl: z
    .string()
    .max(200, "URL too long")
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\//.test(val), {
      message: "LinkedIn URL must start with http:// or https://",
    }),
  portfolioUrl: z
    .string()
    .max(200, "URL too long")
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\//.test(val), {
      message: "Portfolio URL must start with http:// or https://",
    }),
  projectLinks: z.string().max(500, "Project links must not exceed 500 characters").optional(),
  whyWds: z
    .string()
    .min(10, "Please share why you want to join WDS (at least 10 characters)")
    .max(1000, "Your response must not exceed 1000 characters")
    .trim(),
  learningGoal: z
    .string()
    .min(5, "Please share your learning goal (at least 5 characters)")
    .max(500, "Learning goal must not exceed 500 characters")
    .trim(),
  scenarioResponse: z
    .string()
    .min(10, "Please share your approach to the scenario (at least 10 characters)")
    .max(1000, "Response must not exceed 1000 characters")
    .trim(),
  timeCommitment: z.enum(TIME_COMMITMENTS),
  preferredTeam: z.enum(WINGS),
  website_hp: z.string().max(0, "Bot submission detected").optional(),
});

export type RecruitmentApplicationInput = z.infer<typeof recruitmentApplicationSchema>;

// 2. Candidate Lifecycle Status Update Schema
export const recruitmentStatusUpdateSchema = z.object({
  status: z.enum(RECRUITMENT_STAGES),
  notes: z.string().max(500).optional(),
  interviewer: z.string().max(80).optional(),
  interviewDate: z.string().max(80).optional(),
});
export type RecruitmentStatusUpdateInput = z.infer<typeof recruitmentStatusUpdateSchema>;

// 3. Task Creation Schema
export const taskCreateSchema = z.object({
  title: z.string().min(3).max(120).trim(),
  project: z.string().min(2).max(80).trim().default("General"),
  priority: z.enum(TASK_PRIORITIES).default("MEDIUM"),
  assignee: z.string().max(80).trim().default("Unassigned"),
  dueDate: z.string().max(50).trim().default("Next Sprint"),
  status: z.enum(TASK_STATUSES).default("PENDING"),
});
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;

// 4. Bug Creation Schema
export const bugCreateSchema = z.object({
  title: z.string().min(3).max(150).trim(),
  page: z.string().min(1).max(200).trim(),
  severity: z.enum(BUG_SEVERITIES).default("MEDIUM"),
  status: z.enum(BUG_STATUSES).default("OPEN"),
  reporter: z.string().max(80).trim().default("anonymous_hunter"),
});
export type BugCreateInput = z.infer<typeof bugCreateSchema>;

// 7. Bug Hunt Webhook Ingestion Schema
export const bugHuntWebhookPayloadSchema = z.object({
  bugId: z.string().min(1).max(50),
  title: z.string().min(3).max(150).trim(),
  website: z.string().min(1).max(200).trim(),
  severity: z.enum(BUG_SEVERITIES).default("MEDIUM"),
  reporterHandle: z.string().max(80).trim().default("bug_hunter"),
  description: z.string().max(1000).optional(),
  timestamp: z.number().optional(),
});
export type BugHuntWebhookPayload = z.infer<typeof bugHuntWebhookPayloadSchema>;
