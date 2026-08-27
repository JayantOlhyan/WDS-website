"use client";

import React from "react";
import Link from "next/link";
import { WDSLogo, OctocatPixel, GitBranchVisual } from "./ui/PixelIcons";
import { PixelButton } from "./ui/PixelButton";
import { sound } from "@/lib/soundEffects";
import {
  Compass,
  FolderGit,
  Users,
  BookOpen,
  Mail,
  MapPin,
  Building,
  ArrowUpRight,
  Heart,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-wds-bg border-t-2 border-wds-yellow text-wds-white overflow-hidden">
      {/* 4 Outer Corner Pixel Accents */}
      <span className="absolute top-0 left-0 w-3 h-3 bg-wds-yellow" />
      <span className="absolute top-0 right-0 w-3 h-3 bg-wds-yellow" />
      <span className="absolute bottom-0 left-0 w-3 h-3 bg-wds-yellow" />
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-wds-yellow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        {/* Top Grid: Logo & Tagline + 5 Navigation Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-wds-yellow/30">
          {/* Left Society Identity Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <WDSLogo className="w-14 h-14" />
                <div>
                  <h3 className="font-pixel text-base sm:text-lg text-wds-yellow tracking-wider leading-none">
                    WEB DEV
                  </h3>
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-white tracking-widest leading-tight mt-1">
                    SOCIETY <span className="text-wds-yellow">MSIT</span>
                  </h3>
                </div>
              </div>

              {/* Tagline Box */}
              <div className="space-y-2 mt-4 font-mono text-xs">
                <div className="text-wds-yellow font-bold uppercase tracking-wider text-sm">
                  BUILT BY STUDENTS. <br />
                  FOR STUDENTS.
                </div>
                <p className="text-wds-muted leading-relaxed">
                  One society. Countless possibilities. <br />
                  Let&apos;s build better, together.
                </p>
              </div>
            </div>

            {/* System Status HUD Box (Matching Poster) */}
            <div className="mt-6 p-3.5 border border-wds-yellow bg-wds-card relative shadow-pixel-yellow-sm max-w-xs">
              <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-wds-yellow" />
              <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-wds-yellow" />
              
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-[10px] text-wds-yellow">&gt;_ SYSTEM STATUS</span>
                <span className="flex items-center gap-1.5 text-[9px] font-pixel text-wds-green">
                  <span className="w-1.5 h-1.5 bg-wds-green rounded-full animate-pulse" />
                  ONLINE
                </span>
              </div>

              <div className="font-mono text-[11px] space-y-1 text-wds-muted">
                <div className="flex justify-between">
                  <span>SERVERS</span>
                  <span className="text-wds-white font-bold">: ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>PROJECTS</span>
                  <span className="text-wds-green font-bold">: LIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>COMMUNITY</span>
                  <span className="text-wds-yellow font-bold">: GROWING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Navigation Columns (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-xs font-mono">
            {/* Column 1: Explore */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-pixel text-[11px] text-wds-yellow uppercase pb-1 border-b border-wds-yellow/30">
                <Compass className="w-3.5 h-3.5" />
                <span>EXPLORE</span>
              </div>
              <ul className="space-y-2 text-wds-muted">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Projects", href: "/projects" },
                  { name: "Opportunities", href: "/opportunities" },
                  { name: "Team", href: "/team" },
                  { name: "Recruitment", href: "/recruitment" },
                  { name: "Contact", href: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => sound.playClick()}
                      className="hover:text-wds-yellow transition-colors inline-flex items-center gap-1"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Projects */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-pixel text-[11px] text-wds-yellow uppercase pb-1 border-b border-wds-yellow/30">
                <FolderGit className="w-3.5 h-3.5" />
                <span>PROJECTS</span>
              </div>
              <ul className="space-y-2 text-wds-muted">
                {[
                  { name: "MSIT Website", href: "https://msit.in", ext: true },
                  { name: "WDS Bug Hunt", href: "/hub", ext: false },
                  { name: "WDS Terminal CLI", href: "/terminal", ext: false },
                  { name: "WDS Website Hub", href: "/hub", ext: false },
                  { name: "Tech Newsletter", href: "/projects", ext: false },
                  { name: "Freshers Hub", href: "/opportunities", ext: false },
                ].map((item) => (
                  <li key={item.name}>
                    {item.ext ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="hover:text-wds-yellow transition-colors inline-flex items-center gap-1"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => sound.playClick()}
                        className="hover:text-wds-yellow transition-colors inline-flex items-center gap-1"
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Community */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-pixel text-[11px] text-wds-yellow uppercase pb-1 border-b border-wds-yellow/30">
                <Users className="w-3.5 h-3.5" />
                <span>COMMUNITY</span>
              </div>
              <ul className="space-y-2 text-wds-muted">
                {[
                  { name: "WhatsApp", href: "https://chat.whatsapp.com/wds-msit" },
                  { name: "Instagram", href: "https://instagram.com/wds_msit" },
                  { name: "LinkedIn", href: "https://linkedin.com/company/wds-msit" },
                  { name: "GitHub", href: "https://github.com/JayantOlhyan/WDS-website" },
                  { name: "YouTube", href: "https://youtube.com/@wds-msit" },
                  { name: "Discord", href: "https://discord.gg/wds-msit" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="hover:text-wds-yellow transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:text-wds-yellow" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-pixel text-[11px] text-wds-yellow uppercase pb-1 border-b border-wds-yellow/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>RESOURCES</span>
              </div>
              <ul className="space-y-2 text-wds-muted">
                {[
                  { name: "Events", href: "/opportunities" },
                  { name: "Workshops", href: "/opportunities" },
                  { name: "Announcements", href: "/about" },
                  { name: "Documentation", href: "/terminal" },
                  { name: "Guidelines", href: "/about" },
                  { name: "FAQs", href: "/recruitment" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => sound.playClick()}
                      className="hover:text-wds-yellow transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Contact & Collab Box */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 font-pixel text-[11px] text-wds-yellow uppercase pb-1 border-b border-wds-yellow/30">
                <Mail className="w-3.5 h-3.5" />
                <span>CONTACT</span>
              </div>
              <div className="space-y-2.5 text-wds-muted text-[11px]">
                <div className="flex items-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-wds-yellow shrink-0 mt-0.5" />
                  <a
                    href="mailto:hello@wds.msit"
                    className="text-wds-white hover:text-wds-yellow hover:underline transition-colors break-all"
                  >
                    hello@wds.msit
                  </a>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-wds-yellow shrink-0 mt-0.5" />
                  <a
                    href="https://maps.google.com/?q=Maharaja+Surajmal+Institute+of+Technology+New+Delhi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-wds-yellow hover:underline transition-colors"
                  >
                    Maharaja Surajmal Institute of Technology, New Delhi - 110058
                  </a>
                </div>
                <div className="flex items-start gap-1.5">
                  <Building className="w-3.5 h-3.5 text-wds-yellow shrink-0 mt-0.5" />
                  <Link href="/contact" className="hover:text-wds-yellow hover:underline transition-colors">
                    Room No. 201 (Near CSE Dept.)
                  </Link>
                </div>
              </div>

              {/* Want to collaborate mini banner */}
              <div className="mt-4 p-2.5 border border-wds-yellow bg-wds-card">
                <div className="font-pixel text-[9px] text-wds-yellow mb-1.5">
                  &gt;_ WANT TO COLLABORATE?
                </div>
                <PixelButton href="/contact" variant="primary" size="sm" className="w-full text-center text-[9px]">
                  LET&apos;S CONNECT →
                </PixelButton>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Git Commit Branch HUD & GitHub Octocat CTA */}
        <div className="py-6 border-b border-wds-yellow/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Latest Commit Text (3 cols) */}
          <div className="md:col-span-3 font-mono">
            <div className="font-pixel text-xs text-wds-yellow flex items-center gap-1.5">
              <span>&gt;_ LATEST COMMIT</span>
            </div>
            <p className="text-wds-white font-bold text-sm mt-1">Improve. Build. Repeat.</p>
            <p className="text-wds-muted text-xs">26 May 2026, 10:30 AM</p>
          </div>

          {/* Git Branch Visualization (6 cols) */}
          <div className="md:col-span-6 flex justify-center">
            <GitBranchVisual />
          </div>

          {/* Contribute on GitHub with Octocat (3 cols) */}
          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 font-mono">
            <div className="text-right">
              <div className="font-pixel text-[10px] text-wds-yellow">&gt;_ CONTRIBUTE</div>
              <p className="text-wds-muted text-[11px] max-w-[180px]">
                Open for ideas, PRs &amp; feedback.
              </p>
              <a
                href="https://github.com/JayantOlhyan/WDS-website"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="inline-block mt-1 text-xs text-wds-yellow hover:underline font-bold"
              >
                CONTRIBUTE ON GITHUB →
              </a>
            </div>
            <OctocatPixel className="w-12 h-12 shrink-0" />
          </div>
        </div>

        {/* Bottom Bar: Copyright & Motto */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-wds-muted">
          <div>
            &copy; 2026 <span className="text-wds-white font-bold">WEB DEV SOCIETY MSIT</span>. ALL RIGHTS RESERVED.
          </div>

          {/* Middle Badge */}
          <div className="border border-wds-yellow/50 px-3 py-1 bg-wds-card text-wds-yellow font-pixel text-[10px]">
            CODE • COLLABORATE • CREATE IMPACT
          </div>

          <div className="flex items-center gap-1.5 text-wds-white font-bold">
            <Heart className="w-3.5 h-3.5 text-wds-yellow fill-wds-yellow" />
            <span>TOGETHER, LET&apos;S BUILD BETTER!</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
