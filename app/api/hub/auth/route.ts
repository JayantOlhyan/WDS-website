import { NextRequest, NextResponse } from "next/server";
import {
  HUB_COOKIE_NAME,
  getHubSessionFromRequest,
  validateAccessKey,
} from "@/lib/auth";
import { sessionStore } from "@/lib/sessionStore";

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
  try {
    const body = await req.json();
    const { accessKey } = body;

    if (!accessKey || typeof accessKey !== "string") {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "Access key is required." },
        { status: 400 }
      );
    }

    const authResult = validateAccessKey(accessKey);
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Invalid access key. Access denied." },
        { status: 401 }
      );
    }

    // Create opaque server session
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
      { status: 200 }
    );

    // Set secure HTTP-only cookie with opaque session ID only
    response.cookies.set({
      name: HUB_COOKIE_NAME,
      value: session.sessionId,
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
      { success: false, error: "INTERNAL_ERROR", message: "Authentication server error." },
      { status: 500 }
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
