"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelSelect } from "@/components/ui/PixelSelect";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { sound } from "@/lib/soundEffects";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Send,
} from "lucide-react";

interface FormData {
  fullName: string;
  enrollmentNo: string;
  phone: string;
  year: string;
  branch: string;
  section: string;
  collegeEmail: string;
  interests: string[];
  experienceLevel: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  projectLinks: string;
  whyWds: string;
  learningGoal: string;
  scenarioResponse: string;
  timeCommitment: string;
  preferredTeam: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  enrollmentNo: "",
  phone: "",
  year: "1st Year",
  branch: "Computer Science & Engineering (CSE)",
  section: "CSE-1",
  collegeEmail: "",
  interests: ["Frontend", "UI/UX"],
  experienceLevel: "Complete Beginner",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  projectLinks: "",
  whyWds: "",
  learningGoal: "",
  scenarioResponse: "",
  timeCommitment: "2–4 hours / week",
  preferredTeam: "Frontend Wing",
};

export default function RecruitmentApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const interestOptions = [
    "Frontend Development",
    "Backend Development",
    "UI/UX & Graphic Design",
    "Quality Assurance (QA)",
    "Content Management & Editorial",
    "PR, Social Media & Marketing", 
    "Mobile Applications",
    "DevOps & Infrastructure",
    "AI & Automation",
  ];

  const toggleInterest = (interest: string) => {
    sound.playClick();
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg("Please enter your Full Name.");
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMsg("Please enter your Phone / WhatsApp number.");
        return false;
      }
      if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
        setErrorMsg("Phone / WhatsApp number must be exactly 10 digits.");
        return false;
      }
      if (!formData.year.trim()) {
        setErrorMsg("Please select your Year of Study.");
        return false;
      }
      if (!formData.branch.trim()) {
        setErrorMsg("Please select your Branch.");
        return false;
      }
      if (!formData.section.trim()) {
        setErrorMsg("Please enter your Section / Shift.");
        return false;
      }
      if (!formData.collegeEmail.trim() || !formData.collegeEmail.includes("@")) {
        setErrorMsg("Please enter a valid Email address.");
        return false;
      }
    } else if (step === 2) {
      if (formData.interests.length === 0) {
        setErrorMsg("Please select at least one interest.");
        return false;
      }
    }
    return true;
  };

  const handleNext = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      sound.playClick();
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    sound.playClick();
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNext(e);
      return;
    }

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        ...formData,
        enrollmentNo: formData.enrollmentNo || formData.phone.replace(/[^0-9]/g, "") || formData.phone,
      };

      const response = await fetch("/api/recruitment/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to submit application");
      }

      sound.playSuccess();

      // Trigger victory confetti on client-side
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFD600", "#F5F0DF", "#00FF66"],
        });
      } catch {
        // Fallback gracefully
      }

      setSubmitted(true);
      setRecordId(resData.recordId || "WDS-2026-" + Math.floor(1000 + Math.random() * 9000));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting form. Please retry.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-16 px-4 max-w-3xl mx-auto w-full font-mono">
        <TerminalWindow title="APPLICATION_SUBMITTED.LOG" theme="yellow-header">
          <div className="text-center py-8 space-y-6">
            <div className="inline-flex p-4 border-2 border-wds-green bg-wds-green/10 text-wds-green">
              <CheckCircle2 className="w-16 h-16" />
            </div>

            <div className="space-y-2">
              <span className="font-pixel text-[11px] text-wds-yellow">&gt;_ STATUS: APPLICATION SUBMITTED</span>
              <h1 className="font-pixel text-2xl sm:text-3xl text-wds-white">
                APPLICATION RECEIVED!
              </h1>
              <p className="text-sm text-wds-muted max-w-md mx-auto leading-relaxed">
                Thank you for applying to the Web Development Society MSIT. Your application has been logged directly into our system.
              </p>
            </div>

            {/* Application ID Card */}
            <div className="p-4 border border-wds-yellow/40 bg-wds-bg max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between text-wds-muted">
                <span>APPLICANT:</span>
                <span className="text-wds-white font-bold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between text-wds-muted">
                <span>ENROLLMENT:</span>
                <span className="text-wds-white font-bold">{formData.enrollmentNo}</span>
              </div>
              <div className="flex justify-between text-wds-muted">
                <span>PREFERRED WING:</span>
                <span className="text-wds-yellow font-bold">{formData.preferredTeam}</span>
              </div>
              <div className="flex justify-between text-wds-muted pt-2 border-t border-wds-yellow/20">
                <span>APPLICATION REF ID:</span>
                <span className="font-pixel text-wds-green">{recordId}</span>
              </div>
            </div>

            <p className="text-xs text-wds-muted max-w-lg mx-auto">
              Our review committee will examine your responses. Shortlisted applicants will receive next steps and interview slots via their registered email address.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <PixelButton href="/" variant="primary" size="md">
                RETURN HOME →
              </PixelButton>
              <PixelButton href="/terminal" variant="outline" size="md">
                LAUNCH TERMINAL &gt;_
              </PixelButton>
            </div>
          </div>
        </TerminalWindow>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto w-full font-mono bg-grid-lines">
      {/* Header Banner */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-wds-yellow bg-wds-yellow/10 text-wds-yellow font-pixel text-xs">
          <Terminal className="w-3.5 h-3.5" />
          <span>WDS RECRUITMENT 2026 APPLICATION</span>
        </div>
        <h1 className="font-pixel text-2xl sm:text-3xl text-wds-white">
          JOIN THE SOCIETY
        </h1>
        <p className="text-xs sm:text-sm text-wds-muted max-w-xl mx-auto">
          It's for joining the society, it's for the interviews.
        </p>
      </div>

      {/* Progress HUD Bar */}
      <div className="mb-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow overflow-hidden relative">
        {/* Top Header HUD Row */}
        <div className="p-3 bg-wds-bg/90 border-b border-wds-yellow/30 flex items-center justify-between gap-3 font-pixel text-xs">
          <div className="flex items-center gap-2 text-wds-yellow">
            <span className="animate-pulse">&gt;_</span>
            <span className="text-wds-muted hidden sm:inline-block text-[11px]">APPLICATION STAGE:</span>
            <span className="px-2.5 py-0.5 bg-wds-yellow text-wds-bg font-bold whitespace-nowrap">
              0{currentStep} / 05
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-wds-muted font-mono tracking-widest hidden xs:inline-block">
              PROGRESS: <span className="text-wds-yellow font-bold">{currentStep * 20}%</span>
            </span>
            <div className="w-24 sm:w-36 h-2.5 bg-wds-bg border border-wds-yellow p-0.5 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-full flex-1 transition-all duration-300 ${
                    s <= currentStep ? "bg-wds-yellow" : "bg-wds-yellow/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stepper Tabs Grid */}
        <div className="grid grid-cols-5 divide-x divide-wds-yellow/20 text-center font-pixel text-[10px] sm:text-xs">
          {[
            { num: 1, label: "01 INFO" },
            { num: 2, label: "02 INTERESTS" },
            { num: 3, label: "03 EXPERIENCE" },
            { num: 4, label: "04 MINDSET" },
            { num: 5, label: "05 CONFIRM" },
          ].map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <div
                key={st.num}
                className={`py-2.5 px-1 transition-all flex items-center justify-center gap-1.5 select-none ${
                  isActive
                    ? "bg-wds-yellow/20 text-wds-yellow font-bold border-b-2 border-wds-yellow"
                    : isCompleted
                    ? "bg-wds-bg text-wds-white hover:text-wds-yellow cursor-pointer"
                    : "bg-wds-card/40 text-wds-muted/50"
                }`}
                onClick={() => {
                  if (st.num < currentStep) {
                    sound.playClick();
                    setErrorMsg(null);
                    setCurrentStep(st.num);
                  } else if (st.num > currentStep) {
                    if (validateStep(currentStep)) {
                      sound.playClick();
                      setCurrentStep(st.num);
                    }
                  }
                }}
              >
                <span className="truncate">{st.label}</span>
                {isCompleted && <span className="text-wds-green text-[10px] hidden sm:inline">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-3 border-2 border-wds-red bg-wds-red/10 text-wds-red text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Multi-Step Form Card */}
      <TerminalWindow
        title={`WDS_APPLICATION_STAGE_0${currentStep}.EXE`}
        theme="yellow-header"
        statusText={`STAGE 0${currentStep}/05`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 01: ABOUT YOU */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-wds-yellow/30 pb-3">
                <h2 className="font-pixel text-base text-wds-yellow">&gt;_ STEP 01: ABOUT YOU</h2>
                <p className="text-xs text-wds-muted">Personal &amp; College Contact Information.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    Full Name <span className="text-wds-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5 flex items-center justify-between">
                    <span>Phone / WhatsApp Number <span className="text-wds-yellow">*</span></span>
                    <span className="text-[10px] font-normal text-wds-muted">({formData.phone.length}/10 digits)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                      setFormData({ ...formData, phone: digitsOnly, enrollmentNo: digitsOnly });
                    }}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow font-mono"
                  />
                </div>

                <PixelSelect
                  label="Year of Study"
                  required
                  value={formData.year}
                  onChange={(val) => setFormData({ ...formData, year: val })}
                  options={[
                    { value: "1st Year", label: "1st Year (First Year)" },
                    { value: "2nd Year", label: "2nd Year (Second Year)" },
                    { value: "3rd Year", label: "3rd Year (Third Year)" },
                    { value: "4th Year", label: "4th Year (Fourth Year)" },
                  ]}
                />

                <PixelSelect
                  label="Branch"
                  required
                  value={formData.branch}
                  onChange={(val) => setFormData({ ...formData, branch: val })}
                  options={[
                    "Computer Science & Engineering (CSE)",
                    "Information Technology (IT)",
                    "Electronics & Communication Engineering (ECE)",
                    "Electrical & Electronics Engineering (EEE)",
                  ]}
                />

                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    Section / Shift <span className="text-wds-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g. Shift 1 / CSE-1 or IT-2"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wds-white mb-1.5">
                    College or Personal Email <span className="text-wds-yellow">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.collegeEmail}
                    onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
                    placeholder="e.g. priyanshu@msit.in or gmail.com"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 02: YOUR INTERESTS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="border-b border-wds-yellow/30 pb-3">
                <h2 className="font-pixel text-base text-wds-yellow">&gt;_ STEP 02: YOUR INTERESTS</h2>
                <p className="text-xs text-wds-muted">Select all fields you are curious to learn, build or contribute to.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => {
                  const isChecked = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 border text-left flex items-center justify-between text-xs transition-colors ${isChecked
                          ? "border-wds-yellow bg-wds-yellow/15 text-wds-white font-bold"
                          : "border-wds-border-dim bg-wds-bg text-wds-muted hover:border-wds-yellow"
                        }`}
                    >
                      <span>{interest}</span>
                      <span
                        className={`w-4 h-4 border flex items-center justify-center text-[10px] ${isChecked ? "border-wds-yellow bg-wds-yellow text-wds-bg" : "border-wds-border-dim"
                          }`}
                      >
                        {isChecked ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 03: YOUR EXPERIENCE & LINKS */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="border-b border-wds-yellow/30 pb-3">
                <h2 className="font-pixel text-base text-wds-yellow">&gt;_ STEP 03: YOUR EXPERIENCE</h2>
                <p className="text-xs text-wds-muted">
                  Share your current background. Portfolio links are completely optional!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-wds-white mb-2">
                  Current Technical / Design Experience Level:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { title: "Complete Beginner", desc: "No prior experience. Highly curious to learn." },
                    { title: "Basic Knowledge", desc: "Know basic HTML/CSS/JS or Python fundamentals." },
                    { title: "Some Projects", desc: "Have built personal projects / websites." },
                    { title: "Comfortable", desc: "Shipped applications, use Git & frameworks." },
                    { title: "Real-world Experience", desc: "Built production systems or contributed to Open Source." },
                  ].map((lvl) => (
                    <button
                      key={lvl.title}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setFormData({ ...formData, experienceLevel: lvl.title });
                      }}
                      className={`p-3 border text-left text-xs transition-colors ${formData.experienceLevel === lvl.title
                          ? "border-wds-yellow bg-wds-yellow/15 font-bold"
                          : "border-wds-border-dim bg-wds-bg text-wds-muted hover:border-wds-yellow"
                        }`}
                    >
                      <div className="text-wds-yellow font-bold">{lvl.title}</div>
                      <div className="text-[11px] text-wds-muted mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-wds-white mb-1">GitHub Profile (Optional)</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/your-handle"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs text-wds-white mb-1">LinkedIn Profile (Optional)</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-wds-white mb-1">
                  Portfolio / Project URLs or Things You&apos;ve Made (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.projectLinks}
                  onChange={(e) => setFormData({ ...formData, projectLinks: e.target.value })}
                  placeholder="Paste URLs to live websites, Figma files, GitHub repos, or describe things you've tinkered with..."
                  className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 04: YOUR MINDSET & SCENARIO */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-wds-yellow/30 pb-3">
                <h2 className="font-pixel text-base text-wds-yellow">&gt;_ STEP 04: YOUR MINDSET</h2>
                <p className="text-xs text-wds-muted">We care about your curiosity and approach to problem-solving.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-wds-white mb-1.5">
                  1. Why do you want to join WDS? <span className="text-wds-muted font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.whyWds}
                  onChange={(e) => setFormData({ ...formData, whyWds: e.target.value })}
                  placeholder="What excites you about building and maintaining real platforms with WDS?"
                  className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-wds-white mb-1.5">
                  2. What is one skill you want to become genuinely good at during your first year? <span className="text-wds-muted font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.learningGoal}
                  onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                  placeholder="e.g. Next.js architecture, UI micro-animations, bug hunting, API scaling..."
                  className="w-full p-2.5 bg-wds-bg border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow"
                />
              </div>

              <div className="p-3 border border-wds-yellow/30 bg-wds-bg space-y-2">
                <div className="font-pixel text-[10px] text-wds-yellow flex items-center justify-between">
                  <span>&gt; REAL-WORLD SCENARIO</span>
                  <span className="text-wds-muted font-mono font-normal text-[10px]">(OPTIONAL)</span>
                </div>
                <p className="text-xs text-wds-muted leading-relaxed">
                  &quot;A website has gone live. Students report that a button doesn&apos;t work on mobile, one page loads slowly and an image is broken. What would you do?&quot;
                </p>
                <textarea
                  rows={3}
                  value={formData.scenarioResponse}
                  onChange={(e) => setFormData({ ...formData, scenarioResponse: e.target.value })}
                  placeholder="Walk us through how you would investigate and tackle this..."
                  className="w-full p-2.5 bg-wds-card border border-wds-yellow/40 text-wds-white text-xs outline-none focus:border-wds-yellow resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 05: COMMITMENT & SUBMISSION */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-wds-yellow/30 pb-3">
                <h2 className="font-pixel text-base text-wds-yellow">&gt;_ STEP 05: COMMITMENT &amp; REVIEW</h2>
                <p className="text-xs text-wds-muted">Confirm your availability and submit your application.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PixelSelect
                  label="Realistic Weekly Time Contribution:"
                  value={formData.timeCommitment}
                  onChange={(val) => setFormData({ ...formData, timeCommitment: val })}
                  options={[
                    "1–2 hours / week",
                    "2–4 hours / week",
                    "4–6 hours / week",
                    "6+ hours / week",
                  ]}
                />

                <PixelSelect
                  label="Preferred Team / Wing:"
                  value={formData.preferredTeam}
                  onChange={(val) => setFormData({ ...formData, preferredTeam: val })}
                  options={[
                    "Frontend Wing",
                    "Backend Wing",
                    "UI/UX Wing",
                    "Quality Assurance Wing",
                    "Content Management Wing",
                    "PR & Social Media Wing",
                  ]}
                />
              </div>

              <div className="p-4 border border-wds-yellow/40 bg-wds-bg text-xs space-y-2">
                <div className="font-pixel text-[10px] text-wds-yellow mb-2">&gt; APPLICATION SUMMARY</div>
                <div className="grid grid-cols-2 gap-2 text-wds-muted">
                  <div>Name: <span className="text-wds-white font-bold">{formData.fullName}</span></div>
                  <div>Phone/WhatsApp: <span className="text-wds-white font-bold">{formData.phone}</span></div>
                  <div>Year: <span className="text-wds-white font-bold">{formData.year}</span></div>
                  <div>Branch: <span className="text-wds-white font-bold">{formData.branch}</span></div>
                  <div>Section/Shift: <span className="text-wds-white font-bold">{formData.section}</span></div>
                  <div>Email: <span className="text-wds-white font-bold">{formData.collegeEmail}</span></div>
                </div>
                <div className="pt-2 border-t border-wds-border-dim text-wds-muted">
                  Interests: <span className="text-wds-yellow">{formData.interests.join(", ")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-6 border-t border-wds-yellow/30 flex items-center justify-between">
            {currentStep > 1 ? (
              <PixelButton
                type="button"
                onClick={handleBack}
                variant="ghost"
                size="md"
              >
                ← BACK
              </PixelButton>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <PixelButton
                type="button"
                onClick={handleNext}
                variant="primary"
                size="md"
              >
                NEXT STEP →
              </PixelButton>
            ) : (
              <PixelButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="bg-wds-yellow text-wds-bg"
              >
                {isSubmitting ? "TRANSMITTING TO NOTION..." : "SUBMIT APPLICATION →"}
              </PixelButton>
            )}
          </div>
        </form>
      </TerminalWindow>
    </div>
  );
}
