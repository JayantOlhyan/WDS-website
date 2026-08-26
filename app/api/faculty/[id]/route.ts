import { NextRequest, NextResponse } from "next/server";
import { facultyRepository } from "@/lib/repositories/FacultyRepository";
import { updateFacultySchema } from "@/lib/validation/faculty";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const facultyId = params.id;

  const result = await facultyRepository.getById(facultyId);
  if (!result.success || !result.data) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "NOT_FOUND",
      "Faculty advisor not found or Notion offline.",
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
  const facultyId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = updateFacultySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid faculty update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await facultyRepository.update(facultyId, parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to update faculty in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/faculty/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating faculty.", 500, undefined, requestId);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const facultyId = params.id;

  const result = await facultyRepository.archive(facultyId);
  if (!result.success) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
      "Failed to archive faculty in Notion.",
      result.isOffline ? 503 : 500,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, message: "Faculty record archived successfully." }, { status: 200, headers: { "X-Request-ID": requestId } });
}
