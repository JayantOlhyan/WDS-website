"use client";

import React from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050708] text-[#F5F0DF] font-mono min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full border-2 border-[#FFD600] bg-[#081014] p-8 text-center space-y-6 shadow-[4px_4px_0px_0px_#FFD600]">
          <div className="inline-flex p-3 border-2 border-[#FF3366] bg-[#FF3366]/10 text-[#FF3366]">
            <AlertOctagon className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="font-mono text-3xl text-[#FF3366] font-bold">500: FATAL GLOBAL ERROR</h1>
            <p className="text-xs text-[#9A9D9A]">
              A critical root exception was encountered in the WDS MSIT kernel layer.
            </p>
          </div>

          <div className="p-4 bg-[#050708] border border-[#FF3366]/40 text-left text-xs font-mono space-y-1 text-[#9A9D9A]">
            <div className="text-[#FFD600]">&gt; WDS_ROOT_KERNEL:~$ panic --dump</div>
            <div className="text-[#FF3366] font-bold">{error.message || "Root Layout Exception"}</div>
            {error.digest && <div className="text-[10px]">Digest: {error.digest}</div>}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FFD600] text-[#050708] font-bold text-xs border-2 border-[#FFD600] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESTART ROOT CORE</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-transparent text-[#F5F0DF] font-bold text-xs border border-[#FFD600]/50 hover:border-[#FFD600] flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>RETURN HOME</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
