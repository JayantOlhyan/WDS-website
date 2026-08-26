import { NextRequest, NextResponse } from "next/server";
import { candidatesRepository } from "@/lib/repositories/CandidatesRepository";
import { candidateApplicationSchema } from "@/lib/validation/candidates";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || undefined;
  const preferredWing = searchParams.get("preferredWing") || undefined;
  const search = searchParams.get("search") || undefined;

  const result = await candidatesRepository.getAll({ status, preferredWing, search });

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Candidates database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = candidateApplicationSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid candidate application submission.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await candidatesRepository.create(parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to submit candidate application in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/candidates Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while saving application.", 500, undefined, requestId);
  }
}
