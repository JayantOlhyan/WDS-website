export interface ResourceRecord {
  id: string;
  name: string;
  type: "DOCUMENTATION" | "API_KEY" | "DESIGN_SYSTEM" | "INFRASTRUCTURE" | "EXTERNAL_TOOL" | "GUIDELINE";
  url: string;
  project?: string;
  projectId?: string;
  description?: string;
  owner: string;
  createdAt?: string;
}
