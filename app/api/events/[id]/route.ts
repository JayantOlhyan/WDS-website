import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { eventService } from "@/lib/services/eventService";
import { patchEventStageSchema } from "@/lib/validation/event";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "events.manage");
  if ("response" in auth) return auth.response;

  const eventId = params.id;
  if (!eventId) {
    return createErrorResponse("VALIDATION_ERROR", "Event ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = patchEventStageSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid event stage payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const updated = await eventService.updateEventStage(eventId, parseResult.data, auth.session);
    if (!updated) {
      return createErrorResponse("NOT_FOUND", "Event not found.", 404, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/events/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating event.", 500, undefined, requestId);
  }
}
