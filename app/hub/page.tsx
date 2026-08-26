"use client";

import React, { useState, useEffect, useCallback } from "react";
import { sound } from "@/lib/soundEffects";
import { HubTab, TaskItem, BugItem, AssetItem } from "@/lib/hub/types";
import { INITIAL_HUB_ASSETS, HUB_NAV_GROUPS } from "@/lib/hub/constants";
import { CandidateApplication, ApplicationStatus } from "@/lib/notion/recruitment";
import { SocietyProject } from "@/lib/repositories/ProjectRepository";
import { SocietyEvent, EventLifecycleStage } from "@/lib/repositories/EventRepository";
import { SocietyContentItem, ContentWorkflowStage } from "@/lib/repositories/ContentRepository";
import { SocietyMember, InvitationToken } from "@/lib/repositories/MemberRepository";
import { AuditLogEntry } from "@/lib/repositories/types";
import { HubRole } from "@/lib/auth";

import { HubAuthGuard } from "@/components/hub/HubAuthGuard";
import { HubHeader } from "@/components/hub/HubHeader";
import { HubSidebar } from "@/components/hub/HubSidebar";
import { DashboardView } from "@/components/hub/DashboardView";
import { ProjectView } from "@/components/hub/ProjectView";
import { TaskView } from "@/components/hub/TaskView";
import { BugView } from "@/components/hub/BugView";
import { RecruitmentView } from "@/components/hub/RecruitmentView";
import { EventView } from "@/components/hub/EventView";
import { ContentView } from "@/components/hub/ContentView";
import { AssetView } from "@/components/hub/AssetView";
import { WebsiteView } from "@/components/hub/WebsiteView";
import { MemberView } from "@/components/hub/MemberView";
import { AuditView } from "@/components/hub/AuditView";
import { DocumentationView } from "@/components/hub/DocumentationView";
import { CommandPalette } from "@/components/hub/CommandPalette";
import { TaskModal } from "@/components/hub/TaskModal";
import { BugModal } from "@/components/hub/BugModal";

interface SessionData {
  username: string;
  role: HubRole;
  wing: string;
}

