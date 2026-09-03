"use client";

import React, { useState, useEffect, useCallback } from "react";
import { sound } from "@/lib/soundEffects";
import { HubTab, TaskItem, BugItem, AssetItem } from "@/lib/hub/types";
import { INITIAL_HUB_ASSETS } from "@/lib/hub/constants";
import { CandidateApplication } from "@/lib/notion/recruitment";
import { SocietyProject } from "@/lib/repositories/ProjectRepository";
import { SocietyEvent, EventLifecycleStage } from "@/lib/repositories/EventRepository";
import { SocietyContentItem, ContentWorkflowStage } from "@/lib/repositories/ContentRepository";
import { SocietyMember, InvitationToken } from "@/lib/repositories/MemberRepository";
import { AuditLogEntry } from "@/lib/repositories/types";
import { HubUserSession } from "@/lib/auth";

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
import { AdminView } from "@/components/hub/AdminView";
import { HandoverView } from "@/components/hub/HandoverView";
import { CommandPalette } from "@/components/hub/CommandPalette";
import { TaskModal } from "@/components/hub/TaskModal";
import { BugModal } from "@/components/hub/BugModal";
import { EventModal } from "@/components/hub/EventModal";

export default function WdsHubPage() {
  const [session] = useState<HubUserSession>({
    username: "WDS Operator",
    role: "ADMIN",
    wing: "Core Operations",
  });

  const [activeTab, setActiveTab] = useState<HubTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);
  const [newBugModalOpen, setNewBugModalOpen] = useState<boolean>(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState<boolean>(false);

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
  const [members] = useState<SocietyMember[]>([]);
  const [invitations] = useState<InvitationToken[]>([]);
  const [auditLogs] = useState<AuditLogEntry[]>([]);
  const [assets] = useState<AssetItem[]>(INITIAL_HUB_ASSETS);

  // 1. Fetch Live Hub Subsystems
  const fetchLiveHubData = useCallback(async () => {
    // Fetch Tasks
    try {
      const tRes = await fetch("/api/tasks");
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
      const bRes = await fetch("/api/bugs");
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
      const pRes = await fetch("/api/projects");
      const pData = await pRes.json();
      if (pRes.ok && pData.success) setProjects(pData.data || []);
    } catch {
      // silent
    }

    // Fetch Events
    try {
      const eRes = await fetch("/api/events");
      const eData = await eRes.json();
      if (eRes.ok && eData.success) setEvents(eData.data || []);
    } catch {
      // silent
    }

    // Fetch Content
    try {
      const cRes = await fetch("/api/content");
      const cData = await cRes.json();
      if (cRes.ok && cData.success) setContentItems(cData.data || []);
    } catch {
      // silent
    }

    // Fetch Candidates/Recruitment
    try {
      const rRes = await fetch("/api/candidates");
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
  }, []);

  useEffect(() => {
    fetchLiveHubData();
  }, [fetchLiveHubData]);

  // 2. Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sound.modalOpen();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Task Mutations
  const toggleTaskStatus = async (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const currentStatus = targetTask.status;
    const nextStatus =
      currentStatus === "PENDING"
        ? "IN_PROGRESS"
        : currentStatus === "IN_PROGRESS"
        ? "COMPLETED"
        : "PENDING";

    const prevTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus === "PENDING" ? "TODO" : nextStatus }),
      });

      if (!res.ok) {
        setTasks(prevTasks);
        sound.error();
      } else {
        sound.confirm();
      }
    } catch {
      setTasks(prevTasks);
      sound.error();
    }
  };

  const handleAddTask = async (newTask: Omit<TaskItem, "id">) => {
    const optimisticId = `task-${Date.now()}`;
    const optimisticTask: TaskItem = { id: optimisticId, ...newTask };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === optimisticId ? data.data : t))
        );
        sound.confirm();
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== optimisticId));
        sound.error();
      }
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== optimisticId));
      sound.error();
    }
  };

  const handleAddProject = async (newProject: {
    name: string;
    description: string;
    lead: string;
    wing: string;
    type: string;
    techStack: string[];
    websiteUrl?: string;
    githubUrl?: string;
    status: "ACTIVE" | "MAINTENANCE" | "COMPLETED" | "PLANNING";
  }) => {
    const optimisticId = `project-${Date.now()}`;
    const slug = newProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const optimisticProject: SocietyProject = {
      id: optimisticId,
      slug,
      lastUpdated: new Date().toISOString(),
      ...newProject,
    };
    setProjects((prev) => [optimisticProject, ...prev]);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...newProject }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === optimisticId ? { ...optimisticProject, ...data.data } : p))
        );
        sound.confirm();
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== optimisticId));
        sound.error();
      }
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== optimisticId));
      sound.error();
    }
  };

  const handleCreateEvent = async (newEvent: any) => {
    const optimisticId = `event-${Date.now()}`;
    const optimisticEvent = { id: optimisticId, ...newEvent };
    setEvents((prev) => [optimisticEvent, ...prev]);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        const data = await res.json();
        setEvents((prev) =>
          prev.map((e) => (e.id === optimisticId ? data.data : e))
        );
        sound.confirm();
      } else {
        setEvents((prev) => prev.filter((e) => e.id !== optimisticId));
        sound.error();
      }
    } catch {
      setEvents((prev) => prev.filter((e) => e.id !== optimisticId));
      sound.error();
    }
  };

  // 4. Bug Mutations
  const handleAddBug = async (newBug: Omit<BugItem, "id">) => {
    const optimisticId = `bug-${Date.now()}`;
    const optimisticBug: BugItem = { id: optimisticId, ...newBug };
    setBugs((prev) => [optimisticBug, ...prev]);

    try {
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBug),
      });

      if (res.ok) {
        const data = await res.json();
        setBugs((prev) =>
          prev.map((b) => (b.id === optimisticId ? data.data : b))
        );
        sound.confirm();
      } else {
        setBugs((prev) => prev.filter((b) => b.id !== optimisticId));
        sound.error();
      }
    } catch {
      setBugs((prev) => prev.filter((b) => b.id !== optimisticId));
      sound.error();
    }
  };

  const handleUpdateBugStatus = async (id: string, status: BugItem["status"]) => {
    const prevBugs = [...bugs];
    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    try {
      const res = await fetch(`/api/bugs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        setBugs(prevBugs);
        sound.error();
      } else {
        sound.confirm();
      }
    } catch {
      setBugs(prevBugs);
      sound.error();
    }
  };

  const handleUpdateCandidateStatus = async (id: string, status: string, notes?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id
              ? {
                  ...app,
                  status: status as any,
                  ...(notes !== undefined ? { notes } : {}),
                }
              : app
          )
        );
        sound.confirm();
        return true;
      } else {
        sound.error();
        return false;
      }
    } catch {
      sound.error();
      return false;
    }
  };

  const handleUpdateEventStage = async (id: string, stage: EventLifecycleStage) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, stage } : e))
        );
        sound.confirm();
      }
    } catch {
      sound.error();
    }
  };

  const handleUpdateContentStage = async (id: string, stage: ContentWorkflowStage) => {
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        setContentItems((prev) =>
          prev.map((c) => (c.id === id ? { ...c, stage } : c))
        );
        sound.confirm();
      }
    } catch {
      sound.error();
    }
  };

  const handleCreateInvitation = async () => {};

  const handleExportCsv = async (type: string) => {
    window.open(`/api/hub/export?type=${type}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-wds-dark text-wds-white flex flex-col selection:bg-wds-yellow selection:text-wds-black">
      {/* 1. Header Navigation */}
      <HubHeader
        activeTab={activeTab}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        mobileDrawerOpen={mobileDrawerOpen}
        onToggleMobileDrawer={() => setMobileDrawerOpen((prev) => !prev)}
        onOpenCommandPalette={() => {
          sound.modalOpen();
          setCmdPaletteOpen(true);
        }}
        onOpenNewTaskModal={() => setNewTaskModalOpen(true)}
        notifOpen={notifOpen}
        onToggleNotif={() => setNotifOpen((prev) => !prev)}
        session={session}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <HubSidebar
          activeTab={activeTab}
          collapsed={sidebarCollapsed}
          onSelectTab={(tab) => {
            sound.tabSwitch();
            setActiveTab(tab);
          }}
        />

        {/* 3. Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
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

          {activeTab === "projects" && (
            <ProjectView projects={projects} onAddProject={handleAddProject} />
          )}

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
              onOpenNewEventModal={() => setNewEventModalOpen(true)}
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

          {activeTab === "handover" && (
            <HandoverView
              projects={projects}
              tasks={tasks}
              bugs={bugs}
            />
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <AdminView onExportData={handleExportCsv} />
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

      <EventModal
        isOpen={newEventModalOpen}
        onClose={() => setNewEventModalOpen(false)}
        onAddEvent={handleCreateEvent}
      />
    </div>
  );
}
