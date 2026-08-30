"use client";

import React, { useState } from "react";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { sound } from "@/lib/soundEffects";
import { ShieldAlert, Key } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminAccessPage() {
  const [role, setRole] = useState("admin");
  const [id, setId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "the core", label: "The Core" },
    { value: "the lead", label: "The Lead" },
    { value: "the member", label: "The Member" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMsg(null);

    if (!id.trim()) {
      setErrorMsg("ACCESS DENIED: ID REQUIRED");
      return;
    }

    setIsSubmitting(true);
    
    // Mocking a backend request
    setTimeout(() => {
      setIsSubmitting(false);
      setErrorMsg("SYSTEM ERROR: UNABLE TO VERIFY CREDENTIALS OFFLINE");
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] bg-wds-bg pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-wds-yellow rounded-full mix-blend-screen filter blur-[128px]" />
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-wds-red rounded-full mix-blend-screen filter blur-[128px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <TerminalWindow title="ADMIN_ACCESS.exe">
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <ShieldAlert className="w-12 h-12 text-wds-yellow mx-auto mb-4 animate-pulse" />
              <h1 className="font-pixel text-xl text-wds-yellow">RESTRICTED AREA</h1>
              <p className="font-mono text-xs text-wds-muted">
                Please enter your designated role and identification key to proceed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-pixel text-[10px] text-wds-yellow uppercase">
                  Select Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => {
                      sound.playHover();
                      setRole(e.target.value);
                    }}
                    className="w-full bg-wds-card border-2 border-wds-yellow/50 p-3 font-mono text-sm text-wds-white focus:outline-none focus:border-wds-yellow appearance-none cursor-pointer hover:bg-wds-yellow/5 transition-colors"
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-wds-bg text-wds-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-wds-yellow font-pixel text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-pixel text-[10px] text-wds-yellow uppercase flex items-center gap-2">
                  <Key className="w-3 h-3" /> Identification Key
                </label>
                <input
                  type="password"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your ID..."
                  className="w-full bg-wds-card border-2 border-wds-yellow/50 p-3 font-mono text-sm text-wds-white focus:outline-none focus:border-wds-yellow placeholder:text-wds-muted/50 transition-colors hover:border-wds-yellow/80"
                />
              </div>

              {errorMsg && (
                <div className="p-3 border border-wds-red/50 bg-wds-red/10 text-wds-red font-mono text-[11px] flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 font-bold">!</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-4">
                <PixelButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-4"
                >
                  {isSubmitting ? "AUTHENTICATING..." : "INITIATE LOGIN"}
                </PixelButton>
              </div>
            </form>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
