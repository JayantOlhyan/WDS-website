"use client";

import React, { useEffect } from "react";
import { PixelButton } from "@/components/ui/PixelButton";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[WDS Application Error Boundary Caught]:", error);
  }, [error]);

  return (
    <div className="flex-1 w-full min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-wds-bg bg-grid-lines font-mono">
      <div className="max-w-xl w-full">
        <TerminalWindow title="FATAL: RUNTIME_EXCEPTION" statusText="ERROR">
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="inline-flex items-center justify-center p-3 border-2 border-wds-red bg-wds-red/10 text-wds-red mb-2">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="font-pixel text-xl sm:text-2xl text-wds-yellow">
                &gt;_ SYSTEM ERROR DETECTED
              </h1>
              <p className="text-xs sm:text-sm text-wds-muted max-w-md mx-auto leading-relaxed">
                An unexpected exception occurred while rendering this view.
              </p>
            </div>

            {/* Error Diagnostics */}
            <div className="p-4 bg-wds-bg border border-wds-red/40 text-left text-xs font-mono space-y-1.5 text-wds-muted">
              <div>
                <span className="text-wds-yellow">WDS@MSIT:~$</span> cat /var/log/kernel.panic
              </div>
              <div className="text-wds-red font-bold">
                [EXCEPTION] {error.message || "An unknown client execution error occurred."}
              </div>
              {error.digest && (
                <div className="text-[10px] text-wds-muted">
                  Digest ID: <code>{error.digest}</code>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-auto px-6 py-2.5 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold border-2 border-wds-yellow hover:bg-[#fff176] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY SYSTEM →</span>
              </button>

              <PixelButton href="/" variant="outline" size="md" className="w-full sm:w-auto">
                <div className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>RETURN HOME</span>
                </div>
              </PixelButton>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
