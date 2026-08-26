"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { History, Shield, Filter, Search, Download } from "lucide-react";
import { AuditLogEntry } from "@/lib/repositories/types";

interface AuditViewProps {
  logs: AuditLogEntry[];
  onExportAudit?: () => void;
}

export function AuditView({ logs, onExportAudit }: AuditViewProps) {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const actionsList = Array.from(new Set(logs.map((l) => l.action)));

  const filtered = logs.filter((log) => {
    const matchAction = filterAction === "ALL" || log.action === filterAction;
    const matchSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ SYSTEM AUDIT TRAIL &amp; ACTIVITY</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Immutable operational event ledger recording member actions, candidate transitions, and task mutations.
          </p>
        </div>

        {onExportAudit && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onExportAudit();
            }}
            className="px-4 py-2 border border-wds-yellow bg-wds-card hover:bg-wds-yellow hover:text-wds-bg text-wds-yellow font-pixel text-xs font-bold shadow-pixel-yellow-sm flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT AUDIT CSV</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-wds-card border border-wds-yellow/40">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-wds-yellow absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actor, action, resource..."
            className="w-full pl-8 pr-3 py-1.5 bg-wds-bg border border-wds-yellow/30 text-xs text-wds-white outline-none focus:border-wds-yellow font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-wds-muted shrink-0" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-wds-bg border border-wds-yellow/40 px-3 py-1 text-xs text-wds-white font-mono outline-none focus:border-wds-yellow"
          >
            <option value="ALL">ALL ACTIONS ({logs.length})</option>
            {actionsList.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="border-2 border-wds-yellow/50 bg-wds-card overflow-x-auto shadow-pixel-yellow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-wds-bg border-b-2 border-wds-yellow/30 text-wds-yellow font-pixel text-[10px]">
            <tr>
              <th className="p-3">TIMESTAMP</th>
              <th className="p-3">ACTOR &amp; ROLE</th>
              <th className="p-3">ACTION EVENT</th>
              <th className="p-3">RESOURCE &amp; TARGET</th>
              <th className="p-3">PAYLOAD SUMMARY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wds-yellow/10">
            {filtered.length > 0 ? (
              filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-wds-bg/60 transition-colors">
                  <td className="p-3 text-wds-muted whitespace-nowrap text-[11px]">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-bold text-wds-white">{entry.actor}</div>
                    <div className="text-[10px] text-wds-yellow font-pixel">{entry.role}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 border border-wds-yellow/40 bg-wds-bg text-wds-yellow font-pixel text-[9px]">
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="text-wds-white">{entry.resource}</div>
                    <code className="text-[10px] text-wds-muted">{entry.resourceId}</code>
                  </td>
                  <td className="p-3 text-wds-muted max-w-xs truncate text-[11px]">
                    {entry.details ? JSON.stringify(entry.details) : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-wds-muted">
                  No matching audit entries recorded in event store.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
