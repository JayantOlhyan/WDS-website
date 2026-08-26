import { describe, it, expect } from "vitest";
import { HUB_ROLES_HIERARCHY, HubRole } from "../lib/auth";

describe("Role-Based Access Control (RBAC) Matrix", () => {
  const checkRoleAccess = (userRole: HubRole, requiredRole: HubRole): boolean => {
    const userLevel = HUB_ROLES_HIERARCHY[userRole] || 0;
    const requiredLevel = HUB_ROLES_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
  };

  it("grants ADMIN role full access to all levels", () => {
    expect(checkRoleAccess("ADMIN", "ADMIN")).toBe(true);
    expect(checkRoleAccess("ADMIN", "CORE_TEAM")).toBe(true);
    expect(checkRoleAccess("ADMIN", "TEAM_LEAD")).toBe(true);
    expect(checkRoleAccess("ADMIN", "MEMBER")).toBe(true);
  });

  it("grants CORE_TEAM access to recruitment and task endpoints but not ADMIN-only", () => {
    expect(checkRoleAccess("CORE_TEAM", "CORE_TEAM")).toBe(true);
    expect(checkRoleAccess("CORE_TEAM", "TEAM_LEAD")).toBe(true);
    expect(checkRoleAccess("CORE_TEAM", "MEMBER")).toBe(true);
    expect(checkRoleAccess("CORE_TEAM", "ADMIN")).toBe(false);
  });

  it("restricts TEAM_LEAD from accessing recruitment records", () => {
    expect(checkRoleAccess("TEAM_LEAD", "TEAM_LEAD")).toBe(true);
    expect(checkRoleAccess("TEAM_LEAD", "MEMBER")).toBe(true);
    expect(checkRoleAccess("TEAM_LEAD", "CORE_TEAM")).toBe(false);
    expect(checkRoleAccess("TEAM_LEAD", "ADMIN")).toBe(false);
  });

  it("restricts MEMBER role to basic operations only", () => {
    expect(checkRoleAccess("MEMBER", "MEMBER")).toBe(true);
    expect(checkRoleAccess("MEMBER", "TEAM_LEAD")).toBe(false);
    expect(checkRoleAccess("MEMBER", "CORE_TEAM")).toBe(false);
    expect(checkRoleAccess("MEMBER", "ADMIN")).toBe(false);
  });
});
