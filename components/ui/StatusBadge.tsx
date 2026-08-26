import React from "react";

interface StatusBadgeProps {
  status: "ONLINE" | "LIVE" | "ACTIVE" | "IN DEVELOPMENT" | "COMING SOON" | "SUCCESS";
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const isGreen = status === "ONLINE" || status === "LIVE" || status === "ACTIVE" || status === "SUCCESS";
  const isYellow = status === "IN DEVELOPMENT" || status === "COMING SOON";

  const sizeStyles = size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-pixel border uppercase tracking-wider ${sizeStyles} ${
        isGreen
          ? "border-wds-green/50 bg-wds-green/10 text-wds-green"
          : isYellow
          ? "border-wds-yellow/50 bg-wds-yellow/10 text-wds-yellow"
          : "border-wds-muted bg-wds-muted/10 text-wds-muted"
      } ${className}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 ${
          isGreen ? "bg-wds-green animate-pulse" : isYellow ? "bg-wds-yellow" : "bg-wds-muted"
        }`}
      />
      <span>{status}</span>
    </div>
  );
}
