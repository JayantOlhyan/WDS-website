"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { Plus } from "lucide-react";
import { TaskItem } from "@/lib/hub/types";

interface TaskViewProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
}

export function TaskView({ tasks, onToggleTask, onOpenNewTaskModal }: TaskViewProps) {
  const [filter, setFilter] = useState<"ALL" | "TODAY" | "UPCOMING" | "COMPLETED">("ALL");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "COMPLETED") return task.status === "COMPLETED";
    if (filter === "UPCOMING" || filter === "TODAY") return task.status !== "COMPLETED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ SPRINT TASK BOARD</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Manage society projects, development sprints, bug fixes, and documentation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenNewTaskModal();
          }}
          className="px-4 py-2 border border-wds-yellow bg-wds-yellow text-wds-bg font-pixel text-xs font-bold shadow-pixel-yellow-sm hover:bg-[#fff176] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NEW TASK</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-wds-card border border-wds-yellow/40">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "TODAY", "UPCOMING", "COMPLETED"] as const).map((tab) => (
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
          SHOWING {filteredTasks.length} SPRINT ITEMS
        </div>
      </div>

      {/* Task Items List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border-2 border-wds-yellow/60 bg-wds-card hover:border-wds-yellow shadow-pixel-yellow-sm transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className={`w-5 h-5 border mt-0.5 flex items-center justify-center text-xs shrink-0 ${
                      task.status === "COMPLETED"
                        ? "border-wds-green bg-wds-green text-wds-bg font-bold"
                        : "border-wds-yellow bg-wds-bg text-wds-yellow"
                    }`}
                  >
                    {task.status === "COMPLETED" ? "✓" : ""}
                  </button>
                  <div>
                    <span className="font-pixel text-[10px] text-wds-yellow mr-2">{task.id}</span>
                    <span
                      className={`text-sm font-bold ${
                        task.status === "COMPLETED" ? "line-through text-wds-muted" : "text-wds-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 font-pixel text-[9px] border ${
                      task.priority === "HIGH"
                        ? "border-wds-yellow text-wds-yellow bg-wds-yellow/10"
                        : "border-wds-border-dim text-wds-muted bg-wds-bg"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-0.5 font-pixel text-[9px] ${
                      task.status === "COMPLETED"
                        ? "bg-wds-green/20 text-wds-green border border-wds-green/40"
                        : "bg-wds-yellow/20 text-wds-yellow border border-wds-yellow/40"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-wds-yellow/20 text-xs text-wds-muted">
                <div className="flex items-center gap-4">
                  <span>
                    Project: <strong className="text-wds-white">{task.project}</strong>
                  </span>
                  <span>
                    Assignee: <strong className="text-wds-yellow">{task.assignee}</strong>
                  </span>
                </div>
                <div>
                  Due Date: <strong className="text-wds-white">{task.dueDate}</strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border-2 border-wds-yellow/30 bg-wds-card space-y-2">
            <div className="font-pixel text-xs text-wds-yellow">&gt;_ NO TASKS MATCHING FILTER</div>
            <p className="text-xs text-wds-muted">All clear! No pending sprint items in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
