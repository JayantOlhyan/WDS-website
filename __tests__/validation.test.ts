import { describe, it, expect } from "vitest";
import { recruitmentApplicationSchema } from "../lib/validation";

describe("Recruitment Application Zod Schema Validation", () => {
  const validPayload = {
    fullName: "Aarav Sharma",
    enrollmentNo: "01215002724",
    branch: "Computer Science & Engineering (CSE)",
    section: "CSE-1",
    collegeEmail: "aarav.sharma@msit.in",
    phone: "9876543210",
    interests: ["Next.js", "TypeScript"],
    experienceLevel: "Some Projects",
    preferredTeam: "Frontend Wing",
    timeCommitment: "4–8 hours / week",
    whyWds: "I want to build real digital platforms with WDS.",
    learningGoal: "Master full-stack Next.js and open source.",
    scenarioResponse: "I would analyze the bug report, reproduce locally, and open a PR.",
  };

  it("passes validation with complete valid payload", () => {
    const result = recruitmentApplicationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("fails when enrollment number is not exactly 11 digits", () => {
    const invalidPayload = { ...validPayload, enrollmentNo: "12345" };
    const result = recruitmentApplicationSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("fails when email is invalid", () => {
    const invalidPayload = { ...validPayload, collegeEmail: "not-an-email" };
    const result = recruitmentApplicationSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("fails when honeypot website_hp is populated by a spam bot", () => {
    const botPayload = { ...validPayload, website_hp: "https://spam.com" };
    const result = recruitmentApplicationSchema.safeParse(botPayload);
    expect(result.success).toBe(false);
  });

  it("fails when branch is not in allowed branch list", () => {
    const invalidPayload = { ...validPayload, branch: "NonExistent Branch" };
    const result = recruitmentApplicationSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});
