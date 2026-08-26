"use client";

import React from "react";
import Link from "next/link";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  RocketPixel,
  TrophyPixel,
} from "@/components/ui/PixelIcons";
import {
  Code2,
  Rocket,
  Briefcase,
  Users,
  Wallet,
  Star,
  Sparkles,
  Infinity as InfinityIcon,
} from "lucide-react";

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines">
      {/* ========================================================================= */}
      {/* 1. TOP HERO & PLAYER 01 EXP HUD (Matching Poster #4)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b-2 border-wds-yellow/30 pb-12">
        {/* Left Header */}
        <div className="lg:col-span-6 space-y-4">
          <h1 className="font-pixel text-3xl sm:text-5xl text-wds-yellow leading-tight">
            &gt;_ OPPORTUNITIES
          </h1>

          <div className="flex items-center gap-1">
            <span className="w-12 h-1 bg-wds-yellow" />
            <span className="w-2 h-1 bg-wds-yellow" />
            <span className="w-2 h-1 bg-wds-yellow" />
            <span className="w-24 h-1 bg-wds-border-dim" />
          </div>

          <p className="font-mono text-sm sm:text-base text-wds-muted leading-relaxed max-w-lg">
            Level up your skills. Build real experience. Create impact that goes beyond the classroom.
          </p>
        </div>

        {/* Right Player 01 EXP HUD */}
        <div className="lg:col-span-6 p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow relative">
          {/* 4 Corner Pixels */}
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-wds-yellow" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-wds-yellow" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

          {/* HUD Status Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
            <span className="tracking-widest">PLAYER 01</span>
            
            {/* Custom Pixel Health Bar */}
            <div className="flex items-center gap-2">
              <div className="w-28 sm:w-44 h-3 bg-wds-bg border border-wds-yellow p-0.5 flex">
                <div className="h-full w-4/5 bg-wds-yellow" />
              </div>
              <span className="text-[10px]">EXP +100</span>
            </div>
          </div>

          {/* Motivational Dialogue */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="space-y-1 font-pixel text-xs sm:text-sm text-wds-white">
              <div>EVERY PROJECT.</div>
              <div>EVERY TASK.</div>
              <div>EVERY LINE OF CODE.</div>
              <div className="text-wds-yellow pt-1 text-sm sm:text-base">
                LEVELS YOU UP.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrophyPixel className="w-10 h-10 hidden sm:block" />
              <RocketPixel className="w-14 h-14" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 6 CORE OPPORTUNITY CARDS (Matching Poster #4)                          */}
      {/* ========================================================================= */}
      <div className="py-14 border-b-2 border-wds-yellow/30">
        <SectionHeader
          title="EXP & REWARD TIERS"
          subtitle="Real-world engineering ownership and technical depth you won't find in textbooks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 01: Real Projects */}
          <div className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  <span className="font-pixel text-sm text-wds-yellow">&lt;/&gt;</span>
                </div>
                <h3 className="font-pixel text-sm text-wds-yellow">REAL PROJECTS</h3>
              </div>
              <div className="w-full h-[1px] bg-wds-yellow/30 mb-4" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                Work on websites and digital products that are used by thousands of students across the college.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-wds-border-dim flex items-center justify-between font-pixel text-[10px] text-wds-yellow">
              <span>BUILD REAL</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 02: Startup Exposure */}
          <div className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  <Rocket className="w-5 h-5 text-wds-yellow" />
                </div>
                <h3 className="font-pixel text-sm text-wds-yellow">STARTUP EXPOSURE</h3>
              </div>
              <div className="w-full h-[1px] bg-wds-yellow/30 mb-4" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                Get exposure to startups, founders, industry mentors and real-world software architecture problems.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-wds-border-dim flex items-center justify-between font-pixel text-[10px] text-wds-yellow">
              <span>THINK BIG</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 03: Portfolio That Stands Out */}
          <div className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  <Briefcase className="w-5 h-5 text-wds-yellow" />
                </div>
                <h3 className="font-pixel text-sm text-wds-yellow">PORTFOLIO THAT STANDS OUT</h3>
              </div>
              <div className="w-full h-[1px] bg-wds-yellow/30 mb-4" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                Build work that you can be genuinely proud of and showcase anywhere to hiring managers.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-wds-border-dim flex items-center justify-between font-pixel text-[10px] text-wds-yellow">
              <span>BUILD YOUR BRAND</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 04: Powerful Network */}
          <div className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  <Users className="w-5 h-5 text-wds-yellow" />
                </div>
                <h3 className="font-pixel text-sm text-wds-yellow">POWERFUL NETWORK</h3>
              </div>
              <div className="w-full h-[1px] bg-wds-yellow/30 mb-4" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                Connect with like-minded student builders, seniors, alumni engineers and industry professionals.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-wds-border-dim flex items-center justify-between font-pixel text-[10px] text-wds-yellow">
              <span>GROW TOGETHER</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 05: Paid Opportunities */}
          <div className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  <Wallet className="w-5 h-5 text-wds-yellow" />
                </div>
                <h3 className="font-pixel text-sm text-wds-yellow">PAID OPPORTUNITIES</h3>
              </div>
              <div className="w-full h-[1px] bg-wds-yellow/30 mb-4" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                Top contributors may get opportunities to work on paid projects (performance based &amp; availability).
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-wds-border-dim flex items-center justify-between font-pixel text-[10px] text-wds-yellow">
              <span>EARN &amp; LEARN</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 06: Leadership & Ownership */}
          <div className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200">
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  <Star className="w-5 h-5 text-wds-yellow" />
                </div>
                <h3 className="font-pixel text-sm text-wds-yellow">LEADERSHIP &amp; OWNERSHIP</h3>
              </div>
              <div className="w-full h-[1px] bg-wds-yellow/30 mb-4" />
              <p className="font-mono text-xs sm:text-sm text-wds-muted leading-relaxed">
                Lead teams, own major digital features and make technical decisions that create lasting impact.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-wds-border-dim flex items-center justify-between font-pixel text-[10px] text-wds-yellow">
              <span>LEAD. IMPACT. INSPIRE.</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM LEVEL UP BANNER (Matching Poster #4)                            */}
      {/* ========================================================================= */}
      <div className="pt-12">
        <div className="p-6 sm:p-8 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="font-pixel text-sm sm:text-base text-wds-yellow flex items-center gap-2 justify-center lg:justify-start">
              <span>&gt;_ LEVEL UP TO UNLOCK MORE</span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-wds-muted max-w-xl">
              New skills. Bigger challenges. Greater impact. The more you contribute, the more you grow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* 4 Infinite Metrics */}
            <div className="grid grid-cols-4 gap-4 p-3 border border-wds-yellow/30 bg-wds-bg text-center font-mono text-xs">
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">SKILLS</div>
                <div className="font-pixel text-sm text-wds-white">∞</div >
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">EXPERIENCE</div>
                <div className="font-pixel text-sm text-wds-white">∞</div >
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">IMPACT</div>
                <div className="font-pixel text-sm text-wds-white">∞</div >
              </div>
              <div>
                <div className="font-pixel text-[10px] text-wds-yellow">POSSIBILITIES</div>
                <div className="font-pixel text-sm text-wds-white">∞</div >
              </div>
            </div>

            <PixelButton href="/recruitment/apply" variant="primary" size="lg">
              JOIN THE JOURNEY →
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
