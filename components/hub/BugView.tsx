"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { Bug, ExternalLink, AlertCircle, RotateCcw } from "lucide-react";
import { BugItem } from "@/lib/hub/types";

interface BugViewProps {
  bugs: BugItem[];
  isOffline?: boolean;
  onRetry?: () => void;
  onUpdateBugStatus?: (id: string, newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED") => void;
  onOpenNewBugModal: () => void;
}

export function BugView({
  bugs,
  isOffline,
  onRetry,
  onUpdateBugStatus,
  onOpenNewBugModal,
}: BugViewProps) {
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");

  const filteredBugs = bugs.filter((bug) => {
    if (filter === "OPEN") return bug.status === "OPEN" || bug.status === "IN_PROGRESS";
    if (filter === "RESOLVED") return bug.status === "RESOLVED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WDS BUG TRACKER</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Operational triage queue for issues reported via the live WDS Bug Hunt portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wds-bug-hunt.netlify.app/bug-hunt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow text-xs text-wds-yellow flex items-center gap-1.5 font-mono"
          >
            <span>LIVE BUG HUNT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenNewBugModal();
            }}
            className="px-4 py-2 border border-wds-yellow bg-wds-yellow text-wds-bg font-pixel text-xs font-bold shadow-pixel-yellow-sm hover:bg-[#fff176]"
          >
            + LOG BUG
          </button>
        </div>
      </div>

      {/* Offline Alert */}
      {isOffline && (
        <div className="p-4 bg-wds-card border-2 border-wds-yellow/60 shadow-pixel-yellow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-wds-yellow">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold">Notion Bugs Database Not Connected:</span> Connect{" "}
              <code>NOTION_BUGS_DATABASE_ID</code> to enable live queue sync.
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="px-3 py-1 bg-wds-yellow text-wds-bg font-pixel text-[10px] font-bold flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RETRY</span>
            </button>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 p-3 bg-wds-card border border-wds-yellow/40">
        <div className="flex items-center gap-2">
          {(["ALL", "OPEN", "RESOLVED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter(tab);
              }}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                filter === tab
                  ? "bg-wds-yellow text-wds-bg font-bold"
                  : "text-wds-muted hover:text-wds-white border border-wds-border-dim bg-wds-bg"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-xs text-wds-muted font-pixel text-[10px]">
          {filteredBugs.length} BUGS IN QUEUE
        </div>
      </div>

      {/* Bug List */}
      <div className="space-y-3">
        {filteredBugs.length > 0 ? (
          filteredBugs.map((bug) => (
            <div
              key={bug.id}
              className="p-4 border-2 border-wds-yellow/50 bg-wds-card space-y-3 shadow-pixel-yellow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bug
                    className={`w-4 h-4 ${
                      bug.severity === "CRITICAL" ? "text-wds-red" : "text-wds-yellow"
                    }`}
                  />
                  <span className="font-pixel text-xs text-wds-yellow">{bug.id}</span>
                  <span className="font-bold text-sm text-wds-white">{bug.title}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 font-pixel text-[9px] ${
                      bug.severity === "CRITICAL"
                        ? "bg-wds-red text-wds-white"
                        : "bg-wds-yellow/20 text-wds-yellow border border-wds-yellow/40"
                    }`}
                  >
                    {bug.severity}
                  </span>
                  <span
                    className={`px-2 py-0.5 font-pixel text-[9px] ${
                      bug.status === "RESOLVED"
                        ? "text-wds-green border border-wds-green bg-wds-green/10"
                        : "text-wds-yellow border border-wds-yellow bg-wds-yellow/10"
                    }`}
                  >
                    {bug.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center text-xs text-wds-muted pt-2 border-t border-wds-yellow/20 gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    Affected Page: <code className="text-wds-white">{bug.page}</code>
                  </span>
                  <span>
                    Reported by: <strong className="text-wds-yellow">{bug.reporter}</strong>
                  </span>
                </div>

                {onUpdateBugStatus && (
                  <div className="flex items-center gap-1.5 text-[10px] font-pixel">
                    {bug.status !== "RESOLVED" ? (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playSuccess();
                          onUpdateBugStatus(bug.id, "RESOLVED");
                        }}
                        className="px-2 py-1 bg-wds-green/20 border border-wds-green text-wds-green hover:bg-wds-green hover:text-wds-bg transition-colors"
                      >
                        MARK RESOLVED ✓
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onUpdateBugStatus(bug.id, "OPEN");
                        }}
                        className="px-2 py-1 bg-wds-card border border-wds-border-dim text-wds-muted hover:border-wds-yellow text-[9px]"
                      >
                        REOPEN
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border-2 border-wds-yellow/30 bg-wds-card space-y-2">
            <div className="font-pixel text-xs text-wds-yellow">
              {isOffline ? "&gt;_ DATABASE TEMPORARILY OFFLINE" : "&gt;_ NO BUGS IN QUEUE"}
            </div>
            <p className="text-xs text-wds-muted">
              {isOffline
                ? "Notion database connection offline. Check server credentials or click retry."
                : "Queue is clear. No active bug reports under triage."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
