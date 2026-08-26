import { NextRequest, NextResponse } from "next/server";
import { projectsRepository } from "@/lib/repositories/ProjectsRepository";
import { createProjectSchema } from "@/lib/validation/projects";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET() {
  const requestId = generateRequestId();
  const result = await projectsRepository.getAll();

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Projects database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createProjectSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid project payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await projectsRepository.create(parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to create project in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/projects Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating project.", 500, undefined, requestId);
  }
}
