"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { FileText, Plus, Share2, CheckCircle2, ArrowRight } from "lucide-react";
import { SocietyContentItem, ContentWorkflowStage } from "@/lib/repositories/ContentRepository";

interface ContentViewProps {
  contentItems: SocietyContentItem[];
  onUpdateStage?: (id: string, stage: ContentWorkflowStage) => void;
  onOpenNewContentModal?: () => void;
}

export function ContentView({ contentItems, onUpdateStage, onOpenNewContentModal }: ContentViewProps) {
  const [activePlatform, setActivePlatform] = useState<string>("ALL");

  const filtered = contentItems.filter((c) =>
    activePlatform === "ALL" ? true : c.platform === activePlatform
  );

  const getStageColor = (stage: ContentWorkflowStage) => {
    switch (stage) {
      case "PUBLISHED":
        return "bg-wds-green/20 text-wds-green border-wds-green";
      case "SCHEDULED":
        return "bg-wds-yellow/20 text-wds-yellow border-wds-yellow";
      case "APPROVED":
        return "bg-[#64b5f6]/20 text-[#64b5f6] border-[#64b5f6]";
      case "REVIEW":
        return "bg-wds-card text-wds-white border-wds-yellow/40";
      case "DRAFT":
      case "IDEA":
      default:
        return "bg-wds-bg text-wds-muted border-wds-border-dim";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ EDITORIAL &amp; CONTENT DESK</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Manage society releases, tech articles, Instagram graphics, LinkedIn newsletters, and tutorials.
          </p>
        </div>

        {onOpenNewContentModal && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenNewContentModal();
            }}
            className="px-4 py-2 border border-wds-yellow bg-wds-yellow text-wds-bg font-pixel text-xs font-bold shadow-pixel-yellow-sm hover:bg-[#fff176] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NEW DRAFT</span>
          </button>
        )}
      </div>

      {/* Platform Filters */}
      <div className="flex flex-wrap gap-2 p-3 bg-wds-card border border-wds-yellow/40">
        {(["ALL", "INSTAGRAM", "LINKEDIN", "NEWSLETTER", "WEBSITE_BLOG"] as const).map((plat) => (
          <button
            key={plat}
            type="button"
            onClick={() => {
              sound.playClick();
              setActivePlatform(plat);
            }}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              activePlatform === plat
                ? "bg-wds-yellow text-wds-bg font-bold"
                : "text-wds-muted hover:text-wds-white border border-wds-border-dim bg-wds-bg"
            }`}
          >
            {plat}
          </button>
        ))}
      </div>

      {/* Kanban / Cards List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 border-2 border-wds-yellow/50 bg-wds-card shadow-pixel-yellow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-wds-yellow">{item.id}</span>
                <span className="font-bold text-sm text-wds-white">{item.title}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 bg-wds-bg border border-wds-border-dim text-[9px] font-mono">
                  {item.platform}
                </span>
                <span className={`px-2 py-0.5 font-pixel text-[9px] border ${getStageColor(item.stage)}`}>
                  {item.stage}
                </span>
              </div>
            </div>

            {item.caption && (
              <p className="text-xs text-wds-muted bg-wds-bg p-2.5 border border-wds-yellow/10 italic">
                &quot;{item.caption}&quot;
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-wds-yellow/20 text-xs text-wds-muted">
              <div>
                Author: <strong className="text-wds-white">{item.author}</strong>
                {item.reviewer && <span> • Reviewer: <strong className="text-wds-yellow">{item.reviewer}</strong></span>}
              </div>

              {onUpdateStage && (
                <div className="flex items-center gap-1.5 text-[10px] font-pixel">
                  {item.stage === "DRAFT" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStage(item.id, "REVIEW")}
                      className="px-2 py-1 border border-wds-yellow bg-wds-bg hover:bg-wds-yellow hover:text-wds-bg"
                    >
                      SUBMIT FOR REVIEW →
                    </button>
                  )}
                  {item.stage === "REVIEW" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStage(item.id, "APPROVED")}
                      className="px-2 py-1 border border-[#64b5f6] bg-[#64b5f6]/20 text-[#64b5f6] hover:bg-[#64b5f6] hover:text-wds-bg"
                    >
                      APPROVE ✓
                    </button>
                  )}
                  {item.stage === "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStage(item.id, "PUBLISHED")}
                      className="px-2 py-1 border border-wds-green bg-wds-green text-wds-bg font-bold"
                    >
                      PUBLISH 🚀
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
