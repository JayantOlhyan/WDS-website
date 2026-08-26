import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { taskRepository } from "@/lib/repositories/TaskRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { taskUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireMinimumRole(req, "MEMBER");
  if ("response" in auth) return auth.response;

  const taskId = params.id;
  if (!taskId) {
    return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: "Task ID is required." }, { status: 400 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = taskUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          details: parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        },
        { status: 400 }
      );
    }

    const updates = parseResult.data;
    const result = await taskRepository.updateTask(taskId, updates);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "PERSISTENCE_FAILED", message: "Failed to update task in database." },
        { status: 500 }
      );
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "TASK_UPDATED",
      resource: "Task",
      resourceId: taskId,
      details: updates,
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/hub/tasks/[id] Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
