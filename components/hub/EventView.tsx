"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { Calendar, Plus, MapPin, Users, ArrowRight } from "lucide-react";
import { SocietyEvent, EventLifecycleStage } from "@/lib/repositories/EventRepository";

interface EventViewProps {
  events: SocietyEvent[];
  onUpdateStage?: (id: string, stage: EventLifecycleStage) => void;
  onOpenNewEventModal?: () => void;
}

export function EventView({ events, onUpdateStage, onOpenNewEventModal }: EventViewProps) {
  const [activeStage, setActiveStage] = useState<"ALL" | EventLifecycleStage>("ALL");

  const filtered = events.filter((e) => (activeStage === "ALL" ? true : e.stage === activeStage));

  const getStageBadge = (stage: EventLifecycleStage) => {
    switch (stage) {
      case "LIVE":
        return "bg-wds-green text-wds-bg font-bold border-wds-green animate-pulse";
      case "REGISTRATION":
        return "bg-wds-yellow/20 text-wds-yellow border-wds-yellow";
      case "ANNOUNCED":
        return "bg-[#64b5f6]/20 text-[#64b5f6] border-[#64b5f6]";
      case "PLANNING":
        return "bg-wds-card text-wds-white border-wds-border-dim";
      case "COMPLETED":
        return "bg-wds-green/10 text-wds-green border-wds-green/40";
      case "ARCHIVED":
      default:
        return "bg-wds-bg text-wds-muted border-wds-border-dim";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ SOCIETY EVENT OPERATIONS</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Hackathons, technical bootcamps, speaker sessions, and campus community meetups.
          </p>
        </div>

        {onOpenNewEventModal && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenNewEventModal();
            }}
            className="px-4 py-2 border border-wds-yellow bg-wds-yellow text-wds-bg font-pixel text-xs font-bold shadow-pixel-yellow-sm hover:bg-[#fff176] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NEW EVENT</span>
          </button>
        )}
      </div>

      {/* Stage Tabs */}
      <div className="flex flex-wrap gap-2 p-3 bg-wds-card border border-wds-yellow/40">
        {(["ALL", "PLANNING", "ANNOUNCED", "REGISTRATION", "LIVE", "COMPLETED"] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveStage(st);
            }}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              activeStage === st
                ? "bg-wds-yellow text-wds-bg font-bold"
                : "text-wds-muted hover:text-wds-white border border-wds-border-dim bg-wds-bg"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="p-5 border-2 border-wds-yellow/60 bg-wds-card shadow-pixel-yellow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-pixel text-[10px] text-wds-yellow">{ev.id}</span>
                <span className={`px-2 py-0.5 font-pixel text-[9px] border ${getStageBadge(ev.stage)}`}>
                  {ev.stage}
                </span>
              </div>

              <h3 className="font-pixel text-sm text-wds-white">{ev.title}</h3>
              <p className="text-xs text-wds-muted leading-relaxed">{ev.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-wds-yellow/20 text-xs">
              <div className="grid grid-cols-2 gap-2 text-wds-muted text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-wds-yellow shrink-0" />
                  <span>{ev.date}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-wds-yellow shrink-0" />
                  <span className="truncate">{ev.venue}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-wds-yellow/10">
                <span className="text-wds-muted text-[11px]">
                  Lead: <strong className="text-wds-white">{ev.lead}</strong>
                </span>

                {onUpdateStage && (
                  <div className="flex items-center gap-1 text-[10px] font-pixel">
                    {ev.stage === "PLANNING" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStage(ev.id, "ANNOUNCED")}
                        className="px-2 py-1 border border-wds-yellow bg-wds-bg hover:bg-wds-yellow hover:text-wds-bg"
                      >
                        ANNOUNCE →
                      </button>
                    )}
                    {ev.stage === "ANNOUNCED" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStage(ev.id, "REGISTRATION")}
                        className="px-2 py-1 border border-wds-yellow bg-wds-yellow text-wds-bg font-bold"
                      >
                        OPEN REGISTRATION →
                      </button>
                    )}
                    {ev.stage === "REGISTRATION" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStage(ev.id, "LIVE")}
                        className="px-2 py-1 border border-wds-green bg-wds-green text-wds-bg font-bold"
                      >
                        GO LIVE ⚡
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
