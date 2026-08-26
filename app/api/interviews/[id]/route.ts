import { NextRequest, NextResponse } from "next/server";
import { interviewsRepository } from "@/lib/repositories/InterviewsRepository";
import { updateInterviewSchema } from "@/lib/validation/interviews";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const interviewId = params.id;

  const result = await interviewsRepository.getById(interviewId);
  if (!result.success || !result.data) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "NOT_FOUND",
      "Interview evaluation not found or Notion offline.",
      result.isOffline ? 503 : 404,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const interviewId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = updateInterviewSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid interview update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await interviewsRepository.update(interviewId, parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to update interview in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/interviews/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating interview.", 500, undefined, requestId);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const interviewId = params.id;

  const result = await interviewsRepository.archive(interviewId);
  if (!result.success) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
      "Failed to archive interview in Notion.",
      result.isOffline ? 503 : 500,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, message: "Interview evaluation archived successfully." }, { status: 200, headers: { "X-Request-ID": requestId } });
}
