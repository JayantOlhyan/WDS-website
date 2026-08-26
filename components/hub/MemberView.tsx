"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { UserCheck, Plus, Key, Copy, Check, Shield } from "lucide-react";
import { SocietyMember, InvitationToken } from "@/lib/repositories/MemberRepository";
import { HubRole } from "@/lib/auth";

interface MemberViewProps {
  members: SocietyMember[];
  invitations: InvitationToken[];
  userRole?: HubRole;
  onCreateInvitation?: (role: HubRole, wing: string) => void;
}

export function MemberView({
  members,
  invitations,
  userRole = "MEMBER",
  onCreateInvitation,
}: MemberViewProps) {
  const [inviteRole, setInviteRole] = useState<HubRole>("MEMBER");
  const [inviteWing, setInviteWing] = useState<string>("Technical Wing");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canInvite = userRole === "ADMIN" || userRole === "CORE_TEAM";

  const handleCopy = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    sound.playSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ SOCIETY MEMBERS &amp; ACCESS</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Registered contributors, team leads, and secure single-use invitation tokens.
          </p>
        </div>

        <div className="p-2 border border-wds-yellow/30 bg-wds-card text-right font-mono text-xs">
          <div className="text-[9px] text-wds-muted">&gt;_ ACTIVE SQUAD</div>
          <div className="font-pixel text-[10px] text-wds-green">{members.length} REGISTERED</div>
        </div>
      </div>

      {/* Admin Invitation Generator */}
      {canInvite && onCreateInvitation && (
        <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
          <div className="font-pixel text-xs text-wds-yellow flex items-center gap-2">
            <Key className="w-4 h-4" />
            <span>&gt;_ GENERATE SINGLE-USE ONBOARDING INVITATION TOKEN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-pixel text-wds-muted block mb-1">TARGET ROLE</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as HubRole)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white font-mono outline-none focus:border-wds-yellow"
              >
                {userRole === "ADMIN" && <option value="ADMIN">ADMIN (Full Access)</option>}
                <option value="CORE_TEAM">CORE_TEAM (Recruitment + Ops)</option>
                <option value="TEAM_LEAD">TEAM_LEAD (Sprint Lead)</option>
                <option value="MEMBER">MEMBER (Builder Access)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-pixel text-wds-muted block mb-1">ASSIGNED WING</label>
              <select
                value={inviteWing}
                onChange={(e) => setInviteWing(e.target.value)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white font-mono outline-none focus:border-wds-yellow"
              >
                <option value="Technical Wing">Technical Wing</option>
                <option value="Design & UI/UX Wing">Design &amp; UI/UX Wing</option>
                <option value="Content & Editorial Wing">Content &amp; Editorial Wing</option>
                <option value="Events & Operations Wing">Events &amp; Operations Wing</option>
                <option value="Core Operations">Core Operations</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onCreateInvitation(inviteRole, inviteWing);
                }}
                className="w-full py-2 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold hover:bg-[#fff176] shadow-pixel-yellow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>GENERATE INVITATION</span>
              </button>
            </div>
          </div>

          {invitations.length > 0 && (
            <div className="pt-3 border-t border-wds-yellow/20 space-y-2">
              <div className="text-[10px] font-pixel text-wds-yellow">&gt;_ ACTIVE INVITATION TOKENS</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-2.5 bg-wds-bg border border-wds-border-dim flex items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="truncate flex items-center gap-2">
                      <span className="font-pixel text-[9px] text-wds-yellow">{inv.role}</span>
                      <span className="text-wds-muted">({inv.wing})</span>
                      <code className="text-wds-white truncate max-w-xs">{inv.token}</code>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-pixel ${
                          inv.status === "PENDING" ? "text-wds-yellow" : "text-wds-muted"
                        }`}
                      >
                        {inv.status}
                      </span>
                      {inv.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => handleCopy(inv.token, inv.id)}
                          className="px-2 py-1 bg-wds-card border border-wds-yellow/40 hover:bg-wds-yellow hover:text-wds-bg text-[10px] flex items-center gap-1"
                        >
                          {copiedId === inv.id ? <Check className="w-3 h-3 text-wds-green" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === inv.id ? "COPIED" : "COPY"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 border-2 border-wds-yellow/50 bg-wds-card shadow-pixel-yellow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-wds-yellow" />
                <span className="font-bold text-sm text-wds-white">{member.name}</span>
              </div>
              <span
                className={`px-2 py-0.5 font-pixel text-[9px] border ${
                  member.role === "ADMIN"
                    ? "border-wds-yellow text-wds-yellow bg-wds-yellow/10"
                    : member.role === "CORE_TEAM"
                    ? "border-[#64b5f6] text-[#64b5f6] bg-[#64b5f6]/10"
                    : "border-wds-border-dim text-wds-muted"
                }`}
              >
                {member.role}
              </span>
            </div>

            <div className="space-y-1 text-xs text-wds-muted">
              <div>
                Wing: <strong className="text-wds-white">{member.wing}</strong>
              </div>
              <div>
                Email: <span className="text-wds-yellow">{member.email}</span>
              </div>
              <div className="text-[10px] pt-1">Joined: {member.joinedDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
