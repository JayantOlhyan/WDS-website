import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { meetingService } from "@/lib/services/meetingService";
import { createMeetingSchema } from "@/lib/validation/meeting";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await meetingService.getMeetings();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createMeetingSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid meeting payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await meetingService.createMeeting(parseResult.data, auth.session);
    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to record meeting in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/meetings Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while recording meeting.", 500, undefined, requestId);
  }
}
