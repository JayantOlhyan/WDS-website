import React from "react";
import Image from "next/image";

export function WDSLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/images/wds-logo.png"
        alt="WDS MSIT Official Logo"
        className="w-full h-full object-contain select-none"
      />
    </div>
  );
}

export function OctocatPixel({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 8-Bit Pixel Octocat Silhouette */}
      <rect x="16" y="8" width="8" height="8" fill="#FFD600" />
      <rect x="40" y="8" width="8" height="8" fill="#FFD600" />
      <rect x="12" y="16" width="40" height="20" fill="#FFD600" />
      <rect x="8" y="24" width="48" height="12" fill="#FFD600" />
      
      {/* Face Cutout */}
      <rect x="16" y="20" width="32" height="14" fill="#081014" />
      
      {/* Eyes */}
      <rect x="20" y="24" width="6" height="6" fill="#FFD600" />
      <rect x="38" y="24" width="6" height="6" fill="#FFD600" />
      <rect x="22" y="26" width="2" height="2" fill="#050708" />
      <rect x="40" y="26" width="2" height="2" fill="#050708" />
      
      {/* Nose */}
      <rect x="30" y="30" width="4" height="2" fill="#FFD600" />
      
      {/* Body & Tentacles */}
      <rect x="20" y="36" width="24" height="16" fill="#FFD600" />
      <rect x="12" y="44" width="8" height="12" fill="#FFD600" />
      <rect x="44" y="44" width="8" height="12" fill="#FFD600" />
      <rect x="24" y="52" width="6" height="8" fill="#FFD600" />
      <rect x="34" y="52" width="6" height="8" fill="#FFD600" />
      <rect x="8" y="40" width="4" height="8" fill="#FFD600" />
      <rect x="52" y="40" width="4" height="8" fill="#FFD600" />
    </svg>
  );
}

export function RocketPixel({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tip */}
      <rect x="30" y="4" width="4" height="6" fill="#FFD600" />
      <rect x="28" y="10" width="8" height="6" fill="#FFD600" />
      
      {/* Rocket Main Hull */}
      <rect x="26" y="16" width="12" height="22" fill="#FFD600" />
      <rect x="28" y="20" width="8" height="8" fill="#081014" />
      <rect x="30" y="22" width="4" height="4" fill="#FFD600" />
      
      {/* Fins */}
      <rect x="18" y="28" width="8" height="14" fill="#FFD600" />
      <rect x="38" y="28" width="8" height="14" fill="#FFD600" />
      <rect x="14" y="36" width="4" height="8" fill="#FFD600" />
      <rect x="46" y="36" width="4" height="8" fill="#FFD600" />
      
      {/* Thruster Base */}
      <rect x="24" y="38" width="16" height="4" fill="#F5C400" />
      
      {/* Pixel Blast Flame & Clouds */}
      <rect x="28" y="42" width="8" height="6" fill="#FFD600" />
      <rect x="30" y="48" width="4" height="6" fill="#FFD600" />
      <rect x="18" y="52" width="8" height="4" fill="#FFD600" opacity="0.6" />
      <rect x="38" y="52" width="8" height="4" fill="#FFD600" opacity="0.6" />
      <rect x="10" y="56" width="44" height="4" fill="#FFD600" opacity="0.8" />
    </svg>
  );
}

