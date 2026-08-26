import { LucideIcon } from "lucide-react";

export type HubTab =
  | "dashboard"
  | "tasks"
  | "bugs"
  | "recruitment"
  | "content"
  | "events"
  | "assets"
  | "websites"
  | "faculty"
  | "resources"
  | "settings"
  | "trash";

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignee: string;
}

export interface BugItem {
  id: string;
  title: string;
  page: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  reporter: string;
  date: string;
}

export interface AssetItem {
  id: string;
  name: string;
  category: "LOGOS" | "POSTERS" | "BRAND" | "DOCUMENTS";
  size: string;
  format: "PNG" | "PDF" | "MD" | "SVG";
  updated: string;
}

export interface NavItemConfig {
  id: HubTab;
  label: string;
  icon: LucideIcon;
  count?: string;
  alert?: boolean;
}

export interface NavGroupConfig {
  group: string;
  items: NavItemConfig[];
}
