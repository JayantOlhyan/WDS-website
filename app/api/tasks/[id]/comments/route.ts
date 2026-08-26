import { NextRequest, NextResponse } from "next/server";
import { tasksRepository } from "@/lib/repositories/TasksRepository";
import { taskCommentSchema } from "@/lib/validation/tasks";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const taskId = params.id;

  const comments = await tasksRepository.getComments(taskId);
  return NextResponse.json({ success: true, data: comments }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const taskId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = taskCommentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid comment payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const { comment, author, type } = parseResult.data;
    const result = await tasksRepository.addComment(taskId, comment, author, type);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to add comment to task.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.comment }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/tasks/[id]/comments Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while adding comment.", 500, undefined, requestId);
  }
}
