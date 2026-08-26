"use client";

import React from "react";
import Link from "next/link";
import {
  WDSLogo,
  RocketPixel,
  BugPixel,
  MonitorCodePixel,
  MonitorWrenchPixel,
  TrophyPixel,
  CircuitHubPixel,
} from "@/components/ui/PixelIcons";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { WDS_PROJECTS } from "@/lib/projectsData";
import { sound } from "@/lib/soundEffects";
import {
  Globe,
  Bug,
  Mail,
  Users,
  Terminal,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  Code2,
  ExternalLink,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-grid-lines">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Split Screen with Retro Application Window)              */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b-2 border-wds-yellow/40 overflow-hidden">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-wds-yellow/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-wds-bg-secondary/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Typography & CTAs (6-7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-wds-yellow bg-wds-yellow/10 text-wds-yellow font-pixel text-[10px] sm:text-xs">
              <span className="w-2 h-2 bg-wds-yellow animate-pulse" />
              <span>WEB DEVELOPMENT SOCIETY • MSIT</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-wds-white leading-tight tracking-tight">
                <span className="text-wds-yellow block mb-2">&gt;_ YOUR CODE.</span>
                <span className="text-wds-white block mb-2">YOUR IDEAS.</span>
                <span className="text-wds-yellow block">YOUR COMMUNITY.</span>
              </h1>

              <div className="pt-2">
                <p className="font-pixel text-xs sm:text-sm text-wds-yellow tracking-wider">
                  BUILT BY STUDENTS. FOR STUDENTS.
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="font-mono text-sm sm:text-base text-wds-muted max-w-xl leading-relaxed">
              The Web Development Society of MSIT is a student-driven technology community where students learn, build, maintain and ship real digital experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <PixelButton href="/projects" variant="primary" size="lg">
                EXPLORE WDS →
              </PixelButton>
              <PixelButton href="/recruitment/apply" variant="outline" size="lg">
                JOIN WDS 2026 →
              </PixelButton>
            </div>

            {/* Bottom Status Indicators */}
            <div className="pt-6 border-t border-wds-yellow/20 w-full flex flex-wrap items-center gap-6 font-mono text-xs text-wds-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-wds-green animate-pulse" />
                <span>SYSTEM STATUS: <strong className="text-wds-green font-bold">ONLINE</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-wds-yellow font-bold">❖</span>
                <span>PROJECTS: <strong className="text-wds-white font-bold">ACTIVE</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-wds-yellow font-bold">❖</span>
                <span>COMMUNITY: <strong className="text-wds-yellow font-bold">GROWING</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Retro Computer / Browser Application Window (5 cols) */}
          <div className="lg:col-span-5 relative">
            <TerminalWindow
              title="WDS_ECOSYSTEM_PREVIEW.EXE"
              theme="yellow-header"
              statusText="ACTIVE BUILD"
              className="w-full"
            >
              <div className="space-y-4 font-mono">
                {/* Browser View Header */}
                <div className="p-3 bg-wds-bg border border-wds-yellow/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-wds-yellow truncate">
                    <span className="text-wds-muted">URL:</span>
                    <span className="font-mono text-[11px] truncate">https://msit.in [PROD-V2]</span>
                  </div>
                  <StatusBadge status="LIVE" size="sm" />
                </div>

                {/* Window Body Display */}
                <div className="p-4 bg-wds-bg-secondary border border-wds-border-dim space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-pixel text-xs text-wds-yellow">MSIT DIGITAL PORTAL</div>
                      <div className="text-[11px] text-wds-muted mt-0.5">Engineered &amp; Maintained by WDS</div>
                    </div>
                    <div className="px-2 py-0.5 border border-wds-green bg-wds-green/10 text-wds-green text-[10px] font-pixel">
                      BUILD: OK
                    </div>
                  </div>

                  {/* Visual Simulation of System Architecture */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                      <div className="text-wds-muted text-[10px]">UPTIME</div>
                      <div className="text-wds-green font-bold font-mono">99.98%</div>
                    </div>
                    <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                      <div className="text-wds-muted text-[10px]">ACTIVE USERS</div>
                      <div className="text-wds-yellow font-bold font-mono">50,000+</div>
                    </div>
                    <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                      <div className="text-wds-muted text-[10px]">BUG HUNT</div>
                      <div className="text-wds-yellow font-bold font-mono">LEADERBOARD ON</div>
                    </div>
                    <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                      <div className="text-wds-muted text-[10px]">NEXT SPRINT</div>
                      <div className="text-wds-white font-bold font-mono">ORIENTATION</div>
                    </div>
                  </div>

                  {/* Floating Action HUD Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2 py-1 bg-wds-card border border-wds-yellow/40 text-wds-white text-[10px] font-pixel">
                      [ LIVE WEBSITE ]
                    </span>
                    <span className="px-2 py-1 bg-wds-card border border-wds-yellow/40 text-wds-yellow text-[10px] font-pixel">
                      [ BUG HUNT ACTIVE ]
                    </span>
                    <span className="px-2 py-1 bg-wds-card border border-wds-yellow/40 text-wds-green text-[10px] font-pixel">
                      [ PROJECTS ACTIVE ]
                    </span>
                  </div>
                </div>

                {/* Bottom CLI Output in Window */}
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 text-[11px] text-wds-muted flex items-center justify-between">
                  <span>WDS@MSIT:~$ deploy --release prod</span>
                  <span className="text-wds-green font-bold">READY</span>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* ========================================================================= */}
      {/* 2. WHAT WDS ACTUALLY DOES (Matching Reference Poster #2)                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          align="center"
          title="WHAT WDS ACTUALLY DOES"
          subtitle="We don't just code. We build, maintain and ship"
          highlightText="REAL DIGITAL EXPERIENCES."
        />

        {/* 3 Major Cards (01 BUILD, 02 MAINTAIN, 03 SHIP) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {/* Card 01: BUILD */}
          <div className="relative p-6 sm:p-8 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-yellow">
            {/* Top Pill: 01 */}
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold">
                01
              </span>
              <span className="font-pixel text-[10px] text-wds-yellow tracking-widest">
                STAGE_01
              </span>
            </div>

            {/* Pixel Art Icon */}
            <div className="my-4 flex justify-center">
              <MonitorCodePixel className="w-20 h-20" />
            </div>

            {/* Title & Description */}
            <div className="text-center my-4 space-y-3">
              <h3 className="font-pixel text-xl sm:text-2xl text-wds-yellow">BUILD</h3>
              <div className="w-12 h-[2px] bg-wds-yellow/40 mx-auto" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                We build responsive websites, web apps and digital solutions that solve real problems.
              </p>
            </div>

            {/* Sub-tags Footer */}
            <div className="grid grid-cols-3 gap-1.5 pt-6 border-t border-wds-yellow/20 text-center font-mono text-[10px] font-bold">
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                DEVELOP
              </span>
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                DESIGN
              </span>
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                CREATE
              </span>
            </div>
          </div>

          {/* Card 02: MAINTAIN */}
          <div className="relative p-6 sm:p-8 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-yellow">
            {/* Top Pill: 02 */}
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold">
                02
              </span>
              <span className="font-pixel text-[10px] text-wds-yellow tracking-widest">
                STAGE_02
              </span>
            </div>

            {/* Pixel Art Icon */}
            <div className="my-4 flex justify-center">
              <MonitorWrenchPixel className="w-20 h-20" />
            </div>

            {/* Title & Description */}
            <div className="text-center my-4 space-y-3">
              <h3 className="font-pixel text-xl sm:text-2xl text-wds-yellow">MAINTAIN</h3>
              <div className="w-12 h-[2px] bg-wds-yellow/40 mx-auto" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                We keep things running smoothly. Fix bugs, update content, improve performance and enhance UX.
              </p>
            </div>

            {/* Sub-tags Footer */}
            <div className="grid grid-cols-3 gap-1.5 pt-6 border-t border-wds-yellow/20 text-center font-mono text-[10px] font-bold">
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                DEBUG
              </span>
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                UPDATE
              </span>
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                OPTIMIZE
              </span>
            </div>
          </div>

          {/* Card 03: SHIP */}
          <div className="relative p-6 sm:p-8 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-yellow">
            {/* Top Pill: 03 */}
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold">
                03
              </span>
              <span className="font-pixel text-[10px] text-wds-yellow tracking-widest">
                STAGE_03
              </span>
            </div>

            {/* Pixel Art Icon */}
            <div className="my-4 flex justify-center">
              <RocketPixel className="w-20 h-20" />
            </div>

            {/* Title & Description */}
            <div className="text-center my-4 space-y-3">
              <h3 className="font-pixel text-xl sm:text-2xl text-wds-yellow">SHIP</h3>
              <div className="w-12 h-[2px] bg-wds-yellow/40 mx-auto" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                We deploy, test and ship features that students actually use and make an impact.
              </p>
            </div>

            {/* Sub-tags Footer */}
            <div className="grid grid-cols-3 gap-1.5 pt-6 border-t border-wds-yellow/20 text-center font-mono text-[10px] font-bold">
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                DEPLOY
              </span>
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                TEST
              </span>
              <span className="p-1.5 border border-wds-yellow/30 bg-wds-bg text-wds-white">
                DELIVER
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar (Matching Reference Poster #2) */}
        <div className="mt-12 p-6 bg-wds-bg-secondary border-2 border-wds-yellow shadow-pixel-yellow grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {/* Stat 1: Real Projects */}
          <div className="flex items-center gap-3">
            <div className="font-pixel text-lg text-wds-yellow">&lt;/&gt;</div>
            <div>
              <div className="text-[10px] font-mono text-wds-muted uppercase">REAL PROJECTS</div>
              <div className="font-pixel text-lg sm:text-xl text-wds-yellow">04+</div>
              <div className="text-[10px] font-mono text-wds-muted">Active Platforms</div>
            </div>
          </div>

          {/* Stat 2: Bugs Squashed */}
          <div className="flex items-center gap-3">
            <Bug className="w-7 h-7 text-wds-yellow shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-wds-muted uppercase">BUGS SQUASHED</div>
              <div className="font-pixel text-lg sm:text-xl text-wds-yellow">100+</div>
              <div className="text-[10px] font-mono text-wds-muted">And Counting</div>
            </div>
          </div>

          {/* Stat 3: Members */}
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-wds-yellow shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-wds-muted uppercase">MEMBERS</div>
              <div className="font-pixel text-lg sm:text-xl text-wds-yellow">200+</div>
              <div className="text-[10px] font-mono text-wds-muted">Active Builders</div>
            </div>
          </div>

          {/* Stat 4: Users Impacted */}
          <div className="flex items-center gap-3">
            <Globe className="w-7 h-7 text-wds-yellow shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-wds-muted uppercase">USERS IMPACTED</div>
              <div className="font-pixel text-lg sm:text-xl text-wds-yellow">50K+</div>
              <div className="text-[10px] font-mono text-wds-muted">And Growing</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WDS DIGITAL ECOSYSTEM (Matching Reference Poster #5)                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-wds-card/40 border-y border-wds-yellow/20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header with Circuit Icon */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <span className="w-1.5 h-1.5 bg-wds-yellow" />
                  <span className="w-1.5 h-1.5 bg-transparent" />
                  <span className="w-1.5 h-1.5 bg-transparent" />
                  <span className="w-1.5 h-1.5 bg-wds-yellow" />
                </div>
                <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-wds-yellow">
                  &gt;_ THE WDS ECOSYSTEM
                </h2>
              </div>
              <p className="font-mono text-sm text-wds-muted">
                One society. Multiple platforms. Built and maintained by students.
              </p>
            </div>

            {/* Circuit Hub Illustration */}
            <div className="hidden md:block">
              <CircuitHubPixel className="w-24 h-16" />
            </div>
          </div>

          {/* 5 Project Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Project 1: MSIT Website */}
            <PixelCard className="flex flex-col justify-between" variant="default">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Globe className="w-5 h-5 text-wds-yellow" />
                  <span className="font-pixel text-[9px] text-wds-yellow">MSIT WEBSITE</span>
                </div>
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 mb-3 text-center">
                  <div className="font-pixel text-[10px] text-wds-white">MSIT.IN</div>
                  <div className="text-[9px] text-wds-muted mt-1">Official College Portal</div>
                </div>
                <p className="font-mono text-xs text-wds-muted leading-relaxed mb-4">
                  The official website of MSIT, designed, developed and maintained by WDS.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <StatusBadge status="LIVE" size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-wds-yellow" />
                </div>
                <PixelButton href="https://msit.in" external variant="primary" size="sm" className="w-full text-center">
                  VISIT WEBSITE →
                </PixelButton>
              </div>
            </PixelCard>

            {/* Project 2: WDS Bug Hunt */}
            <PixelCard className="flex flex-col justify-between" variant="default">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Bug className="w-5 h-5 text-wds-yellow" />
                  <span className="font-pixel text-[9px] text-wds-yellow">WDS BUG HUNT</span>
                </div>
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 mb-3 text-center">
                  <div className="font-pixel text-[10px] text-wds-yellow">BUG HUNT QA</div>
                  <div className="text-[9px] text-wds-white font-bold mt-1">FIND &bull; REPORT &bull; WIN</div>
                </div>
                <p className="font-mono text-xs text-wds-muted leading-relaxed mb-4">
                  Find bugs on the MSIT website, earn points, climb the leaderboard and win exciting rewards!
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <StatusBadge status="LIVE" size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-wds-yellow" />
                </div>
                <PixelButton href="/projects#bug-hunt" variant="primary" size="sm" className="w-full text-center">
                  START HUNTING →
                </PixelButton>
              </div>
            </PixelCard>

            {/* Project 3: Newsletter */}
            <PixelCard className="flex flex-col justify-between" variant="default">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Mail className="w-5 h-5 text-wds-yellow" />
                  <span className="font-pixel text-[9px] text-wds-yellow">NEWSLETTER</span>
                </div>
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 mb-3 text-center">
                  <div className="font-pixel text-[10px] text-wds-white">WDS DIGEST</div>
                  <div className="text-[9px] text-wds-muted mt-1">Weekly Engineering Insights</div>
                </div>
                <p className="font-mono text-xs text-wds-muted leading-relaxed mb-4">
                  Stay updated with the latest events, projects, opportunities and tech insights.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <StatusBadge status="LIVE" size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-wds-yellow" />
                </div>
                <PixelButton href="/projects#newsletter" variant="primary" size="sm" className="w-full text-center">
                  SUBSCRIBE →
                </PixelButton>
              </div>
            </PixelCard>

            {/* Project 4: Freshers Hub */}
            <PixelCard className="flex flex-col justify-between" variant="default">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-5 h-5 text-wds-yellow" />
                  <span className="font-pixel text-[9px] text-wds-yellow">FRESHERS HUB</span>
                </div>
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 mb-3 text-center">
                  <div className="font-pixel text-[10px] text-wds-white">FRESHERS HUB</div>
                  <div className="text-[9px] text-wds-muted mt-1">Resources &bull; Survival Guide</div>
                </div>
                <p className="font-mono text-xs text-wds-muted leading-relaxed mb-4">
                  Your one-stop hub for everything you need as a fresher at MSIT. Connect, learn and grow.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <StatusBadge status="LIVE" size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-wds-yellow" />
                </div>
                <PixelButton href="/projects#freshers-hub" variant="primary" size="sm" className="w-full text-center">
                  EXPLORE HUB →
                </PixelButton>
              </div>
            </PixelCard>

            {/* Project 5: More Projects Cooking */}
            <PixelCard className="flex flex-col justify-between" variant="default">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Code2 className="w-5 h-5 text-wds-yellow" />
                  <span className="font-pixel text-[9px] text-wds-yellow">MORE PROJECTS</span>
                </div>
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 mb-3 text-center">
                  <div className="font-pixel text-[10px] text-wds-yellow">R&amp;D LABS</div>
                  <div className="text-[9px] text-wds-white mt-1">Something Awesome Cooking!</div>
                </div>
                <p className="font-mono text-xs text-wds-muted leading-relaxed mb-4">
                  We&apos;re constantly building new things that make a difference. Join WDS to build them.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <StatusBadge status="IN DEVELOPMENT" size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-wds-yellow" />
                </div>
                <PixelButton href="/projects" variant="primary" size="sm" className="w-full text-center">
                  VIEW ALL →
                </PixelButton>
              </div>
            </PixelCard>
          </div>

          {/* Bottom Mission Banner (Matching Reference Poster #5) */}
          <div className="mt-10 p-4 border border-wds-yellow bg-wds-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-pixel text-xs text-wds-yellow">&gt;_</span>
              <div>
                <span className="font-mono text-xs text-wds-muted block">Different platforms. One mission.</span>
                <span className="font-mono text-xs sm:text-sm text-wds-yellow font-bold">
                  TO BUILD, MAINTAIN AND IMPROVE DIGITAL EXPERIENCES FOR EVERY MSITian.
                </span>
              </div>
            </div>
            <PixelButton href="/projects" variant="outline" size="sm">
              EXPLORE ALL →
            </PixelButton>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BUG HUNT SECTION (Matching Reference Poster #3)                        */}
      {/* ========================================================================= */}
      <section id="bug-hunt-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header Banner */}
        <div className="border-2 border-wds-yellow bg-wds-card p-6 sm:p-8 shadow-pixel-yellow">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-wds-yellow/30">
            {/* Left Header */}
            <div>
              <div className="flex items-center gap-4">
                <BugPixel className="w-14 h-14" />
                <div>
                  <h2 className="font-pixel text-2xl sm:text-4xl text-wds-yellow leading-tight">
                    WDS BUG HUNT
                  </h2>
                  <div className="font-mono text-sm sm:text-base text-wds-white font-bold tracking-wider mt-1">
                    FIND BUGS. EARN POINTS. GET REWARDED.
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs sm:text-sm text-wds-muted mt-3 max-w-xl">
                Love exploring? Help make the MSIT website better for everyone! Spot broken links, mobile layout bugs, missing information or UI glitches.
              </p>
            </div>

            {/* Right Orientation Notice */}
            <div className="p-4 border border-wds-yellow bg-wds-bg-secondary max-w-md">
              <div className="font-pixel text-[11px] text-wds-yellow mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wds-yellow" />
                LAUNCHING AT ORIENTATION!
              </div>
              <p className="font-mono text-xs text-wds-muted">
                Be the first to hunt, report issues on MSIT platforms &amp; win exclusive WDS developer swag!
              </p>
            </div>
          </div>

          {/* 3 Column Workflow: How It Works | QR Scan Hub | Live Stats & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Col 1: How It Works (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="font-pixel text-xs text-wds-yellow mb-2">&gt;_ HOW IT WORKS</div>

              {/* Step 1 */}
              <div className="p-3 border border-wds-yellow/30 bg-wds-bg flex items-start gap-3">
                <span className="font-pixel text-xs text-wds-yellow">01</span>
                <div>
                  <div className="font-mono text-xs text-wds-white font-bold">EXPLORE</div>
                  <div className="font-mono text-[11px] text-wds-muted">Browse the official MSIT website.</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 border border-wds-yellow/30 bg-wds-bg flex items-start gap-3">
                <span className="font-pixel text-xs text-wds-yellow">02</span>
                <div>
                  <div className="font-mono text-xs text-wds-white font-bold">FIND</div>
                  <div className="font-mono text-[11px] text-wds-muted">Spot real bugs, missing or broken data.</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 border border-wds-yellow/30 bg-wds-bg flex items-start gap-3">
                <span className="font-pixel text-xs text-wds-yellow">03</span>
                <div>
                  <div className="font-mono text-xs text-wds-white font-bold">REPORT</div>
                  <div className="font-mono text-[11px] text-wds-muted">Submit report with screenshot &amp; steps.</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3 border border-wds-yellow/30 bg-wds-bg flex items-start gap-3">
                <span className="font-pixel text-xs text-wds-yellow">04</span>
                <div>
                  <div className="font-mono text-xs text-wds-white font-bold">EARN</div>
                  <div className="font-mono text-[11px] text-wds-muted">Get points, rank up &amp; unlock rewards!</div>
                </div>
              </div>
            </div>

            {/* Col 2: QR Scanner / Hunt Trigger Card (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border-2 border-wds-yellow bg-wds-bg text-center space-y-4">
              <div className="font-pixel text-[11px] text-wds-yellow">SCAN TO START HUNTING!</div>
              
              {/* Retro Styled QR Code Simulation */}
              <div className="p-4 bg-wds-yellow border-4 border-wds-bg shadow-pixel-yellow max-w-[200px] aspect-square flex flex-col items-center justify-center">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-wds-yellow">
                  {/* Stylized QR Pixels */}
                  <span className="bg-wds-bg col-span-2 row-span-2" />
                  <span className="bg-wds-yellow col-span-2" />
                  <span className="bg-wds-bg col-span-2 row-span-2" />
                  <span className="bg-wds-bg" />
                  <span className="bg-wds-bg" />
                  <span className="bg-wds-bg col-span-2" />
                  <span className="bg-wds-bg col-span-2" />
                  <span className="bg-wds-bg" />
                  <span className="bg-wds-bg" />
                  <span className="bg-wds-bg col-span-2 row-span-2" />
                  <span className="bg-wds-yellow col-span-2" />
                  <span className="bg-wds-bg col-span-2 row-span-2" />
                </div>
              </div>

              <div className="font-mono text-xs text-wds-muted">
                &gt;_ EVERY BUG YOU FIND MAKES MSIT BETTER.
              </div>

              <PixelButton href="/recruitment/apply" variant="primary" size="md" className="w-full">
                ENTER BUG HUNT →
              </PixelButton>
            </div>

            {/* Col 3: Live Stats & Leaderboard (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Live Stats Box */}
              <div className="p-4 border border-wds-yellow/40 bg-wds-bg">
                <div className="font-pixel text-[10px] text-wds-yellow mb-3 flex items-center justify-between">
                  <span>LIVE STATS</span>
                  <span className="text-wds-green font-pixel text-[8px] animate-pulse">● SYNCED</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <div className="text-[9px] text-wds-muted">BUGS FOUND</div>
                    <div className="font-pixel text-base text-wds-yellow">128</div>
                    <div className="text-[8px] text-wds-green">+12 TODAY</div>
                  </div>
                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <div className="text-[9px] text-wds-muted">ACTIVE HUNTERS</div>
                    <div className="font-pixel text-base text-wds-yellow">97</div>
                    <div className="text-[8px] text-wds-green">+5 TODAY</div>
                  </div>
                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <div className="text-[9px] text-wds-muted">POINTS EARNED</div>
                    <div className="font-pixel text-base text-wds-yellow">4,320</div>
                    <div className="text-[8px] text-wds-green">+320 TODAY</div>
                  </div>
                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <div className="text-[9px] text-wds-muted">REWARDS WON</div>
                    <div className="font-pixel text-base text-wds-yellow">23</div>
                    <div className="text-[8px] text-wds-green">+3 TODAY</div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Box */}
              <div className="p-4 border border-wds-yellow/40 bg-wds-bg font-mono text-xs">
                <div className="font-pixel text-[10px] text-wds-yellow mb-2.5 flex items-center justify-between">
                  <span>🏆 LEADERBOARD</span>
                  <span className="text-[9px] text-wds-muted">VIEW ALL →</span>
                </div>

                <div className="space-y-1.5">
                  {[
                    { rank: "01", name: "bug_destroyer_07", pts: "650" },
                    { rank: "02", name: "code_explorer", pts: "580" },
                    { rank: "03", name: "pixel_hunter", pts: "420" },
                    { rank: "04", name: "404_not_found", pts: "310" },
                  ].map((hunter) => (
                    <div
                      key={hunter.rank}
                      className="flex items-center justify-between px-2.5 py-1 bg-wds-card border border-wds-border-dim text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-[9px] text-wds-yellow">{hunter.rank}</span>
                        <span className="text-wds-white">{hunter.name}</span>
                      </div>
                      <span className="font-pixel text-[9px] text-wds-yellow">{hunter.pts} PTS</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Rewards Showcase Banner */}
          <div className="mt-8 pt-6 border-t border-wds-yellow/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="p-3 border border-wds-yellow/20 bg-wds-bg">
              <TrophyPixel className="w-8 h-8 mx-auto mb-1" />
              <div className="text-wds-yellow font-bold text-[11px]">TOP HUNTERS</div>
              <div className="text-wds-muted text-[10px]">Win exciting developer goodies!</div>
            </div>
            <div className="p-3 border border-wds-yellow/20 bg-wds-bg">
              <Award className="w-8 h-8 text-wds-yellow mx-auto mb-1" />
              <div className="text-wds-yellow font-bold text-[11px]">EARN POINTS</div>
              <div className="text-wds-muted text-[10px]">More bugs, more points!</div>
            </div>
            <div className="p-3 border border-wds-yellow/20 bg-wds-bg">
              <Zap className="w-8 h-8 text-wds-yellow mx-auto mb-1" />
              <div className="text-wds-yellow font-bold text-[11px]">LEADERBOARD</div>
              <div className="text-wds-muted text-[10px]">Climb up &amp; get noticed!</div>
            </div>
            <div className="p-3 border border-wds-yellow/20 bg-wds-bg">
              <Sparkles className="w-8 h-8 text-wds-yellow mx-auto mb-1" />
              <div className="text-wds-yellow font-bold text-[11px]">BADGES</div>
              <div className="text-wds-muted text-[10px]">Unlock exclusive Discord roles!</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OPPORTUNITIES PREVIEW (Matching Reference Poster #4)                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-wds-card/30 border-y border-wds-yellow/20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header with Player 01 EXP HUD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            {/* Title */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-wds-yellow">
                  &gt;_ OPPORTUNITIES
                </h2>
              </div>
              <p className="font-mono text-sm text-wds-muted leading-relaxed">
                Level up your skills. Build real experience. Create impact that goes beyond the classroom.
              </p>
            </div>

            {/* Player 01 HUD Box (Matching Poster 4) */}
            <div className="lg:col-span-6 p-4 border-2 border-wds-yellow bg-wds-bg shadow-pixel-yellow">
              <div className="flex items-center justify-between pb-2 border-b border-wds-yellow/30 font-pixel text-[10px] text-wds-yellow">
                <span>PLAYER 01</span>
                {/* Pixel Health / EXP Bar */}
                <div className="flex items-center gap-1">
                  <div className="w-24 h-2 bg-wds-card border border-wds-yellow flex">
                    <span className="w-4/5 h-full bg-wds-yellow" />
                  </div>
                  <span>EXP +100</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div className="space-y-1 font-pixel text-xs text-wds-white">
                  <div>EVERY PROJECT.</div>
                  <div>EVERY TASK.</div>
                  <div>EVERY LINE OF CODE.</div>
                  <div className="text-wds-yellow pt-1 font-bold">LEVELS YOU UP.</div>
                </div>
                <RocketPixel className="w-12 h-12 shrink-0" />
              </div>
            </div>
          </div>

          {/* 6 Opportunity Cards (Matching Poster 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 Real Projects */}
            <PixelCard className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-pixel text-base text-wds-yellow">&lt;/&gt;</span>
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow">REAL PROJECTS</h3>
                </div>
                <div className="w-full h-[1px] bg-wds-yellow/30 mb-3" />
                <p className="font-mono text-xs text-wds-muted leading-relaxed">
                  Work on websites and digital products that are used by thousands of students daily.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-wds-border-dim flex justify-between items-center text-[10px] font-pixel text-wds-yellow">
                <span>BUILD REAL</span>
                <span>→</span>
              </div>
            </PixelCard>

            {/* 02 Startup Exposure */}
            <PixelCard className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <RocketPixel className="w-6 h-6" />
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow">STARTUP EXPOSURE</h3>
                </div>
                <div className="w-full h-[1px] bg-wds-yellow/30 mb-3" />
                <p className="font-mono text-xs text-wds-muted leading-relaxed">
                  Get exposure to startups, founders, industry mentors and real-world engineering problems.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-wds-border-dim flex justify-between items-center text-[10px] font-pixel text-wds-yellow">
                <span>THINK BIG</span>
                <span>→</span>
              </div>
            </PixelCard>

            {/* 03 Portfolio That Stands Out */}
            <PixelCard className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Layers className="w-5 h-5 text-wds-yellow" />
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow">PORTFOLIO IMPACT</h3>
                </div>
                <div className="w-full h-[1px] bg-wds-yellow/30 mb-3" />
                <p className="font-mono text-xs text-wds-muted leading-relaxed">
                  Build work that you can be genuinely proud of and showcase anywhere to recruiters.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-wds-border-dim flex justify-between items-center text-[10px] font-pixel text-wds-yellow">
                <span>BUILD YOUR BRAND</span>
                <span>→</span>
              </div>
            </PixelCard>

            {/* 04 Powerful Network */}
            <PixelCard className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-wds-yellow" />
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow">POWERFUL NETWORK</h3>
                </div>
                <div className="w-full h-[1px] bg-wds-yellow/30 mb-3" />
                <p className="font-mono text-xs text-wds-muted leading-relaxed">
                  Connect with like-minded students, seniors, alumni developers and industry engineers.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-wds-border-dim flex justify-between items-center text-[10px] font-pixel text-wds-yellow">
                <span>GROW TOGETHER</span>
                <span>→</span>
              </div>
            </PixelCard>

            {/* 05 Paid Opportunities */}
            <PixelCard className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-wds-yellow" />
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow">PAID OPPORTUNITIES</h3>
                </div>
                <div className="w-full h-[1px] bg-wds-yellow/30 mb-3" />
                <p className="font-mono text-xs text-wds-muted leading-relaxed">
                  Top contributors may get opportunities to work on paid projects (performance based).
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-wds-border-dim flex justify-between items-center text-[10px] font-pixel text-wds-yellow">
                <span>EARN &amp; LEARN</span>
                <span>→</span>
              </div>
            </PixelCard>

            {/* 06 Leadership & Ownership */}
            <PixelCard className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <TrophyPixel className="w-6 h-6" />
                  <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow">LEADERSHIP</h3>
                </div>
                <div className="w-full h-[1px] bg-wds-yellow/30 mb-3" />
                <p className="font-mono text-xs text-wds-muted leading-relaxed">
                  Lead teams, own project features and make technical decisions that create real impact.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-wds-border-dim flex justify-between items-center text-[10px] font-pixel text-wds-yellow">
                <span>LEAD &bull; INSPIRE</span>
                <span>→</span>
              </div>
            </PixelCard>
          </div>

          {/* Bottom Level Up HUD Banner */}
          <div className="mt-10 p-5 border-2 border-wds-yellow bg-wds-bg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="font-pixel text-xs text-wds-yellow">&gt;_ LEVEL UP TO UNLOCK MORE</div>
              <div className="font-mono text-xs text-wds-muted">
                New skills. Bigger challenges. Greater impact. The more you contribute, the more you grow.
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-wds-muted">
                <div className="text-center">
                  <div className="font-pixel text-xs text-wds-yellow">SKILLS</div>
                  <div>∞</div>
                </div>
                <div className="text-center">
                  <div className="font-pixel text-xs text-wds-yellow">EXPERIENCE</div>
                  <div>∞</div>
                </div>
                <div className="text-center">
                  <div className="font-pixel text-xs text-wds-yellow">IMPACT</div>
                  <div>∞</div>
                </div>
              </div>

              <PixelButton href="/opportunities" variant="primary" size="md">
                JOIN THE JOURNEY →
              </PixelButton>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE TERMINAL PREVIEW SECTION                                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          align="left"
          title="WDS INTERACTIVE TERMINAL"
          subtitle="Query society logs, discover repositories and trigger secret system commands directly."
        />

        <div className="mt-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow p-4 sm:p-6">
          <InteractiveTerminal compact initialCommands={["whoami", "ls projects/"]} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. RECRUITMENT 2026 CALL TO ACTION BANNER                                */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-wds-bg-secondary border-t-2 border-wds-yellow">
        <div className="max-w-5xl mx-auto border-2 border-wds-yellow bg-wds-card p-8 sm:p-12 shadow-pixel-yellow text-center space-y-6 relative overflow-hidden">
          <span className="absolute top-2 left-2 font-pixel text-[10px] text-wds-yellow">&gt;_ RECRUITMENT 2026</span>
          <span className="absolute top-2 right-2 flex items-center gap-1.5 font-pixel text-[9px] text-wds-green">
            <span className="w-1.5 h-1.5 bg-wds-green rounded-full animate-pulse" />
            APPLICATIONS OPEN
          </span>

          <div className="pt-4">
            <h2 className="font-pixel text-2xl sm:text-4xl text-wds-yellow leading-tight">
              READY TO BUILD SOMETHING REAL?
            </h2>
            <p className="font-mono text-sm sm:text-base text-wds-muted max-w-xl mx-auto mt-3">
              Be a part of a community that builds, maintains and ships real digital experiences for MSIT. No prior experience required.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <PixelButton href="/recruitment/apply" variant="primary" size="lg">
              APPLY NOW FOR WDS 2026 →
            </PixelButton>
            <PixelButton href="/recruitment" variant="outline" size="lg">
              VIEW SELECTION PROCESS
            </PixelButton>
          </div>
        </div>
      </section>
    </div>
  );
}
