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

export const interviewEvaluationSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required").trim(),
  candidateName: z.string().min(2, "Candidate name is required").max(100).trim(),
  interviewer: z.string().min(2, "Interviewer name is required").max(100).trim(),
  round: interviewRoundSchema.default("ROUND_1_TECHNICAL"),
  technicalScore: z.number().min(1).max(10),
  communicationScore: z.number().min(1).max(10),
  problemSolvingScore: z.number().min(1).max(10),
  teamFitScore: z.number().min(1).max(10),
  overallScore: z.number().min(1).max(10).optional(),
  strengths: z.string().min(3, "Strengths are required").max(1000).trim(),
  weaknesses: z.string().min(3, "Weaknesses are required").max(1000).trim(),
  questionsAsked: z.string().max(2000).trim().optional(),
  interviewNotes: z.string().max(3000).trim().optional(),
  recommendation: interviewRecommendationSchema,
  decisionStatus: interviewDecisionSchema.default("PENDING"),
  interviewDate: z.string().min(4, "Interview date is required").trim(),
});

export const interviewUpdateSchema = interviewEvaluationSchema.partial();

export type InterviewEvaluationInput = z.infer<typeof interviewEvaluationSchema>;
export type InterviewUpdateInput = z.infer<typeof interviewUpdateSchema>;
