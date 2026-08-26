"use client";

import React from "react";
import { Link2, ExternalLink } from "lucide-react";

export function WebsiteView() {
  const websites = [
    {
      name: "MSIT Official Institutional Portal",
      url: "https://msit.in",
      status: "LIVE",
      type: "Institutional",
      description: "Primary web portal for Maharaja Surajmal Institute of Technology.",
    },
    {
      name: "WDS Bug Hunt Platform",
      url: "https://wds-bug-hunt.netlify.app/bug-hunt",
      status: "LIVE",
      type: "QA & Engagement",
      description: "Community QA and website discovery platform for student testers.",
    },
    {
      name: "WDS Interactive Terminal",
      url: "/terminal",
      status: "LIVE",
      type: "CLI Shell",
      description: "UNIX-like browser shell for society exploration and commands.",
    },
    {
      name: "WDS GitHub Organization",
      url: "https://github.com/JayantOlhyan/WDS-website",
      status: "LIVE",
      type: "Open Source",
      description: "Official repository and open-source codebase for WDS.",
    },
    {
      name: "WDS Tech Newsletter Engine",
      url: "/projects#newsletter",
      status: "IN DEVELOPMENT",
      type: "Editorial",
      description: "Technical articles and engineering digest engine.",
    },
    {
      name: "MSIT Freshers Hub 2026",
      url: "/projects#freshers-hub",
      status: "IN DEVELOPMENT",
      type: "Student Resource",
      description: "Notes, syllabus repository and survival guide for first years.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-wds-yellow/30">
        <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WEBSITES REGISTRY</h1>
        <p className="text-xs text-wds-muted mt-0.5">
          Verified production links, operational health, and development environments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {websites.map((site, idx) => (
          <div
            key={idx}
            className="p-5 border-2 border-wds-yellow/50 bg-wds-card flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Link2 className="w-5 h-5 text-wds-yellow" />
                <span
                  className={`font-pixel text-[9px] px-1.5 py-0.5 border ${
                    site.status === "LIVE"
                      ? "bg-wds-green/20 border-wds-green text-wds-green"
                      : "bg-wds-yellow/20 border-wds-yellow text-wds-yellow"
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <h3 className="font-bold text-xs text-wds-white">{site.name}</h3>
              <div className="text-[10px] text-wds-muted mt-0.5">{site.type}</div>
              <p className="text-xs text-wds-muted mt-2 leading-relaxed">{site.description}</p>
            </div>

            <div className="pt-3 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
              <span className="text-[10px] text-wds-muted truncate max-w-[140px]">{site.url}</span>
              <a
                href={site.url}
                target={site.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-wds-yellow hover:underline flex items-center gap-1 font-bold text-xs"
              >
                <span>OPEN</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
