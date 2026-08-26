import { describe, it, expect } from "vitest";
import {
  interviewEvaluationSchema,
  createTaskSchema,
  createBugSchema,
  candidateApplicationSchema,
  createEventSchema,
  createContentSchema,
  createMemberSchema,
  createAssetSchema,
  createMeetingSchema,
  createIncidentSchema,
  createFacultySchema,
  createDocumentationSchema,
} from "../lib/validation";

describe("Unified Zod Validation Layer", () => {
  it("validates valid interview evaluation scorecard", () => {
    const valid = interviewEvaluationSchema.safeParse({
      candidateId: "cand-123",
      candidateName: "Aarav Sharma",
      interviewer: "Jayant Olhyan",
      round: "ROUND_1_TECHNICAL",
      technicalScore: 9,
      communicationScore: 8,
      problemSolvingScore: 9,
      teamFitScore: 8,
      strengths: "Excellent React and CSS understanding",
      weaknesses: "Less experience with PostgreSQL",
      recommendation: "STRONG_HIRE",
      decisionStatus: "PENDING",
      interviewDate: "2026-08-27",
    });

    expect(valid.success).toBe(true);
  });

  it("rejects interview scores exceeding range 1-10", () => {
    const invalid = interviewEvaluationSchema.safeParse({
      candidateId: "cand-123",
      candidateName: "Aarav Sharma",
      interviewer: "Jayant Olhyan",
      round: "ROUND_1_TECHNICAL",
      technicalScore: 15, // Out of bounds
      communicationScore: 8,
      problemSolvingScore: 9,
      teamFitScore: 8,
      strengths: "Great",
      weaknesses: "None",
      recommendation: "HIRE",
      interviewDate: "2026-08-27",
    });

    expect(invalid.success).toBe(false);
  });

  it("validates task creation schema with tags", () => {
    const valid = createTaskSchema.safeParse({
      title: "Build centralized Notion properties extractor",
      status: "TODO",
      priority: "HIGH",
      project: "WDS Main Website",
      assignee: "Jayant Olhyan",
      tags: ["Notion", "Backend", "Architecture"],
    });

    expect(valid.success).toBe(true);
  });

  it("validates incident declaration schema", () => {
    const valid = createIncidentSchema.safeParse({
      website: "https://msit.in",
      severity: "CRITICAL",
      notes: "Gateway timeout on student portal",
      httpStatus: 504,
    });

    expect(valid.success).toBe(true);
  });

  it("validates meeting creation schema", () => {
    const valid = createMeetingSchema.safeParse({
      title: "Sprint 4 Planning & Recruitment Strategy",
      date: "2026-08-27",
      participants: ["Jayant Olhyan", "Core Tech Lead", "Design Lead"],
      agenda: "Review Bug Hunt queue and interview schedules",
    });

    expect(valid.success).toBe(true);
  });
});
