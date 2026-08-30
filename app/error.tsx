"use client";

import React, { useEffect, useState } from "react";
import { PixelButton } from "@/components/ui/PixelButton";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { sound } from "@/lib/soundEffects";
import { AlertOctagon, RotateCcw, Home, Terminal, Copy, Check } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("[WDS Application Error Boundary Caught]:", error);
  }, [error]);

  const copyDiagnostic = () => {
    sound.playClick();
    const details = `[WDS ERROR 500 LOG]\nMessage: ${error.message || "Unknown Runtime Exception"}\nDigest: ${error.digest || "N/A"}\nTimestamp: ${new Date().toISOString()}`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-wds-bg bg-grid-lines font-mono relative overflow-hidden">
      {/* Red ambient glow for error alert */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-wds-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full z-10 space-y-6">
        <TerminalWindow title="WDS_KERNEL :: FATAL_500_SYSTEM_EXCEPTION.SYS" statusText="CRASH">
          <div className="p-6 sm:p-10 space-y-6 text-center">
            {/* Header section */}
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center p-3 border-2 border-wds-red bg-wds-red/10 text-wds-red shadow-pixel-yellow mb-1">
                <AlertOctagon className="w-10 h-10 animate-pulse" />
              </div>
              <h1 className="font-pixel text-4xl sm:text-5xl text-wds-red tracking-wider">
                500
              </h1>
              <div className="font-pixel text-sm sm:text-base text-wds-white">
                &gt;_ FATAL SYSTEM EXCEPTION
              </div>
              <p className="text-xs sm:text-sm text-wds-muted max-w-md mx-auto leading-relaxed">
                An unhandled runtime error occurred while executing the request.
              </p>
            </div>

            {/* Error Diagnostics Stack Box */}
            <div className="p-4 bg-wds-card border-2 border-wds-red/40 text-left text-xs font-mono space-y-2 text-wds-muted relative">
              <div className="flex items-center justify-between text-[10px] text-wds-muted border-b border-wds-red/20 pb-2 mb-2">
                <span className="text-wds-red font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-wds-red animate-ping" /> KERNEL PANIC STACK TRACE
                </span>
                <span>STATUS: 500_INTERNAL_ERROR</span>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-wds-yellow">&gt; WDS_OS:~$</span> cat /var/log/runtime_fault.log
                </div>
                <div className="text-wds-red font-bold break-words pt-1">
                  [EXCEPTION] {error.message || "An unexpected application failure occurred."}
                </div>
                {error.digest && (
                  <div className="text-[11px] text-wds-muted pt-1">
                    System Digest ID: <code className="text-wds-yellow">{error.digest}</code>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-wds-red/20 flex justify-end">
                <button
                  type="button"
                  onClick={copyDiagnostic}
                  className="text-[11px] text-wds-muted hover:text-wds-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-wds-green" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "COPIED TO CLIPBOARD" : "COPY STACK DETAILS"}</span>
                </button>
              </div>
            </div>

            {/* Recovery Action Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  reset();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold border-2 border-wds-yellow hover:bg-[#fff176] shadow-pixel-yellow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY SYSTEM CORE →</span>
              </button>

              <PixelButton
                href="/"
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => sound.playClick()}
              >
                <div className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>RETURN HOME</span>
                </div>
              </PixelButton>

              <PixelButton
                href="/terminal"
                variant="ghost"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => sound.playClick()}
              >
                <div className="flex items-center justify-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>CLI TERMINAL</span>
                </div>
              </PixelButton>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
