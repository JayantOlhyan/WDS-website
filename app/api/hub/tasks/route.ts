import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireMinimumRole } from "@/lib/auth";
import { taskRepository } from "@/lib/repositories/TaskRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { taskCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await taskRepository.getTasks();
  if (!result.success && result.isOffline) {
    return NextResponse.json(
      { success: false, data: [], code: "DATABASE_OFFLINE", message: "Tasks database is offline or not configured." },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requireMinimumRole(req, "TEAM_LEAD");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = taskCreateSchema.safeParse(rawBody);

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

    const taskData = parseResult.data;
    const result = await taskRepository.createTask({
      id: `TSK-${Date.now()}`,
      ...taskData,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "PERSISTENCE_FAILED", message: "Failed to persist task to database." },
        { status: 500 }
      );
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "TASK_CREATED",
      resource: "Task",
      resourceId: result.data.id,
      details: { title: result.data.title, project: result.data.project },
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/hub/tasks Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
