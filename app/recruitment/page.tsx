"use client";

import React from "react";
import Link from "next/link";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  RocketPixel,
  TrophyPixel,
  WDSLogo,
} from "@/components/ui/PixelIcons";
import {
  Code,
  Users,
  Briefcase,
  TrendingUp,
  Gift,
  FileEdit,
  FileCheck2,
  MessageSquare,
  Puzzle,
  CheckCircle2,
  Check,
  Sparkles,
} from "lucide-react";

export default function RecruitmentPage() {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines">
      {/* ========================================================================= */}
      {/* 1. TOP SPLIT HERO (Matching Poster #1)                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b-2 border-wds-yellow/30 pb-12">
        {/* Left Column: Hero Title & Overview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h1 className="font-pixel text-3xl sm:text-5xl text-wds-yellow leading-tight tracking-tight">
              &gt;_ RECRUITMENT <br />
              <span className="text-wds-white">2026</span>
            </h1>

            <div className="mt-4 flex items-center gap-1">
              <span className="w-12 h-1 bg-wds-yellow" />
              <span className="w-2 h-1 bg-wds-yellow" />
              <span className="w-2 h-1 bg-wds-yellow" />
              <span className="w-24 h-1 bg-wds-border-dim" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-pixel text-sm sm:text-base text-wds-white">
              YOUR CODE. YOUR IDEAS. YOUR COMMUNITY. <br />
              <span className="text-wds-yellow">STARTS HERE.</span>
            </h2>
            <p className="font-mono text-sm text-wds-muted leading-relaxed max-w-lg">
              Join WDS and work on real projects, maintain live websites, solve real problems and build impact that goes beyond the classroom.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <PixelButton href="/recruitment/apply" variant="primary" size="lg">
              APPLY FOR WDS 2026 →
            </PixelButton>
            <PixelButton href="#selection-process" variant="outline" size="lg">
              VIEW SELECTION PROCESS
            </PixelButton>
          </div>
        </div>

        {/* Right Column: Terminal Window with Guidelines (6 cols) */}
        <div className="lg:col-span-6">
          <TerminalWindow
            title="TERMINAL://WDS_RECRUITMENT_2026"
            theme="yellow-header"
            statusText="OPEN"
          >
            <div className="space-y-5 font-mono text-xs text-wds-white">
              {/* Who Can Apply */}
              <div>
                <div className="font-pixel text-[11px] text-wds-yellow mb-1 flex items-center gap-2">
                  <span>&gt; WHO CAN APPLY?</span>
                </div>
                <p className="text-wds-muted pl-3 leading-relaxed">
                  All MSIT students passionate about technology, design, content, community and making an impact. <br />
                  <strong className="text-wds-yellow font-bold">No prior experience required.</strong>
                </p>
              </div>

              {/* What We Look For */}
              <div>
                <div className="font-pixel text-[11px] text-wds-yellow mb-1 flex items-center gap-2">
                  <span>&gt; WHAT WE LOOK FOR?</span>
                </div>
                <p className="text-wds-muted pl-3 leading-relaxed">
                  Curiosity. Consistency. Creativity. Collaboration. Commitment.
                </p>
              </div>

              {/* Important Dates */}
              <div className="p-3 border border-wds-yellow/30 bg-wds-bg space-y-1.5 text-[11px]">
                <div className="font-pixel text-[10px] text-wds-yellow mb-1">&gt; TIMELINE</div>
                <div className="flex justify-between text-wds-muted">
                  <span>• Applications Status</span>
                  <span className="text-wds-green font-bold">: ACTIVE / ROLLING</span>
                </div>
                <div className="flex justify-between text-wds-muted">
                  <span>• Round 1 Review</span>
                  <span className="text-wds-white font-bold">: WITHIN 48 HOURS</span>
                </div>
                <div className="flex justify-between text-wds-muted">
                  <span>• Candidate Interviews</span>
                  <span className="text-wds-white font-bold">: SCHEDULED INDIVIDUALLY</span>
                </div>
                <div className="flex justify-between text-wds-muted">
                  <span>• Final Results</span>
                  <span className="text-wds-yellow font-bold">: NOTIFIED VIA EMAIL</span>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. WHAT YOU GET AT WDS (Matching Poster #1)                              */}
      {/* ========================================================================= */}
      <div className="py-14 border-b-2 border-wds-yellow/30">
        <SectionHeader
          title="WHAT YOU GET AT WDS"
          subtitle="Real engineering experiences and genuine community growth from day one."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Card 1: Real Projects */}
          <PixelCard className="flex items-start gap-4">
            <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
              <span className="font-pixel text-base text-wds-yellow">&lt;/&gt;</span>
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow mb-1">REAL PROJECTS</h3>
              <p className="font-mono text-xs text-wds-muted leading-relaxed">
                Work on websites and products used by thousands of MSIT students.
              </p>
            </div>
          </PixelCard>

          {/* Card 2: Skill Growth */}
          <PixelCard className="flex items-start gap-4">
            <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
              <TrophyPixel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow mb-1">SKILL GROWTH</h3>
              <p className="font-mono text-xs text-wds-muted leading-relaxed">
                Learn by doing and level up with every project you ship.
              </p>
            </div>
          </PixelCard>

          {/* Card 3: Amazing Team */}
          <PixelCard className="flex items-start gap-4">
            <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
              <Users className="w-5 h-5 text-wds-yellow" />
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow mb-1">AMAZING TEAM</h3>
              <p className="font-mono text-xs text-wds-muted leading-relaxed">
                Collaborate with like-minded peers and build together.
              </p>
            </div>
          </PixelCard>

          {/* Card 4: Exposure */}
          <PixelCard className="flex items-start gap-4">
            <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
              <RocketPixel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow mb-1">EXPOSURE</h3>
              <p className="font-mono text-xs text-wds-muted leading-relaxed">
                Get exposure to startups, mentors and industry standards.
              </p>
            </div>
          </PixelCard>

          {/* Card 5: Leadership */}
          <PixelCard className="flex items-start gap-4">
            <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
              <TrendingUp className="w-5 h-5 text-wds-yellow" />
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow mb-1">LEADERSHIP</h3>
              <p className="font-mono text-xs text-wds-muted leading-relaxed">
                Take ownership, lead projects and create lasting impact.
              </p>
            </div>
          </PixelCard>

          {/* Card 6: Rewards */}
          <PixelCard className="flex items-start gap-4">
            <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
              <Gift className="w-5 h-5 text-wds-yellow" />
            </div>
            <div>
              <h3 className="font-pixel text-xs sm:text-sm text-wds-yellow mb-1">REWARDS</h3>
              <p className="font-mono text-xs text-wds-muted leading-relaxed">
                Recognition, developer goodies, certificates and exciting perks.
              </p>
            </div>
          </PixelCard>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SELECTION PROCESS & FINAL CTA (Matching Poster #1)                    */}
      {/* ========================================================================= */}
      <div id="selection-process" className="pt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 5-Step Selection Process (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <SectionHeader
            title="SELECTION PROCESS"
            subtitle="Transparent, growth-focused evaluation designed to recognize passion and problem-solving mindset."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {/* Step 1 */}
            <div className="p-4 border border-wds-yellow/40 bg-wds-card flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <FileEdit className="w-5 h-5 text-wds-yellow" />
                <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow text-wds-bg font-bold">
                  01
                </span>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">APPLY ONLINE</div>
                <p className="font-mono text-[11px] text-wds-muted mt-1 leading-snug">
                  Fill out our multi-step application form.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 border border-wds-yellow/40 bg-wds-card flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <FileCheck2 className="w-5 h-5 text-wds-yellow" />
                <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow text-wds-bg font-bold">
                  02
                </span>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">SHORTLISTING</div>
                <p className="font-mono text-[11px] text-wds-muted mt-1 leading-snug">
                  We review your mindset, goals &amp; responses.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 border border-wds-yellow/40 bg-wds-card flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <MessageSquare className="w-5 h-5 text-wds-yellow" />
                <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow text-wds-bg font-bold">
                  03
                </span>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">INTERVIEW</div>
                <p className="font-mono text-[11px] text-wds-muted mt-1 leading-snug">
                  Interaction round to know you better.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 border border-wds-yellow/40 bg-wds-card flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <Puzzle className="w-5 h-5 text-wds-yellow" />
                <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow text-wds-bg font-bold">
                  04
                </span>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">FINAL ROUND</div>
                <p className="font-mono text-[11px] text-wds-muted mt-1 leading-snug">
                  Problem solving / task round (if needed).
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 border border-wds-yellow/40 bg-wds-card flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="w-5 h-5 text-wds-green" />
                <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow text-wds-bg font-bold">
                  05
                </span>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-green">RESULTS</div>
                <p className="font-mono text-[11px] text-wds-muted mt-1 leading-snug">
                  Welcome to WDS! Notified via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Ready To Build Card (4 cols) */}
        <div className="lg:col-span-4 p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow flex flex-col justify-between text-center space-y-4">
          <div className="space-y-2">
            <div className="font-pixel text-xs text-wds-yellow">READY TO BUILD SOMETHING AMAZING?</div>
            <p className="font-mono text-xs text-wds-muted leading-relaxed">
              Be a part of a community that builds, maintains and ships real digital experiences.
            </p>
          </div>

          <div className="space-y-3">
            <PixelButton href="/recruitment/apply" variant="primary" size="lg" className="w-full">
              APPLY NOW →
            </PixelButton>

            <div className="flex items-center justify-center gap-2 font-mono text-xs text-wds-green">
              <span className="w-2 h-2 rounded-full bg-wds-green animate-pulse" />
              <span>Applications are open!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
