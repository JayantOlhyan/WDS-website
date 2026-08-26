"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import { HubTab, TaskItem, BugItem, AssetItem } from "@/lib/hub/types";
import {
  INITIAL_HUB_TASKS,
  INITIAL_HUB_BUGS,
  INITIAL_HUB_ASSETS,
  HUB_NAV_GROUPS,
} from "@/lib/hub/constants";
import { HubHeader } from "@/components/hub/HubHeader";
import { HubSidebar } from "@/components/hub/HubSidebar";
import { DashboardView } from "@/components/hub/DashboardView";
import { TaskView } from "@/components/hub/TaskView";
import { BugView } from "@/components/hub/BugView";
import { AssetView } from "@/components/hub/AssetView";
import { WebsiteView } from "@/components/hub/WebsiteView";
import { CommandPalette } from "@/components/hub/CommandPalette";
import { TaskModal } from "@/components/hub/TaskModal";
import { BugModal } from "@/components/hub/BugModal";

export default function WdsHubPage() {
  const [activeTab, setActiveTab] = useState<HubTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);
  const [newBugModalOpen, setNewBugModalOpen] = useState<boolean>(false);

  // Application State
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_HUB_TASKS);
  const [bugs, setBugs] = useState<BugItem[]>(INITIAL_HUB_BUGS);
  const [assets] = useState<AssetItem[]>(INITIAL_HUB_ASSETS);

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sound.playClick();
        setCmdPaletteOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setCmdPaletteOpen(false);
        setNotifOpen(false);
        setNewTaskModalOpen(false);
        setNewBugModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTaskStatus = (id: string) => {
    sound.playClick();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "COMPLETED" ? "PENDING" : "COMPLETED";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddBug = (newBug: BugItem) => {
    setBugs((prev) => [newBug, ...prev]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-wds-bg font-mono text-wds-white select-text">
      {/* 1. Global Sticky Command Bar */}
      <HubHeader
        activeTab={activeTab}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileDrawerOpen={mobileDrawerOpen}
        onToggleMobileDrawer={() => setMobileDrawerOpen(!mobileDrawerOpen)}
        onOpenCommandPalette={() => setCmdPaletteOpen(true)}
        onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
        notifOpen={notifOpen}
        onToggleNotif={() => setNotifOpen(!notifOpen)}
      />

      {/* 2. Main Layout Container */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <HubSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          collapsed={sidebarCollapsed}
        />

        {/* Mobile Full-Screen Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-40 bg-wds-bg md:hidden flex flex-col p-6 overflow-y-auto border-4 border-wds-yellow">
            <div className="flex items-center justify-between pb-4 border-b-2 border-wds-yellow">
              <div className="flex items-center gap-2">
                <img src="/images/wds-logo.png" alt="WDS Logo" className="w-8 h-8" />
                <span className="font-pixel text-xs text-wds-yellow">WDS_HUB_NAV.SH</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMobileDrawerOpen(false);
                }}
                className="p-1 border border-wds-yellow text-wds-yellow font-pixel text-xs hover:bg-wds-yellow hover:text-wds-bg"
              >
                [X] CLOSE
              </button>
            </div>

            <nav className="my-6 space-y-6">
              {HUB_NAV_GROUPS.map((group) => (
                <div key={group.group} className="space-y-2">
                  <div className="font-pixel text-[10px] text-wds-yellow px-2">&gt;_ {group.group}</div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setActiveTab(item.id);
                            setMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 text-xs border ${
                            isActive
                              ? "border-wds-yellow bg-wds-yellow text-wds-bg font-bold"
                              : "border-wds-border-dim bg-wds-card text-wds-white hover:border-wds-yellow"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.count && (
                            <span className="font-pixel text-[9px] opacity-80">{item.count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* 3. Main Viewport Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {activeTab === "dashboard" && (
            <DashboardView
              tasks={tasks}
              onToggleTask={toggleTaskStatus}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
            />
          )}

          {activeTab === "tasks" && (
            <TaskView
              tasks={tasks}
              onToggleTask={toggleTaskStatus}
              onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
            />
          )}

          {activeTab === "bugs" && (
            <BugView
              bugs={bugs}
              onOpenNewBugModal={() => setNewBugModalOpen(true)}
            />
          )}

          {activeTab === "assets" && <AssetView assets={assets} />}

          {activeTab === "websites" && <WebsiteView />}

          {activeTab !== "dashboard" &&
            activeTab !== "tasks" &&
            activeTab !== "bugs" &&
            activeTab !== "assets" &&
            activeTab !== "websites" && (
              <div className="p-8 border-2 border-wds-yellow bg-wds-card text-center space-y-4 max-w-2xl mx-auto my-12">
                <div className="font-pixel text-base text-wds-yellow">
                  &gt;_ {activeTab.toUpperCase()} SUBSYSTEM
                </div>
                <p className="text-xs text-wds-muted leading-relaxed">
                  This administrative module is ready for live operational sync.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveTab("dashboard");
                    }}
                    className="px-4 py-2 border border-wds-yellow bg-wds-yellow text-wds-bg font-pixel text-xs font-bold"
                  >
                    RETURN TO DASHBOARD →
                  </button>
                </div>
              </div>
            )}
        </main>
      </div>

      {/* 4. Modals & Command Palette */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
        onOpenNewBugModal={() => setNewBugModalOpen(true)}
      />

      <TaskModal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      <BugModal
        isOpen={newBugModalOpen}
        onClose={() => setNewBugModalOpen(false)}
        onAddBug={handleAddBug}
      />
    </div>
  );
}
