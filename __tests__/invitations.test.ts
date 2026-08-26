import { describe, it, expect } from "vitest";
import { memberRepository } from "../lib/repositories/MemberRepository";

describe("Single-Use Member Invitation System", () => {
  it("creates a single-use onboarding invitation token", async () => {
    const inv = await memberRepository.createInvitation("MEMBER", "Technical Wing", "Jayant");
    expect(inv.token).toMatch(/^wds_inv_[0-9a-f]{32}$/);
    expect(inv.status).toBe("PENDING");
    expect(new Date(inv.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it("accepts a valid pending invitation and creates an active member", async () => {
    const inv = await memberRepository.createInvitation("TEAM_LEAD", "Design & UI/UX Wing", "Admin");
    const member = await memberRepository.acceptInvitation(inv.token, "New Designer", "designer@msit.in");

    expect(member).not.toBeNull();
    expect(member?.name).toBe("New Designer");
    expect(member?.role).toBe("TEAM_LEAD");
    expect(member?.wing).toBe("Design & UI/UX Wing");

    // Re-using the same token must fail
    const reused = await memberRepository.acceptInvitation(inv.token, "Another User", "another@msit.in");
    expect(reused).toBeNull();
  });

  it("revokes an active invitation token", async () => {
    const inv = await memberRepository.createInvitation("MEMBER", "Content Wing", "Admin");
    const revoked = await memberRepository.revokeInvitation(inv.id);
    expect(revoked).toBe(true);

    const accepted = await memberRepository.acceptInvitation(inv.token, "Fail User", "fail@msit.in");
    expect(accepted).toBeNull();
  });
});
