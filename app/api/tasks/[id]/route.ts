import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { taskService } from "@/lib/services/taskService";
import { taskUpdateSchema } from "@/lib/validation/task";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const taskId = params.id;
  if (!taskId) {
    return createErrorResponse("VALIDATION_ERROR", "Task ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = taskUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid task update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await taskService.updateTask(taskId, parseResult.data, auth.session);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update task in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/tasks/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating task.", 500, undefined, requestId);
  }
}
