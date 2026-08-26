import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bug,
  Users,
  FileText,
  Calendar,
  FolderArchive,
  Link2,
  UserCheck,
  History,
  BookOpen,
  Settings,
} from "lucide-react";
import { NavGroupConfig, AssetItem } from "./types";

export const HUB_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: "CORE OPERATIONS",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "tasks", label: "Task Board", icon: CheckSquare },
      { id: "bugs", label: "Bug Tracker", icon: Bug },
      { id: "recruitment", label: "Recruitment '26", icon: Users },
    ],
  },
  {
    group: "INITIATIVES & ASSETS",
    items: [
      { id: "events", label: "Events & Hackathons", icon: Calendar },
      { id: "content", label: "Editorial Content", icon: FileText },
      { id: "assets", label: "Asset Drive", icon: FolderArchive },
      { id: "websites", label: "Websites & Uptime", icon: Link2 },
    ],
  },
  {
    group: "SOCIETY MANAGEMENT",
    items: [
      { id: "members", label: "Society Members", icon: UserCheck },
      { id: "audit", label: "System Audit Log", icon: History },
      { id: "documentation", label: "SOP & Handover", icon: BookOpen },
      { id: "settings", label: "Settings & Access", icon: Settings },
    ],
  },
];

export const INITIAL_HUB_ASSETS: AssetItem[] = [
  { id: "AST-01", name: "WDS_Official_Logo_HQ.png", category: "LOGOS", size: "1.0 MB", format: "PNG", updated: "26 May", project: "WDS Website" },
  { id: "AST-02", name: "Recruitment_2026_Poster.pdf", category: "POSTERS", size: "3.2 MB", format: "PDF", updated: "24 May", project: "Recruitment 2026" },
  { id: "AST-03", name: "Bug_Hunt_QR_Banner.png", category: "BRAND", size: "640 KB", format: "PNG", updated: "22 May", project: "WDS Bug Hunt" },
  { id: "AST-04", name: "Design_Tokens_Guide.md", category: "DOCUMENTS", size: "35 KB", format: "MD", updated: "18 May", project: "WDS Website" },
];
