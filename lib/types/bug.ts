export interface BugRecord {
  id: string;
  title: string;
  description?: string;
  url?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priority: "P0" | "P1" | "P2" | "P3";
  status: "OPEN" | "TRIAGED" | "IN_PROGRESS" | "RESOLVED" | "DUPLICATE" | "INVALID";
  project: string;
  projectId?: string;
  assignee?: string;
  reporter: string;
  source?: string;
  reproductionSteps?: string;
  resolutionNotes?: string;
  externalId?: string;
  reportedAt: string;
  resolvedAt?: string;
}
