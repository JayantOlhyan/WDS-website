import { NextRequest, NextResponse } from "next/server";
import { interviewsRepository } from "@/lib/repositories/InterviewsRepository";
import { createInterviewSchema } from "@/lib/validation/interviews";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);

  const candidateId = searchParams.get("candidateId") || searchParams.get("candidate") || undefined;
  const interviewer = searchParams.get("interviewer") || undefined;
  const round = searchParams.get("round") || undefined;
  const recommendation = searchParams.get("recommendation") || undefined;
  const date = searchParams.get("date") || undefined;

  const result = await interviewsRepository.getAll({
    candidateId,
    interviewer,
    round,
    recommendation,
    date,
  });

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Interviews database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createInterviewSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid interview scorecard submission.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await interviewsRepository.create(parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to save interview evaluation in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/interviews Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while saving interview evaluation.", 500, undefined, requestId);
  }
}
