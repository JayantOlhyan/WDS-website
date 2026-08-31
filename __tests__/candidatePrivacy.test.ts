import { describe, it, expect } from "vitest";
import { hasPermission } from "../lib/permissions";

describe("Candidate Data Privacy & Access Isolation", () => {
  it("strictly isolates candidate evaluations from MEMBER role", () => {
    expect(hasPermission("MEMBER", "recruitment.read")).toBe(false);
    expect(hasPermission("MEMBER", "recruitment.evaluate")).toBe(false);
    expect(hasPermission("MEMBER", "recruitment.update")).toBe(false);
    expect(hasPermission("MEMBER", "recruitment.export")).toBe(false);
  });

  it("strictly isolates candidate evaluations from TEAM_LEAD role", () => {
    expect(hasPermission("TEAM_LEAD", "recruitment.read")).toBe(false);
    expect(hasPermission("TEAM_LEAD", "recruitment.evaluate")).toBe(false);
    expect(hasPermission("TEAM_LEAD", "recruitment.export")).toBe(false);
  });

  it("allows candidate evaluation exclusively to CORE_TEAM and ADMIN", () => {
    expect(hasPermission("CORE_TEAM", "recruitment.read")).toBe(true);
    expect(hasPermission("CORE_TEAM", "recruitment.evaluate")).toBe(true);
    expect(hasPermission("ADMIN", "recruitment.read")).toBe(true);
    expect(hasPermission("ADMIN", "recruitment.export")).toBe(true);
  });
});
