export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  comment: string;
  type: "NOTE" | "BLOCKER" | "HANDOVER" | "TECHNICAL" | "GENERAL";
  createdAt: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "COMPLETED" | "CANCELLED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  project: string; // Project Name or linked ID
  projectId?: string;
  assignee: string;
  dueDate?: string;
  tags?: string[];
  blockedBy?: string;
  relatedBugId?: string;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
