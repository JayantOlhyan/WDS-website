"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import {
  CandidateApplication,
  ApplicationStatus,
} from "@/lib/notion/recruitment";
import {
  NormalizedCandidateData,
  getNormalizedCandidate,
  parseScorecard,
} from "@/lib/notion/candidateNormalizer";
export type { NormalizedCandidateData };
export { getNormalizedCandidate, parseScorecard };
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
  Maximize2,
  X,
  Copy,
  Printer,
  ExternalLink,
  FileText,
  Check,
} from "lucide-react";
import { HubRole } from "@/lib/auth";

interface RecruitmentViewProps {
  applications: CandidateApplication[];
  isOffline?: boolean;
  userRole?: HubRole;
  onRetry?: () => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus, notes?: string) => Promise<boolean | void> | void;
  onExportCsv?: () => void;
}

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
  const [isSavingScorecard, setIsSavingScorecard] = useState<boolean>(false);

  // Full Screen / Full View Modal state
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Keep selectedCandidate synced with parent applications list
  useEffect(() => {
    if (selectedCandidate) {
      const live = applications.find((a) => a.id === selectedCandidate.id);
      if (live && (live.notes !== selectedCandidate.notes || live.status !== selectedCandidate.status)) {
        setSelectedCandidate(live);
      }
    } else if (applications.length > 0) {
      setSelectedCandidate(applications[0]);
    }
  }, [applications, selectedCandidate]);

  // Load candidate evaluation scores when selected candidate changes
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

  // Handle ESC key to close full screen view modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

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
    const norm = getNormalizedCandidate(app);
    const matchesStage = activeStage === "ALL" || norm.status === activeStage;
    const matchesSearch =
      norm.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      norm.enrollmentNo.includes(searchQuery) ||
      norm.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      norm.preferredTeam.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleCopyAllAnswers = () => {
    if (!selectedCandidate) return;
    const cData = getNormalizedCandidate(selectedCandidate);
    const textReport = `================================================
WDS RECRUITMENT 2026 - CANDIDATE FULL RELEASE
================================================
FULL NAME:        ${cData.fullName}
ENROLLMENT NO:    ${cData.enrollmentNo}
COLLEGE EMAIL:    ${cData.collegeEmail}
PHONE / WHATSAPP: ${cData.phone}
BRANCH/SECTION:   ${cData.branch} (${cData.section})
YEAR OF STUDY:    ${cData.year}
PREFERRED WING:   ${cData.preferredTeam}
EXPERIENCE LEVEL: ${cData.experienceLevel}
TIME COMMITMENT:  ${cData.timeCommitment}
STATUS:           ${cData.status}
APPLIED DATE:     ${cData.appliedDate}

------------------------------------------------
INTERESTS & FOCUS AREAS
------------------------------------------------
${cData.interests.length > 0 ? cData.interests.join(", ") : "None specified"}

------------------------------------------------
PROFILES & PORTFOLIO LINKS
------------------------------------------------
GitHub:    ${cData.githubUrl || "N/A"}
LinkedIn:  ${cData.linkedinUrl || "N/A"}
Portfolio: ${cData.portfolioUrl || "N/A"}

================================================
FULL QUESTION & ANSWER RESPONSES
================================================

[Q1] Why do you want to join WDS?
${cData.whyWds || "N/A"}

[Q2] First-Year Skill / Learning Goal:
${cData.learningGoal || "N/A"}

[Q3] Real-World Mobile / Performance Bug Scenario Response:
${cData.scenarioResponse || "N/A"}

[Q4] Projects & Work / Portfolio Highlights:
${cData.projectLinks || "N/A"}

================================================
INTERVIEW EVALUATION SCORECARD
================================================
Technical Skills:  ${cData.scorecard.tech}/10
Communication:     ${cData.scorecard.comm}/10
Problem Solving:   ${cData.scorecard.prob}/10
Team Fit/Culture:  ${cData.scorecard.fit}/10
TOTAL SCORE:       ${cData.totalScore}/40
================================================
`;
    navigator.clipboard.writeText(textReport);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const selectedNorm = selectedCandidate ? getNormalizedCandidate(selectedCandidate) : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">
            &gt;_ RECRUITMENT 2026 PIPELINE &amp; EVALUATION
          </h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Manage candidate screening, scorecards, full release Q&amp;A responses, and CSV export.
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
            filtered.map((candidate) => {
              const norm = getNormalizedCandidate(candidate);
              return (
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
                          {norm.id.slice(0, 10)}
                        </span>
                        <span className="font-bold text-sm text-wds-white">
                          {norm.fullName}
                        </span>
                      </div>
                      <div className="text-xs text-wds-muted mt-0.5 flex items-center gap-2">
                        <span>{norm.branch} ({norm.section}) • Roll: {norm.enrollmentNo}</span>
                        {norm.rawNotes && norm.rawNotes.includes("SCORECARD") && (
                          <span className="px-1 border border-wds-green/50 bg-wds-green/10 text-wds-green font-pixel text-[8px] uppercase tracking-wide">
                            EVALUATED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 font-pixel text-[9px] border ${getStatusColor(
                          norm.status
                        )}`}
                      >
                        {norm.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-wds-yellow/20 text-xs text-wds-muted">
                    <div className="flex items-center gap-2">
                      <span className="text-wds-white font-bold">{norm.preferredTeam}</span>
                      <span>•</span>
                      <span>{norm.experienceLevel}</span>
                    </div>
                    <div className="text-[10px] text-wds-muted">
                      Applied: {norm.appliedDate}
                    </div>
                  </div>
                </div>
              );
            })
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
          {selectedCandidate && selectedNorm ? (
            <div className="sticky top-16 space-y-3">
              {/* Option Bar Above Receipt for Full Screen / Full View & Quick Actions */}
              <div className="flex items-center justify-between gap-2 p-3 bg-wds-card border-2 border-wds-yellow shadow-pixel-yellow-sm">
                <div className="flex items-center gap-2 font-pixel text-[10px] text-wds-yellow">
                  <FileText className="w-3.5 h-3.5" />
                  <span>CANDIDATE DOSSIER</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsFullScreen(true);
                    }}
                    className="px-2.5 py-1 bg-wds-yellow text-wds-bg font-pixel text-[9px] font-bold flex items-center gap-1 hover:bg-wds-yellow-bright transition-colors shadow-sm"
                    title="Open Full Release View Modal"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>FULL SCREEN</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyAllAnswers}
                    className="px-2 py-1 bg-wds-bg border border-wds-yellow/40 text-wds-yellow hover:border-wds-yellow font-pixel text-[9px] flex items-center gap-1 transition-colors"
                    title="Copy candidate application release to clipboard"
                  >
                    {copied ? <Check className="w-3 h-3 text-wds-green" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "COPIED" : "COPY"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      window.print();
                    }}
                    className="px-2 py-1 bg-wds-bg border border-wds-yellow/40 text-wds-yellow hover:border-wds-yellow font-pixel text-[9px] flex items-center gap-1 transition-colors"
                    title="Print Application Release"
                  >
                    <Printer className="w-3 h-3" />
                    <span>PRINT</span>
                  </button>
                </div>
              </div>

              {/* Receipt Drawer Card */}
              <div className="p-5 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-wds-yellow/30">
                  <div>
                    <span className="font-pixel text-[9px] text-wds-yellow">
                      {selectedNorm.id.slice(0, 10)}
                    </span>
                    <h3 className="font-pixel text-base text-wds-white">
                      {selectedNorm.fullName}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 font-pixel text-[10px] border ${getStatusColor(
                      selectedNorm.status
                    )}`}
                  >
                    {selectedNorm.status}
                  </span>
                </div>

                {/* Candidate Demographics Data */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-wds-bg border border-wds-yellow/20 space-y-2 font-mono">
                    <div className="text-[10px] font-pixel text-wds-yellow mb-1.5 flex items-center justify-between">
                      <span>&gt;_ CANDIDATE DEMOGRAPHICS</span>
                      <span className="text-[9px] text-wds-muted font-mono">{selectedNorm.year}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-wds-muted">Enrollment No:</span>
                      <span className="font-bold text-wds-white">{selectedNorm.enrollmentNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wds-muted">Branch / Section:</span>
                      <span className="text-wds-white">{selectedNorm.branch} ({selectedNorm.section})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wds-muted">Phone:</span>
                      <span className="text-wds-white font-bold">{selectedNorm.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wds-muted">Email:</span>
                      <a href={`mailto:${selectedNorm.collegeEmail}`} className="text-wds-yellow hover:underline truncate max-w-[200px]">
                        {selectedNorm.collegeEmail}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wds-muted">Applied Date:</span>
                      <span className="text-wds-white">{selectedNorm.appliedDate}</span>
                    </div>

                    <div className="pt-2 border-t border-wds-yellow/10 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-wds-muted">Preferred Wing:</span>
                        <span className="text-wds-yellow font-bold">{selectedNorm.preferredTeam}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-wds-muted">Experience Level:</span>
                        <span className="text-wds-white">{selectedNorm.experienceLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-wds-muted">Time Commitment:</span>
                        <span className="text-wds-white">{selectedNorm.timeCommitment}</span>
                      </div>
                    </div>

                    {selectedNorm.interests && selectedNorm.interests.length > 0 && (
                      <div className="pt-2 border-t border-wds-yellow/10">
                        <span className="text-wds-muted block mb-1">Interests / Focus Areas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedNorm.interests.map((int) => (
                            <span key={int} className="px-1.5 py-0.5 bg-wds-card border border-wds-border-dim text-[9px] text-wds-white font-mono">
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedNorm.githubUrl || selectedNorm.linkedinUrl || selectedNorm.portfolioUrl) && (
                      <div className="pt-2 border-t border-wds-yellow/10 flex flex-wrap gap-2">
                        {selectedNorm.githubUrl && (
                          <a
                            href={selectedNorm.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-wds-yellow hover:underline flex items-center gap-1 text-[10px]"
                          >
                            [GITHUB ↗]
                          </a>
                        )}
                        {selectedNorm.linkedinUrl && (
                          <a
                            href={selectedNorm.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-wds-yellow hover:underline flex items-center gap-1 text-[10px]"
                          >
                            [LINKEDIN ↗]
                          </a>
                        )}
                        {selectedNorm.portfolioUrl && (
                          <a
                            href={selectedNorm.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-wds-yellow hover:underline flex items-center gap-1 text-[10px]"
                          >
                            [PORTFOLIO ↗]
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Question & Answer Responses Section */}
                <div className="p-3 bg-wds-bg border border-wds-yellow/20 space-y-3 font-mono text-xs">
                  <div className="font-pixel text-[10px] text-wds-yellow flex items-center justify-between border-b border-wds-yellow/20 pb-2">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-wds-yellow" />
                      <span>&gt;_ FULL QUESTION &amp; ANSWER RESPONSES</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFullScreen(true)}
                      className="text-[9px] text-wds-yellow hover:underline flex items-center gap-0.5 font-bold"
                    >
                      <span>EXPAND</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Q1: Why WDS */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-wds-muted font-bold block">
                      1. Why do you want to join WDS?
                    </span>
                    <p className="text-wds-white bg-wds-card/70 p-2.5 border border-wds-border-dim text-[11px] leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.whyWds || <span className="text-wds-muted italic">No response provided in application.</span>}
                    </p>
                  </div>

                  {/* Q2: Learning Goal */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-wds-muted font-bold block">
                      2. First-Year Skill / Learning Goal:
                    </span>
                    <p className="text-wds-white bg-wds-card/70 p-2.5 border border-wds-border-dim text-[11px] leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.learningGoal || <span className="text-wds-muted italic">No response provided in application.</span>}
                    </p>
                  </div>

                  {/* Q3: Scenario Response */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-wds-muted font-bold block">
                      3. Real-World Mobile / Bug Scenario Response:
                    </span>
                    <p className="text-wds-white bg-wds-card/70 p-2.5 border border-wds-border-dim text-[11px] leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.scenarioResponse || <span className="text-wds-muted italic">No response provided in application.</span>}
                    </p>
                  </div>

                  {/* Q4: Projects & Work */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-wds-muted font-bold block">
                      4. Projects &amp; Work / Tinkered Items:
                    </span>
                    <p className="text-wds-white bg-wds-card/70 p-2.5 border border-wds-border-dim text-[11px] leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.projectLinks || <span className="text-wds-muted italic">No project links provided in application.</span>}
                    </p>
                  </div>

                  {selectedNorm.cleanNotes && (
                    <div className="space-y-1 pt-1 border-t border-wds-yellow/10">
                      <span className="text-[10px] text-wds-muted font-bold block">
                        5. Additional Notes &amp; Raw Submission:
                      </span>
                      <p className="text-wds-white bg-wds-card/70 p-2 border border-wds-border-dim text-[10px] leading-relaxed whitespace-pre-wrap font-mono">
                        {selectedNorm.cleanNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Interview Evaluation Scorecard */}
                <div className="p-4 bg-wds-bg border-2 border-wds-yellow/40 space-y-3">
                  <div className="font-pixel text-[10px] text-wds-yellow flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-wds-yellow" />
                      <span>&gt;_ INTERVIEW EVALUATION SCORECARD (1-10)</span>
                    </div>
                    {scorecardSubmitted && (
                      <span className="text-wds-green font-pixel text-[9px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SAVED</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-wds-muted">Technical Skills:</label>
                        <span className="font-pixel text-[10px] text-wds-yellow">{techScore}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={techScore}
                        onChange={(e) => {
                          setTechScore(Number(e.target.value));
                          setScorecardSubmitted(false);
                        }}
                        className="w-full accent-wds-yellow cursor-pointer h-1.5 bg-wds-card"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-wds-muted">Communication:</label>
                        <span className="font-pixel text-[10px] text-wds-yellow">{commScore}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={commScore}
                        onChange={(e) => {
                          setCommScore(Number(e.target.value));
                          setScorecardSubmitted(false);
                        }}
                        className="w-full accent-wds-yellow cursor-pointer h-1.5 bg-wds-card"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-wds-muted">Problem Solving:</label>
                        <span className="font-pixel text-[10px] text-wds-yellow">{problemScore}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={problemScore}
                        onChange={(e) => {
                          setProblemScore(Number(e.target.value));
                          setScorecardSubmitted(false);
                        }}
                        className="w-full accent-wds-yellow cursor-pointer h-1.5 bg-wds-card"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-wds-muted">Team Fit / Culture:</label>
                        <span className="font-pixel text-[10px] text-wds-yellow">{fitScore}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={fitScore}
                        onChange={(e) => {
                          setFitScore(Number(e.target.value));
                          setScorecardSubmitted(false);
                        }}
                        className="w-full accent-wds-yellow cursor-pointer h-1.5 bg-wds-card"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
                    <span className="font-pixel text-[9px] text-wds-muted">
                      Total Score: <strong className="text-wds-yellow font-pixel text-xs">{techScore + commScore + problemScore + fitScore} / 40</strong>
                    </span>
                    <button
                      type="button"
                      disabled={isSavingScorecard}
                      onClick={async () => {
                        if (!selectedCandidate) return;
                        sound.playClick();
                        setIsSavingScorecard(true);

                        const existingCleanNotes = (selectedCandidate.notes || "")
                          .replace(/SCORECARD\[.*?\]\s*/g, "")
                          .trim();

                        const serializedScorecard = `SCORECARD[tech:${techScore},comm:${commScore},prob:${problemScore},fit:${fitScore}]`;
                        const updatedNotes = existingCleanNotes
                          ? `${existingCleanNotes}\n\n${serializedScorecard}`
                          : serializedScorecard;

                        try {
                          await onUpdateStatus(selectedCandidate.id, selectedCandidate.status, updatedNotes);
                          setSelectedCandidate({ ...selectedCandidate, notes: updatedNotes });
                          setScorecardSubmitted(true);
                          sound.playSuccess();
                        } catch (err) {
                          console.error("[Save Scorecard Error]:", err);
                          sound.error();
                        } finally {
                          setIsSavingScorecard(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-wds-yellow text-wds-bg font-pixel text-[9px] font-bold hover:bg-wds-yellow-bright transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSavingScorecard ? (
                        <span>SAVING...</span>
                      ) : scorecardSubmitted ? (
                        <>
                          <Check className="w-3 h-3 text-wds-bg" />
                          <span>SAVED ✓</span>
                        </>
                      ) : (
                        <span>SAVE SCORECARD</span>
                      )}
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
                            onUpdateStatus(selectedCandidate.id, st, selectedCandidate.notes);
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
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-wds-yellow/30 bg-wds-card text-xs text-wds-muted sticky top-16">
              Select a candidate from the pipeline to view application details, full Q&amp;A release, and scorecards.
            </div>
          )}
        </div>
      </div>

      {/* FULL SCREEN / FULL VIEW DOSSIER MODAL */}
      {isFullScreen && selectedNorm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center overflow-y-auto animate-fadeIn font-mono">
          <div className="border-2 border-wds-yellow bg-wds-card max-w-4xl w-full max-h-[92vh] flex flex-col shadow-pixel-yellow overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-wds-bg border-b-2 border-wds-yellow flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-wds-yellow/40 bg-wds-yellow/10 text-wds-yellow hidden sm:block">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-pixel text-[10px] text-wds-yellow flex items-center gap-2">
                    <span>WDS RECRUITMENT 2026</span>
                    <span>{"//"}</span>
                    <span>CANDIDATE FULL RELEASE DOSSIER</span>
                  </div>
                  <h2 className="font-pixel text-lg text-wds-white">
                    {selectedNorm.fullName}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAllAnswers}
                  className="px-3 py-1.5 bg-wds-bg border border-wds-yellow/40 hover:border-wds-yellow text-wds-yellow font-pixel text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-wds-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? "COPIED" : "COPY TEXT"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold flex items-center gap-1.5 hover:bg-wds-yellow-bright transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PRINT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="p-1.5 border border-wds-yellow/40 hover:border-wds-red text-wds-muted hover:text-wds-red transition-colors"
                  title="Close Full View (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Dossier Banner Row */}
              <div className="p-4 border-2 border-wds-yellow/40 bg-wds-bg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="text-[10px] text-wds-muted font-pixel">CANDIDATE REF ID</div>
                  <div className="font-pixel text-sm text-wds-yellow">{selectedNorm.id}</div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-wds-muted block text-[10px]">CURRENT STAGE:</span>
                    <span className={`px-2 py-0.5 font-pixel text-[10px] border ${getStatusColor(selectedNorm.status)}`}>
                      {selectedNorm.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-wds-muted block text-[10px]">APPLIED DATE:</span>
                    <span className="text-wds-white font-bold">{selectedNorm.appliedDate}</span>
                  </div>
                  <div>
                    <span className="text-wds-muted block text-[10px]">TOTAL EVALUATION SCORE:</span>
                    <span className="font-pixel text-wds-green">{selectedNorm.totalScore} / 40</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Demographics & College Details */}
              <div className="space-y-3">
                <h3 className="font-pixel text-xs text-wds-yellow border-b border-wds-yellow/30 pb-1.5 flex items-center gap-2">
                  <span>01. CANDIDATE PROFILE &amp; DEMOGRAPHICS</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Full Name</span>
                    <span className="font-bold text-wds-white text-sm">{selectedNorm.fullName}</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Enrollment No / Roll</span>
                    <span className="font-bold text-wds-white">{selectedNorm.enrollmentNo}</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Phone / WhatsApp</span>
                    <span className="font-bold text-wds-yellow">{selectedNorm.phone}</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Email Address</span>
                    <a href={`mailto:${selectedNorm.collegeEmail}`} className="text-wds-yellow hover:underline font-bold truncate block">
                      {selectedNorm.collegeEmail}
                    </a>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Branch &amp; Section</span>
                    <span className="text-wds-white">{selectedNorm.branch} ({selectedNorm.section})</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Year of Study</span>
                    <span className="text-wds-white">{selectedNorm.year}</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Preferred Wing</span>
                    <span className="text-wds-yellow font-bold">{selectedNorm.preferredTeam}</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Experience Level</span>
                    <span className="text-wds-white">{selectedNorm.experienceLevel}</span>
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block">Weekly Commitment</span>
                    <span className="text-wds-white">{selectedNorm.timeCommitment}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Online Profiles & Work Links */}
              <div className="space-y-3">
                <h3 className="font-pixel text-xs text-wds-yellow border-b border-wds-yellow/30 pb-1.5 flex items-center gap-2">
                  <span>02. ONLINE PROFILES &amp; PORTFOLIO LINKS</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block mb-1">GitHub Profile</span>
                    {selectedNorm.githubUrl ? (
                      <a
                        href={selectedNorm.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-wds-yellow hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>{selectedNorm.githubUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-wds-muted italic">Not provided</span>
                    )}
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block mb-1">LinkedIn Profile</span>
                    {selectedNorm.linkedinUrl ? (
                      <a
                        href={selectedNorm.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-wds-yellow hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>{selectedNorm.linkedinUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-wds-muted italic">Not provided</span>
                    )}
                  </div>

                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block mb-1">Portfolio Website</span>
                    {selectedNorm.portfolioUrl ? (
                      <a
                        href={selectedNorm.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-wds-yellow hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>{selectedNorm.portfolioUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-wds-muted italic">Not provided</span>
                    )}
                  </div>
                </div>

                {selectedNorm.interests && selectedNorm.interests.length > 0 && (
                  <div className="p-3 bg-wds-bg border border-wds-yellow/20">
                    <span className="text-[10px] text-wds-muted block mb-1.5">Selected Fields of Interest:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNorm.interests.map((int) => (
                        <span key={int} className="px-2 py-1 bg-wds-yellow/15 border border-wds-yellow/40 text-wds-white text-[10px] font-bold font-mono">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Full Question & Answer Responses */}
              <div className="space-y-4">
                <h3 className="font-pixel text-xs text-wds-yellow border-b border-wds-yellow/30 pb-1.5 flex items-center gap-2">
                  <span>03. FULL APPLICATION FORM RESPONSES</span>
                </h3>

                <div className="space-y-3">
                  {/* Q1 */}
                  <div className="p-4 bg-wds-bg border border-wds-yellow/30 space-y-2">
                    <div className="font-pixel text-[10px] text-wds-yellow">
                      QUESTION 01: WHY DO YOU WANT TO JOIN WDS?
                    </div>
                    <div className="p-3 bg-wds-card border border-wds-border-dim text-xs text-wds-white leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.whyWds || <span className="text-wds-muted italic">No response provided in application.</span>}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="p-4 bg-wds-bg border border-wds-yellow/30 space-y-2">
                    <div className="font-pixel text-[10px] text-wds-yellow">
                      QUESTION 02: WHAT SKILL DO YOU WANT TO MASTER IN YOUR FIRST YEAR?
                    </div>
                    <div className="p-3 bg-wds-card border border-wds-border-dim text-xs text-wds-white leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.learningGoal || <span className="text-wds-muted italic">No response provided in application.</span>}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="p-4 bg-wds-bg border border-wds-yellow/30 space-y-2">
                    <div className="font-pixel text-[10px] text-wds-yellow">
                      QUESTION 03: REAL-WORLD SCENARIO RESPONSE (MOBILE / PERFORMANCE BUG)
                    </div>
                    <div className="text-[10px] text-wds-muted italic">
                      &quot;A website has gone live. Students report that a button doesn&apos;t work on mobile, one page loads slowly and an image is broken. What would you do?&quot;
                    </div>
                    <div className="p-3 bg-wds-card border border-wds-border-dim text-xs text-wds-white leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.scenarioResponse || <span className="text-wds-muted italic">No response provided in application.</span>}
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="p-4 bg-wds-bg border border-wds-yellow/30 space-y-2">
                    <div className="font-pixel text-[10px] text-wds-yellow">
                      QUESTION 04: PROJECTS &amp; WORK / TINKERED ITEMS
                    </div>
                    <div className="p-3 bg-wds-card border border-wds-border-dim text-xs text-wds-white leading-relaxed whitespace-pre-wrap">
                      {selectedNorm.projectLinks || <span className="text-wds-muted italic">No project links provided in application.</span>}
                    </div>
                  </div>

                  {selectedNorm.cleanNotes && (
                    <div className="p-4 bg-wds-bg border border-wds-yellow/30 space-y-2">
                      <div className="font-pixel text-[10px] text-wds-yellow">
                        RAW SUBMISSION LOG &amp; ADDITIONAL NOTES
                      </div>
                      <div className="p-3 bg-wds-card border border-wds-border-dim text-xs text-wds-white leading-relaxed whitespace-pre-wrap font-mono">
                        {selectedNorm.cleanNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Evaluation Scorecard Summary */}
              <div className="space-y-3">
                <h3 className="font-pixel text-xs text-wds-yellow border-b border-wds-yellow/30 pb-1.5 flex items-center gap-2">
                  <span>04. INTERVIEW EVALUATION SCORECARD</span>
                </h3>

                <div className="p-4 bg-wds-bg border-2 border-wds-yellow/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <span className="text-[9px] text-wds-muted block font-pixel">TECHNICAL SKILLS</span>
                    <span className="font-pixel text-lg text-wds-yellow">{selectedNorm.scorecard.tech} / 10</span>
                  </div>

                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <span className="text-[9px] text-wds-muted block font-pixel">COMMUNICATION</span>
                    <span className="font-pixel text-lg text-wds-yellow">{selectedNorm.scorecard.comm} / 10</span>
                  </div>

                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <span className="text-[9px] text-wds-muted block font-pixel">PROBLEM SOLVING</span>
                    <span className="font-pixel text-lg text-wds-yellow">{selectedNorm.scorecard.prob} / 10</span>
                  </div>

                  <div className="p-2 border border-wds-yellow/20 bg-wds-card">
                    <span className="text-[9px] text-wds-muted block font-pixel">CULTURE &amp; TEAM FIT</span>
                    <span className="font-pixel text-lg text-wds-yellow">{selectedNorm.scorecard.fit} / 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-wds-bg border-t-2 border-wds-yellow flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-[10px] text-wds-muted font-pixel">
                PRESS <kbd className="px-1 py-0.5 bg-wds-card border border-wds-yellow/40 text-wds-yellow">ESC</kbd> TO CLOSE RELEASE DOSSIER
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAllAnswers}
                  className="px-3 py-1.5 bg-wds-bg border border-wds-yellow/40 text-wds-yellow hover:border-wds-yellow font-pixel text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-wds-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "COPIED" : "COPY TEXT"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="px-4 py-1.5 bg-wds-yellow text-wds-bg font-pixel text-xs font-bold hover:bg-wds-yellow-bright transition-colors"
                >
                  CLOSE DOSSIER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
