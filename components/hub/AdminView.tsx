"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import {
  ShieldAlert,
  Server,
  Database,
  Key,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { SystemConfigurationReport } from "@/lib/notion/schemaValidator";

interface AdminViewProps {
  onExportData?: (type: "recruitment" | "tasks" | "bugs" | "audit" | "projects") => void;
}

export function AdminView({ onExportData }: AdminViewProps) {
  const [configReport, setConfigReport] = useState<SystemConfigurationReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hub/config");
      const data = await res.json();
      if (res.ok && data.success) {
        setConfigReport(data.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ ADMIN &amp; SYSTEM CONTROL CENTER</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Restricted operational console for database bindings, credentials, and data exports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            fetchConfig();
          }}
          className="px-3 py-1.5 border border-wds-yellow bg-wds-card hover:bg-wds-yellow hover:text-wds-bg text-wds-yellow font-pixel text-xs flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>RE-SCAN SYSTEM</span>
        </button>
      </div>

      {/* Grid: 4 Core Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Database Configuration & Schema Health */}
        <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
          <div className="flex items-center gap-2 text-xs font-pixel text-wds-yellow pb-2 border-b border-wds-yellow/30">
            <Database className="w-4 h-4" />
            <span>&gt;_ NOTION DATABASES &amp; SCHEMA</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {configReport ? (
              <>
                <div className="flex justify-between items-center p-2 bg-wds-bg border border-wds-border-dim">
                  <span className="text-wds-muted">Notion Integration Secret:</span>
                  <span
                    className={`font-pixel text-[9px] px-2 py-0.5 ${
                      configReport.notion.tokenConfigured
                        ? "text-wds-green bg-wds-green/10 border border-wds-green/30"
                        : "text-wds-red bg-wds-red/10 border border-wds-red/30"
                    }`}
                  >
                    {configReport.notion.tokenConfigured ? "CONFIGURED" : "MISSING"}
                  </span>
                </div>

                {Object.entries(configReport.notion.databases).map(([key, db]) => (
                  <div
                    key={key}
                    className="p-2.5 bg-wds-bg border border-wds-border-dim flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-wds-white">{db.name}</div>
                      <div className="text-[10px] text-wds-muted">
                        Status: {db.configured ? "Bound" : "Unbound"}
                      </div>
                    </div>
                    <span
                      className={`font-pixel text-[9px] px-2 py-0.5 ${
                        db.accessible
                          ? "text-wds-green bg-wds-green/10 border border-wds-green/30"
                          : "text-wds-yellow bg-wds-yellow/10 border border-wds-yellow/30"
                      }`}
                    >
                      {db.accessible ? "ONLINE" : db.configured ? "OFFLINE" : "UNCONFIGURED"}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-4 text-wds-muted">Scanning Notion database schema bindings...</div>
            )}
          </div>
        </div>

        {/* 2. Security, Integrations & Webhooks */}
        <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
          <div className="flex items-center gap-2 text-xs font-pixel text-wds-yellow pb-2 border-b border-wds-yellow/30">
            <Lock className="w-4 h-4" />
            <span>&gt;_ SECURITY &amp; WEBHOOK INGESTION</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {configReport && (
              <>
                <div className="flex justify-between items-center p-2 bg-wds-bg border border-wds-border-dim">
                  <span className="text-wds-muted">Bug Hunt HMAC Webhook:</span>
                  <span
                    className={`font-pixel text-[9px] px-2 py-0.5 ${
                      configReport.webhook.configured
                        ? "text-wds-green bg-wds-green/10 border border-wds-green/30"
                        : "text-wds-yellow bg-wds-yellow/10 border border-wds-yellow/30"
                    }`}
                  >
                    {configReport.webhook.configured ? "VERIFIED" : "UNCONFIGURED"}
                  </span>
                </div>

                <div className="p-2.5 bg-wds-bg border border-wds-border-dim space-y-1.5">
                  <div className="text-[10px] font-pixel text-wds-muted">ROLE CREDENTIALS STATUS:</div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>ADMIN KEY: <strong className="text-wds-green">{configReport.auth.adminConfigured ? "SET" : "MISSING"}</strong></div>
                    <div>CORE KEY: <strong className="text-wds-green">{configReport.auth.coreConfigured ? "SET" : "MISSING"}</strong></div>
                    <div>LEAD KEY: <strong className="text-wds-green">{configReport.auth.leadConfigured ? "SET" : "MISSING"}</strong></div>
                    <div>MEMBER KEY: <strong className="text-wds-green">{configReport.auth.memberConfigured ? "SET" : "MISSING"}</strong></div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 bg-wds-bg border border-wds-border-dim">
                  <span className="text-wds-muted">Environment:</span>
                  <span className="text-wds-yellow font-pixel text-[10px]">{configReport.environment.toUpperCase()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Data Export & Backups */}
        <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-pixel text-wds-yellow pb-2 border-b border-wds-yellow/30">
            <Download className="w-4 h-4" />
            <span>&gt;_ DATA BACKUP &amp; RFC 4180 CSV EXPORT CONSOLE</span>
          </div>

          <p className="text-xs text-wds-muted">
            Sanitized CSV exports with formula injection defense (safe against spreadsheet macro execution).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "RECRUITMENT CSV", type: "recruitment" as const },
              { label: "SPRINT TASKS CSV", type: "tasks" as const },
              { label: "BUG HUNT CSV", type: "bugs" as const },
              { label: "SYSTEM AUDIT CSV", type: "audit" as const },
            ].map((btn) => (
              <button
                key={btn.type}
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onExportData) onExportData(btn.type);
                }}
                className="p-3 border border-wds-yellow/60 bg-wds-bg hover:bg-wds-yellow hover:text-wds-bg text-wds-yellow font-pixel text-[10px] text-center transition-colors shadow-pixel-yellow-sm"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
