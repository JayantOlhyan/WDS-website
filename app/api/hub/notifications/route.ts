import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { notificationRepository } from "@/lib/repositories/NotificationRepository";

export async function GET(req: NextRequest) {
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const notifications = await notificationRepository.getNotifications();
  return NextResponse.json({ success: true, data: notifications }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  await notificationRepository.markAllRead();
  return NextResponse.json({ success: true, message: "All notifications marked as read." }, { status: 200 });
}
