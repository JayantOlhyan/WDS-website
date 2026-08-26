import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { eventService } from "@/lib/services/eventService";
import { createEventSchema } from "@/lib/validation/event";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET() {
  const events = await eventService.getEvents();
  return NextResponse.json({ success: true, data: events }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "events.manage");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createEventSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid event payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const event = await eventService.createEvent(parseResult.data, auth.session);
    return NextResponse.json({ success: true, data: event }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/events Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating event.", 500, undefined, requestId);
  }
}
