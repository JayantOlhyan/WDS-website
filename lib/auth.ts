import { NextRequest, NextResponse } from "next/server";
import { sessionStore, ServerSession } from "./sessionStore";

export type HubRole = "ADMIN" | "CORE_TEAM" | "TEAM_LEAD" | "MEMBER";

export const HUB_ROLES_HIERARCHY: Record<HubRole, number> = {
  ADMIN: 100,
  CORE_TEAM: 80,
  TEAM_LEAD: 60,
  MEMBER: 40,
};

export const HUB_COOKIE_NAME = "wds_hub_session";

export interface HubUserSession {
  username: string;
  role: HubRole;
  wing: string;
}

export interface HubAuthResult {
  username: string;
  role: HubRole;
  wing: string;
}

/**
 * Validates credentials against environment variables with safe development defaults.
 */
export function validateAccessKey(key: string): HubAuthResult | null {
  if (!key || typeof key !== "string") return null;
  const trimmed = key.trim();

  const isDevOrTest = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
  const adminKey = process.env.HUB_ADMIN_KEY || (isDevOrTest ? "wds-admin-2026" : undefined);
  const coreKey = process.env.HUB_CORE_KEY || (isDevOrTest ? "wds-core-2026" : undefined);
  const leadKey = process.env.HUB_LEAD_KEY || (isDevOrTest ? "wds-tech-2026" : undefined);
  const memberKey = process.env.HUB_MEMBER_KEY || (isDevOrTest ? "wds-member-2026" : undefined);

  if (adminKey && trimmed === adminKey) {
    return { username: "Jayant Olhyan", role: "ADMIN", wing: "President / Tech Lead" };
  }
  if (coreKey && trimmed === coreKey) {
    return { username: "Core Lead", role: "CORE_TEAM", wing: "Core Team" };
  }
  if (leadKey && trimmed === leadKey) {
    return { username: "Tech Wing Lead", role: "TEAM_LEAD", wing: "Technical Wing" };
  }
  if (memberKey && trimmed === memberKey) {
    return { username: "Society Builder", role: "MEMBER", wing: "Member" };
  }

  return null;
}

/**
 * Retrieves and validates the server-side session from request cookie.
 */
export function getHubSessionFromRequest(req: NextRequest): ServerSession | null {
  const cookie = req.cookies.get(HUB_COOKIE_NAME);
  if (!cookie?.value) return null;
  return sessionStore.getSession(cookie.value);
}

/**
 * Enforces valid session presence. Returns 401 if missing or invalid.
 */
export function requireSession(req: NextRequest): { session: ServerSession } | { response: NextResponse } {
  const session = getHubSessionFromRequest(req);
  if (!session) {
    return {
      response: NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Valid authenticated Hub session required." },
        { status: 401 }
      ),
    };
  }
  return { session };
}

/**
 * Enforces exact role or minimum role requirement. Returns 403 if insufficient.
 */
export function requireMinimumRole(
  req: NextRequest,
  minRole: HubRole
): { session: ServerSession } | { response: NextResponse } {
  const authResult = requireSession(req);
  if ("response" in authResult) return authResult;

  const userLevel = HUB_ROLES_HIERARCHY[authResult.session.role] || 0;
  const requiredLevel = HUB_ROLES_HIERARCHY[minRole] || 0;

  if (userLevel < requiredLevel) {
    return {
      response: NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN",
          message: `Insufficient privileges. Minimum role required: ${minRole}`,
        },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

/**
 * Enforces role membership in allowed role set. Returns 403 if not in list.
 */
export function requireRole(
  req: NextRequest,
  allowedRoles: HubRole[]
): { session: ServerSession } | { response: NextResponse } {
  const authResult = requireSession(req);
  if ("response" in authResult) return authResult;

  if (!allowedRoles.includes(authResult.session.role)) {
    return {
      response: NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN",
          message: `Forbidden. Role must be one of: ${allowedRoles.join(", ")}`,
        },
        { status: 403 }
      ),
    };
  }

  return authResult;
}
