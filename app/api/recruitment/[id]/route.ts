import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { recruitmentService } from "@/lib/services/recruitmentService";
import { recruitmentStatusUpdateSchema } from "@/lib/validation/recruitment";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "CORE_TEAM");
  if ("response" in auth) return auth.response;

  const candidateId = params.id;
  if (!candidateId) {
    return createErrorResponse("VALIDATION_ERROR", "Candidate ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = recruitmentStatusUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid recruitment status update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await recruitmentService.updateStatus(candidateId, parseResult.data, auth.session);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update candidate in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/recruitment/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating candidate.", 500, undefined, requestId);
  }
}
