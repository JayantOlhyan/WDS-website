"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Bug,
  Users,
  FolderArchive,
  Link2,
  Plus,
  BookOpen,
  Calendar,
  FileText,
  UserCheck,
  History,
  FolderKanban,
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

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  const quickActions = [
    {
      label: "Create New Sprint Task",
      category: "ACTION",
      icon: Plus,
      action: () => {
        onClose();
        onOpenNewTaskModal();
      },
    },
    {
      label: "Log Bug / Vulnerability",
      category: "ACTION",
      icon: Bug,
      action: () => {
        onClose();
        onOpenNewBugModal();
      },
    },
    {
      label: "Go to Dashboard",
      category: "NAVIGATION",
      icon: LayoutDashboard,
      action: () => {
        onClose();
        onSelectTab("dashboard");
      },
    },
    {
      label: "Go to Project Registry",
      category: "NAVIGATION",
      icon: FolderKanban,
      action: () => {
        onClose();
        onSelectTab("projects");
      },
    },
    {
      label: "Go to Task Board",
      category: "NAVIGATION",
      icon: CheckSquare,
      action: () => {
        onClose();
        onSelectTab("tasks");
      },
    },
    {
      label: "Go to Bug Tracker",
      category: "NAVIGATION",
      icon: Bug,
      action: () => {
        onClose();
        onSelectTab("bugs");
      },
    },
    {
      label: "Go to Recruitment 2026",
      category: "NAVIGATION",
      icon: Users,
      action: () => {
        onClose();
        onSelectTab("recruitment");
      },
    },
    {
      label: "Go to Events & Hackathons",
      category: "NAVIGATION",
      icon: Calendar,
      action: () => {
        onClose();
        onSelectTab("events");
      },
    },
    {
      label: "Go to Editorial Content",
      category: "NAVIGATION",
      icon: FileText,
      action: () => {
        onClose();
        onSelectTab("content");
      },
    },
    {
      label: "Go to Asset Drive",
      category: "NAVIGATION",
      icon: FolderArchive,
      action: () => {
        onClose();
        onSelectTab("assets");
      },
    },
    {
      label: "Go to Websites & Uptime Health",
      category: "NAVIGATION",
      icon: Link2,
      action: () => {
        onClose();
        onSelectTab("websites");
      },
    },
    {
      label: "Go to Society Members & Access",
      category: "NAVIGATION",
      icon: UserCheck,
      action: () => {
        onClose();
        onSelectTab("members");
      },
    },
    {
      label: "Go to System Audit Log",
      category: "NAVIGATION",
      icon: History,
      action: () => {
        onClose();
        onSelectTab("audit");
      },
    },
    {
      label: "Go to SOP & Handover Docs",
      category: "NAVIGATION",
      icon: BookOpen,
      action: () => {
        onClose();
        onSelectTab("documentation");
      },
    },
  ];

  const filtered = quickActions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow-lg overflow-hidden flex flex-col font-mono">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-3 border-b-2 border-wds-yellow bg-wds-bg">
          <Search className="w-4 h-4 text-wds-yellow shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or subsystem name..."
            className="w-full bg-transparent text-sm text-wds-white placeholder-wds-muted outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-wds-yellow text-[10px] text-wds-yellow font-pixel">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-wds-yellow/10">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    item.action();
                  }}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-wds-yellow hover:text-wds-bg text-left text-xs transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-wds-yellow group-hover:text-wds-bg" />
                    <span className="font-bold text-wds-white group-hover:text-wds-bg">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-pixel text-wds-muted group-hover:text-wds-bg">
                    {item.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-wds-muted">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-2 border-t border-wds-yellow/30 bg-wds-bg flex justify-between items-center text-[10px] text-wds-muted px-3">
          <span>WDS Operating System v2.1</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
