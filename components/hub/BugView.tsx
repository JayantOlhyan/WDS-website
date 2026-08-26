"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { Bug, ExternalLink } from "lucide-react";
import { BugItem } from "@/lib/hub/types";

interface BugViewProps {
  bugs: BugItem[];
  onOpenNewBugModal: () => void;
}

export function BugView({ bugs, onOpenNewBugModal }: BugViewProps) {
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-3 bg-wds-card border border-wds-yellow/40">
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

      {/* Bug List */}
      <div className="space-y-3">
        {filteredBugs.map((bug) => (
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
                      ? "text-wds-green border border-wds-green"
                      : "text-wds-yellow border border-wds-yellow"
                  }`}
                >
                  {bug.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-between text-xs text-wds-muted pt-2 border-t border-wds-yellow/20">
              <span>
                Affected Page: <code className="text-wds-white">{bug.page}</code>
              </span>
              <span>
                Reported by: <strong className="text-wds-yellow">{bug.reporter}</strong> ({bug.date})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
