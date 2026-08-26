"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WDSLogo } from "./ui/PixelIcons";
import { PixelButton } from "./ui/PixelButton";
import { sound } from "@/lib/soundEffects";
import { Volume2, VolumeX, Menu, X, Terminal } from "lucide-react";

import { siteConfig } from "@/lib/siteConfig";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const toggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  };

  const navLinks = [
    { label: "HOME", href: "/" },
    ...siteConfig.navItems.map((item) => ({
      label: item.name,
      href: item.href,
      isExternal: item.isExternal,
      badge: item.badge,
    })),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-wds-bg/95 backdrop-blur-sm border-b-2 border-wds-yellow">
        {/* Top Mini HUD Status Bar */}
        <div className="hidden md:flex items-center justify-between px-4 py-1 bg-wds-bg-secondary text-[10px] font-mono text-wds-muted border-b border-wds-yellow/20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-wds-green">
              <span className="w-1.5 h-1.5 bg-wds-green animate-pulse inline-block" />
              SYSTEM STATUS: ONLINE
            </span>
            <span className="text-wds-yellow">WDS_MSIT_NODE_V2.6</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-wds-white">BUILT BY STUDENTS • FOR STUDENTS</span>
            <button
              onClick={toggleSound}
              className="flex items-center gap-1 text-wds-yellow hover:text-wds-white transition-colors cursor-pointer"
              title="Toggle Retro Sound Effects"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-wds-green" />}
              <span>{isMuted ? "SFX: OFF" : "SFX: ON"}</span>
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-3 group select-none"
          >
            <div className="transition-transform duration-200 group-hover:scale-105">
              <WDSLogo className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-xs sm:text-sm text-wds-yellow tracking-wider leading-tight group-hover:text-[#fff176] transition-colors">
                WEB DEV
              </span>
              <span className="font-pixel text-[10px] sm:text-xs text-wds-white tracking-widest leading-none">
                SOCIETY <span className="text-wds-yellow">MSIT</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => sound.playClick()}
                  className={`relative px-2.5 py-1.5 font-mono text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? "text-wds-yellow bg-wds-yellow/10"
                      : "text-wds-white hover:text-wds-yellow hover:bg-wds-card"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-wds-yellow" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Controls */}
          <div className="flex items-center gap-3">
            <Link
              href="/terminal"
              onClick={() => sound.playClick()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border border-wds-yellow/40 bg-wds-card hover:border-wds-yellow text-wds-yellow text-xs font-mono transition-colors"
              title="Launch Terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-pixel text-[10px]">&gt;_</span>
            </Link>

            <PixelButton
              href="/recruitment/apply"
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              APPLY NOW →
            </PixelButton>

            {/* Mobile Sound Toggle */}
            <button
              onClick={toggleSound}
              className="md:hidden p-2 text-wds-yellow border border-wds-yellow/40 hover:border-wds-yellow bg-wds-card"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-wds-green" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 text-wds-yellow border-2 border-wds-yellow bg-wds-card hover:bg-wds-yellow hover:text-wds-bg transition-colors"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Terminal Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-wds-bg flex flex-col p-6 overflow-y-auto border-4 border-wds-yellow scanline-effect">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-wds-yellow">
            <div className="flex items-center gap-2">
              <WDSLogo className="w-8 h-8" />
              <span className="font-pixel text-xs text-wds-yellow">WDS_MENU.SH</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
              }}
              className="p-1.5 border-2 border-wds-yellow text-wds-yellow hover:bg-wds-yellow hover:text-wds-bg font-pixel text-xs"
            >
              [X] CLOSE
            </button>
          </div>

          <div className="py-2 text-xs font-mono text-wds-muted">
            <p>&gt;_ NAVIGATE WDS DIGITAL DIRECTORY:</p>
          </div>

          {/* Links List */}
          <nav className="flex flex-col gap-3 my-4">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    sound.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 border font-mono text-sm flex items-center justify-between transition-colors ${
                    isActive
                      ? "border-wds-yellow bg-wds-yellow text-wds-bg font-bold"
                      : "border-wds-border-dim bg-wds-card text-wds-white hover:border-wds-yellow hover:text-wds-yellow"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-pixel text-xs opacity-70">
                      0{idx + 1}
                    </span>
                    <span className="font-bold tracking-wider">{link.label}</span>
                  </div>
                  <span className="font-pixel text-xs">→</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Action in Mobile Menu */}
          <div className="mt-auto pt-6 border-t border-wds-yellow/30 flex flex-col gap-3">
            <PixelButton
              href="/recruitment/apply"
              onClick={() => setMobileMenuOpen(false)}
              variant="primary"
              size="lg"
              className="w-full text-center"
            >
              APPLY FOR WDS 2026 →
            </PixelButton>

            <div className="text-center font-mono text-[11px] text-wds-muted">
              SYSTEM STATUS: <span className="text-wds-green">ONLINE</span> • NODE: MSIT
            </div>
          </div>
        </div>
      )}
    </>
  );
}
