"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import {
  Command,
  X,
  LayoutDashboard,
  CheckSquare,
  Bug,
  FolderArchive,
  Link2,
  Plus,
  ExternalLink,
} from "lucide-react";
import { HubTab } from "@/lib/hub/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: HubTab) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewBugModal: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onOpenNewTaskModal,
  onOpenNewBugModal,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const items = [
    { label: "Go to Dashboard", tab: "dashboard" as HubTab, icon: LayoutDashboard, group: "Navigation" },
    { label: "Go to Tasks Board", tab: "tasks" as HubTab, icon: CheckSquare, group: "Navigation" },
    { label: "Go to Bug Tracker", tab: "bugs" as HubTab, icon: Bug, group: "Navigation" },
    { label: "Go to Recruitment '26 Pipeline", tab: "recruitment" as HubTab, icon: CheckSquare, group: "Navigation" },
    { label: "Go to Asset Drive", tab: "assets" as HubTab, icon: FolderArchive, group: "Navigation" },
    { label: "Go to Websites Registry", tab: "websites" as HubTab, icon: Link2, group: "Navigation" },
    {
      label: "+ Create New Sprint Task",
      action: () => {
        onClose();
        onOpenNewTaskModal();
      },
      icon: Plus,
      group: "Actions",
    },
    {
      label: "+ Log Website Bug",
      action: () => {
        onClose();
        onOpenNewBugModal();
      },
      icon: Bug,
      group: "Actions",
    },
    { label: "Open WDS Live Bug Hunt", href: "https://wds-bug-hunt.netlify.app/bug-hunt", icon: ExternalLink, group: "External" },
    { label: "Open WDS Public Home", href: "/", icon: ExternalLink, group: "Navigation" },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
      <div className="w-full max-w-xl bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-4 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 pb-3 border-b border-wds-yellow/30">
          <Command className="w-5 h-5 text-wds-yellow shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search hub views..."
            className="w-full bg-transparent text-sm text-wds-white outline-none font-mono"
          />
          <button type="button" onClick={onClose} className="p-1 text-wds-muted hover:text-wds-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1 text-xs font-mono">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (item.action) {
                      item.action();
                    } else if (item.tab) {
                      onSelectTab(item.tab);
                      onClose();
                    } else if (item.href) {
                      window.open(item.href, "_blank");
                      onClose();
                    }
                  }}
                  className="w-full p-2.5 border border-transparent hover:border-wds-yellow hover:bg-wds-yellow hover:text-wds-bg flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-wds-yellow group-hover:text-wds-bg" />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <span className="font-pixel text-[9px] opacity-60 uppercase">{item.group}</span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-wds-muted text-xs">&gt;_ NO MATCHING COMMANDS</div>
          )}
        </div>

        <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-[10px] text-wds-muted">
          <span>
            Navigation: <kbd className="text-wds-yellow">↑</kbd> <kbd className="text-wds-yellow">↓</kbd>
          </span>
          <span>
            Close: <kbd className="text-wds-yellow">ESC</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
