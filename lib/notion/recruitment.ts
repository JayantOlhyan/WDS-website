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
  branch: string;
  section: string;
  collegeEmail: string;
  phone: string;
  interests: string[];
  experienceLevel: string;
  preferredTeam: string;
  timeCommitment: string;
  status: ApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  interviewer?: string;
  notes?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}
