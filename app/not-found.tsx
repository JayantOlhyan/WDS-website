"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { sound } from "@/lib/soundEffects";
import {
  AlertTriangle,
  Home,
  Compass,
  RefreshCw,
  Terminal,
  FolderGit2,
} from "lucide-react";

export default function NotFound() {
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = () => {
    sound.playClick();
    setIsPinging(true);
    setPingStatus("PINGING ROUTER 127.0.0.1...");
    setTimeout(() => {
      setPingStatus("ROUTE DEFUNCT [HTTP 404]. RECOMMENDED NODE: /");
      setIsPinging(false);
    }, 600);
  };

  return (
    <div className="flex-1 w-full min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-wds-bg bg-grid-lines font-mono relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-wds-yellow/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full z-10 space-y-6">
        <TerminalWindow title="WDS_KERNEL :: ERROR_404_PAGE_NOT_FOUND.SYS" statusText="OFFLINE">
          <div className="p-6 sm:p-10 space-y-6 text-center">
            {/* Header section */}
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center p-3 border-2 border-wds-red bg-wds-red/10 text-wds-red shadow-pixel-yellow mb-1">
                <AlertTriangle className="w-10 h-10 animate-pulse" />
              </div>
              <h1 className="font-pixel text-4xl sm:text-5xl text-wds-yellow tracking-wider">
                404
              </h1>
              <div className="font-pixel text-sm sm:text-base text-wds-white">
                &gt;_ SIGNAL LOST: ROUTE NOT FOUND
              </div>
              <p className="text-xs sm:text-sm text-wds-muted max-w-md mx-auto leading-relaxed">
                The requested URL path or subsystem does not exist in the WDS MSIT digital ecosystem.
              </p>
            </div>

            {/* Diagnostic Terminal View */}
            <div className="p-4 bg-wds-card border-2 border-wds-yellow/30 text-left text-xs font-mono space-y-2 text-wds-muted relative">
              <div className="flex items-center justify-between text-[10px] text-wds-muted border-b border-wds-yellow/20 pb-2 mb-2">
                <span className="text-wds-yellow font-bold">SYSTEM DIAGNOSTIC LOG</span>
                <span>STATUS: 404_NOT_FOUND</span>
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-wds-yellow">&gt; WDS_OS v2026.4:~$</span> route --verify location
                </div>
                <div className="text-wds-red font-bold">
                  [ERROR] 404: Target node address is unmapped or moved.
                </div>
                <div className="text-wds-muted text-[11px]">
                  Subsystem: Webpack App Router Core | Host: localhost
                </div>
              </div>

              {pingStatus && (
                <div className="pt-2 border-t border-wds-yellow/20 text-wds-green font-bold animate-pulse">
                  &gt; {pingStatus}
                </div>
              )}
            </div>

            {/* Quick Diagnostic Actions */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <PixelButton
                  href="/"
                  variant="primary"
                  size="md"
                  onClick={() => sound.playClick()}
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>RETURN HOME →</span>
                  </div>
                </PixelButton>

                <PixelButton
                  href="/recruitment/apply"
                  variant="outline"
                  size="md"
                  onClick={() => sound.playClick()}
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>APPLY 2026</span>
                  </div>
                </PixelButton>

                <button
                  type="button"
                  onClick={handlePing}
                  disabled={isPinging}
                  className="px-4 py-2 bg-wds-bg border border-wds-yellow/40 text-wds-yellow hover:border-wds-yellow text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
                  <span>PING ROUTE</span>
                </button>
              </div>

              {/* Quick Links Row */}
              <div className="flex items-center justify-center gap-4 text-xs text-wds-muted pt-2 font-mono">
                <Link
                  href="/projects"
                  onClick={() => sound.playClick()}
                  className="hover:text-wds-yellow transition-colors underline underline-offset-4 flex items-center gap-1"
                >
                  <FolderGit2 className="w-3.5 h-3.5" /> Projects
                </Link>
                <span>•</span>
                <Link
                  href="/terminal"
                  onClick={() => sound.playClick()}
                  className="hover:text-wds-yellow transition-colors underline underline-offset-4 flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" /> Terminal
                </Link>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
