import { NextRequest, NextResponse } from "next/server";
import {
  HUB_COOKIE_NAME,
  getHubSessionFromRequest,
  validateAccessKey,
} from "@/lib/auth";
import { sessionStore } from "@/lib/sessionStore";
import { generateRequestId } from "@/lib/errors";

// In-memory brute force protection tracking failed login attempts by client IP
interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}
const loginRateLimitMap = new Map<string, RateLimitRecord>();

function checkLoginRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    loginRateLimitMap.set(ip, { attempts: 1, resetAt: now + 5 * 60 * 1000 });
    return { allowed: true, remaining: 4 };
  }

  if (record.attempts >= 5) {
    return { allowed: false, remaining: 0 };
  }

  record.attempts += 1;
  return { allowed: true, remaining: 5 - record.attempts };
}

function clearLoginRateLimit(ip: string): void {
  loginRateLimitMap.delete(ip);
}

export async function GET(req: NextRequest) {
  const session = getHubSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json(
    {
      authenticated: true,
      session: {
        username: session.username,
        role: session.role,
        wing: session.wing,
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateCheck = checkLoginRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many failed login attempts. Please wait 5 minutes before retrying.",
          requestId,
        },
      },
      { status: 429, headers: { "X-Request-ID": requestId, "Retry-After": "300" } }
    );
  }

  try {
    const body = await req.json();
    const { accessKey } = body;

    if (!accessKey || typeof accessKey !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Access key is required.",
            requestId,
          },
        },
        { status: 400, headers: { "X-Request-ID": requestId } }
      );
    }

    const authResult = validateAccessKey(accessKey);
    if (!authResult) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid access key. Access denied.",
            requestId,
          },
        },
        { status: 401, headers: { "X-Request-ID": requestId } }
      );
    }

    // Login succeeded -> clear failed rate limit counter for this IP
    clearLoginRateLimit(clientIp);

    // Create tamper-proof signed server session
    const session = sessionStore.createSession(
      authResult.username,
      authResult.role,
      authResult.wing
    );

    const response = NextResponse.json(
      {
        success: true,
        session: {
          username: session.username,
          role: session.role,
          wing: session.wing,
        },
      },
      { status: 200, headers: { "X-Request-ID": requestId } }
    );

    // Set secure HTTP-only cookie containing signed token
    response.cookies.set({
      name: HUB_COOKIE_NAME,
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("[Hub Auth POST Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Authentication server error.",
          requestId,
        },
      },
      { status: 500, headers: { "X-Request-ID": requestId } }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const cookie = req.cookies.get(HUB_COOKIE_NAME);
  if (cookie?.value) {
    sessionStore.deleteSession(cookie.value);
  }

  const response = NextResponse.json({ success: true, message: "Logged out." }, { status: 200 });
  response.cookies.delete(HUB_COOKIE_NAME);
  return response;
}
