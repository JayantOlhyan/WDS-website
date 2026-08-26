import crypto from "crypto";
import { HubRole } from "@/lib/auth";

export interface SocietyMember {
  id: string;
  name: string;
  email: string;
  role: HubRole;
  wing: string;
  status: "ACTIVE" | "SUSPENDED" | "ALUMNI";
  joinedDate: string;
  lastActive?: string;
}

export interface InvitationToken {
  id: string;
  token: string;
  role: HubRole;
  wing: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
}

class MemoryMemberRepository {
  private members: SocietyMember[] = [
    {
      id: "MEM-001",
      name: "Jayant Olhyan",
      email: "president@msit.in",
      role: "ADMIN",
      wing: "President / Tech Lead",
      status: "ACTIVE",
      joinedDate: "2024-08-01",
      lastActive: new Date().toISOString(),
    },
    {
      id: "MEM-002",
      name: "Core Tech Lead",
      email: "tech@wdsmsit.in",
      role: "CORE_TEAM",
      wing: "Technical Wing",
      status: "ACTIVE",
      joinedDate: "2024-08-15",
      lastActive: new Date().toISOString(),
    },
    {
      id: "MEM-003",
      name: "Design Lead",
      email: "design@wdsmsit.in",
      role: "TEAM_LEAD",
      wing: "Design & UI/UX Wing",
      status: "ACTIVE",
      joinedDate: "2024-09-01",
      lastActive: new Date().toISOString(),
    },
  ];

  private invitations: InvitationToken[] = [];

  public async getMembers(): Promise<SocietyMember[]> {
    return this.members;
  }

  public async createInvitation(
    role: HubRole,
    wing: string,
    createdBy: string
  ): Promise<InvitationToken> {
    const token = `wds_inv_${crypto.randomBytes(16).toString("hex")}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days TTL

    const invitation: InvitationToken = {
      id: `INV-${Date.now()}`,
      token,
      role,
      wing,
      createdBy,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: "PENDING",
    };

    this.invitations.unshift(invitation);
    return invitation;
  }

  public async getInvitations(): Promise<InvitationToken[]> {
    return this.invitations;
  }

  public async revokeInvitation(id: string): Promise<boolean> {
    const inv = this.invitations.find((i) => i.id === id);
    if (inv && inv.status === "PENDING") {
      inv.status = "REVOKED";
      return true;
    }
    return false;
  }

  public async acceptInvitation(token: string, name: string, email: string): Promise<SocietyMember | null> {
    const inv = this.invitations.find((i) => i.token === token && i.status === "PENDING");
    if (!inv) return null;

    if (new Date() > new Date(inv.expiresAt)) {
      inv.status = "REVOKED";
      return null;
    }

    inv.status = "ACCEPTED";
    inv.usedAt = new Date().toISOString();

    const newMember: SocietyMember = {
      id: `MEM-${Date.now()}`,
      name,
      email,
      role: inv.role,
      wing: inv.wing,
      status: "ACTIVE",
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
    };

    this.members.push(newMember);
    return newMember;
  }
}

export const memberRepository = new MemoryMemberRepository();
