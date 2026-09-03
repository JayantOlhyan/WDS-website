import { describe, it, expect } from "vitest";
import { getNormalizedCandidate } from "../lib/notion/candidateNormalizer";
import { CandidateApplication } from "../lib/notion/recruitment";

describe("Candidate Evaluation & Q&A Preservation Test Suite", () => {
  it("extracts all questions, answers, and additional details from candidate application notes", () => {
    const candidate: CandidateApplication = {
      id: "3cfd8b74-4b52-4752-965a-8b89cf00ce22",
      fullName: "Vaibhav Bhandari",
      enrollmentNo: "0123456789",
      collegeEmail: "vaibhav@msit.in",
      phone: "9911174227",
      branch: "Computer Science & Engineering (CSE)",
      section: "CSE-4",
      year: "1st Year",
      preferredTeam: "Technical Wing",
      experienceLevel: "Beginner",
      timeCommitment: "4-8 hrs",
      status: "RECEIVED",
      appliedDate: "9/2/2026",
      notes: `Interests:\nFrontend Development, UI/UX & Graphic Design\n\nProjects & Work:\nhttps://github.com/vaibhav/portfolio - Built a responsive portfolio in Next.js\n\nWhy WDS:\nI want to collaborate with seniors, learn full-stack web engineering, and contribute to official college web projects.\n\nLearning Goal:\nMaster Next.js 14, Tailwind CSS, and server-side state architecture.\n\nScenario Response:\nI would inspect the mobile browser console for viewport errors, optimize large uncompressed image assets with WebP, and verify CSS flexbox breakpoints.\n\n[Raw Selections - Exp: Complete Beginner, Time: 4–8 hours / week, Wing: Frontend Wing]`,
    };

    const norm = getNormalizedCandidate(candidate);

    expect(norm.fullName).toBe("Vaibhav Bhandari");
    expect(norm.enrollmentNo).toBe("0123456789");
    expect(norm.collegeEmail).toBe("vaibhav@msit.in");
    expect(norm.phone).toBe("9911174227");
    expect(norm.preferredTeam).toBe("Frontend Wing");
    expect(norm.experienceLevel).toBe("Complete Beginner");
    expect(norm.interests).toContain("Frontend Development");
    expect(norm.interests).toContain("UI/UX & Graphic Design");
    expect(norm.whyWds).toContain("collaborate with seniors");
    expect(norm.learningGoal).toContain("Master Next.js 14");
    expect(norm.scenarioResponse).toContain("inspect the mobile browser console");
    expect(norm.projectLinks).toContain("github.com/vaibhav/portfolio");
  });

  it("preserves candidate Q&A notes when appending scorecard evaluation", () => {
    const originalNotes = `Interests:\nFrontend Development\n\nWhy WDS:\nExcited about web tech!\n\nLearning Goal:\nReact & TypeScript`;
    const serializedScorecard = `SCORECARD[tech:8,comm:9,prob:7,fit:9]`;
    const combinedNotes = `${originalNotes}\n\n${serializedScorecard}`;

    const candidate: CandidateApplication = {
      id: "test-cand-score",
      fullName: "Priyanshu Sharma",
      enrollmentNo: "9876543210",
      collegeEmail: "priyanshu@msit.in",
      phone: "9876543210",
      branch: "IT",
      section: "IT-1",
      preferredTeam: "Frontend Wing",
      experienceLevel: "Beginner",
      timeCommitment: "4-8 hrs",
      status: "INTERVIEW",
      appliedDate: "9/2/2026",
      notes: combinedNotes,
    };

    const norm = getNormalizedCandidate(candidate);

    expect(norm.whyWds).toBe("Excited about web tech!");
    expect(norm.learningGoal).toBe("React & TypeScript");
    expect(norm.scorecard.tech).toBe(8);
    expect(norm.scorecard.comm).toBe(9);
    expect(norm.scorecard.prob).toBe(7);
    expect(norm.scorecard.fit).toBe(9);
    expect(norm.totalScore).toBe(33);
  });

  it("handles fallback to phone number when enrollment number is omitted", () => {
    const candidate: any = {
      id: "test-fallback",
      fullName: "Test User",
      phone: "9911174227",
      branch: "CSE",
      section: "CSE-4",
      status: "RECEIVED",
      appliedDate: "9/2/2026",
    };

    const norm = getNormalizedCandidate(candidate);
    expect(norm.enrollmentNo).toBe("9911174227");
  });
});
