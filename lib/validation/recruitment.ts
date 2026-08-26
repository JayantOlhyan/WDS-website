import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "RECEIVED",
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
]);

export const branchSchema = z.enum(["CSE", "IT", "ECE", "EEE", "AIDS", "AIML"]);

export const candidateApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(80).trim(),
  enrollmentNo: z.string().min(8, "Enrollment number is required").max(15).trim(),
  branch: branchSchema,
  section: z.string().min(1, "Section is required").max(10).trim(),
  collegeEmail: z.string().email("Valid email address is required").trim(),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15).trim(),
  preferredTeam: z.string().min(2, "Preferred team is required").max(50).trim(),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  timeCommitment: z.enum(["<4 hrs", "4-8 hrs", "8-12 hrs", "12+ hrs"]),
  notes: z.string().max(1000).trim().optional(),
});

export const recruitmentStatusUpdateSchema = z.object({
  status: applicationStatusSchema,
  notes: z.string().max(1000).trim().optional(),
  interviewer: z.string().max(80).trim().optional(),
});

export type CandidateApplicationInput = z.infer<typeof candidateApplicationSchema>;
export type RecruitmentStatusUpdateInput = z.infer<typeof recruitmentStatusUpdateSchema>;
