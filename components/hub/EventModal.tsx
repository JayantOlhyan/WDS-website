"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: {
    title: string;
    name: string;
    description: string;
    stage: "PLANNING" | "ANNOUNCED" | "REGISTRATION" | "LIVE" | "COMPLETED";
    status: "PLANNING" | "ANNOUNCED" | "REGISTRATION" | "LIVE" | "COMPLETED";
    date: string;
    venue: string;
    lead: string;
    registrationUrl?: string;
    expectedAttendance: number;
  }) => void;
}

export function EventModal({ isOpen, onClose, onAddEvent }: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<"PLANNING" | "ANNOUNCED" | "REGISTRATION" | "LIVE" | "COMPLETED">("PLANNING");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [lead, setLead] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState(50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date.trim() || !venue.trim()) return;

    sound.playSuccess();

    onAddEvent({
      title: title.trim(),
      name: title.trim(),
      description: description.trim(),
      stage,
      status: stage,
      date: date.trim(),
      venue: venue.trim(),
      lead: lead.trim() || "WDS Events Lead",
      registrationUrl: registrationUrl.trim() || undefined,
      expectedAttendance: Number(expectedAttendance) || 50,
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setStage("PLANNING");
    setDate("");
    setVenue("");
    setLead("");
    setRegistrationUrl("");
    setExpectedAttendance(50);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30 font-pixel text-xs text-wds-yellow">
          <span>&gt;_ SCHEDULE NEW SOCIETY EVENT</span>
          <button type="button" onClick={onClose} className="text-wds-muted hover:text-wds-white">
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-wds-white font-bold mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Orientation Ceremony 2026"
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
            />
          </div>

          <div>
            <label className="block text-wds-white font-bold mb-1">Description *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the event..."
              rows={3}
              className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Date *</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. September 10, 2026"
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Venue *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Main Auditorium, MSIT"
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Lead Organizer</label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="e.g. Events Team"
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Lifecycle Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full p-2 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              >
                <option value="PLANNING">PLANNING</option>
                <option value="ANNOUNCED">ANNOUNCED</option>
                <option value="REGISTRATION">REGISTRATION</option>
                <option value="LIVE">LIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-wds-white font-bold mb-1">Registration Link (optional)</label>
              <input
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="e.g. https://..."
                className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
              />
            </div>
            <div>
              <label className="block text-wds-white font-bold mb-1">Expected Attendance</label>
              <input
                type="number"
                min={1}
                value={expectedAttendance}
                onChange={(e) => setExpectedAttendance(Number(e.target.value))}
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
              SAVE EVENT →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
