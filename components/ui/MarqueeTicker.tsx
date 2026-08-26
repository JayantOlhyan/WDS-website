"use client";

import React from "react";

interface MarqueeTickerProps {
  items?: string[];
  className?: string;
}

export function MarqueeTicker({
  items = [
    "SYSTEM STATUS: ONLINE",
    "RECRUITMENT 2026 ACTIVE",
    "BUG HUNT LEADERBOARD LIVE",
    "MSIT PORTAL MAINTAINED BY WDS",
    "BUILT BY STUDENTS • FOR STUDENTS",
    "CODE • COLLABORATE • CREATE IMPACT",
  ],
  className = "",
}: MarqueeTickerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden border-y border-wds-yellow/30 bg-wds-bg-secondary/80 py-2 select-none ${className}`}
    >
      <div className="flex w-max animate-marquee gap-8 items-center text-xs font-mono font-bold text-wds-yellow">
        {/* Repeat array twice for seamless infinite scroll */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="font-pixel text-[10px] text-wds-yellow">❖</span>
            <span className="tracking-wider uppercase text-wds-white hover:text-wds-yellow transition-colors">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
