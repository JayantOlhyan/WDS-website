export interface InterviewRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  interviewer: string;
  round: "ROUND_1_TECHNICAL" | "ROUND_2_HR_CULTURE" | "ROUND_3_FINAL";
  date: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  teamFitScore: number;
  overallScore: number;
  strengths: string;
  weaknesses: string;
  questionsAsked?: string;
  recommendation: "STRONG_HIRE" | "HIRE" | "LEAN_HIRE" | "LEAN_REJECT" | "REJECT";
  decisionStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "WAITLISTED";
  notes?: string;
  createdAt?: string;
}
