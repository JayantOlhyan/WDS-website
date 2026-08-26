import { NextRequest, NextResponse } from "next/server";
import { collegeInfoRepository } from "@/lib/repositories/CollegeInfoRepository";
import { updateCollegeInfoSchema } from "@/lib/validation/collegeInfo";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const infoId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = updateCollegeInfoSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid college info update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await collegeInfoRepository.update(infoId, parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to update college info in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/college-info/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating college info.", 500, undefined, requestId);
  }
}
