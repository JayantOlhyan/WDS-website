import { NextRequest, NextResponse } from "next/server";
import { tasksRepository } from "@/lib/repositories/TasksRepository";
import { createTaskSchema } from "@/lib/validation/tasks";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const project = searchParams.get("project") || undefined;
  const assignee = searchParams.get("assignee") || undefined;
  const dueDate = searchParams.get("dueDate") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const result = await tasksRepository.getAll({
    status,
    priority,
    project,
    assignee,
    dueDate,
    search,
    page,
    limit,
  });

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Tasks database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json(
    {
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        hasMore: Boolean(result.hasMore),
      },
    },
    { status: 200, headers: { "X-Request-ID": requestId } }
  );
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createTaskSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid task payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await tasksRepository.create(parseResult.data);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to create task in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/tasks Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating task.", 500, undefined, requestId);
  }
}
