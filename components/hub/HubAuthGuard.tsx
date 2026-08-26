"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { Lock, Key, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { HubUserSession } from "@/lib/auth";

interface HubAuthGuardProps {
  onAuthenticated: (session: HubUserSession) => void;
}

export function HubAuthGuard({ onAuthenticated }: HubAuthGuardProps) {
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const presets = [
    { label: "Admin (Jayant)", key: "wds-admin-2026", role: "ADMIN" },
    { label: "Core Lead", key: "wds-core-2026", role: "CORE_TEAM" },
    { label: "Tech Lead", key: "wds-tech-2026", role: "TEAM_LEAD" },
    { label: "Society Member", key: "wds-member-2026", role: "MEMBER" },
  ];

  const handleLogin = async (keyToSubmit: string) => {
    if (!keyToSubmit.trim()) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/hub/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey: keyToSubmit.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playSuccess();
        onAuthenticated(data.session);
      } else {
        sound.playError();
        setErrorMsg(data.error || "Authentication failed. Invalid key.");
      }
    } catch {
      sound.playError();
      setErrorMsg("Network error connecting to Hub Auth server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 bg-wds-bg bg-grid-lines font-mono">
      <div className="max-w-xl w-full">
        <TerminalWindow title="WDS_HUB_AUTHENTICATION.EXE" statusText="SECURE_GATEWAY">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 border-2 border-wds-yellow bg-wds-card text-wds-yellow shadow-pixel-yellow-sm mb-2">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="font-pixel text-xl sm:text-2xl text-wds-yellow">
                &gt;_ WDS HUB ACCESS GATEWAY
              </h1>
              <p className="text-xs text-wds-muted max-w-md mx-auto leading-relaxed">
                Enter your authorized WDS access key to unlock internal society operations, sprint boards, and bug queues.
              </p>
            </div>

            {/* Manual Key Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(accessKey);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-wds-white mb-1">
                  Access Key / Role Token
                </label>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-wds-yellow absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    autoFocus
                    required
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="e.g. wds-admin-2026"
                    className="w-full pl-9 pr-3 py-2.5 bg-wds-bg border-2 border-wds-yellow/50 focus:border-wds-yellow text-sm text-wds-white font-mono outline-none shadow-inner"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-wds-red/10 border border-wds-red text-wds-red text-xs font-mono">
                  [AUTH_ERROR]: {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold border-2 border-wds-yellow hover:bg-[#fff176] shadow-pixel-yellow flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? "AUTHENTICATING..." : "VERIFY CREDENTIALS →"}</span>
              </button>
            </form>

            {/* Quick Demo Access Key Presets */}
            <div className="pt-4 border-t border-wds-yellow/20 space-y-2.5">
              <div className="text-[10px] font-pixel text-wds-muted uppercase flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-wds-yellow" />
                <span>QUICK ROLE ACCESS KEYS</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {presets.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setAccessKey(p.key);
                      handleLogin(p.key);
                    }}
                    className="p-2 bg-wds-bg border border-wds-border-dim hover:border-wds-yellow text-left flex flex-col justify-between group transition-colors"
                  >
                    <div className="font-bold text-wds-white group-hover:text-wds-yellow flex items-center justify-between">
                      <span className="truncate">{p.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-[9px] text-wds-muted font-pixel mt-1">{p.role}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
