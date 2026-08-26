import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { interviewService } from "@/lib/services/interviewService";
import { interviewEvaluationSchema } from "@/lib/validation/interview";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "recruitment.read");
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId") || undefined;

  const result = await interviewService.getEvaluations(candidateId);
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "recruitment.evaluate");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = interviewEvaluationSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid interview scorecard submission.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await interviewService.submitEvaluation(parseResult.data, auth.session);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to save interview evaluation in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/interviews Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while saving interview evaluation.", 500, undefined, requestId);
  }
}
