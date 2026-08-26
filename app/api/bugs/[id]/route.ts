import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { bugService } from "@/lib/services/bugService";
import { bugUpdateSchema } from "@/lib/validation/bug";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "TEAM_LEAD");
  if ("response" in auth) return auth.response;

  const bugId = params.id;
  if (!bugId) {
    return createErrorResponse("VALIDATION_ERROR", "Bug ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = bugUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid bug update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await bugService.updateBug(bugId, parseResult.data, auth.session);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update bug in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/bugs/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating bug.", 500, undefined, requestId);
  }
}
