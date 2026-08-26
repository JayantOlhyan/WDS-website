"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import { Link2, ExternalLink, RotateCcw, Activity, ShieldCheck } from "lucide-react";
import { SiteHealthResult } from "@/lib/healthChecks";

export function WebsiteView() {
  const [healthData, setHealthData] = useState<SiteHealthResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>("Initializing...");

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/hub/health");
      const data = await res.json();
      if (res.ok && data.success) {
        setHealthData(data.results);
        setLastCheckTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn("[Health Check Fetch Error]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Periodic health refresh every 45s
    const interval = setInterval(fetchHealth, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">
            &gt;_ WEBSITES &amp; HEALTH MONITOR
          </h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Verified ecosystem endpoints, live HTTP latency ping, and SSRF-safe monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 border border-wds-yellow/30 bg-wds-card text-xs text-wds-muted font-mono hidden sm:block">
            Last Checked: <span className="text-wds-white font-bold">{lastCheckTime}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              fetchHealth();
            }}
            disabled={isLoading}
            className="px-3 py-1.5 border border-wds-yellow bg-wds-yellow text-wds-bg font-pixel text-xs font-bold hover:bg-[#fff176] shadow-pixel-yellow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>PING SITES</span>
          </button>
        </div>
      </div>

      {/* Security Whitelist Badge */}
      <div className="p-3 bg-wds-card border border-wds-yellow/30 flex items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-wds-green">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>SSRF Domain Whitelist Active (Strict Host Matching)</span>
        </div>
        <span className="text-wds-muted text-[10px] hidden md:inline">
          msit.in • wds-bug-hunt.netlify.app • github.com
        </span>
      </div>

      {/* Grid of Verified Monitored Sites */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData.map((site, idx) => (
          <div
            key={idx}
            className="p-5 border-2 border-wds-yellow/50 bg-wds-card flex flex-col justify-between space-y-4 shadow-pixel-yellow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Link2 className="w-5 h-5 text-wds-yellow" />
                <div className="flex items-center gap-2">
                  {site.status === "ONLINE" && (
                    <span className="w-2 h-2 rounded-full bg-wds-green animate-pulse" />
                  )}
                  <span
                    className={`font-pixel text-[9px] px-1.5 py-0.5 border ${
                      site.status === "ONLINE"
                        ? "bg-wds-green/20 border-wds-green text-wds-green"
                        : site.status === "IN_DEVELOPMENT"
                        ? "bg-wds-yellow/20 border-wds-yellow text-wds-yellow"
                        : "bg-wds-red/20 border-wds-red text-wds-red"
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-xs text-wds-white">{site.name}</h3>
              <div className="text-[10px] text-wds-muted truncate mt-0.5">{site.url}</div>

              {/* Latency & HTTP Status Strip */}
              {site.status === "ONLINE" && (
                <div className="mt-3 p-2 bg-wds-bg border border-wds-yellow/20 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <div className="text-[9px] text-wds-muted">HTTP STATUS</div>
                    <div className="font-bold text-wds-green">{site.httpStatus || 200} OK</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-wds-muted">LATENCY</div>
                    <div className="font-bold text-wds-yellow flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{site.responseTimeMs || 120}ms</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
              <span className="text-[10px] text-wds-muted">Checked: {site.lastChecked}</span>
              <a
                href={site.url}
                target={site.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
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