export function BugPixel({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Antennae */}
      <rect x="20" y="8" width="4" height="4" fill="#FFD600" />
      <rect x="24" y="12" width="4" height="4" fill="#FFD600" />
      <rect x="40" y="8" width="4" height="4" fill="#FFD600" />
      <rect x="36" y="12" width="4" height="4" fill="#FFD600" />
      
      {/* Bug Head */}
      <rect x="26" y="16" width="12" height="8" fill="#FFD600" />
      
      {/* Eyes */}
      <rect x="24" y="18" width="2" height="2" fill="#050708" />
      <rect x="38" y="18" width="2" height="2" fill="#050708" />
      
      {/* Body */}
      <rect x="22" y="24" width="20" height="26" fill="#FFD600" />
      <rect x="30" y="24" width="4" height="26" fill="#081014" />
      
      {/* Legs */}
      <rect x="12" y="22" width="10" height="4" fill="#FFD600" />
      <rect x="42" y="22" width="10" height="4" fill="#FFD600" />
      
      <rect x="10" y="32" width="12" height="4" fill="#FFD600" />
      <rect x="42" y="32" width="12" height="4" fill="#FFD600" />
      
      <rect x="14" y="42" width="8" height="4" fill="#FFD600" />
      <rect x="42" y="42" width="8" height="4" fill="#FFD600" />
    </svg>
  );
}

export function MonitorCodePixel({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Window */}
      <rect x="8" y="10" width="48" height="38" fill="#081014" stroke="#FFD600" strokeWidth="2" />
      <rect x="8" y="10" width="48" height="8" fill="#FFD600" />
      
      {/* Window Controls */}
      <rect x="12" y="12" width="4" height="4" fill="#050708" />
      <rect x="18" y="12" width="4" height="4" fill="#050708" />
      <rect x="24" y="12" width="4" height="4" fill="#050708" />
      
      {/* Code Lines */}
      <rect x="14" y="24" width="10" height="3" fill="#FFD600" />
      <rect x="26" y="24" width="16" height="3" fill="#F5F0DF" />
      
      <rect x="18" y="30" width="22" height="3" fill="#FFD600" />
      
      <rect x="18" y="36" width="14" height="3" fill="#00FF66" />
      <rect x="34" y="36" width="8" height="3" fill="#F5F0DF" />
      
      {/* Monitor Stand */}
      <rect x="28" y="48" width="8" height="6" fill="#FFD600" />
      <rect x="20" y="54" width="24" height="4" fill="#FFD600" />
    </svg>
  );
}

export function MonitorWrenchPixel({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Window */}
      <rect x="8" y="10" width="48" height="38" fill="#081014" stroke="#FFD600" strokeWidth="2" />
      <rect x="8" y="10" width="48" height="8" fill="#FFD600" />
      
      {/* Window Controls */}
      <rect x="12" y="12" width="4" height="4" fill="#050708" />
      <rect x="18" y="12" width="4" height="4" fill="#050708" />
      
      {/* Pixel Bug in Screen Corner */}
      <rect x="42" y="14" width="6" height="6" fill="#FFD600" />
      
      {/* Crossed Wrench Pixel Art */}
      <path
        d="M20 38 L34 24 M28 20 L38 20 L38 30 L34 30 L32 26 L26 32 L30 34 L30 38 L20 38 Z"
        stroke="#FFD600"
        strokeWidth="3"
        strokeLinecap="square"
        fill="#FFD600"
      />
      <rect x="22" y="36" width="16" height="4" fill="#FFD600" transform="rotate(-45 30 38)" />
      
      {/* Monitor Stand */}
      <rect x="28" y="48" width="8" height="6" fill="#FFD600" />
      <rect x="20" y="54" width="24" height="4" fill="#FFD600" />
    </svg>
  );
}

export function TrophyPixel({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cup Top */}
      <rect x="16" y="12" width="32" height="6" fill="#FFD600" />
      <rect x="18" y="18" width="28" height="14" fill="#FFD600" />
      <rect x="22" y="32" width="20" height="6" fill="#FFD600" />
      <rect x="26" y="38" width="12" height="6" fill="#FFD600" />
      
      {/* Handles */}
      <rect x="10" y="16" width="6" height="14" fill="#FFD600" />
      <rect x="16" y="26" width="4" height="4" fill="#FFD600" />
      <rect x="48" y="16" width="6" height="14" fill="#FFD600" />
      <rect x="44" y="26" width="4" height="4" fill="#FFD600" />
      
      {/* Stem & Base */}
      <rect x="28" y="44" width="8" height="8" fill="#FFD600" />
      <rect x="20" y="52" width="24" height="6" fill="#FFD600" />
      
      {/* Star Highlight */}
      <rect x="30" y="22" width="4" height="4" fill="#050708" />
    </svg>
  );
}

