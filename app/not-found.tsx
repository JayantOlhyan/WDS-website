"use client";

import React from "react";
import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { sound } from "@/lib/soundEffects";
import { AlertTriangle, Home, Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 w-full min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-wds-bg bg-grid-lines font-mono">
      <div className="max-w-xl w-full">
        <TerminalWindow title="ERROR 404: ROUTE_NOT_FOUND" statusText="OFFLINE">
          <div className="p-6 sm:p-8 space-y-6 text-center">
            {/* 404 ASCII Header */}
            <div className="inline-flex items-center justify-center p-3 border-2 border-wds-red bg-wds-red/10 text-wds-red mb-2">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="font-pixel text-2xl sm:text-3xl text-wds-yellow">
                &gt;_ 404: PAGE NOT FOUND
              </h1>
              <p className="text-xs sm:text-sm text-wds-muted max-w-md mx-auto leading-relaxed">
                The requested URL or subsystem does not exist in the WDS MSIT digital ecosystem.
              </p>
            </div>

            {/* Terminal Diagnostic Block */}
            <div className="p-4 bg-wds-bg border border-wds-yellow/30 text-left text-xs font-mono space-y-1.5 text-wds-muted">
              <div>
                <span className="text-wds-yellow">WDS@MSIT:~$</span> route --verify location
              </div>
              <div className="text-wds-red font-bold">
                [ERROR] 404: Target node address unreachable.
              </div>
              <div className="text-wds-muted text-[11px]">
                Hint: Check the command palette (⌘K) or return to home directory.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <PixelButton href="/" variant="primary" size="md" className="w-full sm:w-auto">
                <div className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>RETURN HOME →</span>
                </div>
              </PixelButton>

              <PixelButton href="/terminal" variant="outline" size="md" className="w-full sm:w-auto">
                <div className="flex items-center justify-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>OPEN TERMINAL</span>
                </div>
              </PixelButton>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
