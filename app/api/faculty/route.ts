import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { facultyService } from "@/lib/services/facultyService";
import { createFacultySchema } from "@/lib/validation/faculty";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET() {
  const requestId = generateRequestId();
  const result = await facultyService.getFaculty();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "members.manage");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createFacultySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid faculty advisor payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await facultyService.createFaculty(parseResult.data, auth.session);
    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to record faculty advisor in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/faculty Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while recording faculty advisor.", 500, undefined, requestId);
  }
}
