import { HubRole } from "./auth";

export type Permission =
  // Tasks
  | "tasks.read"
  | "tasks.create"
  | "tasks.update"
  | "tasks.delete"
  // Bugs
  | "bugs.read"
  | "bugs.create"
  | "bugs.triage"
  | "bugs.resolve"
  // Recruitment
  | "recruitment.read"
  | "recruitment.update"
  | "recruitment.evaluate"
  | "recruitment.export"
  // Projects
  | "projects.read"
  | "projects.manage"
  // Events
  | "events.read"
  | "events.manage"
  // Content
  | "content.read"
  | "content.create"
  | "content.review"
  | "content.publish"
  // Assets
  | "assets.read"
  | "assets.manage"
  // Members & Invitations
  | "members.read"
  | "members.invite"
  | "members.manage"
  // System & Health
  | "system.health.read"
  | "system.incidents.manage"
  | "system.audit.read"
  | "system.export";

export const ROLE_PERMISSIONS: Record<HubRole, Permission[]> = {
  ADMIN: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "tasks.delete",
    "bugs.read",
    "bugs.create",
    "bugs.triage",
    "bugs.resolve",
    "recruitment.read",
    "recruitment.update",
    "recruitment.evaluate",
    "recruitment.export",
    "projects.read",
    "projects.manage",
    "events.read",
    "events.manage",
    "content.read",
    "content.create",
    "content.review",
    "content.publish",
    "assets.read",
    "assets.manage",
    "members.read",
    "members.invite",
    "members.manage",
    "system.health.read",
    "system.incidents.manage",
    "system.audit.read",
    "system.export",
  ],
  CORE_TEAM: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "bugs.read",
    "bugs.create",
    "bugs.triage",
    "bugs.resolve",
    "recruitment.read",
    "recruitment.update",
    "recruitment.evaluate",
    "recruitment.export",
    "projects.read",
    "projects.manage",
    "events.read",
    "events.manage",
    "content.read",
    "content.create",
    "content.review",
    "content.publish",
    "assets.read",
    "assets.manage",
    "members.read",
    "members.invite",
    "system.health.read",
    "system.incidents.manage",
    "system.audit.read",
  ],
  TEAM_LEAD: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "bugs.read",
    "bugs.create",
    "bugs.triage",
    "bugs.resolve",
    "projects.read",
    "events.read",
    "events.manage",
    "content.read",
    "content.create",
    "content.review",
    "assets.read",
    "assets.manage",
    "members.read",
    "system.health.read",
    "system.incidents.manage",
  ],
  MEMBER: [
    "tasks.read",
    "tasks.update", // toggle assigned tasks
    "bugs.read",
    "bugs.create",
    "projects.read",
    "events.read",
    "content.read",
    "content.create",
    "assets.read",
    "members.read",
    "system.health.read",
  ],
};

/**
 * Checks if a given role has the specified permission
 */
export function hasPermission(role: HubRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
