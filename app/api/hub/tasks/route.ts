import { NextRequest, NextResponse } from "next/server";
import { getHubSessionFromRequest, hasRequiredRole } from "@/lib/auth";
import { fetchNotionTasks, createNotionTask } from "@/lib/notion/tasks";
import { TaskItem } from "@/lib/hub/types";

export async function GET(req: NextRequest) {
  const session = getHubSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Hub session required." }, { status: 401 });
  }

  const { tasks, source } = await fetchNotionTasks();
  return NextResponse.json({ success: true, tasks, source }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = getHubSessionFromRequest(req);
  if (!session || !hasRequiredRole(session, "TEAM_LEAD")) {
    return NextResponse.json(
      { error: "Forbidden. Insufficient role permissions to create tasks." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as TaskItem;
    if (!body.title) {
      return NextResponse.json({ error: "Task title is required." }, { status: 400 });
    }

    const created = await createNotionTask(body);
    return NextResponse.json(
      { success: true, persistedToNotion: created, task: body },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[Hub Tasks POST Error]:", err);
    return NextResponse.json({ error: "Failed to process task." }, { status: 500 });
  }
}
