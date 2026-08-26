import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireMinimumRole } from "@/lib/auth";
import { taskService } from "@/lib/services/taskService";
import { createTaskSchema } from "@/lib/validation/task";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await taskService.getTasks();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "TEAM_LEAD");
  if ("response" in auth) return auth.response;

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

    const result = await taskService.createTask(parseResult.data, auth.session);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to create task in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/tasks Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating task.", 500, undefined, requestId);
  }
}
