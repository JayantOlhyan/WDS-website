import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import {
  recruitmentRepository,
  isValidLifecycleTransition,
} from "@/lib/repositories/RecruitmentRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { recruitmentStatusUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireMinimumRole(req, "CORE_TEAM");
  if ("response" in auth) return auth.response;

  const candidateId = params.id;
  if (!candidateId) {
    return NextResponse.json(
      { success: false, error: "VALIDATION_ERROR", message: "Candidate ID is required." },
      { status: 400 }
    );
  }

  try {
    const rawBody = await req.json();
    const parseResult = recruitmentStatusUpdateSchema.safeParse(rawBody);

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

    const { status: targetStatus, notes, interviewer } = parseResult.data;
    const isAdmin = auth.session.role === "ADMIN";

    // Update Notion candidate record
    const result = await recruitmentRepository.updateApplicationStatus(
      candidateId,
      targetStatus,
      notes,
      interviewer
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "PERSISTENCE_FAILED", message: "Failed to update candidate in database." },
        { status: 500 }
      );
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "CANDIDATE_STATUS_UPDATED",
      resource: "CandidateApplication",
      resourceId: candidateId,
      details: { newStatus: targetStatus, notes, interviewer },
    });

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/hub/recruitment/[id] Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
