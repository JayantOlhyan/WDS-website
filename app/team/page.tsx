"use client";

import React from "react";
import Link from "next/link";
import { TEAM_DOMAINS } from "@/lib/teamData";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sound } from "@/lib/soundEffects";
import {
  Users2,
  Code2,
  Palette,
  Megaphone,
  Calendar,
  Github,
  Linkedin,
  Terminal,
} from "lucide-react";

export default function TeamPage() {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines font-mono">
      {/* Top Header */}
      <div className="border-b-2 border-wds-yellow/30 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-wds-yellow bg-wds-yellow/10 text-wds-yellow font-pixel text-xs mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>&gt;_ WDS SQUAD &amp; WINGS</span>
        </div>

        <h1 className="font-pixel text-3xl sm:text-4xl text-wds-yellow leading-tight">
          THE ENGINEERS &amp; CREATORS
        </h1>

        <p className="text-xs sm:text-sm text-wds-muted mt-2 max-w-xl">
          Meet the specialized wings driving development, design, maintenance, editorial, and operations across the WDS MSIT ecosystem.
        </p>
      </div>

      {/* Domain Wings Sections */}
      <div className="space-y-16 py-12">
        {TEAM_DOMAINS.map((domain, index) => (
          <div key={domain.name} className="space-y-6">
            {/* Wing Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wds-yellow/30">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-xs text-wds-yellow">0{index + 1} //</span>
                <h2 className="font-pixel text-lg sm:text-xl text-wds-white">{domain.name}</h2>
              </div>
              <p className="text-xs text-wds-muted max-w-md">{domain.description}</p>
            </div>

            {/* Wing Tech Stack Tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-pixel text-wds-yellow mr-2">TECH STACK:</span>
              {domain.stack.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 border border-wds-yellow/20 bg-wds-card text-[10px] text-wds-white"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {domain.members.map((member, idx) => (
                <div
                  key={idx}
                  className="relative p-5 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow-sm flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200"
                >
                  {/* 4 Corner Pixels */}
                  <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-wds-yellow" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-wds-yellow" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

                  <div>
                    {/* Retro Pixel Avatar Frame */}
                    <div className="w-full aspect-square border-2 border-wds-yellow bg-wds-bg flex flex-col items-center justify-center p-4 mb-4 relative">
                      <div className="p-3 border border-wds-yellow/30 bg-wds-card">
                        <Code2 className="w-8 h-8 text-wds-yellow" />
                      </div>
                      <span className="mt-2 font-pixel text-[9px] px-2 py-0.5 bg-wds-yellow text-wds-bg font-bold">
                        {member.badge}
                      </span>
                    </div>

                    <h3 className="font-pixel text-xs text-wds-yellow mb-1">{member.role}</h3>
                    <p className="text-[11px] text-wds-muted leading-relaxed mb-4">{member.focus}</p>
                  </div>

                  {/* Social Links */}
                  <div className="pt-3 border-t border-wds-yellow/20 flex items-center justify-between text-xs text-wds-muted">
                    <span className="text-[10px]">WDS MSIT</span>
                    <div className="flex items-center gap-2">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick()}
                          className="hover:text-wds-yellow transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick()}
                          className="hover:text-wds-yellow transition-colors"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recruitment Callout */}
      <div className="mt-8 p-8 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow text-center space-y-4">
        <h3 className="font-pixel text-lg sm:text-xl text-wds-yellow">
          WANT TO JOIN OUR SQUAD?
        </h3>
        <p className="text-xs sm:text-sm text-wds-muted max-w-lg mx-auto">
          We recruit passionate first and second-year students across all engineering branches at MSIT.
        </p>
        <div className="pt-2">
          <PixelButton href="/recruitment/apply" variant="primary" size="lg">
            APPLY FOR WDS 2026 →
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
