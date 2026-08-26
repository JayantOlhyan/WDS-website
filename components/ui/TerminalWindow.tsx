import React from "react";

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  theme?: "yellow-header" | "dark-header";
  statusText?: string;
}

export function TerminalWindow({
  title = "WDS_TERMINAL.EXE",
  children,
  className = "",
  theme = "yellow-header",
  statusText,
}: TerminalWindowProps) {
  return (
    <div className={`relative border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow ${className}`}>
      {/* 4 Outer Corner Accents */}
      <span className="absolute -top-[4px] -left-[4px] w-2.5 h-2.5 bg-wds-yellow" />
      <span className="absolute -top-[4px] -right-[4px] w-2.5 h-2.5 bg-wds-yellow" />
      <span className="absolute -bottom-[4px] -left-[4px] w-2.5 h-2.5 bg-wds-yellow" />
      <span className="absolute -bottom-[4px] -right-[4px] w-2.5 h-2.5 bg-wds-yellow" />

      {/* Header Bar */}
      {theme === "yellow-header" ? (
        <div className="flex items-center justify-between bg-wds-yellow px-3 py-1.5 text-wds-bg font-mono font-bold text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px]">&gt;_</span>
            <span className="tracking-wider uppercase truncate">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            {statusText && (
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] bg-wds-bg text-wds-yellow font-pixel">
                {statusText}
              </span>
            )}
            {/* Retro PC Window Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Minimize"
                className="w-3.5 h-3.5 border border-wds-bg flex items-center justify-center text-[10px] leading-none hover:bg-wds-bg hover:text-wds-yellow"
              >
                _
              </button>
              <button
                type="button"
                aria-label="Maximize"
                className="w-3.5 h-3.5 border border-wds-bg flex items-center justify-center text-[10px] leading-none hover:bg-wds-bg hover:text-wds-yellow"
              >
                □
              </button>
              <button
                type="button"
                aria-label="Close"
                className="w-3.5 h-3.5 border border-wds-bg flex items-center justify-center text-[10px] leading-none hover:bg-wds-bg hover:text-wds-yellow"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-wds-bg border-b border-wds-yellow/40 px-3 py-2 text-wds-yellow font-mono text-xs select-none">
          {/* Classic Unix Terminal Header (3 dots) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-wds-yellow" />
            <span className="w-2.5 h-2.5 rounded-none bg-wds-yellow" />
            <span className="w-2.5 h-2.5 rounded-none bg-wds-yellow" />
          </div>

          <div className="font-pixel text-[10px] text-wds-yellow tracking-widest truncate mx-2">
            {title}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-pixel text-wds-green">ONLINE</span>
          </div>
        </div>
      )}

      {/* Window Body */}
      <div className="p-4 sm:p-6 overflow-hidden">{children}</div>
    </div>
  );
}
