import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { bugUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireMinimumRole(req, "TEAM_LEAD");
  if ("response" in auth) return auth.response;

  const bugId = params.id;
  if (!bugId) {
    return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: "Bug ID is required." }, { status: 400 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = bugUpdateSchema.safeParse(rawBody);

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
    const result = await bugRepository.updateBug(bugId, updates);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "PERSISTENCE_FAILED", message: "Failed to update bug in database." },
        { status: 500 }
      );
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "BUG_MUTATED",
      resource: "Bug",
      resourceId: bugId,
      details: updates,
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/hub/bugs/[id] Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
