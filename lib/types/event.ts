export interface EventRecord {
  id: string;
  name: string;
  title: string;
  description: string;
  status: "IDEA" | "PLANNING" | "ANNOUNCED" | "REGISTRATION" | "LIVE" | "COMPLETED" | "ARCHIVED";
  stage: "IDEA" | "PLANNING" | "ANNOUNCED" | "REGISTRATION" | "LIVE" | "COMPLETED" | "ARCHIVED";
  date: string;
  venue: string;
  project?: string;
  projectId?: string;
  registrationUrl?: string;
  lead: string;
  expectedAttendance?: number;
  createdAt?: string;
}
