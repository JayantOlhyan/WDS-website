export interface ProjectRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "ACTIVE" | "MAINTENANCE" | "COMPLETED" | "PLANNING";
  type?: string;
  lead: string;
  wing: string;
  websiteUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  deploymentPlatform?: string;
  tasksCount?: number;
  bugsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
