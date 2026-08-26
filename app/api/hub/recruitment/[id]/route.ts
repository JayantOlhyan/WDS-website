import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import {
  recruitmentRepository,
  isValidLifecycleTransition,
} from "@/lib/repositories/RecruitmentRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { recruitmentStatusUpdateSchema } from "@/lib/validation";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "CORE_TEAM");
  if ("response" in auth) return auth.response;

  const candidateId = params.id;
  if (!candidateId) {
    return createErrorResponse("VALIDATION_ERROR", "Candidate ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = recruitmentStatusUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid recruitment status update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const { status: targetStatus, notes, interviewer } = parseResult.data;

    // Update Notion candidate record
    const result = await recruitmentRepository.updateApplicationStatus(
      candidateId,
      targetStatus,
      notes,
      interviewer
    );

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to update candidate in database.", 500, undefined, requestId);
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "CANDIDATE_STATUS_UPDATED",
      resource: "CandidateApplication",
      resourceId: candidateId,
      details: { newStatus: targetStatus, notes, interviewer, requestId },
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/hub/recruitment/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server failure while updating candidate.", 500, undefined, requestId);
  }
}
