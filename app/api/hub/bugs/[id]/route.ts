import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { bugUpdateSchema } from "@/lib/validation";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "TEAM_LEAD");
  if ("response" in auth) return auth.response;

  const bugId = params.id;
  if (!bugId) {
    return createErrorResponse("VALIDATION_ERROR", "Bug ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = bugUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid bug update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const updates = parseResult.data;
    const result = await bugRepository.updateBug(bugId, updates);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update bug in database.", 500, undefined, requestId);
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "BUG_MUTATED",
      resource: "Bug",
      resourceId: bugId,
      details: { ...updates, requestId },
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/hub/bugs/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server failure while updating bug.", 500, undefined, requestId);
  }
}
