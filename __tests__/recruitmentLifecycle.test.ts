import { describe, it, expect } from "vitest";
import { isValidLifecycleTransition } from "../lib/repositories/RecruitmentRepository";

describe("Candidate Recruitment Lifecycle Transition Rules", () => {
  it("allows standard linear progression", () => {
    expect(isValidLifecycleTransition("RECEIVED", "SCREENING")).toBe(true);
    expect(isValidLifecycleTransition("SCREENING", "SHORTLISTED")).toBe(true);
    expect(isValidLifecycleTransition("SHORTLISTED", "INTERVIEW")).toBe(true);
    expect(isValidLifecycleTransition("INTERVIEW", "SELECTED")).toBe(true);
  });

  it("allows rejection from any intermediate stage", () => {
    expect(isValidLifecycleTransition("RECEIVED", "REJECTED")).toBe(true);
    expect(isValidLifecycleTransition("SCREENING", "REJECTED")).toBe(true);
    expect(isValidLifecycleTransition("SHORTLISTED", "REJECTED")).toBe(true);
    expect(isValidLifecycleTransition("INTERVIEW", "REJECTED")).toBe(true);
  });

  it("prevents jumping directly from RECEIVED to SELECTED without screening/interview", () => {
    expect(isValidLifecycleTransition("RECEIVED", "SELECTED", false)).toBe(false);
  });

  it("allows ADMIN role to override any state transition", () => {
    expect(isValidLifecycleTransition("RECEIVED", "SELECTED", true)).toBe(true);
  });

  it("allows reconsideration of REJECTED applicant back to SCREENING", () => {
    expect(isValidLifecycleTransition("REJECTED", "SCREENING")).toBe(true);
  });
});
