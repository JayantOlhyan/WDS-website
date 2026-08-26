import React from "react";

interface SectionHeaderProps {
  prompt?: string;
  title: string;
  subtitle?: string;
  highlightText?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  prompt = ">_",
  title,
  subtitle,
  highlightText,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-8 sm:mb-12 ${isCenter ? "text-center" : "text-left"} ${className}`}>
      {/* Pixel Header with Prompt and Checkers */}
      <div
        className={`flex items-center gap-3 mb-2.5 ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        {isCenter && (
          <div className="hidden sm:grid grid-cols-2 gap-1 w-5 h-5 opacity-80">
            <span className="w-2 h-2 bg-wds-yellow" />
            <span className="w-2 h-2 bg-transparent" />
            <span className="w-2 h-2 bg-transparent" />
            <span className="w-2 h-2 bg-wds-yellow" />
          </div>
        )}

        <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-wds-yellow tracking-tight leading-tight flex items-center gap-2 flex-wrap">
          <span className="text-wds-yellow opacity-90">{prompt}</span>
          <span className="text-wds-white hover:text-wds-yellow transition-colors">{title}</span>
        </h2>

        {isCenter && (
          <div className="hidden sm:grid grid-cols-2 gap-1 w-5 h-5 opacity-80">
            <span className="w-2 h-2 bg-transparent" />
            <span className="w-2 h-2 bg-wds-yellow" />
            <span className="w-2 h-2 bg-wds-yellow" />
            <span className="w-2 h-2 bg-transparent" />
          </div>
        )}
      </div>

      {/* Subtitle & Highlights */}
      {subtitle && (
        <p className="font-mono text-sm sm:text-base text-wds-muted max-w-2xl mx-auto leading-relaxed">
          {subtitle}{" "}
          {highlightText && (
            <span className="text-wds-yellow font-bold uppercase tracking-wider block sm:inline mt-1 sm:mt-0">
              {highlightText}
            </span>
          )}
        </p>
      )}

      {/* Retro Pixel Dashed Separator */}
      <div
        className={`mt-4 flex items-center gap-1 ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        <div className="h-[2px] w-12 bg-wds-yellow" />
        <div className="h-[2px] w-2 bg-wds-yellow" />
        <div className="h-[2px] w-2 bg-wds-yellow" />
        <div className="h-[2px] w-48 bg-wds-border-dim" />
      </div>
    </div>
  );
}
