"use client";

import React from "react";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sound } from "@/lib/soundEffects";
import {
  Terminal,
  Sparkles,
  Code2,
  Bug,
  Users,
  Star,
} from "lucide-react";

export default function TerminalPage() {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines font-mono">
      {/* Top Header & Tip Box (Matching Poster #7) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-3xl sm:text-4xl text-wds-yellow leading-tight">
            &gt;_ WDS TERMINAL
          </h1>
          <p className="text-xs sm:text-sm text-wds-muted mt-2">
            Explore. Discover. Get Connected.
          </p>
        </div>

        {/* Tip Box */}
        <div className="p-4 border border-wds-yellow bg-wds-card shadow-pixel-yellow-sm max-w-md">
          <div className="font-pixel text-[11px] text-wds-yellow mb-1 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-wds-yellow" />
            <span>TIP: Try some commands</span>
          </div>
          <p className="text-xs text-wds-muted">
            Type <code className="text-wds-yellow font-bold">&apos;help&apos;</code> to see all available system commands.
          </p>
        </div>
      </div>

      {/* Main Terminal Shell + Sidebar Matrix */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Shell (8 cols) */}
        <div className="lg:col-span-8">
          <TerminalWindow
            title="WDS@MSIT:~"
            theme="dark-header"
            className="w-full min-h-[500px]"
          >
            <InteractiveTerminal compact={false} initialCommands={["whoami", "ls projects/", "status"]} />
          </TerminalWindow>
        </div>

        {/* Available Commands Cheatsheet Sidebar (4 cols) */}
        <div className="lg:col-span-4 p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow flex flex-col justify-between space-y-6">
          <div>
            <div className="font-pixel text-xs text-wds-yellow pb-3 border-b border-wds-yellow/30">
              AVAILABLE COMMANDS
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">whoami</span>
                <span className="text-wds-muted text-[11px]">Show identity</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">ls projects/</span>
                <span className="text-wds-muted text-[11px]">List all projects</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">status</span>
                <span className="text-wds-muted text-[11px]">System status</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">events</span>
                <span className="text-wds-muted text-[11px]">Upcoming events</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">team</span>
                <span className="text-wds-muted text-[11px]">Meet the team</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">join</span>
                <span className="text-wds-muted text-[11px]">How to join WDS</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-wds-border-dim pb-1.5">
                <span className="text-wds-yellow font-bold">help</span>
                <span className="text-wds-muted text-[11px]">Show this help</span>
              </div>

              <div className="flex justify-between items-baseline pb-1.5">
                <span className="text-wds-yellow font-bold">clear</span>
                <span className="text-wds-muted text-[11px]">Clear terminal</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-wds-bg border border-wds-yellow/20 text-[11px] text-wds-muted">
            <span className="text-wds-yellow font-bold">KEYBOARD SHORTCUTS:</span>
            <div className="mt-1 space-y-0.5 text-[10px]">
              <div>• <span className="text-wds-white">Up / Down Arrow</span>: Command History</div>
              <div>• <span className="text-wds-white">Enter</span>: Execute command</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Banner (Matching Poster #7) */}
      <div className="mt-10 p-4 sm:p-6 bg-wds-bg-secondary border-2 border-wds-yellow shadow-pixel-yellow grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-center">
        {/* Status 1 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-wds-green font-pixel text-[10px]">
            <span className="w-2 h-2 rounded-full bg-wds-green animate-pulse" />
            <span>SYSTEM STATUS</span>
          </div>
          <div className="font-pixel text-sm text-wds-green mt-1">ONLINE</div>
        </div>

        {/* Status 2 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-wds-muted font-pixel text-[9px]">
            <Code2 className="w-3.5 h-3.5 text-wds-yellow" />
            <span>LINES OF CODE</span>
          </div>
          <div className="font-pixel text-sm text-wds-yellow mt-1">25,642+</div>
        </div>

        {/* Status 3 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-wds-muted font-pixel text-[9px]">
            <Bug className="w-3.5 h-3.5 text-wds-yellow" />
            <span>BUGS SQUASHED</span>
          </div>
          <div className="font-pixel text-sm text-wds-yellow mt-1">100+</div>
        </div>

        {/* Status 4 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-wds-muted font-pixel text-[9px]">
            <Users className="w-3.5 h-3.5 text-wds-yellow" />
            <span>ACTIVE MEMBERS</span>
          </div>
          <div className="font-pixel text-sm text-wds-yellow mt-1">200+</div>
        </div>

        {/* Status 5 */}
        <div className="flex flex-col items-center col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-wds-muted font-pixel text-[9px]">
            <Star className="w-3.5 h-3.5 text-wds-yellow" />
            <span>IMPACT</span>
          </div>
          <div className="font-pixel text-sm text-wds-yellow mt-1">50K+ USERS</div>
        </div>
      </div>
    </div>
  );
}
