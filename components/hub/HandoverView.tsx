"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import {
  RotateCcw,
  CheckSquare,
  Shield,
  GitBranch,
  Key,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { SocietyProject } from "@/lib/repositories/ProjectRepository";
import { TaskItem, BugItem } from "@/lib/hub/types";

interface HandoverViewProps {
  projects: SocietyProject[];
  tasks: TaskItem[];
  bugs: BugItem[];
}

interface ChecklistItem {
  id: string;
  category: "ACCESS" | "DATA" | "INFRASTRUCTURE" | "ORGANIZATION";
  task: string;
  description: string;
  completed: boolean;
}

export function HandoverView({ projects, tasks, bugs }: HandoverViewProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "chk-1",
      category: "ACCESS",
      task: "Transfer GitHub Organization Ownership",
      description: "Grant Owner role to the incoming President and Tech Lead on JayantOlhyan/WDS-website.",
      completed: false,
    },
    {
      id: "chk-2",
      category: "ACCESS",
      task: "Notion Workspace Admin Invite",
      description: "Transfer admin rights for Recruitment, Sprint Tasks, and Bug Hunt Notion databases.",
      completed: false,
    },
    {
      id: "chk-3",
      category: "ACCESS",
      task: "Rotate Master Role Passkeys",
      description: "Regenerate HUB_ADMIN_KEY and HUB_CORE_KEY in Vercel project settings.",
      completed: false,
    },
    {
      id: "chk-4",
      category: "DATA",
      task: "Archive Recruitment Candidate Records",
      description: "Export full recruitment CSV for previous batch and duplicate database for incoming year.",
      completed: false,
    },
    {
      id: "chk-5",
      category: "INFRASTRUCTURE",
      task: "Verify Domain DNS & Vercel Ownership",
      description: "Ensure DNS records on college subdomain/domain are linked to active team email.",
      completed: false,
    },
    {
      id: "chk-6",
      category: "ORGANIZATION",
      task: "Review Active Member Roster",
      description: "Promote graduating members to ALUMNI status and onboard new core contributors.",
      completed: false,
    },
  ]);

  const toggleChecklist = (id: string) => {
    sound.playClick();
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklist.filter((i) => i.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ ANNUAL LEADERSHIP HANDOVER</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Operational transition protocol for seamless multi-year governance (WDS 2026 → WDS 2027).
          </p>
        </div>

        <div className="p-2.5 border-2 border-wds-yellow bg-wds-card text-right font-mono text-xs shadow-pixel-yellow-sm">
          <div className="text-[9px] text-wds-muted font-pixel">&gt;_ TRANSITION PROGRESS</div>
          <div className="font-pixel text-sm text-wds-yellow mt-0.5">
            {completedCount} / {checklist.length} STEPS COMPLETED
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border-2 border-wds-yellow/50 bg-wds-card shadow-pixel-yellow-sm space-y-1">
          <div className="text-[10px] font-pixel text-wds-muted">ACTIVE REPOSITORIES</div>
          <div className="font-pixel text-xl text-wds-white">{projects.length} PROJECTS</div>
          <p className="text-[11px] text-wds-muted">Production codebases requiring access transfer.</p>
        </div>

        <div className="p-4 border-2 border-wds-yellow/50 bg-wds-card shadow-pixel-yellow-sm space-y-1">
          <div className="text-[10px] font-pixel text-wds-muted">OPEN SPRINT TASKS</div>
          <div className="font-pixel text-xl text-wds-yellow">
            {tasks.filter((t) => t.status !== "COMPLETED").length} PENDING
          </div>
          <p className="text-[11px] text-wds-muted">Unfinished sprint deliverables to hand over.</p>
        </div>

        <div className="p-4 border-2 border-wds-yellow/50 bg-wds-card shadow-pixel-yellow-sm space-y-1">
          <div className="text-[10px] font-pixel text-wds-muted">UNRESOLVED BUGS</div>
          <div className="font-pixel text-xl text-wds-red">
            {bugs.filter((b) => b.status !== "RESOLVED").length} QUEUED
          </div>
          <p className="text-[11px] text-wds-muted">Pending Bug Hunt triage items.</p>
        </div>
      </div>

      {/* Interactive Handover Checklist */}
      <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
        <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/30 flex items-center justify-between">
          <span>&gt;_ CRITICAL HANDOVER CHECKLIST</span>
          <span className="text-[10px] text-wds-green font-mono">
            {Math.round((completedCount / checklist.length) * 100)}% COMPLETE
          </span>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`p-3.5 border-2 cursor-pointer transition-all flex items-start gap-3 text-xs ${
                item.completed
                  ? "border-wds-green/50 bg-wds-green/5 opacity-80"
                  : "border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow"
              }`}
            >
              <div
                className={`w-5 h-5 border mt-0.5 flex items-center justify-center text-xs shrink-0 ${
                  item.completed
                    ? "border-wds-green bg-wds-green text-wds-bg font-bold"
                    : "border-wds-yellow bg-wds-card text-wds-yellow"
                }`}
              >
                {item.completed ? "✓" : ""}
              </div>

              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[9px] text-wds-yellow">{item.category}</span>
                  <span className={`font-bold ${item.completed ? "line-through text-wds-muted" : "text-wds-white"}`}>
                    {item.task}
                  </span>
                </div>
                <p className="text-[11px] text-wds-muted leading-relaxed font-mono">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Operational Contacts */}
      <div className="p-5 border-2 border-wds-yellow/50 bg-wds-card shadow-pixel-yellow-sm space-y-3">
        <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/20">
          &gt;_ KEY INSTITUTIONAL CONTACTS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-wds-bg border border-wds-border-dim space-y-1">
            <div className="text-wds-white font-bold">Faculty Coordinator</div>
            <div className="text-wds-muted text-[11px]">Maharaja Surajmal Institute of Technology</div>
            <div className="text-wds-yellow text-[11px]">wds@msit.in</div>
          </div>
          <div className="p-3 bg-wds-bg border border-wds-border-dim space-y-1">
            <div className="text-wds-white font-bold">IT Infrastructure / Subdomains</div>
            <div className="text-wds-muted text-[11px]">MSIT Computer Center</div>
            <div className="text-wds-yellow text-[11px]">admin@msit.in</div>
          </div>
        </div>
      </div>
    </div>
  );
}
