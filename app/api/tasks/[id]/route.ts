import { NextRequest, NextResponse } from "next/server";
import { tasksRepository } from "@/lib/repositories/TasksRepository";
import { updateTaskSchema } from "@/lib/validation/tasks";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const taskId = params.id;

  const result = await tasksRepository.getById(taskId);
  if (!result.success || !result.data) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "NOT_FOUND",
      "Task not found or Notion offline.",
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
  const taskId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = updateTaskSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid task update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await tasksRepository.update(taskId, parseResult.data);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to update task in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/tasks/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating task.", 500, undefined, requestId);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const taskId = params.id;

  const result = await tasksRepository.archive(taskId);
  if (!result.success) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
      "Failed to archive task in Notion.",
      result.isOffline ? 503 : 500,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, message: "Task archived successfully." }, { status: 200, headers: { "X-Request-ID": requestId } });
}
