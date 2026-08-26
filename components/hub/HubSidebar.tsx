"use client";

import React from "react";
import { sound } from "@/lib/soundEffects";
import { HUB_NAV_GROUPS } from "@/lib/hub/constants";
import { HubTab } from "@/lib/hub/types";

interface HubSidebarProps {
  activeTab: HubTab;
  onSelectTab: (tab: HubTab) => void;
  collapsed: boolean;
}

export function HubSidebar({ activeTab, onSelectTab, collapsed }: HubSidebarProps) {
  return (
    <aside
      className={`hidden md:flex flex-col justify-between border-r-2 border-wds-yellow/30 bg-wds-bg transition-all duration-200 shrink-0 ${
        collapsed ? "w-16 p-2" : "w-60 lg:w-64 p-4"
      }`}
    >
      <div className="space-y-6 overflow-y-auto pr-1">
        {HUB_NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
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
                      onSelectTab(item.id);
                    }}
                    className={`w-full flex items-center justify-between p-2 text-xs transition-colors group ${
                      isActive
                        ? "bg-wds-yellow text-wds-bg font-bold shadow-pixel-yellow-sm"
                        : "text-wds-muted hover:bg-wds-card hover:text-wds-white border border-transparent hover:border-wds-yellow/30"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-wds-bg" : "text-wds-yellow"}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && item.count && (
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

      {!collapsed && (
        <div className="pt-4 border-t border-wds-yellow/20 space-y-1.5 text-xs text-wds-muted">
          <div className="flex justify-between text-[10px]">
            <span>SYSTEM STATE</span>
            <span className="text-wds-green font-bold">OPERATIONAL</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>COMMUNITY</span>
            <span className="text-wds-white">ACTIVE</span>
          </div>
        </div>
      )}
    </aside>
  );
}
