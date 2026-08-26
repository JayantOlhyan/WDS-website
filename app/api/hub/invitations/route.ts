import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { memberRepository } from "@/lib/repositories/MemberRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { z } from "zod";

const createInvitationSchema = z.object({
  role: z.enum(["ADMIN", "CORE_TEAM", "TEAM_LEAD", "MEMBER"]),
  wing: z.string().min(2).max(80).trim(),
});

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "members.invite");
  if ("response" in auth) return auth.response;

  const invitations = await memberRepository.getInvitations();
  return NextResponse.json({ success: true, data: invitations }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requirePermission(req, "members.invite");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createInvitationSchema.safeParse(rawBody);

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

    const { role, wing } = parseResult.data;

    // Prevent non-admins from inviting ADMIN accounts
    if (role === "ADMIN" && auth.session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "FORBIDDEN", message: "Only ADMINs can issue ADMIN invitations." },
        { status: 403 }
      );
    }

    const invitation = await memberRepository.createInvitation(
      role,
      wing,
      auth.session.username
    );

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "MEMBER_INVITATION_CREATED",
      resource: "Invitation",
      resourceId: invitation.id,
      details: { role, wing, expiresAt: invitation.expiresAt },
    });

    return NextResponse.json({ success: true, data: invitation }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/hub/invitations Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
