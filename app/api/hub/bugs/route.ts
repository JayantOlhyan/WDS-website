import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireMinimumRole } from "@/lib/auth";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { bugCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await bugRepository.getBugs();
  if (!result.success && result.isOffline) {
    return NextResponse.json(
      { success: false, data: [], code: "DATABASE_OFFLINE", message: "Bugs database is offline or not configured." },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requireMinimumRole(req, "MEMBER");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = bugCreateSchema.safeParse(rawBody);

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

    const bugData = parseResult.data;
    const result = await bugRepository.createBug({
      id: `BUG-${Date.now()}`,
      date: new Date().toISOString(),
      ...bugData,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "PERSISTENCE_FAILED", message: "Failed to persist bug to database." },
        { status: 500 }
      );
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "BUG_REPORTED",
      resource: "Bug",
      resourceId: result.data.id,
      details: { title: result.data.title, page: result.data.page },
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/hub/bugs Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
