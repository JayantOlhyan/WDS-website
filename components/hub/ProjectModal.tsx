"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: {
    name: string;
    description: string;
    lead: string;
    wing: string;
    type: string;
    techStack: string[];
    websiteUrl?: string;
    githubUrl?: string;
    status: "ACTIVE" | "MAINTENANCE" | "COMPLETED" | "PLANNING";
  }) => void;
}

export function ProjectModal({ isOpen, onClose, onAddProject }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lead, setLead] = useState("");
  const [wing, setWing] = useState("Technical Wing");
  const [type, setType] = useState("WEB_APPLICATION");
  const [techStackInput, setTechStackInput] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "MAINTENANCE" | "COMPLETED" | "PLANNING">("ACTIVE");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    sound.playSuccess();
    
    // Parse tech stack input (split by commas and clean up spacing)
    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddProject({
      name: name.trim(),
      description: description.trim(),
      lead: lead.trim() || "WDS Tech Lead",
      wing,
      type,
      techStack,
      websiteUrl: websiteUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      status,
    });

    // Reset Form
    setName("");
    setDescription("");
    setLead("");
    setWing("Technical Wing");
    setType("WEB_APPLICATION");
    setTechStackInput("");
    setWebsiteUrl("");
    setGithubUrl("");
    setStatus("ACTIVE");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
          <span>&gt;_ ADD NEW SOCIETY PROJECT</span>
          <button type="button" onClick={onClose} className="text-wds-muted hover:text-wds-white">
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-wds-white font-bold mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WDS Bug Hunt Platform"
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
            />
          </div>

          <div>
            <label className="block text-wds-white font-bold mb-1">Description / Scope *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a description of the project's purpose and scope..."
              rows={3}
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Lead Developer</label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="e.g. Jayant Olhyan"
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Primary Wing</label>
              <select
                value={wing}
                onChange={(e) => setWing(e.target.value)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option>Technical Wing</option>
                <option>Design Wing</option>
                <option>Public Relations</option>
                <option>Corporate Relations</option>
                <option>Content & Social Media</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Project Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option value="WEB_APPLICATION">Web Application</option>
                <option value="MOBILE_APP">Mobile App</option>
                <option value="BOT">Bot / Integration</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PLANNING">PLANNING</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-wds-white font-bold mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="e.g. Next.js, React, Tailwind CSS, Notion API"
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="e.g. https://github.com/..."
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Live Endpoint URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g. https://..."
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-wds-yellow/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-wds-border-dim text-wds-muted hover:text-wds-white text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 border border-wds-yellow bg-wds-yellow text-wds-bg font-bold font-pixel text-xs shadow-pixel-yellow-sm"
            >
              SAVE PROJECT →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
