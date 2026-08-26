"use client";

import React from "react";
import { sound } from "@/lib/soundEffects";
import { Search, Bell, User, Plus, X, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { HubTab } from "@/lib/hub/types";
import { HubUserSession } from "@/lib/auth";

interface HubHeaderProps {
  activeTab: HubTab;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  mobileDrawerOpen: boolean;
  onToggleMobileDrawer: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewTaskModal: () => void;
  notifOpen: boolean;
  onToggleNotif: () => void;
  session?: HubUserSession | null;
  onLogout?: () => void;
}

export function HubHeader({
  activeTab,
  sidebarCollapsed,
  onToggleSidebar,
  mobileDrawerOpen,
  onToggleMobileDrawer,
  onOpenCommandPalette,
  onOpenNewTaskModal,
  notifOpen,
  onToggleNotif,
  session,
  onLogout,
}: HubHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-wds-bg-secondary/95 backdrop-blur-md border-b-2 border-wds-yellow/40 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Brand, Mobile Drawer Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Drawer Trigger */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleMobileDrawer();
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
            onToggleSidebar();
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

      {/* Right: Command Palette Trigger, New Task, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenCommandPalette();
          }}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 border border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow text-xs text-wds-muted hover:text-wds-white transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-wds-yellow" />
          <span className="hidden md:inline text-[11px]">Search hub...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-wds-card border border-wds-yellow/30 text-[9px] text-wds-yellow font-pixel">
            ⌘K
          </kbd>
        </button>

        {/* New Task Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenNewTaskModal();
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
              onToggleNotif();
            }}
            className="relative p-2 border border-wds-yellow/40 bg-wds-bg hover:border-wds-yellow text-wds-yellow transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-wds-yellow text-wds-bg font-pixel text-[8px] flex items-center justify-center font-bold">
              2
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-3 z-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-wds-yellow/30 text-xs font-pixel text-wds-yellow">
                <span>&gt;_ NOTIFICATIONS</span>
                <span className="text-[9px] text-wds-green">2 ACTIVE</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-wds-bg border border-wds-yellow/20 space-y-0.5">
                  <div className="text-wds-yellow font-bold text-[11px]">Bug #24 Verified</div>
                  <p className="text-wds-muted text-[10px]">Academics syllabus target attribute updated.</p>
                </div>
                <div className="p-2 bg-wds-bg border border-wds-yellow/20 space-y-0.5">
                  <div className="text-wds-white font-bold text-[11px]">Recruitment Active</div>
                  <p className="text-wds-muted text-[10px]">2026 application cycle is accepting submissions.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-wds-yellow/30 text-xs">
          <div className="w-7 h-7 border border-wds-yellow bg-wds-card flex items-center justify-center text-wds-yellow">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="font-pixel text-[9px] text-wds-yellow leading-none">
              {session?.role || "GUEST"}
            </div>
            <div className="text-[8px] text-wds-muted mt-0.5 truncate max-w-[100px]">
              {session?.username || "Authenticated"}
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onLogout();
              }}
              className="ml-1 px-1.5 py-0.5 border border-wds-border-dim hover:border-wds-red text-wds-muted hover:text-wds-red text-[9px] font-pixel transition-colors"
              title="Logout from Hub"
            >
              EXIT
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
