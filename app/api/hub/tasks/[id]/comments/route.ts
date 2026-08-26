import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { generateRequestId } from "@/lib/errors";

export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

// In-memory persistent task comments store
const taskCommentsStore: TaskComment[] = [
  {
    id: "cm_01",
    taskId: "TSK-01",
    author: "Jayant",
    role: "ADMIN",
    content: "Initial responsive breakpoint verification completed on iPhone 15 & Pixel 8.",
    timestamp: "2026-08-27T02:00:00.000Z",
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const taskId = decodeURIComponent(params.id);
  const comments = taskCommentsStore.filter((c) => c.taskId === taskId);

  return NextResponse.json({ success: true, data: comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const taskId = decodeURIComponent(params.id);
  const requestId = generateRequestId();

  try {
    const body = await req.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Comment content cannot be empty.",
            requestId,
          },
        },
        { status: 400, headers: { "X-Request-ID": requestId } }
      );
    }

    const newComment: TaskComment = {
      id: `cm_${Date.now()}`,
      taskId,
      author: auth.session.username,
      role: auth.session.role,
      content,
      timestamp: new Date().toISOString(),
    };

    taskCommentsStore.push(newComment);

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "TASK_COMMENT_ADDED",
      resource: "Task",
      resourceId: taskId,
      details: { commentId: newComment.id, requestId },
    });

    return NextResponse.json(
      { success: true, data: newComment },
      { status: 201, headers: { "X-Request-ID": requestId } }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to post task comment.",
          requestId,
        },
      },
      { status: 500, headers: { "X-Request-ID": requestId } }
    );
  }
}
