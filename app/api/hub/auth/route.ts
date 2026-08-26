import { NextRequest, NextResponse } from "next/server";
import {
  HUB_ACCESS_KEYS,
  HUB_COOKIE_NAME,
  encodeHubSession,
  getHubSessionFromRequest,
  HubUserSession,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getHubSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({ authenticated: true, session }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessKey } = body;

    if (!accessKey || typeof accessKey !== "string") {
      return NextResponse.json(
        { success: false, error: "Access key is required." },
        { status: 400 }
      );
    }

    const keyConfig = HUB_ACCESS_KEYS[accessKey.trim().toLowerCase()];
    if (!keyConfig) {
      return NextResponse.json(
        { success: false, error: "Invalid access key. Access denied." },
        { status: 401 }
      );
    }

    const sessionData: HubUserSession = {
      username: keyConfig.username,
      role: keyConfig.role,
      wing: keyConfig.wing,
      issuedAt: Date.now(),
    };

    const token = encodeHubSession(sessionData);

    const response = NextResponse.json(
      { success: true, session: sessionData },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: HUB_COOKIE_NAME,
      value: token,
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
      { success: false, error: "Authentication system error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out." }, { status: 200 });
  response.cookies.delete(HUB_COOKIE_NAME);
  return response;
}