export function CircuitHubPixel({ className = "w-20 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Center Microchip Node */}
      <rect x="38" y="18" width="24" height="24" fill="#081014" stroke="#FFD600" strokeWidth="2" />
      <text x="50" y="33" fill="#FFD600" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">&lt;/&gt;</text>
      
      {/* Microchip Pins */}
      <rect x="34" y="22" width="4" height="2" fill="#FFD600" />
      <rect x="34" y="29" width="4" height="2" fill="#FFD600" />
      <rect x="34" y="36" width="4" height="2" fill="#FFD600" />
      <rect x="62" y="22" width="4" height="2" fill="#FFD600" />
      <rect x="62" y="29" width="4" height="2" fill="#FFD600" />
      <rect x="62" y="36" width="4" height="2" fill="#FFD600" />
      
      {/* Circuit Traces to Peripherals */}
      {/* Left Top -> Globe */}
      <path d="M34 23 H18 V14" stroke="#FFD600" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="12" y="8" width="12" height="12" fill="#081014" stroke="#FFD600" strokeWidth="1.5" />
      <circle cx="18" cy="14" r="3" stroke="#FFD600" strokeWidth="1" />
      
      {/* Left Bottom -> Bug */}
      <path d="M34 37 H18 V46" stroke="#FFD600" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="12" y="40" width="12" height="12" fill="#081014" stroke="#FFD600" strokeWidth="1.5" />
      <rect x="16" y="44" width="4" height="4" fill="#FFD600" />
      
      {/* Right Top -> Mail */}
      <path d="M66 23 H82 V14" stroke="#FFD600" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="76" y="8" width="12" height="12" fill="#081014" stroke="#FFD600" strokeWidth="1.5" />
      <rect x="80" y="12" width="4" height="4" fill="#FFD600" />
      
      {/* Right Bottom -> Users */}
      <path d="M66 37 H82 V46" stroke="#FFD600" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="76" y="40" width="12" height="12" fill="#081014" stroke="#FFD600" strokeWidth="1.5" />
      <circle cx="82" cy="46" r="3" fill="#FFD600" />
    </svg>
  );
}

export function GitBranchVisual() {
  return (
    <div className="relative flex flex-col items-center justify-center py-2 px-4">
      {/* Commit Badge */}
      <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 border border-wds-yellow bg-wds-yellow/10 text-[9px] font-pixel text-wds-yellow">
        <span>YOU ARE HERE</span>
      </div>
      
      {/* Interactive Git Nodes Graph */}
      <svg viewBox="0 0 320 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[320px] h-12">
        {/* Main Trunk Line */}
        <line x1="10" y1="25" x2="310" y2="25" stroke="#FFD600" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Branch Splice Line */}
        <path d="M90 25 C110 25, 115 10, 135 10 H170 C190 10, 195 25, 215 25" stroke="#9A9D9A" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* Trunk Node 1 */}
        <circle cx="50" cy="25" r="4" fill="#FFD600" />
        <circle cx="90" cy="25" r="4" fill="#FFD600" />
        
        {/* Branch Node */}
        <circle cx="150" cy="10" r="3.5" fill="#9A9D9A" />
        
        {/* Active HEAD Node (Squared Pixel) */}
        <rect x="175" y="19" width="12" height="12" fill="#050708" stroke="#FFD600" strokeWidth="2.5" />
        <rect x="178.5" y="22.5" width="5" height="5" fill="#FFD600" />
        
        {/* Next Commit Nodes */}
        <circle cx="235" cy="25" r="4" fill="#FFD600" />
        <circle cx="275" cy="25" r="4" fill="#FFD600" />
      </svg>
    </div>
  );
}
