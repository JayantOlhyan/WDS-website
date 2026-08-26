import { describe, it, expect } from "vitest";
import { hasPermission, Permission, ROLE_PERMISSIONS } from "../lib/permissions";
import { HubRole } from "../lib/auth";

describe("RBAC Authorization Matrix Comprehensive Black-Box Audit", () => {
  it("ensures MEMBER has only operational contributor permissions", () => {
    const role: HubRole = "MEMBER";
    expect(hasPermission(role, "tasks.read")).toBe(true);
    expect(hasPermission(role, "tasks.update")).toBe(true);
    expect(hasPermission(role, "bugs.read")).toBe(true);
    expect(hasPermission(role, "events.read")).toBe(true);
    expect(hasPermission(role, "content.read")).toBe(true);
    expect(hasPermission(role, "content.create")).toBe(true);

    // Forbidden for MEMBER
    expect(hasPermission(role, "tasks.create")).toBe(false);
    expect(hasPermission(role, "tasks.delete")).toBe(false);
    expect(hasPermission(role, "recruitment.read")).toBe(false);
    expect(hasPermission(role, "recruitment.export")).toBe(false);
    expect(hasPermission(role, "system.audit.read")).toBe(false);
    expect(hasPermission(role, "members.manage")).toBe(false);
    expect(hasPermission(role, "system.export")).toBe(false);
  });

  it("ensures TEAM_LEAD can triage and manage events/content but cannot view private recruitment scorecards", () => {
    const role: HubRole = "TEAM_LEAD";
    expect(hasPermission(role, "tasks.update")).toBe(true);
    expect(hasPermission(role, "bugs.triage")).toBe(true);
    expect(hasPermission(role, "events.manage")).toBe(true);
    expect(hasPermission(role, "content.review")).toBe(true);

    // Forbidden for TEAM_LEAD
    expect(hasPermission(role, "recruitment.read")).toBe(false);
    expect(hasPermission(role, "recruitment.evaluate")).toBe(false);
    expect(hasPermission(role, "recruitment.export")).toBe(false);
    expect(hasPermission(role, "system.export")).toBe(false);
  });

  it("ensures CORE_TEAM has full recruitment pipeline access", () => {
    const role: HubRole = "CORE_TEAM";
    expect(hasPermission(role, "recruitment.read")).toBe(true);
    expect(hasPermission(role, "recruitment.evaluate")).toBe(true);
    expect(hasPermission(role, "recruitment.update")).toBe(true);
    expect(hasPermission(role, "recruitment.export")).toBe(true);
    expect(hasPermission(role, "members.invite")).toBe(true);
  });

  it("ensures ADMIN has complete system governance and handover capabilities", () => {
    const role: HubRole = "ADMIN";
    const allPermissions = ROLE_PERMISSIONS.ADMIN;
    for (const p of allPermissions) {
      expect(hasPermission(role, p)).toBe(true);
    }
  });
});
