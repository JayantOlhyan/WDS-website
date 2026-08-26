"use client";

import React from "react";
import Link from "next/link";
import { sound } from "@/lib/soundEffects";

interface PixelButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "outline" | "ghost" | "terminal";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  external?: boolean;
}

export function PixelButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  external = false,
}: PixelButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    sound.playClick();
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-mono font-bold tracking-wide transition-all duration-150 active:translate-y-0.5 active:translate-x-0.5 disabled:opacity-50 disabled:cursor-not-allowed select-none group";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base font-semibold",
  }[size];

  const variantStyles = {
    // Primary: Yellow background with black text
    primary:
      "bg-wds-yellow text-wds-bg border-2 border-wds-yellow hover:bg-[#fff176] shadow-pixel-yellow hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-pixel text-[11px] uppercase",
    // Outline: Dark background with yellow border, yellow hover
    outline:
      "bg-wds-bg text-wds-yellow border-2 border-wds-yellow hover:bg-wds-yellow hover:text-wds-bg shadow-pixel-yellow hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-mono uppercase",
    // Ghost: Subtle border, terminal prompt feel
    ghost:
      "bg-transparent text-wds-white border border-wds-border-dim hover:border-wds-yellow hover:text-wds-yellow",
    // Terminal: Special retro terminal button
    terminal:
      "bg-wds-card text-wds-yellow border border-wds-yellow hover:bg-wds-yellow/15 hover:border-glow-yellow font-mono",
  }[variant];

  const content = (
    <>
      {/* Corner notch decorative pixels for outline / primary */}
      {variant !== "ghost" && (
        <>
          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-wds-yellow" />
          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-wds-yellow" />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {content}
    </button>
  );
}
