"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { FolderKanban, ExternalLink, Github, Code, CheckCircle, ArrowRight } from "lucide-react";
import { SocietyProject } from "@/lib/repositories/ProjectRepository";

interface ProjectViewProps {
  projects: SocietyProject[];
  onSelectProject?: (slug: string) => void;
}

export function ProjectView({ projects, onSelectProject }: ProjectViewProps) {
  const [selectedProject, setSelectedProject] = useState<SocietyProject | null>(projects[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ SOCIETY PROJECT REGISTRY</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Active repositories, live student portals, release cycles, and wing ownership.
          </p>
        </div>

        <div className="p-2 border border-wds-yellow/30 bg-wds-card text-right font-mono text-xs">
          <div className="text-[9px] text-wds-muted">&gt;_ ACTIVE REPOSITORIES</div>
          <div className="font-pixel text-[10px] text-wds-green">{projects.length} TRACKED</div>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Cards Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                sound.playClick();
                setSelectedProject(proj);
                if (onSelectProject) onSelectProject(proj.slug);
              }}
              className={`p-4 border-2 bg-wds-card cursor-pointer transition-all ${
                selectedProject?.id === proj.id
                  ? "border-wds-yellow shadow-pixel-yellow"
                  : "border-wds-border-dim hover:border-wds-yellow/60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 text-wds-yellow shrink-0" />
                  <span className="font-pixel text-xs text-wds-white">{proj.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 font-pixel text-[9px] border ${
                    proj.status === "ACTIVE"
                      ? "border-wds-green text-wds-green bg-wds-green/10"
                      : "border-wds-yellow text-wds-yellow bg-wds-yellow/10"
                  }`}
                >
                  {proj.status}
                </span>
              </div>

              <p className="text-xs text-wds-muted mt-2 line-clamp-2 leading-relaxed">{proj.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-wds-yellow/20 text-[11px] text-wds-muted">
                <div>
                  Lead: <strong className="text-wds-white">{proj.lead}</strong> ({proj.wing})
                </div>
                <div className="flex items-center gap-2">
                  {proj.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-wds-bg border border-wds-border-dim text-[9px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Project Detail Drawer (5 cols) */}
        <div className="lg:col-span-5">
          {selectedProject ? (
            <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-5 sticky top-16">
              <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30">
                <div>
                  <span className="font-pixel text-[9px] text-wds-yellow">{selectedProject.id}</span>
                  <h3 className="font-pixel text-base text-wds-white">{selectedProject.name}</h3>
                </div>
                <span className="px-2 py-0.5 font-pixel text-[10px] border border-wds-green text-wds-green bg-wds-green/10">
                  {selectedProject.status}
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <div className="text-[10px] font-pixel text-wds-yellow mb-1">&gt;_ SCOPE &amp; OBJECTIVE</div>
                  <p className="text-wds-muted bg-wds-bg p-3 border border-wds-yellow/20">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-wds-bg border border-wds-border-dim">
                    <div className="text-[9px] text-wds-muted">PROJECT LEAD</div>
                    <div className="font-bold text-wds-white mt-0.5">{selectedProject.lead}</div>
                  </div>
                  <div className="p-2.5 bg-wds-bg border border-wds-border-dim">
                    <div className="text-[9px] text-wds-muted">PRIMARY WING</div>
                    <div className="font-bold text-wds-yellow mt-0.5">{selectedProject.wing}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-pixel text-wds-yellow mb-1.5">&gt;_ TECHNOLOGY STACK</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-wds-bg border border-wds-yellow/40 text-[10px] font-mono text-wds-white flex items-center gap-1"
                      >
                        <Code className="w-3 h-3 text-wds-yellow" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-wds-yellow/20 space-y-2">
                  <div className="text-[10px] font-pixel text-wds-yellow">&gt;_ VERIFIED ENDPOINTS</div>
                  <div className="space-y-1.5">
                    {selectedProject.websiteUrl && (
                      <a
                        href={selectedProject.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-wds-bg border border-wds-border-dim hover:border-wds-yellow flex items-center justify-between text-xs text-wds-white hover:text-wds-yellow transition-colors"
                      >
                        <span className="truncate">Live Deployment</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-wds-bg border border-wds-border-dim hover:border-wds-yellow flex items-center justify-between text-xs text-wds-white hover:text-wds-yellow transition-colors"
                      >
                        <span className="truncate">Source Repository</span>
                        <Github className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-wds-yellow/30 bg-wds-card text-xs text-wds-muted">
              Select a project from the registry to view tech stack and linked repositories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
