import { NextRequest, NextResponse } from "next/server";
import { bugsRepository } from "@/lib/repositories/BugsRepository";
import { createBugSchema } from "@/lib/validation/bugs";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);

  const severity = searchParams.get("severity") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const status = searchParams.get("status") || undefined;
  const project = searchParams.get("project") || undefined;
  const assignee = searchParams.get("assignee") || undefined;
  const source = searchParams.get("source") || undefined;
  const search = searchParams.get("search") || undefined;

  const result = await bugsRepository.getAll({
    severity,
    priority,
    status,
    project,
    assignee,
    source,
    search,
  });

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Bugs database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createBugSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid bug report payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await bugsRepository.create(parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to report bug in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/bugs Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while reporting bug.", 500, undefined, requestId);
  }
}
