import { describe, it, expect } from "vitest";
import { interviewService } from "../lib/services/interviewService";

describe("Interview Service & Scoring Engine", () => {
  it("calculates accurate weighted score across all 4 evaluation pillars", () => {
    // Technical (35%) + Problem Solving (30%) + Communication (20%) + Team Fit (15%)
    const score = interviewService.computeWeightedScore({
      technicalScore: 8,      // 8 * 0.35 = 2.8
      problemSolvingScore: 9, // 9 * 0.30 = 2.7
      communicationScore: 7,  // 7 * 0.20 = 1.4
      teamFitScore: 8,        // 8 * 0.15 = 1.2
      // Total = 8.1
    });

    expect(score).toBe(8.1);
  });

  it("handles maximum perfect scores (10/10)", () => {
    const score = interviewService.computeWeightedScore({
      technicalScore: 10,
      problemSolvingScore: 10,
      communicationScore: 10,
      teamFitScore: 10,
    });

    expect(score).toBe(10);
  });

  it("handles baseline minimum scores (1/10)", () => {
    const score = interviewService.computeWeightedScore({
      technicalScore: 1,
      problemSolvingScore: 1,
      communicationScore: 1,
      teamFitScore: 1,
    });

    expect(score).toBe(1);
  });
});
