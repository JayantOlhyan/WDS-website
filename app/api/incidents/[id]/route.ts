import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { incidentService } from "@/lib/services/incidentService";
import { updateIncidentSchema } from "@/lib/validation/incident";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "system.incidents.manage");
  if ("response" in auth) return auth.response;

  const incidentId = params.id;
  if (!incidentId) {
    return createErrorResponse("VALIDATION_ERROR", "Incident ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = updateIncidentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid incident update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const updated = await incidentService.updateIncidentStatus(incidentId, parseResult.data, auth.session);
    if (!updated) {
      return createErrorResponse("NOT_FOUND", "Incident not found.", 404, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/incidents/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating incident.", 500, undefined, requestId);
  }
}
