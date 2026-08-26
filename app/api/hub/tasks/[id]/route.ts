import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { taskRepository } from "@/lib/repositories/TaskRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { taskUpdateSchema } from "@/lib/validation";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "MEMBER");
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

    const updates = parseResult.data;
    const result = await taskRepository.updateTask(taskId, updates);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update task in database.", 500, undefined, requestId);
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "TASK_UPDATED",
      resource: "Task",
      resourceId: taskId,
      details: { ...updates, requestId },
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/hub/tasks/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server failure while updating task.", 500, undefined, requestId);
  }
}
