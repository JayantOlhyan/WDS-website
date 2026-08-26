import {
  LayoutDashboard,
  CheckSquare,
  Bug,
  Users,
  FileText,
  Calendar,
  FolderArchive,
  Link2,
  GraduationCap,
  BookOpen,
  Settings,
  Trash2,
} from "lucide-react";
import { NavGroupConfig, AssetItem } from "./types";

export const HUB_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: "WORKSPACE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "tasks", label: "Tasks", icon: CheckSquare },
      { id: "bugs", label: "Bug Tracker", icon: Bug },
      { id: "recruitment", label: "Recruitment '26", icon: Users },
      { id: "content", label: "Content", icon: FileText },
      { id: "events", label: "Events", icon: Calendar },
    ],
  },
  {
    group: "DATA & DIRECTORY",
    items: [
      { id: "assets", label: "Asset Drive", icon: FolderArchive },
      { id: "websites", label: "Websites & Links", icon: Link2 },
      { id: "faculty", label: "Faculty Directory", icon: GraduationCap },
    ],
  },
  {
    group: "RESOURCES",
    items: [
      { id: "resources", label: "Documentation", icon: BookOpen },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "trash", label: "Trash", icon: Trash2 },
    ],
  },
];

export const INITIAL_HUB_ASSETS: AssetItem[] = [
  { id: "AST-01", name: "WDS_Official_Logo_HQ.png", category: "LOGOS", size: "1.0 MB", format: "PNG", updated: "26 May" },
  { id: "AST-02", name: "Recruitment_2026_Poster.pdf", category: "POSTERS", size: "3.2 MB", format: "PDF", updated: "24 May" },
  { id: "AST-03", name: "Bug_Hunt_QR_Banner.png", category: "BRAND", size: "640 KB", format: "PNG", updated: "22 May" },
  { id: "AST-04", name: "Design_Tokens_Guide.md", category: "DOCUMENTS", size: "35 KB", format: "MD", updated: "18 May" },
];
