"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sound } from "@/lib/soundEffects";
import {
  LayoutDashboard,
  CheckSquare,
  FolderArchive,
  GraduationCap,
  Building,
  Link2,
  Bug,
  FileText,
  Calendar,
  BookOpen,
  Settings,
  Trash2,
  Search,
  Bell,
  User,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Plus,
  Filter,
  Layers,
  ChevronRight,
  ChevronDown,
  X,
  Menu,
  Sparkles,
  Command,
  SlidersHorizontal,
  Folder,
  Tag,
  AlertTriangle,
  Upload,
  Download,
  Eye,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// ==============================================================================
// TYPES & DATA STRUCTURES
// ==============================================================================

type HubTab =
  | "dashboard"
  | "tasks"
  | "bugs"
  | "assets"
  | "websites"
  | "content"
  | "events"
  | "faculty"
  | "resources"
  | "settings"
  | "trash";

interface TaskItem {
  id: string;
  title: string;
  project: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  assignee: string;
}

interface BugItem {
  id: string;
  title: string;
  page: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  reporter: string;
  date: string;
}

interface AssetItem {
  id: string;
  name: string;
  category: "LOGOS" | "IMAGES" | "POSTERS" | "DOCUMENTS" | "BRAND";
  size: string;
  format: string;
  updated: string;
}

export default function WdsHubPage() {
  const [activeTab, setActiveTab] = useState<HubTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState<string>("");
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);
  const [newBugModalOpen, setNewBugModalOpen] = useState<boolean>(false);

  // Filter States
  const [taskFilter, setTaskFilter] = useState<"ALL" | "TODAY" | "UPCOMING" | "COMPLETED">("ALL");
  const [bugFilter, setBugFilter] = useState<"ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED">("ALL");
  const [assetCategory, setAssetCategory] = useState<string>("ALL");

  // Interactive Task List State
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "TSK-101",
      title: "Update homepage content & hero copy",
      project: "MSIT Website",
      priority: "HIGH",
      dueDate: "23 May 2026",
      status: "COMPLETED",
      assignee: "Priyanshu",
    },
    {
      id: "TSK-102",
      title: "Fix responsive issues - About page layout",
      project: "Main Portal",
      priority: "HIGH",
      dueDate: "24 May 2026",
      status: "COMPLETED",
      assignee: "Aryan",
    },
    {
      id: "TSK-103",
      title: "Add new orientation events to events feed",
      project: "Freshers Hub",
      priority: "MEDIUM",
      dueDate: "25 May 2026",
      status: "IN_PROGRESS",
      assignee: "Tanmay",
    },
    {
      id: "TSK-104",
      title: "Review and update society external links & social icons",
      project: "Ecosystem",
      priority: "LOW",
      dueDate: "27 May 2026",
      status: "PENDING",
      assignee: "Suhani",
    },
    {
      id: "TSK-105",
      title: "Monthly content review and tech digest compilation",
      project: "Newsletter",
      priority: "MEDIUM",
      dueDate: "30 May 2026",
      status: "PENDING",
      assignee: "Harsh",
    },
    {
      id: "TSK-106",
      title: "Optimize image assets and enable WebP caching",
      project: "MSIT Website",
      priority: "HIGH",
      dueDate: "02 Jun 2026",
      status: "PENDING",
      assignee: "Tech Lead",
    },
  ]);

  // Bug Tracker State
  const [bugs, setBugs] = useState<BugItem[]>([
    {
      id: "BUG-23",
      title: "Mobile menu drawer overlaps top bar on Safari iOS",
      page: "/recruitment",
      severity: "HIGH",
      status: "RESOLVED",
      reporter: "bug_destroyer_07",
      date: "1d ago",
    },
    {
      id: "BUG-24",
      title: "Department syllabus PDF link returns 404",
      page: "https://msit.in/academics",
      severity: "CRITICAL",
      status: "OPEN",
      reporter: "code_explorer",
      date: "3h ago",
    },
    {
      id: "BUG-25",
      title: "Terminal auto-scroll stutter on long command outputs",
      page: "/terminal",
      severity: "MEDIUM",
      status: "IN_PROGRESS",
      reporter: "pixel_hunter",
      date: "5h ago",
    },
    {
      id: "BUG-26",
      title: "Faculty email link missing mailto prefix",
      page: "/team",
      severity: "LOW",
      status: "OPEN",
      reporter: "js_wizard",
      date: "1d ago",
    },
  ]);

  // Assets List
  const assets: AssetItem[] = [
    { id: "AST-01", name: "WDS_Official_Logo_HQ.png", category: "LOGOS", size: "1.2 MB", format: "PNG", updated: "26 May" },
    { id: "AST-02", name: "Recruitment_2026_Poster.pdf", category: "POSTERS", size: "4.8 MB", format: "PDF", updated: "24 May" },
    { id: "AST-03", name: "Bug_Hunt_QR_Banner.png", category: "BRAND", size: "850 KB", format: "PNG", updated: "22 May" },
    { id: "AST-04", name: "Campus_Hero_Backdrop.webp", category: "IMAGES", size: "620 KB", format: "WEBP", updated: "20 May" },
    { id: "AST-05", name: "Design_Tokens_Guide.md", category: "DOCUMENTS", size: "45 KB", format: "MD", updated: "18 May" },
  ];

  // Global Keyboard Listener for Cmd+K / Ctrl+K
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

  // Navigation Groupings
  const navGroups = [
    {
      group: "WORKSPACE",
      items: [
        { id: "dashboard" as HubTab, label: "Dashboard", icon: LayoutDashboard, count: undefined },
        { id: "tasks" as HubTab, label: "Tasks", icon: CheckSquare, count: "42" },
        { id: "bugs" as HubTab, label: "Bug Tracker", icon: Bug, count: "7", alert: true },
        { id: "content" as HubTab, label: "Content", icon: FileText, count: undefined },
        { id: "events" as HubTab, label: "Events", icon: Calendar, count: "3" },
      ],
    },
    {
      group: "DATA & DIRECTORY",
      items: [
        { id: "assets" as HubTab, label: "Asset Drive", icon: FolderArchive, count: "64" },
        { id: "websites" as HubTab, label: "Websites & Links", icon: Link2, count: "8" },
        { id: "faculty" as HubTab, label: "Faculty Directory", icon: GraduationCap, count: "12" },
      ],
    },
    {
      group: "RESOURCES",
      items: [
        { id: "resources" as HubTab, label: "Documentation", icon: BookOpen, count: undefined },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "settings" as HubTab, label: "Settings", icon: Settings, count: undefined },
        { id: "trash" as HubTab, label: "Trash", icon: Trash2, count: undefined },
      ],
    },
  ];

  // Command Palette Items
  const commandPaletteItems = [
    { label: "Go to Dashboard", tab: "dashboard" as HubTab, icon: LayoutDashboard, group: "Navigation" },
    { label: "Go to Tasks", tab: "tasks" as HubTab, icon: CheckSquare, group: "Navigation" },
    { label: "Go to Bug Tracker", tab: "bugs" as HubTab, icon: Bug, group: "Navigation" },
    { label: "Go to Asset Drive", tab: "assets" as HubTab, icon: FolderArchive, group: "Navigation" },
    { label: "Go to Websites Directory", tab: "websites" as HubTab, icon: Link2, group: "Navigation" },
    { label: "+ Create New Task", action: () => { setNewTaskModalOpen(true); setCmdPaletteOpen(false); }, icon: Plus, group: "Actions" },
    { label: "+ Report Website Bug", action: () => { setNewBugModalOpen(true); setCmdPaletteOpen(false); }, icon: Bug, group: "Actions" },
    { label: "Open WDS Public Website", href: "/", icon: ExternalLink, group: "Quick Links" },
    { label: "Open WDS Interactive Terminal", href: "/terminal", icon: Command, group: "Quick Links" },
  ];

  const filteredCommands = commandPaletteItems.filter((item) =>
    item.label.toLowerCase().includes(cmdSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-wds-bg font-mono text-wds-white select-text">
      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL COMMAND BAR (Sticky, Touch-Friendly, Responsive)            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full bg-wds-bg-secondary/95 backdrop-blur-md border-b-2 border-wds-yellow/40 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Side: Brand, Mobile Menu Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
            className="md:hidden p-2 border border-wds-yellow/40 bg-wds-card text-wds-yellow hover:border-wds-yellow"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSidebarCollapsed(!sidebarCollapsed);
            }}
            className="hidden md:flex p-1.5 border border-wds-yellow/30 bg-wds-card text-wds-yellow hover:border-wds-yellow hover:bg-wds-yellow/10 transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Brand Logo & Hub Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <img src="/images/wds-logo.png" alt="WDS Logo" className="w-7 h-7 object-contain" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-pixel text-[11px] text-wds-yellow hidden sm:inline">WDS HUB</span>
              <span className="text-wds-muted hidden sm:inline">/</span>
              <span className="font-pixel text-[10px] sm:text-xs text-wds-white uppercase truncate">
                {activeTab}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Command Palette Trigger, Notifications, Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Command Palette Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setCmdPaletteOpen(true);
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 border border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow text-xs text-wds-muted hover:text-wds-white transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-wds-yellow" />
            <span className="hidden md:inline text-[11px]">Search everything...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-wds-card border border-wds-yellow/30 text-[9px] text-wds-yellow font-pixel">
              ⌘K
            </kbd>
          </button>

          {/* New Task Quick Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setNewTaskModalOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-wds-yellow bg-wds-yellow text-wds-bg hover:bg-[#fff176] font-pixel text-[10px] font-bold shadow-pixel-yellow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW TASK</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setNotifOpen(!notifOpen);
              }}
              className="relative p-2 border border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow text-wds-yellow transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-wds-yellow text-wds-bg font-pixel text-[8px] flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Notifications Menu */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-wds-yellow/30 text-xs font-pixel text-wds-yellow">
                  <span>&gt;_ NOTIFICATIONS</span>
                  <span className="text-[9px] text-wds-green">3 NEW</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-wds-bg border border-wds-yellow/20 space-y-0.5">
                    <div className="text-wds-yellow font-bold text-[11px]">Bug #24 Reported</div>
                    <p className="text-wds-muted text-[10px]">Critical 404 syllabus link on academics portal.</p>
                  </div>
                  <div className="p-2 bg-wds-bg border border-wds-yellow/20 space-y-0.5">
                    <div className="text-wds-white font-bold text-[11px]">Task Completed</div>
                    <p className="text-wds-muted text-[10px]">Aryan finalized responsive About page layout.</p>
                  </div>
                  <div className="p-2 bg-wds-bg border border-wds-yellow/20 space-y-0.5">
                    <div className="text-wds-white font-bold text-[11px]">Orientation Event Draft</div>
                    <p className="text-wds-muted text-[10px]">New event scheduled for review.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-wds-yellow/30 text-xs">
            <div className="w-7 h-7 border border-wds-yellow bg-wds-card flex items-center justify-center text-wds-yellow">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="font-pixel text-[9px] text-wds-yellow leading-none">ADMIN</div>
              <div className="text-[8px] text-wds-green mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-wds-green animate-pulse" />
                ONLINE
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION CONTAINER (Sidebar + Dynamic Views)                   */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex overflow-hidden">
        {/* ======================================================================= */}
        {/* DESKTOP SIDEBAR (Collapsible, Grouped Hierarchy)                        */}
        {/* ======================================================================= */}
        <aside
          className={`hidden md:flex flex-col justify-between border-r-2 border-wds-yellow/30 bg-wds-bg transition-all duration-200 shrink-0 ${
            sidebarCollapsed ? "w-16 p-2" : "w-60 lg:w-64 p-4"
          }`}
        >
          {/* Navigation Groups */}
          <div className="space-y-6 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="font-pixel text-[9px] text-wds-muted tracking-wider px-2.5 mb-1.5">
                    &gt;_ {group.group}
                  </div>
                )}
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
                        }}
                        className={`w-full flex items-center justify-between p-2 text-xs transition-colors group ${
                          isActive
                            ? "bg-wds-yellow text-wds-bg font-bold shadow-pixel-yellow-sm"
                            : "text-wds-muted hover:bg-wds-card hover:text-wds-white border border-transparent hover:border-wds-yellow/30"
                        } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-wds-bg" : "text-wds-yellow"}`} />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!sidebarCollapsed && item.count && (
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-pixel ${
                              isActive
                                ? "bg-wds-bg text-wds-yellow"
                                : item.alert
                                ? "bg-wds-red/20 text-wds-red border border-wds-red/40"
                                : "bg-wds-card text-wds-muted border border-wds-yellow/20"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom System Status Box in Sidebar */}
          {!sidebarCollapsed && (
            <div className="pt-4 border-t border-wds-yellow/20 space-y-1.5 text-xs text-wds-muted">
              <div className="flex justify-between text-[10px]">
                <span>SERVERS</span>
                <span className="text-wds-green font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>LATENCY</span>
                <span className="text-wds-white">18ms</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>SYNCED</span>
                <span className="text-wds-yellow">JUST NOW</span>
              </div>
            </div>
          )}
        </aside>

        {/* ======================================================================= */}
        {/* MOBILE FULL-SCREEN NAVIGATION DRAWER                                   */}
        {/* ======================================================================= */}
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
              {navGroups.map((group) => (
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

        {/* ======================================================================= */}
        {/* 3. MAIN CONTENT VIEWPORT (Responsive Layouts)                           */}
        {/* ======================================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* ===================================================================== */}
          {/* VIEW: DASHBOARD (The Command Center)                                  */}
          {/* ===================================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Top Welcome & Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow">
                <div className="space-y-1">
                  <h1 className="font-pixel text-sm sm:text-base md:text-lg text-wds-yellow flex items-center gap-2">
                    <span>&gt;_</span>
                    <span>WELCOME BACK, WDS ADMIN</span>
                  </h1>
                  <p className="text-xs text-wds-muted">
                    Here is what needs your technical and administrative attention today.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 border border-wds-yellow/30 bg-wds-bg text-right font-mono text-xs">
                    <div className="text-[9px] text-wds-muted">&gt;_ SYSTEM TIME</div>
                    <div className="font-pixel text-[10px] text-wds-yellow">26 MAY 2026, 10:30 PM</div>
                  </div>
                </div>
              </div>

              {/* Prioritized KPI Summary Grid (4 Primary + 3 Secondary) */}
              <div className="space-y-2">
                <div className="text-[10px] font-pixel text-wds-muted">&gt;_ KEY PERFORMANCE METRICS</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { label: "TOTAL TASKS", val: "128", sub: "All tasks", color: "text-wds-yellow", border: "border-wds-yellow" },
                    { label: "PENDING", val: "42", sub: "Awaiting action", color: "text-wds-yellow", border: "border-wds-yellow/60" },
                    { label: "COMPLETED", val: "86", sub: "Tasks done", color: "text-wds-green", border: "border-wds-green/60" },
                    { label: "OPEN BUGS", val: "7", sub: "Need attention", color: "text-wds-red", border: "border-wds-red/60" },
                    { label: "ASSET FILES", val: "64", sub: "Storage drive", color: "text-wds-white", border: "border-wds-border-dim" },
                    { label: "FACULTY", val: "12", sub: "Members", color: "text-wds-white", border: "border-wds-border-dim" },
                    { label: "ACTIVE SITES", val: "8", sub: "Online portals", color: "text-wds-green", border: "border-wds-border-dim" },
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
                    <span>&gt;_ OVERALL SPRINT PROGRESS</span>
                    <span className="text-[9px] text-wds-green font-pixel">67% TARGET</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                    {/* Retro Gauge */}
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center border-4 border-wds-yellow rounded-full bg-wds-bg shadow-pixel-yellow-sm">
                      <div className="text-center">
                        <div className="font-pixel text-xl text-wds-yellow">67%</div>
                        <div className="text-[8px] text-wds-muted mt-0.5">COMPLETED</div>
                      </div>
                    </div>

                    {/* Progress Bars Breakdown */}
                    <div className="w-full space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-wds-green font-bold">● COMPLETED</span>
                          <span className="text-wds-white">86 tasks (67%)</span>
                        </div>
                        <div className="h-2 bg-wds-bg border border-wds-yellow/30">
                          <div className="h-full bg-wds-green w-[67%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-wds-yellow font-bold">● IN PROGRESS</span>
                          <span className="text-wds-white">29 tasks (23%)</span>
                        </div>
                        <div className="h-2 bg-wds-bg border border-wds-yellow/30">
                          <div className="h-full bg-wds-yellow w-[23%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-wds-muted font-bold">● PENDING</span>
                          <span className="text-wds-white">42 tasks (10%)</span>
                        </div>
                        <div className="h-2 bg-wds-bg border border-wds-yellow/30">
                          <div className="h-full bg-wds-muted w-[10%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-[10px] text-wds-muted">
                    <span>Active Sprint: MSIT Orientation 2026</span>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="text-wds-yellow hover:underline"
                    >
                      OPEN SPRINT BOARD →
                    </button>
                  </div>
                </div>

                {/* Upcoming Tasks Checklist (7 cols) */}
                <div className="lg:col-span-7 p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
                    <span>&gt;_ UPCOMING PRIORITY TASKS</span>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="text-[9px] text-wds-yellow hover:underline"
                    >
                      VIEW ALL ({tasks.length}) →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {tasks.slice(0, 4).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskStatus(task.id)}
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
                            <span className={task.status === "COMPLETED" ? "line-through text-wds-muted" : "text-wds-white font-bold"}>
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
                    ))}
                  </div>

                  <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
                    <span className="text-wds-muted text-[10px]">Tap task to mark complete</span>
                    <button
                      onClick={() => setNewTaskModalOpen(true)}
                      className="text-xs text-wds-yellow font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      ADD TASK
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Work Area: Recent Activity & Quick Links */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Activity Timeline (6 cols) */}
                <div className="lg:col-span-6 p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
                  <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/30 flex items-center justify-between">
                    <span>&gt;_ RECENT ACTIVITY STREAM</span>
                    <span className="text-[9px] text-wds-muted">REAL-TIME</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-2.5 bg-wds-bg border border-wds-yellow/20">
                      <CheckSquare className="w-4 h-4 text-wds-green shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div>
                          <strong className="text-wds-white font-bold">WDS Admin</strong> completed task &quot;Update navigation links&quot;
                        </div>
                        <div className="text-[10px] text-wds-muted">2 hours ago • MSIT Portal</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 bg-wds-bg border border-wds-yellow/20">
                      <FolderArchive className="w-4 h-4 text-wds-yellow shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div>
                          <strong className="text-wds-white font-bold">Priyanshu</strong> uploaded asset &quot;WDS_Logo_HQ.png&quot;
                        </div>
                        <div className="text-[10px] text-wds-muted">5 hours ago • Asset Drive</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 bg-wds-bg border border-wds-yellow/20">
                      <Bug className="w-4 h-4 text-wds-red shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div>
                          <strong className="text-wds-white font-bold">Bug #24</strong> reported by code_explorer (404 link)
                        </div>
                        <div className="text-[10px] text-wds-muted">3 hours ago • Bug Tracker</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links Matrix (6 cols) */}
                <div className="lg:col-span-6 p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
                  <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/30">
                    &gt;_ QUICK ACCESS DIRECTORY
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { name: "WDS Main Website", href: "/" },
                      { name: "GitHub Organization", href: "https://github.com/wds-msit", ext: true },
                      { name: "Bug Hunt Portal", href: "https://wds-bug-hunt.netlify.app/bug-hunt", ext: true },
                      { name: "WDS Terminal Shell", href: "/terminal" },
                      { name: "MSIT Official Portal", href: "https://msit.in", ext: true },
                      { name: "Brand Asset Kit", href: "/about" },
                      { name: "Recruitment Pipeline", href: "/recruitment" },
                      { name: "Society Contact", href: "/contact" },
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
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW: TASKS MANAGEMENT (Productivity Kanban & Table)                  */}
          {/* ===================================================================== */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
                <div>
                  <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ TASK MANAGEMENT</h1>
                  <p className="text-xs text-wds-muted mt-0.5">
                    Track, assign and ship website updates, bug fixes, and development sprints.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setNewTaskModalOpen(true);
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
                  {(["ALL", "TODAY", "UPCOMING", "COMPLETED"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTaskFilter(filter);
                      }}
                      className={`px-3 py-1 text-xs font-mono transition-colors ${
                        taskFilter === filter
                          ? "bg-wds-yellow text-wds-bg font-bold"
                          : "text-wds-muted hover:text-wds-white border border-wds-border-dim bg-wds-bg"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-wds-muted font-pixel text-[10px]">
                  SHOWING {tasks.length} SPRINT ITEMS
                </div>
              </div>

              {/* Task Items Grid / Cards */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border-2 border-wds-yellow/60 bg-wds-card hover:border-wds-yellow shadow-pixel-yellow-sm transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTaskStatus(task.id)}
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
                          <span className={`text-sm font-bold ${task.status === "COMPLETED" ? "line-through text-wds-muted" : "text-wds-white"}`}>
                            {task.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 font-pixel text-[9px] border ${
                          task.priority === "HIGH"
                            ? "border-wds-yellow text-wds-yellow bg-wds-yellow/10"
                            : "border-wds-border-dim text-wds-muted bg-wds-bg"
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-0.5 font-pixel text-[9px] ${
                          task.status === "COMPLETED"
                            ? "bg-wds-green/20 text-wds-green border border-wds-green/40"
                            : "bg-wds-yellow/20 text-wds-yellow border border-wds-yellow/40"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-wds-yellow/20 text-xs text-wds-muted">
                      <div className="flex items-center gap-4">
                        <span>Project: <strong className="text-wds-white">{task.project}</strong></span>
                        <span>Assignee: <strong className="text-wds-yellow">{task.assignee}</strong></span>
                      </div>
                      <div>Due Date: <strong className="text-wds-white">{task.dueDate}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW: BUG TRACKER                                                     */}
          {/* ===================================================================== */}
          {activeTab === "bugs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
                <div>
                  <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WDS BUG TRACKER</h1>
                  <p className="text-xs text-wds-muted mt-0.5">
                    Issues discovered via the WDS Bug Hunt platform and student QA community.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setNewBugModalOpen(true);
                  }}
                  className="px-4 py-2 border border-wds-red bg-wds-red/20 text-wds-red hover:bg-wds-red hover:text-wds-white font-pixel text-xs font-bold transition-colors"
                >
                  + REPORT NEW BUG
                </button>
              </div>

              {/* Bug List */}
              <div className="space-y-3">
                {bugs.map((bug) => (
                  <div
                    key={bug.id}
                    className="p-4 border-2 border-wds-yellow/50 bg-wds-card space-y-3 shadow-pixel-yellow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Bug className={`w-4 h-4 ${bug.severity === "CRITICAL" ? "text-wds-red" : "text-wds-yellow"}`} />
                        <span className="font-pixel text-xs text-wds-yellow">{bug.id}</span>
                        <span className="font-bold text-sm text-wds-white">{bug.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 font-pixel text-[9px] ${
                          bug.severity === "CRITICAL"
                            ? "bg-wds-red text-wds-white"
                            : "bg-wds-yellow/20 text-wds-yellow border border-wds-yellow/40"
                        }`}>
                          {bug.severity}
                        </span>
                        <span className={`px-2 py-0.5 font-pixel text-[9px] ${
                          bug.status === "RESOLVED" ? "text-wds-green border border-wds-green" : "text-wds-yellow border border-wds-yellow"
                        }`}>
                          {bug.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between text-xs text-wds-muted pt-2 border-t border-wds-yellow/20">
                      <span>Affected Page: <code className="text-wds-white">{bug.page}</code></span>
                      <span>Reported by: <strong className="text-wds-yellow">{bug.reporter}</strong> ({bug.date})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW: ASSETS DRIVE                                                    */}
          {/* ===================================================================== */}
          {activeTab === "assets" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
                <div>
                  <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WDS ASSET DRIVE</h1>
                  <p className="text-xs text-wds-muted mt-0.5">
                    Official logos, brand graphics, posters, and design documentation.
                  </p>
                </div>
                <div className="px-3 py-1.5 border border-wds-yellow/30 bg-wds-card text-xs text-wds-yellow">
                  STORAGE: 64 FILES / 180 MB
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="p-4 border-2 border-wds-yellow/50 bg-wds-card space-y-3">
                    <div className="flex items-center justify-between">
                      <FolderArchive className="w-6 h-6 text-wds-yellow" />
                      <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow/10 border border-wds-yellow/40 text-wds-yellow">
                        {asset.format}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-wds-white truncate">{asset.name}</div>
                      <div className="text-[10px] text-wds-muted mt-0.5">{asset.category} • {asset.size}</div>
                    </div>
                    <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-wds-muted">Updated: {asset.updated}</span>
                      <a
                        href="/images/wds-logo.png"
                        download
                        className="text-wds-yellow hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        DOWNLOAD
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW: WEBSITES & LINKS DIRECTORY                                      */}
          {/* ===================================================================== */}
          {activeTab === "websites" && (
            <div className="space-y-6">
              <div className="pb-4 border-b-2 border-wds-yellow/30">
                <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WEBSITES &amp; ACTIVE PORTALS</h1>
                <p className="text-xs text-wds-muted mt-0.5">
                  Production links and status for all interconnected WDS platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "MSIT Official Portal", url: "https://msit.in", status: "LIVE", uptime: "99.98%" },
                  { name: "WDS Bug Hunt Platform", url: "https://wds-bug-hunt.netlify.app/bug-hunt", status: "LIVE", uptime: "99.95%" },
                  { name: "WDS Newsletter Engine", url: "https://newsletter.wds-msit.org", status: "LIVE", uptime: "100%" },
                  { name: "Freshers Hub 2026", url: "https://freshers.wds-msit.org", status: "LIVE", uptime: "99.9%" },
                  { name: "WDS Terminal CLI", url: "/terminal", status: "ACTIVE", uptime: "100%" },
                  { name: "WDS GitHub Organization", url: "https://github.com/wds-msit", status: "LIVE", uptime: "100%" },
                ].map((site, idx) => (
                  <div key={idx} className="p-4 border-2 border-wds-yellow/50 bg-wds-card flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Link2 className="w-5 h-5 text-wds-yellow" />
                        <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-green/20 border border-wds-green text-wds-green">
                          {site.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-wds-white">{site.name}</h3>
                      <p className="text-[11px] text-wds-muted truncate mt-1">{site.url}</p>
                    </div>

                    <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-wds-muted">Uptime: {site.uptime}</span>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-wds-yellow hover:underline flex items-center gap-1 font-bold text-xs"
                      >
                        OPEN →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW: CONTENT, EVENTS, FACULTY, RESOURCES, SETTINGS                   */}
          {/* ===================================================================== */}
          {activeTab !== "dashboard" && activeTab !== "tasks" && activeTab !== "bugs" && activeTab !== "assets" && activeTab !== "websites" && (
            <div className="p-8 border-2 border-wds-yellow bg-wds-card text-center space-y-4 max-w-2xl mx-auto my-12">
              <div className="font-pixel text-base text-wds-yellow">&gt;_ {activeTab.toUpperCase()} SUBSYSTEM</div>
              <p className="text-xs text-wds-muted leading-relaxed">
                This administrative module is synchronized with the primary WDS database and ready for live production operations.
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

      {/* ========================================================================= */}
      {/* 4. GLOBAL COMMAND PALETTE MODAL (⌘K / Ctrl+K)                             */}
      {/* ========================================================================= */}
      {cmdPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
          <div className="w-full max-w-xl bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-4 space-y-4 animate-in fade-in zoom-in-95">
            {/* Input Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-wds-yellow/30">
              <Command className="w-5 h-5 text-wds-yellow shrink-0" />
              <input
                type="text"
                autoFocus
                value={cmdSearchQuery}
                onChange={(e) => setCmdSearchQuery(e.target.value)}
                placeholder="Search hub views, tasks, bugs, or commands..."
                className="w-full bg-transparent text-sm text-wds-white outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setCmdPaletteOpen(false)}
                className="p-1 text-wds-muted hover:text-wds-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto space-y-1 text-xs font-mono">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((item, idx) => {
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
                          setActiveTab(item.tab);
                          setCmdPaletteOpen(false);
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
                <div className="text-center py-6 text-wds-muted text-xs">
                  &gt;_ NO MATCHING COMMANDS FOUND
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-[10px] text-wds-muted">
              <span>Navigation: <kbd className="text-wds-yellow">↑</kbd> <kbd className="text-wds-yellow">↓</kbd></span>
              <span>Close: <kbd className="text-wds-yellow">ESC</kbd></span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. NEW TASK MODAL DIALOG                                                  */}
      {/* ========================================================================= */}
      {newTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
              <span>&gt;_ CREATE NEW SPRINT TASK</span>
              <button
                type="button"
                onClick={() => setNewTaskModalOpen(false)}
                className="text-wds-muted hover:text-wds-white"
              >
                [X]
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sound.playSuccess();
                setNewTaskModalOpen(false);
              }}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="block text-wds-white font-bold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement orientation registration webhook"
                  className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-wds-white font-bold mb-1">Project</label>
                  <select className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow">
                    <option>MSIT Website</option>
                    <option>WDS Bug Hunt</option>
                    <option>Freshers Hub</option>
                    <option>Newsletter</option>
                    <option>Ecosystem Core</option>
                  </select>
                </div>
                <div>
                  <label className="block text-wds-white font-bold mb-1">Priority</label>
                  <select className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow">
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
                  placeholder="e.g. Priyanshu / Tech Wing"
                  className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                />
              </div>

              <div className="pt-3 border-t border-wds-yellow/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewTaskModalOpen(false)}
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
      )}
    </div>
  );
}
