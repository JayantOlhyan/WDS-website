import { z } from "zod";

export const interviewRoundSchema = z.enum([
  "ROUND_1_TECHNICAL",
  "ROUND_2_HR_CULTURE",
  "ROUND_3_FINAL",
]);

export const interviewRecommendationSchema = z.enum([
  "STRONG_HIRE",
  "HIRE",
  "LEAN_HIRE",
  "LEAN_REJECT",
  "REJECT",
]);

export const interviewDecisionSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
]);

export const createInterviewSchema = z.object({
  candidateId: z.string().max(100).trim().optional(),
  candidateName: z.string().min(2, "Candidate name is required").max(100).trim(),
  interviewer: z.string().min(2, "Interviewer name is required").max(100).trim(),
  round: interviewRoundSchema.default("ROUND_1_TECHNICAL"),
  date: z.string().min(4, "Interview date is required").trim().optional(),
  interviewDate: z.string().min(4).trim().optional(),
  technicalScore: z.number().min(1).max(10),
  communicationScore: z.number().min(1).max(10),
  problemSolvingScore: z.number().min(1).max(10),
  teamFitScore: z.number().min(1).max(10),
  overallScore: z.number().min(1).max(10).optional(),
  strengths: z.string().min(2, "Strengths required").max(2000).trim(),
  weaknesses: z.string().min(2, "Weaknesses required").max(2000).trim(),
  questionsAsked: z.string().max(2000).trim().optional(),
  recommendation: interviewRecommendationSchema.default("LEAN_HIRE"),
  decisionStatus: interviewDecisionSchema.default("PENDING"),
  notes: z.string().max(3000).trim().optional(),
});

export const interviewEvaluationSchema = createInterviewSchema;
export const updateInterviewSchema = createInterviewSchema.partial();

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
