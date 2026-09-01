export type ApplicationStatus =
  | "RECEIVED"
  | "SCREENING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export interface CandidateApplication {
  id: string;
  fullName: string;
  enrollmentNo: string;
  rollNumber?: string;
  branch: string;
  section: string;
  collegeEmail: string;
  email?: string;
  phone: string;
  interests: string[];
  experienceLevel: string;
  preferredTeam: string;
  preferredWing?: string;
  timeCommitment: string;
  status: ApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  interviewer?: string;
  notes?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  year?: string;
  projectLinks?: string;
  whyWds?: string;
  learningGoal?: string;
  scenarioResponse?: string;
}
