"use client";

import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import {
  WDSLogo,
  MonitorCodePixel,
  MonitorWrenchPixel,
  RocketPixel,
} from "@/components/ui/PixelIcons";
import {
  Terminal,
  Cpu,
  Layers,
  Users2,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines font-mono">
      {/* Hero Header */}
      <div className="border-b-2 border-wds-yellow/30 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-wds-yellow bg-wds-yellow/10 text-wds-yellow font-pixel text-xs mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>&gt;_ ABOUT THE SOCIETY</span>
        </div>

        <h1 className="font-pixel text-3xl sm:text-5xl text-wds-white leading-tight">
          NOT JUST BUILDING SITES. <br />
          <span className="text-wds-yellow">RUNNING THEM.</span>
        </h1>

        <p className="text-sm sm:text-base text-wds-muted max-w-2xl mt-4 leading-relaxed">
          The Web Development Society (WDS) at Maharaja Surajmal Institute of Technology is a student-led engineering organization dedicated to creating, maintaining, and scaling real digital infrastructure for our campus community.
        </p>
      </div>

      {/* Philosophy: BUILD • MAINTAIN • SHIP */}
      <div className="py-14 border-b-2 border-wds-yellow/30">
        <SectionHeader
          title="THE WDS PHILOSOPHY"
          subtitle="A complete lifecycle approach to student software engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <PixelCard className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs text-wds-yellow">01 // BUILD</span>
              <MonitorCodePixel className="w-12 h-12" />
            </div>
            <h3 className="font-pixel text-base text-wds-white">BUILD</h3>
            <p className="text-xs text-wds-muted leading-relaxed">
              We design and develop modern, accessible web applications and campus portals from scratch with strict engineering standards.
            </p>
          </PixelCard>

          <PixelCard className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs text-wds-yellow">02 // MAINTAIN</span>
              <MonitorWrenchPixel className="w-12 h-12" />
            </div>
            <h3 className="font-pixel text-base text-wds-white">MAINTAIN</h3>
            <p className="text-xs text-wds-muted leading-relaxed">
              Real software requires continuous care. We squash bugs, monitor performance, update content, and optimize uptime for 50K+ student visits.
            </p>
          </PixelCard>

          <PixelCard className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs text-wds-yellow">03 // SHIP</span>
              <RocketPixel className="w-12 h-12" />
            </div>
            <h3 className="font-pixel text-base text-wds-white">SHIP</h3>
            <p className="text-xs text-wds-muted leading-relaxed">
              We take code from GitHub repositories to production deployment, teaching students how real product teams deliver value.
            </p>
          </PixelCard>
        </div>
      </div>

      {/* Core Tenets Matrix */}
      <div className="py-14 border-b-2 border-wds-yellow/30">
        <SectionHeader
          title="WHAT MAKES WDS DIFFERENT"
          subtitle="Why WDS operates as a digital workshop rather than a traditional college club."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow-sm space-y-3">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-wds-yellow" />
              <h3 className="font-pixel text-sm text-wds-yellow">STUDENT-DRIVEN OWNERSHIP</h3>
            </div>
            <p className="text-xs text-wds-muted leading-relaxed">
              Students have complete ownership of technical architecture, design tokens, pull requests, and product roadmaps.
            </p>
          </div>

          <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow-sm space-y-3">
            <div className="flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-wds-yellow" />
              <h3 className="font-pixel text-sm text-wds-yellow">OPEN SOURCE CULTURE</h3>
            </div>
            <p className="text-xs text-wds-muted leading-relaxed">
              We foster rigorous code reviews, semantic versioning, Git branching workflows, and open collaboration.
            </p>
          </div>

          <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow-sm space-y-3">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-wds-yellow" />
              <h3 className="font-pixel text-sm text-wds-yellow">FULL DIGITAL ECOSYSTEM</h3>
            </div>
            <p className="text-xs text-wds-muted leading-relaxed">
              From the MSIT official website to our Bug Hunt QA platform and Freshers Hub, we maintain a thriving interconnected ecosystem.
            </p>
          </div>

          <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow-sm space-y-3">
            <div className="flex items-center gap-3">
              <Users2 className="w-6 h-6 text-wds-yellow" />
              <h3 className="font-pixel text-sm text-wds-yellow">INCLUSIVE SKILL ACCELERATOR</h3>
            </div>
            <p className="text-xs text-wds-muted leading-relaxed">
              No prior experience is required to join. We pair first-year enthusiasts with experienced seniors through structured sprints.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-12 text-center space-y-4">
        <h2 className="font-pixel text-xl sm:text-2xl text-wds-white">
          READY TO LEVEL UP WITH US?
        </h2>
        <div className="flex justify-center gap-4 pt-2">
          <PixelButton href="/recruitment/apply" variant="primary" size="lg">
            APPLY FOR WDS 2026 →
          </PixelButton>
          <PixelButton href="/projects" variant="outline" size="lg">
            EXPLORE PLATFORMS
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
