"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import {
  CandidateApplication,
  ApplicationStatus,
} from "@/lib/notion/recruitment";
import {
  Users,
  Search,
  AlertCircle,
  RotateCcw,
  Mail,
  ShieldAlert,
  Download,
  Star,
  CheckCircle2,
} from "lucide-react";
import { HubRole } from "@/lib/auth";

interface RecruitmentViewProps {
  applications: CandidateApplication[];
  isOffline?: boolean;
  userRole?: HubRole;
  onRetry?: () => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus, notes?: string) => void;
  onExportCsv?: () => void;
}

const parseScorecard = (notesStr?: string) => {
  if (!notesStr) return { tech: 5, comm: 5, prob: 5, fit: 5 };
  const match = notesStr.match(/SCORECARD\[tech:(\d+),comm:(\d+),prob:(\d+),fit:(\d+)\]/);
  if (match) {
    return {
      tech: Number(match[1]),
      comm: Number(match[2]),
      prob: Number(match[3]),
      fit: Number(match[4]),
    };
  }
  return { tech: 5, comm: 5, prob: 5, fit: 5 };
};

export function RecruitmentView({
  applications,
  isOffline,
  userRole = "MEMBER",
  onRetry,
  onUpdateStatus,
  onExportCsv,
}: RecruitmentViewProps) {
  const [activeStage, setActiveStage] = useState<"ALL" | ApplicationStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(
    applications[0] || null
  );

  // Scorecard State for Interview Evaluation
  const [techScore, setTechScore] = useState<number>(5);
  const [commScore, setCommScore] = useState<number>(5);
  const [problemScore, setProblemScore] = useState<number>(5);
  const [fitScore, setFitScore] = useState<number>(5);
  const [scorecardSubmitted, setScorecardSubmitted] = useState<boolean>(false);

  // Load candidate evaluation when candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      const scorecard = parseScorecard(selectedCandidate.notes);
      setTechScore(scorecard.tech);
      setCommScore(scorecard.comm);
      setProblemScore(scorecard.prob);
      setFitScore(scorecard.fit);
      setScorecardSubmitted(
        Boolean(selectedCandidate.notes && selectedCandidate.notes.includes("SCORECARD"))
      );
    }
  }, [selectedCandidate]);

  const canManageRecruitment = userRole === "ADMIN" || userRole === "CORE_TEAM";

  const stages: { label: string; value: "ALL" | ApplicationStatus }[] = [
    { label: "ALL APPLICATIONS", value: "ALL" },
    { label: "RECEIVED", value: "RECEIVED" },
    { label: "SCREENING", value: "SCREENING" },
    { label: "SHORTLISTED", value: "SHORTLISTED" },
    { label: "INTERVIEWS", value: "INTERVIEW" },
    { label: "SELECTED", value: "SELECTED" },
    { label: "REJECTED", value: "REJECTED" },
  ];

  const filtered = applications.filter((app) => {
    const matchesStage = activeStage === "ALL" || app.status === activeStage;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.enrollmentNo.includes(searchQuery) ||
      app.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.preferredTeam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "SELECTED":
        return "bg-wds-green/20 text-wds-green border-wds-green";
      case "INTERVIEW":
        return "bg-wds-yellow/20 text-wds-yellow border-wds-yellow";
      case "SHORTLISTED":
        return "bg-[#64b5f6]/20 text-[#64b5f6] border-[#64b5f6]";
      case "SCREENING":
        return "bg-wds-card text-wds-white border-wds-yellow/40";
      case "REJECTED":
        return "bg-wds-red/20 text-wds-red border-wds-red";
      case "RECEIVED":
      default:
        return "bg-wds-bg text-wds-muted border-wds-border-dim";
    }
  };

  if (!canManageRecruitment) {
    return (
      <div className="p-8 border-2 border-wds-yellow bg-wds-card text-center space-y-4 max-w-xl mx-auto my-12 shadow-pixel-yellow">
        <div className="inline-flex p-3 border-2 border-wds-red bg-wds-red/10 text-wds-red mb-2">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-pixel text-base text-wds-yellow">&gt;_ ACCESS RESTRICTED</h2>
        <p className="text-xs text-wds-muted leading-relaxed">
          Recruitment candidate records and applicant evaluation pipelines are restricted to{" "}
          <strong className="text-wds-white">CORE_TEAM</strong> and{" "}
          <strong className="text-wds-white">ADMIN</strong> roles for privacy compliance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">
            &gt;_ RECRUITMENT 2026 PIPELINE &amp; EVALUATION
          </h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Manage candidate screening, scorecards, interview decisions, and CSV export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onExportCsv && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onExportCsv();
              }}
              className="px-3 py-2 border border-wds-yellow bg-wds-card hover:bg-wds-yellow hover:text-wds-bg text-wds-yellow font-pixel text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT CSV</span>
            </button>
          )}

          <div className="p-2 border border-wds-yellow/30 bg-wds-card text-right font-mono text-xs">
            <div className="text-[9px] text-wds-muted">&gt;_ REGISTERED APPLICANTS</div>
            <div className="font-pixel text-[10px] text-wds-green">
              {applications.length} RECORDS
            </div>
          </div>
        </div>
      </div>

      {/* Offline Alert */}
      {isOffline && (
        <div className="p-4 bg-wds-card border-2 border-wds-yellow/60 shadow-pixel-yellow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-wds-yellow">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold">Notion Recruitment Database Offline:</span> Connect{" "}
              <code>NOTION_DATABASE_ID</code> to sync candidates.
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="px-3 py-1 bg-wds-yellow text-wds-bg font-pixel text-[10px] font-bold flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RETRY</span>
            </button>
          )}
        </div>
      )}

      {/* Real Stage Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {[
          { label: "RECEIVED", count: applications.filter((a) => a.status === "RECEIVED").length },
          { label: "SCREENING", count: applications.filter((a) => a.status === "SCREENING").length },
          { label: "SHORTLISTED", count: applications.filter((a) => a.status === "SHORTLISTED").length },
          { label: "INTERVIEWS", count: applications.filter((a) => a.status === "INTERVIEW").length },
          { label: "SELECTED", count: applications.filter((a) => a.status === "SELECTED").length },
          { label: "REJECTED", count: applications.filter((a) => a.status === "REJECTED").length },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => {
              sound.playClick();
              setActiveStage(s.label as ApplicationStatus);
            }}
            className={`p-2.5 border-2 bg-wds-card text-center cursor-pointer transition-all hover:-translate-y-0.5 ${
              activeStage === s.label
                ? "border-wds-yellow shadow-pixel-yellow-sm"
                : "border-wds-border-dim opacity-80 hover:opacity-100"
            }`}
          >
            <div className="text-[9px] text-wds-muted font-pixel">{s.label}</div>
            <div className="font-pixel text-base text-wds-yellow mt-1">{s.count}</div>
          </div>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-wds-card border border-wds-yellow/40">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-wds-yellow absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, wing..."
            className="w-full pl-8 pr-3 py-1.5 bg-wds-bg border border-wds-yellow/30 text-xs text-wds-white outline-none focus:border-wds-yellow font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {stages.map((stage) => (
            <button
              key={stage.value}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveStage(stage.value);
              }}
              className={`px-2.5 py-1 text-[10px] font-pixel transition-colors ${
                activeStage === stage.value
                  ? "bg-wds-yellow text-wds-bg font-bold"
                  : "bg-wds-bg border border-wds-border-dim text-wds-muted hover:text-wds-white"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate List (6 cols) */}
        <div className="lg:col-span-6 space-y-2.5">
          {filtered.length > 0 ? (
            filtered.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCandidate(candidate);
                  setScorecardSubmitted(false);
                }}
                className={`p-4 border-2 bg-wds-card cursor-pointer transition-all ${
                  selectedCandidate?.id === candidate.id
                    ? "border-wds-yellow shadow-pixel-yellow"
                    : "border-wds-yellow/40 hover:border-wds-yellow"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[10px] text-wds-yellow">
                        {candidate.id.slice(0, 10)}
                      </span>
                      <span className="font-bold text-sm text-wds-white">
                        {candidate.fullName}
                      </span>
                    </div>
                    <div className="text-xs text-wds-muted mt-0.5 flex items-center gap-2">
                      <span>{candidate.branch} • Roll: {candidate.enrollmentNo}</span>
                      {candidate.notes && candidate.notes.includes("SCORECARD") && (
                        <span className="px-1 border border-wds-green/50 bg-wds-green/10 text-wds-green font-pixel text-[8px] uppercase tracking-wide">
                          EVALUATED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 font-pixel text-[9px] border ${getStatusColor(
                        candidate.status
                      )}`}
                    >
                      {candidate.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-wds-yellow/20 text-xs text-wds-muted">
                  <div className="flex items-center gap-2">
                    <span className="text-wds-white font-bold">{candidate.preferredTeam}</span>
                    <span>•</span>
                    <span>{candidate.experienceLevel}</span>
                  </div>
                  <div className="text-[10px] text-wds-muted">
                    Applied: {candidate.appliedDate}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border-2 border-wds-yellow/30 bg-wds-card space-y-2">
              <div className="font-pixel text-xs text-wds-yellow">
                {isOffline ? "&gt;_ DATABASE TEMPORARILY OFFLINE" : "&gt;_ NO APPLICANTS FOUND"}
              </div>
              <p className="text-xs text-wds-muted">
                {isOffline
                  ? "Notion database connection offline. Check credentials or click retry."
                  : "No applicant records found in database for this view."}
              </p>
            </div>
          )}
        </div>

        {/* Candidate Detail & Scorecard Drawer (6 cols) */}
        <div className="lg:col-span-6">
          {selectedCandidate ? (
            <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-5 sticky top-16">
              <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30">
                <div>
                  <span className="font-pixel text-[9px] text-wds-yellow">
                    {selectedCandidate.id.slice(0, 10)}
                  </span>
                  <h3 className="font-pixel text-base text-wds-white">
                    {selectedCandidate.fullName}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 font-pixel text-[10px] border ${getStatusColor(
                    selectedCandidate.status
                  )}`}
                >
                  {selectedCandidate.status}
                </span>
              </div>

              {/* Contact info */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-wds-bg border border-wds-yellow/20 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-wds-muted">Enrollment No:</span>
                    <span className="font-bold text-wds-white">{selectedCandidate.enrollmentNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wds-muted">Branch / Section:</span>
                    <span className="text-wds-white">{selectedCandidate.branch} ({selectedCandidate.section})</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-wds-yellow/10">
                    <span className="text-wds-muted flex items-center gap-1">
                      <Mail className="w-3 h-3 text-wds-yellow" /> Email:
                    </span>
                    <a href={`mailto:${selectedCandidate.collegeEmail}`} className="text-wds-yellow hover:underline">
                      {selectedCandidate.collegeEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Interview Evaluation Scorecard */}
              <div className="p-4 bg-wds-bg border-2 border-wds-yellow/40 space-y-3">
                <div className="font-pixel text-[10px] text-wds-yellow flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-wds-yellow" />
                  <span>&gt;_ INTERVIEW EVALUATION SCORECARD (1-10)</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-wds-muted block mb-1">Technical Skills: {techScore}/10</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={techScore}
                      onChange={(e) => {
                        setTechScore(Number(e.target.value));
                        setScorecardSubmitted(false);
                      }}
                      className="w-full accent-wds-yellow cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-wds-muted block mb-1">Communication: {commScore}/10</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={commScore}
                      onChange={(e) => {
                        setCommScore(Number(e.target.value));
                        setScorecardSubmitted(false);
                      }}
                      className="w-full accent-wds-yellow cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-wds-muted block mb-1">Problem Solving: {problemScore}/10</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={problemScore}
                      onChange={(e) => {
                        setProblemScore(Number(e.target.value));
                        setScorecardSubmitted(false);
                      }}
                      className="w-full accent-wds-yellow cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-wds-muted block mb-1">Team Fit / Culture: {fitScore}/10</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={fitScore}
                      onChange={(e) => {
                        setFitScore(Number(e.target.value));
                        setScorecardSubmitted(false);
                      }}
                      className="w-full accent-wds-yellow cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
                  <span className="font-pixel text-[9px] text-wds-muted">
                    Total Score: <strong className="text-wds-yellow">{techScore + commScore + problemScore + fitScore} / 40</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSuccess();
                      setScorecardSubmitted(true);
                      const serializedNotes = `SCORECARD[tech:${techScore},comm:${commScore},prob:${problemScore},fit:${fitScore}]`;
                      onUpdateStatus(selectedCandidate.id, selectedCandidate.status, serializedNotes);
                      setSelectedCandidate({ ...selectedCandidate, notes: serializedNotes });
                    }}
                    className="px-2.5 py-1 bg-wds-yellow text-wds-bg font-pixel text-[9px] font-bold"
                  >
                    {scorecardSubmitted ? "SAVED ✓" : "SAVE SCORECARD"}
                  </button>
                </div>
              </div>

              {/* Status Updater Action */}
              <div className="pt-2 border-t border-wds-yellow/30 space-y-2">
                <div className="text-[10px] font-pixel text-wds-yellow">&gt;_ PIPELINE STAGE TRANSITION</div>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {(["SCREENING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          sound.playSuccess();
                          onUpdateStatus(selectedCandidate.id, st);
                          setSelectedCandidate({ ...selectedCandidate, status: st });
                        }}
                        className={`p-2 border text-center transition-colors text-[9px] font-pixel ${
                          selectedCandidate.status === st
                            ? "bg-wds-yellow text-wds-bg font-bold border-wds-yellow"
                            : "bg-wds-bg border-wds-border-dim text-wds-muted hover:border-wds-yellow hover:text-wds-white"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-wds-yellow/30 bg-wds-card text-xs text-wds-muted">
              Select a candidate from the pipeline to view application details and scorecards.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
