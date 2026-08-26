"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { TaskItem } from "@/lib/hub/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
}

export function TaskModal({ isOpen, onClose, onAddTask }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("MSIT Website");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [assignee, setAssignee] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playSuccess();
    onAddTask({
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      project,
      priority,
      dueDate: "Next Sprint",
      status: "PENDING",
      assignee: assignee.trim() || "Unassigned",
    });
    setTitle("");
    setAssignee("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
          <span>&gt;_ CREATE NEW SPRINT TASK</span>
          <button type="button" onClick={onClose} className="text-wds-muted hover:text-wds-white">
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-wds-white font-bold mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement orientation registration webhook"
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option>MSIT Website</option>
                <option>WDS Bug Hunt</option>
                <option>Freshers Hub</option>
                <option>Newsletter</option>
                <option>Ecosystem Core</option>
              </select>
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "HIGH" | "MEDIUM" | "LOW")}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-wds-white font-bold mb-1">Assignee</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="e.g. Priyanshu / Tech Wing"
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
              className="px-4 py-1.5 border border-wds-yellow bg-wds-yellow text-wds-bg font-bold font-pixel text-xs shadow-pixel-yellow-sm"
            >
              SAVE TASK →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
