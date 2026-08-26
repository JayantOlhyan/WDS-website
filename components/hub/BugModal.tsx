"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { BugItem } from "@/lib/hub/types";

interface BugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBug: (bug: BugItem) => void;
}

export function BugModal({ isOpen, onClose, onAddBug }: BugModalProps) {
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("https://msit.in");
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [reporter, setReporter] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playSuccess();
    onAddBug({
      id: `BUG-${Math.floor(25 + Math.random() * 75)}`,
      title: title.trim(),
      page,
      severity,
      status: "OPEN",
      reporter: reporter.trim() || "anonymous_hunter",
      date: "Just now",
    });
    setTitle("");
    setReporter("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
          <span>&gt;_ LOG NEW WEBSITE BUG</span>
          <button type="button" onClick={onClose} className="text-wds-muted hover:text-wds-white">
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-wds-white font-bold mb-1">Issue Description</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Faculty profile image 404 in CSE department"
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Affected Target URL</label>
              <input
                type="text"
                required
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW")}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option>CRITICAL</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-wds-white font-bold mb-1">Reporter Handle</label>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              placeholder="e.g. hunter_42"
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
            />
          </div>

          <div className="pt-3 border-t border-wds-yellow/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-wds-border-dim text-wds-muted hover:text-wds-white text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 border border-wds-red bg-wds-red/20 text-wds-red hover:bg-wds-red hover:text-wds-white font-bold font-pixel text-xs"
            >
              LOG BUG →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
