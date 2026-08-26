export interface CandidateRecord {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  phone: string;
  branch: string;
  section: string;
  year?: string;
  preferredWing: string;
  experienceLevel: string;
  timeCommitment: string;
  status: "RECEIVED" | "SCREENING" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED";
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  projectLinks?: string;
  whyWds?: string;
  learningGoal?: string;
  scenarioResponse?: string;
  notes?: string;
  interviewsCount?: number;
  appliedDate?: string;
  createdAt?: string;
}
