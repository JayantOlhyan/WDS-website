import React from "react";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "active" | "elevated" | "hud";
  hoverEffect?: boolean;
}

export function PixelCard({
  children,
  className = "",
  variant = "default",
  hoverEffect = true,
}: PixelCardProps) {
  const variantStyles = {
    default: "bg-wds-card border border-wds-border-dim",
    active: "bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow-sm",
    elevated: "bg-wds-bg-secondary border border-wds-yellow",
    hud: "bg-wds-bg border border-wds-yellow/40",
  }[variant];

  const hoverClasses = hoverEffect
    ? "transition-all duration-200 hover:border-wds-yellow hover:-translate-y-1 hover:shadow-glow-yellow"
    : "";

  return (
    <div
      className={`relative p-5 text-wds-white ${variantStyles} ${hoverClasses} ${className}`}
    >
      {/* 4 Corner Pixel Accents (Matching Poster Styles) */}
      <span className="absolute -top-[3px] -left-[3px] w-2 h-2 bg-wds-yellow" />
      <span className="absolute -top-[3px] -right-[3px] w-2 h-2 bg-wds-yellow" />
      <span className="absolute -bottom-[3px] -left-[3px] w-2 h-2 bg-wds-yellow" />
      <span className="absolute -bottom-[3px] -right-[3px] w-2 h-2 bg-wds-yellow" />

      {children}
    </div>
  );
}