export default function WdsHubPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<HubTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);
  const [newBugModalOpen, setNewBugModalOpen] = useState<boolean>(false);

  // Live Data States
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isTasksOffline, setIsTasksOffline] = useState(false);

  const [bugs, setBugs] = useState<BugItem[]>([]);
  const [isBugsOffline, setIsBugsOffline] = useState(false);

  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [isRecruitmentOffline, setIsRecruitmentOffline] = useState(false);

  const [projects, setProjects] = useState<SocietyProject[]>([]);
  const [events, setEvents] = useState<SocietyEvent[]>([]);
  const [contentItems, setContentItems] = useState<SocietyContentItem[]>([]);
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [invitations, setInvitations] = useState<InvitationToken[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [assets] = useState<AssetItem[]>(INITIAL_HUB_ASSETS);

  // 1. Session Check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/hub/auth");
        const data = await res.json();
        if (res.ok && data.authenticated && data.session) {
          setSession(data.session);
        }
      } catch (err) {
        console.warn("[Hub Session Check Error]:", err);
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkSession();
  }, []);

  // 2. Fetch Live Hub Subsystems
  const fetchLiveHubData = useCallback(async () => {
    if (!session) return;

    // Fetch Tasks
    try {
      const tRes = await fetch("/api/hub/tasks");
      const tData = await tRes.json();
      if (tRes.ok && tData.success) {
        setTasks(tData.data || []);
        setIsTasksOffline(false);
      } else {
        setIsTasksOffline(true);
      }
    } catch {
      setIsTasksOffline(true);
    }

    // Fetch Bugs
    try {
      const bRes = await fetch("/api/hub/bugs");
      const bData = await bRes.json();
      if (bRes.ok && bData.success) {
        setBugs(bData.data || []);
        setIsBugsOffline(false);
      } else {
        setIsBugsOffline(true);
      }
    } catch {
      setIsBugsOffline(true);
    }

    // Fetch Projects
    try {
      const pRes = await fetch("/api/hub/projects");
      const pData = await pRes.json();
      if (pRes.ok && pData.success) setProjects(pData.data || []);
    } catch {
      // silent
    }

    // Fetch Events
    try {
      const eRes = await fetch("/api/hub/events");
      const eData = await eRes.json();
      if (eRes.ok && eData.success) setEvents(eData.data || []);
    } catch {
      // silent
    }

    // Fetch Content
    try {
      const cRes = await fetch("/api/hub/content");
      const cData = await cRes.json();
      if (cRes.ok && cData.success) setContentItems(cData.data || []);
    } catch {
      // silent
    }

    // Fetch Members
    try {
      const mRes = await fetch("/api/hub/members");
      const mData = await mRes.json();
      if (mRes.ok && mData.success) setMembers(mData.data || []);
    } catch {
      // silent
    }

    // Fetch Recruitment Candidates (if role permits)
    if (session.role === "ADMIN" || session.role === "CORE_TEAM") {
      try {
        const rRes = await fetch("/api/hub/recruitment");
        const rData = await rRes.json();
        if (rRes.ok && rData.success) {
          setApplications(rData.data || []);
          setIsRecruitmentOffline(false);
        } else {
          setIsRecruitmentOffline(true);
        }
      } catch {
        setIsRecruitmentOffline(true);
      }

      // Fetch Invitations
      try {
        const invRes = await fetch("/api/hub/invitations");
        const invData = await invRes.json();
        if (invRes.ok && invData.success) setInvitations(invData.data || []);
      } catch {
        // silent
      }

      // Fetch Audit Logs
      try {
        const aRes = await fetch("/api/hub/audit");
        const aData = await aRes.json();
        if (aRes.ok && aData.success) setAuditLogs(aData.data || []);
      } catch {
        // silent
      }
    }
  }, [session]);

  useEffect(() => {
    fetchLiveHubData();
  }, [fetchLiveHubData]);

  // Keyboard shortcut listener for Command Palette (⌘K)
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

  const handleLogout = async () => {
    try {
      await fetch("/api/hub/auth", { method: "DELETE" });
    } catch {
      // silent
    }
    setSession(null);
  };

  // Optimistic task toggling with persistent PATCH
  const toggleTaskStatus = async (id: string) => {
    const previousTasks = [...tasks];
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const nextStatus = targetTask.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      const res = await fetch(`/api/hub/tasks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to persist task update");
    } catch (err) {
      console.error("[Task Update Rollback]:", err);
      sound.playError();
      setTasks(previousTasks);
    }
  };

  // Optimistic bug status update
  const handleUpdateBugStatus = async (id: string, newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    const previousBugs = [...bugs];

    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    try {
      const res = await fetch(`/api/hub/bugs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to persist bug update");
    } catch (err) {
      console.error("[Bug Update Rollback]:", err);
      sound.playError();
      setBugs(previousBugs);
    }
  };

  // Optimistic candidate status update
  const handleUpdateCandidateStatus = async (id: string, newStatus: ApplicationStatus) => {
    const previousApplications = [...applications];

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );

    try {
      const res = await fetch(`/api/hub/recruitment/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to persist recruitment status update");
    } catch (err) {
      console.error("[Candidate Status Rollback]:", err);
      sound.playError();
      setApplications(previousApplications);
    }
  };

  // Event stage mutation
  const handleUpdateEventStage = async (id: string, stage: EventLifecycleStage) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, stage } : e)));
    try {
      await fetch(`/api/hub/events?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
    } catch {
      // silent
    }
  };

  // Content stage mutation
  const handleUpdateContentStage = async (id: string, stage: ContentWorkflowStage) => {
    setContentItems((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
    try {
      await fetch(`/api/hub/content?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
    } catch {
      // silent
    }
  };

  // Generate invitation token
  const handleCreateInvitation = async (role: HubRole, wing: string) => {
    try {
      const res = await fetch("/api/hub/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, wing }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        sound.playSuccess();
        setInvitations((prev) => [data.data, ...prev]);
      }
    } catch {
      sound.playError();
    }
  };

  // Trigger CSV export
  const handleExportCsv = (type: "recruitment" | "tasks" | "bugs" | "audit" | "projects") => {
    sound.playClick();
    window.open(`/api/hub/export?type=${type}`, "_blank");
  };

  const handleAddTask = async (newTask: TaskItem) => {
    try {
      const res = await fetch("/api/hub/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setTasks((prev) => [data.data, ...prev]);
      } else {
        sound.playError();
      }
    } catch {
      sound.playError();
    }
  };

  const handleAddBug = async (newBug: BugItem) => {
    try {
      const res = await fetch("/api/hub/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBug),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setBugs((prev) => [data.data, ...prev]);
      } else {
        sound.playError();
      }
    } catch {
      sound.playError();
    }
  };

  if (isAuthChecking) {
    return (
      <div className="w-full min-h-screen bg-wds-bg flex items-center justify-center font-pixel text-xs text-wds-yellow">
        <span>&gt;_ INITIALIZING SECURE WDS OPERATING SYSTEM...</span>
      </div>
    );
  }

  if (!session) {
    return <HubAuthGuard onAuthenticated={(s) => setSession(s)} />;
  }

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
        session={session}
        onLogout={handleLogout}
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
                <span className="font-pixel text-xs text-wds-yellow">WDS_OS_NAV.SH</span>
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
              bugs={bugs}
              isTasksOffline={isTasksOffline}
              isBugsOffline={isBugsOffline}
              onRetry={fetchLiveHubData}
              onToggleTask={toggleTaskStatus}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
            />
          )}

          {activeTab === "projects" && <ProjectView projects={projects} />}

          {activeTab === "tasks" && (
            <TaskView
              tasks={tasks}
              isOffline={isTasksOffline}
              onRetry={fetchLiveHubData}
              onToggleTask={toggleTaskStatus}
              onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
              onExportCsv={() => handleExportCsv("tasks")}
            />
          )}

          {activeTab === "bugs" && (
            <BugView
              bugs={bugs}
              isOffline={isBugsOffline}
              onRetry={fetchLiveHubData}
              onUpdateBugStatus={handleUpdateBugStatus}
              onOpenNewBugModal={() => setNewBugModalOpen(true)}
            />
          )}

          {activeTab === "recruitment" && (
            <RecruitmentView
              applications={applications}
              isOffline={isRecruitmentOffline}
              userRole={session.role}
              onRetry={fetchLiveHubData}
              onUpdateStatus={handleUpdateCandidateStatus}
              onExportCsv={() => handleExportCsv("recruitment")}
            />
          )}

          {activeTab === "events" && (
            <EventView
              events={events}
              onUpdateStage={handleUpdateEventStage}
            />
          )}

          {activeTab === "content" && (
            <ContentView
              contentItems={contentItems}
              onUpdateStage={handleUpdateContentStage}
            />
          )}

          {activeTab === "assets" && <AssetView assets={assets} />}

          {activeTab === "websites" && <WebsiteView />}

          {activeTab === "members" && (
            <MemberView
              members={members}
              invitations={invitations}
              userRole={session.role}
              onCreateInvitation={handleCreateInvitation}
            />
          )}

          {activeTab === "audit" && (
            <AuditView
              logs={auditLogs}
              onExportAudit={() => handleExportCsv("audit")}
            />
          )}

          {activeTab === "documentation" && <DocumentationView />}

          {activeTab === "settings" && (
            <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
              <div className="font-pixel text-sm text-wds-yellow pb-2 border-b border-wds-yellow/30">
                &gt;_ SYSTEM ACCESS &amp; CREDENTIAL CONFIGURATION
              </div>
              <div className="text-xs text-wds-muted space-y-2 leading-relaxed">
                <div>
                  Active User: <strong className="text-wds-white">{session.username}</strong>
                </div>
                <div>
                  Role Clearance: <span className="text-wds-yellow font-pixel">{session.role}</span>
                </div>
                <div>
                  Assigned Wing: <span className="text-wds-white">{session.wing}</span>
                </div>
                <div className="pt-3 border-t border-wds-yellow/20">
                  To rotate master access keys or update Notion database bindings, modify server environment variables in Vercel or <code>.env.local</code>.
                </div>
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
