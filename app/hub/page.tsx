"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function WdsHubPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [tasks, setTasks] = useState([
    { id: 1, title: "Update homepage content", date: "23 May", done: true },
    { id: 2, title: "Fix responsive issues - About page", date: "24 May", done: true },
    { id: 3, title: "Add new events to events page", date: "25 May", done: false },
    { id: 4, title: "Review and update site links", date: "27 May", done: false },
    { id: 5, title: "Monthly content review", date: "30 May", done: false },
  ]);

  const toggleTask = (id: number) => {
    sound.playClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const navItems = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "tasks", label: "TASKS", icon: CheckSquare },
    { id: "assets", label: "ASSETS", icon: FolderArchive },
    { id: "faculty", label: "FACULTY", icon: GraduationCap },
    { id: "college", label: "COLLEGE INFO", icon: Building },
    { id: "links", label: "WEBSITES & LINKS", icon: Link2 },
    { id: "bugs", label: "BUGS", icon: Bug },
    { id: "content", label: "CONTENT", icon: FileText },
    { id: "events", label: "EVENTS", icon: Calendar },
    { id: "resources", label: "RESOURCES", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-wds-bg font-mono text-wds-white bg-grid-lines">
      {/* Top Outer Frame Wrapper */}
      <div className="max-w-[1600px] mx-auto w-full p-3 sm:p-6">
        <div className="border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow relative">
          {/* 4 Corner Accents */}
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-wds-yellow" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-wds-yellow" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-wds-yellow" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-wds-yellow" />

          {/* Top Bar with Hub Title & Search & Profile */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b-2 border-wds-yellow/30 bg-wds-bg-secondary">
            <div className="flex items-center gap-3">
              <img
                src="/images/wds-logo.png"
                alt="WDS Logo"
                className="w-9 h-9 object-contain"
              />
              <span className="font-pixel text-sm sm:text-base text-wds-yellow">
                &gt;_ WDS WEBSITE HUB
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 border border-wds-green/50 bg-wds-green/10 text-wds-green font-pixel text-[9px]">
                PRODUCTION MONITOR
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-wds-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="SEARCH EVERYTHING..."
                  className="w-full pl-8 pr-3 py-1.5 bg-wds-bg border border-wds-yellow/40 text-xs text-wds-white outline-none focus:border-wds-yellow font-mono"
                />
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => sound.playClick()}
                className="relative p-2 border border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow text-wds-yellow"
                title="3 New Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-wds-yellow text-wds-bg font-pixel text-[8px] flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-2 px-3 py-1 border border-wds-yellow/40 bg-wds-bg text-xs">
                <User className="w-4 h-4 text-wds-yellow" />
                <div>
                  <div className="font-pixel text-[9px] text-wds-yellow">WDS ADMIN</div>
                  <div className="text-[8px] text-wds-muted">CORE LEAD</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Sidebar (3 cols) & Content (9 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
            {/* Left Sidebar (3 cols) */}
            <div className="lg:col-span-3 border-r-2 border-wds-yellow/30 p-4 space-y-6 bg-wds-bg">
              {/* Terminal Label */}
              <div>
                <div className="font-pixel text-[10px] text-wds-muted mb-3">&gt;_ WDS HUB TERMINAL</div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          setActiveTab(item.id);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs text-left transition-colors ${
                          isActive
                            ? "bg-wds-yellow text-wds-bg font-bold shadow-pixel-yellow-sm"
                            : "text-wds-muted hover:bg-wds-card hover:text-wds-white"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="tracking-wider">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* System Section */}
              <div className="pt-4 border-t border-wds-yellow/20 space-y-1">
                <div className="font-pixel text-[9px] text-wds-muted mb-2">&gt;_ SYSTEM</div>
                <button
                  onClick={() => sound.playClick()}
                  className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-wds-muted hover:text-wds-white"
                >
                  <Settings className="w-4 h-4" />
                  <span>SETTINGS</span>
                </button>
                <button
                  onClick={() => sound.playClick()}
                  className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-wds-muted hover:text-wds-white"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>TRASH</span>
                </button>
              </div>

              {/* Bottom System Status Box */}
              <div className="p-3 border border-wds-yellow/40 bg-wds-card text-xs space-y-1.5">
                <div className="font-pixel text-[9px] text-wds-yellow">&gt;_ SYSTEM STATUS</div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-wds-muted">STATUS</span>
                  <span className="text-wds-green font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-wds-green animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-wds-muted">SERVERS</span>
                  <span className="text-wds-white font-bold">: ACTIVE</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-wds-muted">LAST SYNC</span>
                  <span className="text-wds-yellow font-bold">: 2 MIN AGO</span>
                </div>
              </div>
            </div>

            {/* Right Main Dashboard Area (9 cols) */}
            <div className="lg:col-span-9 p-4 sm:p-6 space-y-6">
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wds-yellow/20">
                <div>
                  <h2 className="font-pixel text-base sm:text-lg text-wds-yellow flex items-center gap-2">
                    <span>&gt;_</span>
                    <span>WELCOME BACK, WDS ADMIN</span>
                  </h2>
                  <p className="text-xs text-wds-muted mt-0.5">
                    Here&apos;s what&apos;s happening with your society website and active platforms.
                  </p>
                </div>

                <div className="p-2 border border-wds-yellow/30 bg-wds-bg text-right text-xs">
                  <div className="text-[10px] text-wds-muted">&gt;_ TODAY</div>
                  <div className="font-pixel text-[11px] text-wds-yellow">26 MAY 2026, 10:30 PM</div>
                </div>
              </div>

              {/* 7 Metric Cards (Matching Poster #8) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: "TOTAL TASKS", val: "128", sub: "All tasks", color: "text-wds-yellow" },
                  { label: "PENDING TASKS", val: "42", sub: "Awaiting action", color: "text-wds-yellow" },
                  { label: "COMPLETED TASKS", val: "86", sub: "Tasks done", color: "text-wds-green" },
                  { label: "ASSETS", val: "64", sub: "Total files", color: "text-wds-white" },
                  { label: "FACULTY", val: "12", sub: "Faculty members", color: "text-wds-white" },
                  { label: "WEBSITES", val: "8", sub: "Active links", color: "text-wds-yellow" },
                  { label: "OPEN BUGS", val: "7", sub: "Need attention", color: "text-wds-red" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-wds-yellow/40 bg-wds-bg text-center flex flex-col justify-between"
                  >
                    <div className="text-[9px] text-wds-muted uppercase truncate">{stat.label}</div>
                    <div className={`font-pixel text-lg sm:text-xl my-1 ${stat.color}`}>{stat.val}</div>
                    <div className="text-[8px] text-wds-muted truncate">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Middle Section: Task Progress Circular Gauge & Upcoming Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Task Progress Ring & Breakdown (5 cols) */}
                <div className="md:col-span-5 p-5 border border-wds-yellow/40 bg-wds-bg flex flex-col justify-between">
                  <div className="font-pixel text-xs text-wds-yellow mb-4 flex items-center justify-between">
                    <span>&gt;_ TASK PROGRESS</span>
                    <span className="text-[9px] text-wds-muted">[—]</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
                    {/* Retro Pixel Circular Ring Simulation */}
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center border-4 border-wds-yellow rounded-full bg-wds-card shadow-pixel-yellow-sm">
                      <div className="text-center">
                        <div className="font-pixel text-lg text-wds-yellow">67%</div>
                        <div className="text-[8px] text-wds-muted">OVERALL PROGRESS</div>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="w-full space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-wds-muted mb-0.5">
                          <span>● COMPLETED</span>
                          <span className="text-wds-white font-bold">86</span>
                        </div>
                        <div className="h-1.5 bg-wds-card border border-wds-yellow/30">
                          <div className="h-full bg-wds-yellow w-[67%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-wds-muted mb-0.5">
                          <span>● IN PROGRESS</span>
                          <span className="text-wds-white font-bold">29</span>
                        </div>
                        <div className="h-1.5 bg-wds-card border border-wds-yellow/30">
                          <div className="h-full bg-wds-yellow w-[35%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-wds-muted mb-0.5">
                          <span>● PENDING</span>
                          <span className="text-wds-white font-bold">42</span>
                        </div>
                        <div className="h-1.5 bg-wds-card border border-wds-yellow/30">
                          <div className="h-full bg-wds-yellow w-[40%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Tasks Checklist (7 cols) */}
                <div className="md:col-span-7 p-5 border border-wds-yellow/40 bg-wds-bg flex flex-col justify-between">
                  <div className="font-pixel text-xs text-wds-yellow mb-3 flex items-center justify-between">
                    <span>&gt;_ UPCOMING TASKS</span>
                    <button
                      onClick={() => sound.playClick()}
                      className="text-[9px] text-wds-yellow hover:underline"
                    >
                      VIEW ALL →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center justify-between p-2.5 border border-wds-border-dim bg-wds-card hover:border-wds-yellow text-xs cursor-pointer select-none transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 border flex items-center justify-center text-[10px] ${
                              task.done
                                ? "border-wds-yellow bg-wds-yellow text-wds-bg font-bold"
                                : "border-wds-border-dim"
                            }`}
                          >
                            {task.done ? "✓" : ""}
                          </div>
                          <span className={task.done ? "line-through text-wds-muted" : "text-wds-white"}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-wds-muted">{task.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Recent Activity & Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Recent Activity (6 cols) */}
                <div className="md:col-span-6 p-5 border border-wds-yellow/40 bg-wds-bg">
                  <div className="font-pixel text-xs text-wds-yellow mb-3 flex items-center justify-between">
                    <span>&gt;_ RECENT ACTIVITY</span>
                    <span className="text-[9px] text-wds-muted">VIEW ALL</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5 text-wds-muted">
                      <CheckSquare className="w-3.5 h-3.5 text-wds-yellow shrink-0 mt-0.5" />
                      <div>
                        <span className="text-wds-white font-bold">WDS Admin</span> completed &quot;Update navigation links&quot;
                        <div className="text-[10px] text-wds-muted">2h ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-wds-muted">
                      <FileText className="w-3.5 h-3.5 text-wds-yellow shrink-0 mt-0.5" />
                      <div>
                        <span className="text-wds-white font-bold">Priyanshu</span> uploaded &quot;WDS_Logo_V2.png&quot;
                        <div className="text-[10px] text-wds-muted">5h ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-wds-muted">
                      <Bug className="w-3.5 h-3.5 text-wds-green shrink-0 mt-0.5" />
                      <div>
                        <span className="text-wds-white font-bold">Bug #23</span> marked as resolved
                        <div className="text-[10px] text-wds-muted">1d ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links (6 cols) */}
                <div className="md:col-span-6 p-5 border border-wds-yellow/40 bg-wds-bg">
                  <div className="font-pixel text-xs text-wds-yellow mb-3">
                    &gt;_ QUICK LINKS
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { name: "WDS Website", href: "/" },
                      { name: "GitHub Repository", href: "https://github.com/wds-msit", ext: true },
                      { name: "Bug Report Form", href: "/projects#bug-hunt" },
                      { name: "Website Analytics", href: "/hub" },
                      { name: "Content Calendar", href: "/hub" },
                      { name: "Brand Assets", href: "/about" },
                      { name: "Media Drive", href: "/hub" },
                      { name: "Meeting Notes", href: "/hub" },
                    ].map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        onClick={() => sound.playClick()}
                        className="p-2 border border-wds-border-dim bg-wds-card hover:border-wds-yellow hover:text-wds-yellow flex items-center justify-between text-[11px] transition-colors"
                        {...(link.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        <span className="truncate">{link.name}</span>
                        <ArrowRight className="w-3 h-3 shrink-0 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
