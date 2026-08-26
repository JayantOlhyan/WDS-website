import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "RECEIVED",
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
]);

export const branchSchema = z.enum([
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "AIDS",
  "AIML",
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Computer Science & Engineering (Shift 2)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical & Automation Engineering (MAE)",
  "Other / Applied Sciences",
]);

export const candidateApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(80).trim(),
  rollNumber: z.string().min(5, "Roll number / Enrollment number is required").max(20).trim(),
  email: z.string().email("Valid email address is required").trim(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).trim(),
  branch: z.string().min(2).max(80).trim(),
  section: z.string().min(1, "Section is required").max(20).trim(),
  year: z.string().max(20).trim().optional().default("1st Year"),
  preferredWing: z.string().min(2, "Preferred wing is required").max(80).trim(),
  experienceLevel: z.string().min(2).max(80).trim().default("Beginner"),
  timeCommitment: z.string().min(2).max(80).trim().default("4-8 hrs"),
  githubUrl: z.string().url().max(300).optional().or(z.literal("")),
  linkedinUrl: z.string().url().max(300).optional().or(z.literal("")),
  portfolioUrl: z.string().url().max(300).optional().or(z.literal("")),
  notes: z.string().max(2000).trim().optional(),
});

export const updateCandidateSchema = z.object({
  status: applicationStatusSchema.optional(),
  preferredWing: z.string().max(80).optional(),
  notes: z.string().max(2000).optional(),
});

export type CandidateApplicationInput = z.infer<typeof candidateApplicationSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
