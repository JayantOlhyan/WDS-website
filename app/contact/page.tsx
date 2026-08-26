"use client";

import React, { useState } from "react";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { sound } from "@/lib/soundEffects";
import {
  Mail,
  MapPin,
  Building,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "Collaboration",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    sound.playSuccess();
    setSent(true);
  };

  return (
    <div className="flex flex-col w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-grid-lines font-mono">
      {/* Header */}
      <div className="border-b-2 border-wds-yellow/30 pb-8 mb-10">
        <h1 className="font-pixel text-3xl sm:text-4xl text-wds-yellow leading-tight">
          &gt;_ GET IN TOUCH
        </h1>
        <p className="text-xs sm:text-sm text-wds-muted mt-2">
          Want to collaborate with WDS, report a website issue, host a workshop or connect with student developers?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Campus Info & Social Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* College & Lab Details */}
          <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
            <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/30">
              CAMPUS HEADQUARTERS
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
                  <Building className="w-4 h-4 text-wds-yellow" />
                </div>
                <div>
                  <div className="text-wds-white font-bold">Maharaja Surajmal Institute of Technology</div>
                  <div className="text-wds-muted">C-4 Janakpuri, New Delhi - 110058</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
                  <MapPin className="w-4 h-4 text-wds-yellow" />
                </div>
                <div>
                  <div className="text-wds-white font-bold">WDS Society Hub</div>
                  <div className="text-wds-muted">Room No. 201 (Near CSE Dept.)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 border border-wds-yellow bg-wds-bg shrink-0">
                  <Mail className="w-4 h-4 text-wds-yellow" />
                </div>
                <div>
                  <div className="text-wds-white font-bold">Official Email</div>
                  <a
                    href="mailto:hello@wds.msit"
                    className="text-wds-yellow hover:underline"
                  >
                    hello@wds.msit
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Community Matrix */}
          <div className="p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
            <div className="font-pixel text-xs text-wds-yellow pb-2 border-b border-wds-yellow/30">
              COMMUNITY CHANNELS
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: "WhatsApp Community", href: "https://chat.whatsapp.com/wds-msit" },
                { name: "Discord Server", href: "https://discord.gg/wds-msit" },
                { name: "GitHub Organization", href: "https://github.com/wds-msit" },
                { name: "LinkedIn Page", href: "https://linkedin.com/company/wds-msit" },
                { name: "Instagram", href: "https://instagram.com/wds_msit" },
                { name: "YouTube Channel", href: "https://youtube.com/@wds-msit" },
              ].map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2.5 border border-wds-border-dim bg-wds-bg hover:border-wds-yellow hover:text-wds-yellow flex items-center justify-between text-[11px] transition-colors"
                >
                  <span className="truncate">{channel.name}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Collaboration Form (7 cols) */}
        <div className="lg:col-span-7">
          <TerminalWindow
            title="COLLABORATION_DISPATCH.EXE"
            theme="yellow-header"
            statusText="READY"
          >
            {sent ? (
              <div className="text-center py-10 space-y-4 font-mono">
                <div className="inline-flex p-3 border-2 border-wds-green bg-wds-green/10 text-wds-green">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-pixel text-lg text-wds-white">MESSAGE TRANSMITTED!</h3>
                <p className="text-xs text-wds-muted max-w-md mx-auto">
                  Thank you for reaching out to WDS MSIT. Our operations team will review your message and get back to you shortly.
                </p>
                <div className="pt-2">
                  <PixelButton
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: "", email: "", purpose: "Collaboration", message: "" });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    SEND ANOTHER MESSAGE
                  </PixelButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    Your Name <span className="text-wds-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aryan Gupta"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    Email Address <span className="text-wds-yellow">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. aryan@gmail.com"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    Purpose / Subject
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  >
                    <option value="Collaboration">Project Collaboration / Tech Partnership</option>
                    <option value="Bug Report">MSIT Website Bug Report</option>
                    <option value="Event / Workshop">Event / Workshop Proposal</option>
                    <option value="Sponsorship">Sponsorship &amp; Community</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    Message <span className="text-wds-yellow">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your proposal, query or feedback..."
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow resize-none"
                  />
                </div>

                <div className="pt-2">
                  <PixelButton type="submit" variant="primary" size="md" className="w-full">
                    TRANSMIT DISPATCH →
                  </PixelButton>
                </div>
              </form>
            )}
          </TerminalWindow>
        </div>
      </div>
    </div>
  );
}
