import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { interviewService } from "@/lib/services/interviewService";
import { interviewUpdateSchema } from "@/lib/validation/interview";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "recruitment.evaluate");
  if ("response" in auth) return auth.response;

  const interviewId = params.id;
  if (!interviewId) {
    return createErrorResponse("VALIDATION_ERROR", "Interview ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = interviewUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid interview update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await interviewService.updateEvaluation(interviewId, parseResult.data, auth.session);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update interview in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/interviews/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating interview.", 500, undefined, requestId);
  }
}
