"use client";

import React from "react";
import Link from "next/link";
import { sound } from "@/lib/soundEffects";
import { CheckSquare, Bug, ArrowRight, Plus, AlertCircle, RotateCcw } from "lucide-react";
import { TaskItem, BugItem, HubTab } from "@/lib/hub/types";

interface DashboardViewProps {
  tasks: TaskItem[];
  bugs: BugItem[];
  isTasksOffline?: boolean;
  isBugsOffline?: boolean;
  onRetry?: () => void;
  onToggleTask: (id: string) => void;
  onNavigateTab: (tab: HubTab) => void;
  onOpenNewTaskModal: () => void;
}

export function DashboardView({
  tasks,
  bugs,
  isTasksOffline,
  isBugsOffline,
  onRetry,
  onToggleTask,
  onNavigateTab,
  onOpenNewTaskModal,
}: DashboardViewProps) {
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingCount = tasks.filter((t) => t.status === "PENDING").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const openBugsCount = bugs.filter((b) => b.status === "OPEN" || b.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow">
        <div className="space-y-1">
          <h1 className="font-pixel text-sm sm:text-base md:text-lg text-wds-yellow flex items-center gap-2">
            <span>&gt;_</span>
            <span>WDS OPS DASHBOARD</span>
          </h1>
          <p className="text-xs text-wds-muted">
            Active sprints, verified website registries, and student QA triage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 border border-wds-yellow/30 bg-wds-bg text-right font-mono text-xs">
            <div className="text-[9px] text-wds-muted">&gt;_ CYCLE STATUS</div>
            <div className="font-pixel text-[10px] text-wds-green">ACTIVE (2026)</div>
          </div>
        </div>
      </div>

      {/* Database Offline Warning Banner if Notion is unconfigured */}
      {(isTasksOffline || isBugsOffline) && (
        <div className="p-4 bg-wds-card border-2 border-wds-yellow/60 shadow-pixel-yellow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-wds-yellow">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold">Notion Operational Backend Not Connected:</span> Configure{" "}
              <code>NOTION_API_KEY</code> &amp; Database IDs in <code>.env.local</code> to sync live data.
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
              <span>RETRY SYNC</span>
            </button>
          )}
        </div>
      )}

      {/* Prioritized KPI Summary Grid */}
      <div className="space-y-2">
        <div className="text-[10px] font-pixel text-wds-muted">&gt;_ SPRINT METRICS</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "SPRINT TASKS", val: String(tasks.length), sub: isTasksOffline ? "Offline" : "Total scope", color: "text-wds-yellow", border: "border-wds-yellow" },
            { label: "PENDING", val: String(pendingCount), sub: isTasksOffline ? "Offline" : "In backlog", color: "text-wds-yellow", border: "border-wds-yellow/60" },
            { label: "COMPLETED", val: String(completedCount), sub: isTasksOffline ? "Offline" : "Verified & shipped", color: "text-wds-green", border: "border-wds-green/60" },
            { label: "OPEN BUGS", val: String(openBugsCount), sub: isBugsOffline ? "Offline" : "Under triage", color: "text-wds-yellow", border: "border-wds-yellow/60" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-3 border-2 bg-wds-card text-center flex flex-col justify-between shadow-pixel-yellow-sm hover:-translate-y-0.5 transition-transform ${stat.border}`}
            >
              <div className="text-[9px] text-wds-muted uppercase truncate">{stat.label}</div>
              <div className={`font-pixel text-lg sm:text-xl my-1 ${stat.color}`}>{stat.val}</div>
              <div className="text-[8px] text-wds-muted truncate">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Work Area: Task Progress Ring & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Progress (5 cols) */}
        <div className="lg:col-span-5 p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
            <span>&gt;_ SPRINT PROGRESS</span>
            <span className="text-[9px] text-wds-green font-pixel">{progressPercent}% DONE</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            {/* Retro Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center border-4 border-wds-yellow rounded-full bg-wds-bg shadow-pixel-yellow-sm">
              <div className="text-center">
                <div className="font-pixel text-xl text-wds-yellow">{progressPercent}%</div>
                <div className="text-[8px] text-wds-muted mt-0.5">COMPLETED</div>
              </div>
            </div>

            {/* Progress Bars Breakdown */}
            <div className="w-full space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-wds-green font-bold">● COMPLETED</span>
                  <span className="text-wds-white">{completedCount} tasks</span>
                </div>
                <div className="h-2 bg-wds-bg border border-wds-yellow/30">
                  <div
                    className="h-full bg-wds-green transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-wds-yellow font-bold">● IN PROGRESS</span>
                  <span className="text-wds-white">{inProgressCount} tasks</span>
                </div>
                <div className="h-2 bg-wds-bg border border-wds-yellow/30">
                  <div
                    className="h-full bg-wds-yellow transition-all duration-300"
                    style={{ width: `${tasks.length > 0 ? Math.round((inProgressCount / tasks.length) * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-wds-muted font-bold">● PENDING</span>
                  <span className="text-wds-white">{pendingCount} tasks</span>
                </div>
                <div className="h-2 bg-wds-bg border border-wds-yellow/30">
                  <div
                    className="h-full bg-wds-muted transition-all duration-300"
                    style={{ width: `${tasks.length > 0 ? Math.round((pendingCount / tasks.length) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-[10px] text-wds-muted">
            <span>Sprint: WDS Ecosystem Operations</span>
            <button
              type="button"
              onClick={() => onNavigateTab("tasks")}
              className="text-wds-yellow hover:underline font-bold"
            >
              OPEN TASKS BOARD →
            </button>
          </div>
        </div>

        {/* Priority Tasks Checklist (7 cols) */}
        <div className="lg:col-span-7 p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
            <span>&gt;_ UPCOMING PRIORITY TASKS</span>
            <button
              type="button"
              onClick={() => onNavigateTab("tasks")}
              className="text-[9px] text-wds-yellow hover:underline font-bold"
            >
              VIEW ALL ({tasks.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.length > 0 ? (
              tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="p-3 border border-wds-border-dim bg-wds-bg hover:border-wds-yellow flex items-center justify-between gap-3 text-xs cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center text-[10px] shrink-0 ${
                        task.status === "COMPLETED"
                          ? "border-wds-green bg-wds-green text-wds-bg font-bold"
                          : "border-wds-yellow bg-wds-bg"
                      }`}
                    >
                      {task.status === "COMPLETED" ? "✓" : ""}
                    </div>
                    <div className="truncate">
                      <span
                        className={
                          task.status === "COMPLETED"
                            ? "line-through text-wds-muted"
                            : "text-wds-white font-bold"
                        }
                      >
                        {task.title}
                      </span>
                      <div className="text-[10px] text-wds-muted flex items-center gap-2 mt-0.5">
                        <span>{task.project}</span>
                        <span>•</span>
                        <span>Assignee: {task.assignee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span
                      className={`px-1.5 py-0.5 font-pixel ${
                        task.priority === "HIGH"
                          ? "border border-wds-yellow bg-wds-yellow/10 text-wds-yellow"
                          : "border border-wds-border-dim text-wds-muted"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-wds-muted hidden sm:inline">{task.dueDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center border border-wds-yellow/30 bg-wds-bg space-y-1.5">
                <div className="font-pixel text-[10px] text-wds-yellow">
                  {isTasksOffline ? "&gt;_ TASKS DATABASE OFFLINE" : "&gt;_ NO SPRINT TASKS"}
                </div>
                <p className="text-xs text-wds-muted">
                  {isTasksOffline
                    ? "Connect your Notion Tasks database in .env.local"
                    : "No active sprint items found in database."}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
            <span className="text-wds-muted text-[10px]">Tap task to mark complete</span>
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="text-xs text-wds-yellow font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD SPRINT TASK
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links Matrix */}
      <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
        <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/30">
          &gt;_ VERIFIED QUICK ACCESS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { name: "WDS Main Website", href: "/" },
            { name: "WDS Bug Hunt Platform", href: "https://wds-bug-hunt.netlify.app/bug-hunt", ext: true },
            { name: "GitHub Repository", href: "https://github.com/JayantOlhyan/WDS-website", ext: true },
            { name: "MSIT Official Portal", href: "https://msit.in", ext: true },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={() => sound.playClick()}
              className="p-2.5 border border-wds-border-dim bg-wds-bg hover:border-wds-yellow hover:text-wds-yellow flex items-center justify-between transition-colors group"
              {...(link.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="truncate">{link.name}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
