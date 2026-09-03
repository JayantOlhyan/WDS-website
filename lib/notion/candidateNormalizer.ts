import { CandidateApplication, ApplicationStatus } from "./recruitment";

export interface NormalizedCandidateData {
  id: string;
  fullName: string;
  enrollmentNo: string;
  collegeEmail: string;
  phone: string;
  branch: string;
  section: string;
  year: string;
  preferredTeam: string;
  experienceLevel: string;
  timeCommitment: string;
  status: ApplicationStatus;
  appliedDate: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  interests: string[];
  whyWds: string;
  learningGoal: string;
  scenarioResponse: string;
  projectLinks: string;
  cleanNotes: string;
  rawNotes: string;
  rawExperience?: string;
  rawTime?: string;
  rawWing?: string;
  scorecard: { tech: number; comm: number; prob: number; fit: number };
  totalScore: number;
}

export const parseScorecard = (notesStr?: string) => {
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

export function getNormalizedCandidate(candidate: CandidateApplication): NormalizedCandidateData {
  const phone = candidate.phone || (candidate as any).phoneNumber || (candidate as any).whatsapp || "N/A";
  const enrollmentNo =
    candidate.enrollmentNo ||
    candidate.rollNumber ||
    (candidate as any).rollNo ||
    (candidate as any).roll ||
    (phone !== "N/A" ? phone : "N/A");
  const collegeEmail =
    candidate.collegeEmail || (candidate as any).email || (candidate as any).emailAddress || "N/A";
  let preferredTeam =
    candidate.preferredTeam || (candidate as any).preferredWing || (candidate as any).wing || "Technical Wing";
  const year =
    candidate.year || (candidate as any).yearOfStudy || "1st Year";
  const githubUrl = candidate.githubUrl || (candidate as any).github || "";
  const linkedinUrl = candidate.linkedinUrl || (candidate as any).linkedin || "";
  const portfolioUrl = candidate.portfolioUrl || (candidate as any).portfolio || (candidate as any).website || "";

  let experienceLevel = candidate.experienceLevel || "Beginner";
  let timeCommitment = candidate.timeCommitment || "4-8 hrs";
  let whyWds = candidate.whyWds || "";
  let learningGoal = candidate.learningGoal || "";
  let scenarioResponse = candidate.scenarioResponse || "";
  let projectLinks = candidate.projectLinks || "";
  let interests: string[] = candidate.interests ? [...candidate.interests] : [];

  const rawNotes = candidate.notes || "";
  let rawExperience: string | undefined;
  let rawTime: string | undefined;
  let rawWing: string | undefined;

  // Extract Q&A blocks and raw metadata if serialized into notes string
  if (rawNotes) {
    // 1. Raw Selections Tag: [Raw Selections - Exp: ..., Time: ..., Wing: ...]
    const rawSelMatch = rawNotes.match(/\[Raw Selections - Exp:\s*(.*?), Time:\s*(.*?), Wing:\s*(.*?)\]/i);
    if (rawSelMatch) {
      rawExperience = rawSelMatch[1].trim();
      rawTime = rawSelMatch[2].trim();
      rawWing = rawSelMatch[3].trim();
      if (rawWing && preferredTeam === "Technical Wing") {
        preferredTeam = rawWing;
      }
      if (rawExperience && experienceLevel === "Beginner") {
        experienceLevel = rawExperience;
      }
      if (rawTime && timeCommitment === "4-8 hrs") {
        timeCommitment = rawTime;
      }
    }

    // 2. Why WDS
    if (!whyWds) {
      const match =
        rawNotes.match(/Why\s*WDS\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Learning Goal|Scenario Response|Projects & Work|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/Why do you want to join WDS\??\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Learning Goal|Scenario Response|Projects & Work|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/\[Q1\]\s*[^:\n]*:\s*\n?([\s\S]*?)(?=\n\s*\[Q\d\]|\n\s*SCORECARD|$)/i);
      if (match && match[1].trim()) whyWds = match[1].trim();
    }

    // 3. Learning Goal
    if (!learningGoal) {
      const match =
        rawNotes.match(/Learning\s*Goal\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Scenario Response|Projects & Work|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/First-?Year\s*Skill\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Scenario Response|Projects & Work|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/\[Q2\]\s*[^:\n]*:\s*\n?([\s\S]*?)(?=\n\s*\[Q\d\]|\n\s*SCORECARD|$)/i);
      if (match && match[1].trim()) learningGoal = match[1].trim();
    }

    // 4. Scenario Response
    if (!scenarioResponse) {
      const match =
        rawNotes.match(/Scenario\s*Response\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Learning Goal|Projects & Work|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/Real-World\s*Scenario\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Learning Goal|Projects & Work|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/\[Q3\]\s*[^:\n]*:\s*\n?([\s\S]*?)(?=\n\s*\[Q\d\]|\n\s*SCORECARD|$)/i);
      if (match && match[1].trim()) scenarioResponse = match[1].trim();
    }

    // 5. Projects & Work
    if (!projectLinks) {
      const match =
        rawNotes.match(/Projects\s*&\s*Work\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Learning Goal|Scenario Response|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/Portfolio\s*Highlights\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Learning Goal|Scenario Response|Interests|\[Raw Selections|SCORECARD)|$)/i) ||
        rawNotes.match(/\[Q4\]\s*[^:\n]*:\s*\n?([\s\S]*?)(?=\n\s*\[Q\d\]|\n\s*SCORECARD|$)/i);
      if (match && match[1].trim()) projectLinks = match[1].trim();
    }

    // 6. Interests
    if (interests.length === 0) {
      const match = rawNotes.match(/Interests\s*:\s*\n?([\s\S]*?)(?=\n\s*(?:Why WDS|Learning Goal|Scenario Response|Projects & Work|\[Raw Selections|SCORECARD)|$)/i);
      if (match && match[1].trim()) {
        interests = match[1]
          .split(/,|\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  }

  const scorecard = parseScorecard(rawNotes);
  const totalScore = scorecard.tech + scorecard.comm + scorecard.prob + scorecard.fit;

  // Clean unparsed residual notes
  let cleanNotes = rawNotes
    .replace(/SCORECARD\[.*?\]\s*/g, "")
    .replace(/\[Raw Selections - Exp:[^\]]*\]\s*/gi, "")
    .replace(/Interests:\s*\n[\s\S]*?(?=\n\n|\n[A-Z][a-z\s]+:|$)/gi, "")
    .replace(/Projects & Work:\s*\n[\s\S]*?(?=\n\n|\n[A-Z][a-z\s]+:|$)/gi, "")
    .replace(/Why WDS:\s*\n[\s\S]*?(?=\n\n|\n[A-Z][a-z\s]+:|$)/gi, "")
    .replace(/Learning Goal:\s*\n[\s\S]*?(?=\n\n|\n[A-Z][a-z\s]+:|$)/gi, "")
    .replace(/Scenario Response:\s*\n[\s\S]*?(?=\n\n|\n[A-Z][a-z\s]+:|$)/gi, "")
    .trim();

  return {
    id: candidate.id,
    fullName: candidate.fullName || "Unnamed Candidate",
    enrollmentNo,
    collegeEmail,
    phone,
    branch: candidate.branch || "N/A",
    section: candidate.section || "N/A",
    year,
    preferredTeam,
    experienceLevel,
    timeCommitment,
    status: candidate.status || "RECEIVED",
    appliedDate: candidate.appliedDate || "N/A",
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    interests,
    whyWds,
    learningGoal,
    scenarioResponse,
    projectLinks,
    cleanNotes,
    rawNotes,
    rawExperience,
    rawTime,
    rawWing,
    scorecard,
    totalScore,
  };
}
