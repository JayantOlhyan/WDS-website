import { describe, it, expect } from "vitest";
import { hasPermission } from "../lib/permissions";

describe("Fine-Grained Permissions Matrix", () => {
  it("grants ADMIN all system, recruitment, and management permissions", () => {
    expect(hasPermission("ADMIN", "recruitment.export")).toBe(true);
    expect(hasPermission("ADMIN", "system.audit.read")).toBe(true);
    expect(hasPermission("ADMIN", "members.invite")).toBe(true);
    expect(hasPermission("ADMIN", "tasks.delete")).toBe(true);
  });

  it("grants CORE_TEAM recruitment and event management but not full system export", () => {
    expect(hasPermission("CORE_TEAM", "recruitment.read")).toBe(true);
    expect(hasPermission("CORE_TEAM", "recruitment.evaluate")).toBe(true);
    expect(hasPermission("CORE_TEAM", "events.manage")).toBe(true);
    expect(hasPermission("CORE_TEAM", "system.export")).toBe(false);
  });

  it("restricts TEAM_LEAD from candidate recruitment evaluations", () => {
    expect(hasPermission("TEAM_LEAD", "tasks.create")).toBe(true);
    expect(hasPermission("TEAM_LEAD", "bugs.triage")).toBe(true);
    expect(hasPermission("TEAM_LEAD", "recruitment.read")).toBe(false);
    expect(hasPermission("TEAM_LEAD", "recruitment.evaluate")).toBe(false);
  });

  it("restricts MEMBER to basic reads and assigned task updates only", () => {
    expect(hasPermission("MEMBER", "tasks.read")).toBe(true);
    expect(hasPermission("MEMBER", "tasks.update")).toBe(true);
    expect(hasPermission("MEMBER", "tasks.create")).toBe(false);
    expect(hasPermission("MEMBER", "recruitment.read")).toBe(false);
    expect(hasPermission("MEMBER", "system.audit.read")).toBe(false);
  });
});
