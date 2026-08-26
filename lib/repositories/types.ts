import { TaskItem, BugItem } from "@/lib/hub/types";
import { CandidateApplication, ApplicationStatus } from "@/lib/notion/recruitment";

export interface RepositoryQueryResult<T> {
  success: boolean;
  data: T;
  isOffline?: boolean;
  error?: string;
}

export interface ITaskRepository {
  getTasks(): Promise<RepositoryQueryResult<TaskItem[]>>;
  createTask(task: TaskItem): Promise<RepositoryQueryResult<TaskItem>>;
  updateTask(id: string, updates: Partial<TaskItem>): Promise<RepositoryQueryResult<TaskItem>>;
}

export interface IBugRepository {
  getBugs(): Promise<RepositoryQueryResult<BugItem[]>>;
  createBug(bug: BugItem): Promise<RepositoryQueryResult<BugItem>>;
  updateBug(id: string, updates: Partial<BugItem>): Promise<RepositoryQueryResult<BugItem>>;
}

export interface IRecruitmentRepository {
  getApplications(): Promise<RepositoryQueryResult<CandidateApplication[]>>;
  updateApplicationStatus(
    id: string,
    newStatus: ApplicationStatus,
    notes?: string,
    interviewer?: string
  ): Promise<RepositoryQueryResult<CandidateApplication>>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
}

export interface IAuditRepository {
  logEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void>;
  getRecentLogs(limit?: number): Promise<AuditLogEntry[]>;
}
