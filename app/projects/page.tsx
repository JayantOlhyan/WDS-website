"use client";

import React, { useState } from "react";
import { WDS_PROJECTS, Project } from "@/lib/projectsData";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CircuitHubPixel } from "@/components/ui/PixelIcons";
import { sound } from "@/lib/soundEffects";
import {
  Globe,
  Bug,
  Mail,
  Users,
  Terminal,
  Code2,
  ExternalLink,
  Github,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Core Platform", "Community", "Open Source", "Internal Tool"];

  const filteredProjects =
    selectedCategory === "ALL"
      ? WDS_PROJECTS
      : WDS_PROJECTS.filter((p) => p.category === selectedCategory);

  const getProjectIcon = (type: Project["iconType"]) => {
    switch (type) {
      case "globe":
        return <Globe className="w-6 h-6 text-wds-yellow" />;
      case "bug":
        return <Bug className="w-6 h-6 text-wds-yellow" />;
      case "mail":
        return <Mail className="w-6 h-6 text-wds-yellow" />;
      case "users":
        return <Users className="w-6 h-6 text-wds-yellow" />;
      case "terminal":
        return <Terminal className="w-6 h-6 text-wds-yellow" />;
      case "code":
      default:
        return <Code2 className="w-6 h-6 text-wds-yellow" />;
    }
  };

  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-3xl sm:text-4xl text-wds-yellow leading-tight">
            &gt;_ WDS DIGITAL PROJECTS
          </h1>
          <p className="text-xs sm:text-sm text-wds-muted mt-2 max-w-xl">
            Explore the active websites, tools, and platforms built and maintained by the Web Development Society of MSIT.
          </p>
        </div>

        <div className="hidden md:block">
          <CircuitHubPixel className="w-24 h-16" />
        </div>
      </div>

      {/* Filter Categories Bar */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-pixel text-[10px] text-wds-yellow mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            CATEGORY:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                selectedCategory === cat
                  ? "border-wds-yellow bg-wds-yellow text-wds-bg font-bold shadow-pixel-yellow-sm"
                  : "border-wds-border-dim bg-wds-card text-wds-muted hover:border-wds-yellow hover:text-wds-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-wds-muted">
          Showing <span className="text-wds-yellow font-bold">{filteredProjects.length}</span> Platforms
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={project.id}
            className="relative p-6 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow flex flex-col justify-between hover:shadow-glow-yellow transition-all duration-200"
          >
            {/* 4 Corner Accents */}
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-wds-yellow" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-wds-yellow" />

            <div>
              {/* Top Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 border border-wds-yellow bg-wds-bg">
                  {getProjectIcon(project.iconType)}
                </div>
                <StatusBadge status={project.status} size="sm" />
              </div>

              {/* Title & Tagline */}
              <h3 className="font-pixel text-base text-wds-yellow mb-1">{project.name}</h3>
              <p className="text-xs text-wds-white font-bold mb-3">{project.tagline}</p>
              <p className="text-xs text-wds-muted leading-relaxed mb-4">{project.description}</p>

              {/* Key Features List */}
              {project.features && (
                <div className="mb-4 p-3 bg-wds-bg border border-wds-yellow/20 space-y-1.5">
                  <div className="font-pixel text-[9px] text-wds-yellow mb-1">&gt; KEY CAPABILITIES</div>
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-wds-muted">
                      <span className="text-wds-green font-bold">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border border-wds-border-dim bg-wds-bg text-[10px] text-wds-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-wds-yellow/30 flex items-center justify-between gap-3">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2 border border-wds-border-dim bg-wds-bg hover:border-wds-yellow text-wds-white hover:text-wds-yellow transition-colors"
                  title="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              ) : (
                <div />
              )}

              <PixelButton
                href={project.url}
                external={project.url.startsWith("http")}
                variant="primary"
                size="sm"
                className="flex-1 text-center"
              >
                {project.status === "IN DEVELOPMENT" ? "JOIN DEV TEAM →" : "EXPLORE PLATFORM →"}
              </PixelButton>
            </div>
          </div>
        ))}
      </div>

      {/* Open Source Contribution Banner */}
      <div className="mt-16 p-6 sm:p-8 border-2 border-wds-yellow bg-wds-bg-secondary shadow-pixel-yellow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="font-pixel text-sm text-wds-yellow">&gt;_ CONTRIBUTE TO WDS OPEN SOURCE</div>
          <p className="text-xs text-wds-muted max-w-xl">
            All WDS platforms are built collaboratively by students. Found a bug or want to introduce a new feature? Submit an issue or open a pull request on GitHub!
          </p>
        </div>

        <PixelButton href="https://github.com/wds-msit" external variant="outline" size="md">
          VIEW ON GITHUB →
        </PixelButton>
      </div>
    </div>
  );
}
