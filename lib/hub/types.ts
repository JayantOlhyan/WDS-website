import { LucideIcon } from "lucide-react";

export type HubTab =
  | "dashboard"
  | "tasks"
  | "bugs"
  | "assets"
  | "websites"
  | "content"
  | "events"
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
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
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
  category: "LOGOS" | "IMAGES" | "POSTERS" | "DOCUMENTS" | "BRAND";
  size: string;
  format: string;
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
