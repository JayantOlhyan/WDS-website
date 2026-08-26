import { NextRequest, NextResponse } from "next/server";
import { projectsRepository } from "@/lib/repositories/ProjectsRepository";
import { updateProjectSchema } from "@/lib/validation/projects";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const projectId = params.id;

  const result = await projectsRepository.getById(projectId);
  if (!result.success || !result.data) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "NOT_FOUND",
      "Project not found or Notion offline.",
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
  const projectId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = updateProjectSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid project update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await projectsRepository.update(projectId, parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to update project in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/projects/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating project.", 500, undefined, requestId);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const projectId = params.id;

  const result = await projectsRepository.archive(projectId);
  if (!result.success) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
      "Failed to archive project in Notion.",
      result.isOffline ? 503 : 500,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, message: "Project archived successfully." }, { status: 200, headers: { "X-Request-ID": requestId } });
}
