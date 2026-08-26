import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { incidentService } from "@/lib/services/incidentService";
import { createIncidentSchema } from "@/lib/validation/incident";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "system.health.read");
  if ("response" in auth) return auth.response;

  const incidents = await incidentService.getIncidents();
  return NextResponse.json({ success: true, data: incidents }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "system.incidents.manage");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createIncidentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid incident payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const incident = await incidentService.createIncident(parseResult.data, auth.session);
    return NextResponse.json({ success: true, data: incident }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/incidents Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating incident.", 500, undefined, requestId);
  }
}
