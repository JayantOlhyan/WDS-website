import { NextRequest } from "next/server";

export type HubRole = "ADMIN" | "CORE_TEAM" | "TEAM_LEAD" | "MEMBER" | "VIEWER";

export interface HubUserSession {
  username: string;
  role: HubRole;
  wing?: string;
  issuedAt: number;
}

export const HUB_ROLES_HIERARCHY: Record<HubRole, number> = {
  ADMIN: 100,
  CORE_TEAM: 80,
  TEAM_LEAD: 60,
  MEMBER: 40,
  VIEWER: 20,
};

export const HUB_COOKIE_NAME = "wds_hub_session";

// Demo/Operational Access Keys for Society Wings
export const HUB_ACCESS_KEYS: Record<string, { username: string; role: HubRole; wing: string }> = {
  "wds-admin-2026": { username: "Jayant Olhyan", role: "ADMIN", wing: "President / Tech Lead" },
  "wds-core-2026": { username: "WDS Core Lead", role: "CORE_TEAM", wing: "Core Team" },
  "wds-tech-2026": { username: "Frontend Lead", role: "TEAM_LEAD", wing: "Technical Wing" },
  "wds-design-2026": { username: "UI/UX Lead", role: "TEAM_LEAD", wing: "Design Wing" },
  "wds-member-2026": { username: "Society Builder", role: "MEMBER", wing: "Member" },
};

/**
 * Encodes a session object into a compact base64 token
 */
export function encodeHubSession(session: HubUserSession): string {
  const jsonStr = JSON.stringify(session);
  return Buffer.from(jsonStr).toString("base64");
}

/**
 * Decodes and validates a session token
 */
export function decodeHubSession(token: string): HubUserSession | null {
  try {
    const jsonStr = Buffer.from(token, "base64").toString("utf-8");
    const session = JSON.parse(jsonStr) as HubUserSession;
    if (!session.username || !session.role) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to verify user session from Request Cookies
 */
export function getHubSessionFromRequest(req: NextRequest): HubUserSession | null {
  const cookie = req.cookies.get(HUB_COOKIE_NAME);
  if (!cookie?.value) return null;
  return decodeHubSession(cookie.value);
}

/**
 * Checks if a session role has at least the required role permission
 */
export function hasRequiredRole(session: HubUserSession | null, requiredRole: HubRole): boolean {
  if (!session) return false;
  const userLevel = HUB_ROLES_HIERARCHY[session.role] || 0;
  const requiredLevel = HUB_ROLES_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}
