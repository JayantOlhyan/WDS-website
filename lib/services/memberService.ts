import { memberRepository, SocietyMember, InvitationToken } from "../repositories/MemberRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateMemberInput } from "../validation/member";
import { HubRole } from "../auth";

export class MemberService {
  public async getMembers(): Promise<SocietyMember[]> {
    return memberRepository.getMembers();
  }

  public async getInvitations(): Promise<InvitationToken[]> {
    return memberRepository.getInvitations();
  }

  public async createInvitation(
    role: HubRole,
    wing: string,
    createdBy: string
  ): Promise<InvitationToken> {
    const invitation = await memberRepository.createInvitation(role, wing, createdBy);

    await auditRepository.logEvent({
      actor: createdBy,
      role: "ADMIN",
      action: "MEMBER_INVITATION_CREATED",
      resource: "Invitation",
      resourceId: invitation.id,
      details: { role, wing },
    });

    return invitation;
  }

  public async revokeInvitation(id: string, actor: string): Promise<boolean> {
    const success = await memberRepository.revokeInvitation(id);
    if (success) {
      await auditRepository.logEvent({
        actor,
        role: "ADMIN",
        action: "MEMBER_INVITATION_REVOKED",
        resource: "Invitation",
        resourceId: id,
        details: {},
      });
    }
    return success;
  }
}

export const memberService = new MemberService();
