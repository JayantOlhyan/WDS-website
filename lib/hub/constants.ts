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
import { NavGroupConfig, TaskItem, BugItem, AssetItem } from "./types";

export const HUB_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: "WORKSPACE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "tasks", label: "Tasks", icon: CheckSquare, count: "6" },
      { id: "bugs", label: "Bug Tracker", icon: Bug, count: "4", alert: true },
      { id: "recruitment", label: "Recruitment '26", icon: Users, count: "5" },
      { id: "content", label: "Content", icon: FileText },
      { id: "events", label: "Events", icon: Calendar, count: "2" },
    ],
  },
  {
    group: "DATA & DIRECTORY",
    items: [
      { id: "assets", label: "Asset Drive", icon: FolderArchive, count: "5" },
      { id: "websites", label: "Websites & Links", icon: Link2, count: "6" },
      { id: "faculty", label: "Faculty Directory", icon: GraduationCap, count: "12" },
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

export const INITIAL_HUB_TASKS: TaskItem[] = [
  {
    id: "TSK-101",
    title: "Verify MSIT departmental circulars and syllabus links",
    project: "MSIT Website",
    priority: "HIGH",
    dueDate: "28 May 2026",
    status: "COMPLETED",
    assignee: "Tech Lead",
  },
  {
    id: "TSK-102",
    title: "Fix responsive container layout on mobile about section",
    project: "Main Portal",
    priority: "HIGH",
    dueDate: "29 May 2026",
    status: "COMPLETED",
    assignee: "Frontend Wing",
  },
  {
    id: "TSK-103",
    title: "Review new student bug reports submitted via Bug Hunt",
    project: "Bug Hunt",
    priority: "HIGH",
    dueDate: "30 May 2026",
    status: "IN_PROGRESS",
    assignee: "QA Lead",
  },
  {
    id: "TSK-104",
    title: "Update society project directory and verified repositories",
    project: "Ecosystem",
    priority: "MEDIUM",
    dueDate: "01 Jun 2026",
    status: "PENDING",
    assignee: "Core Lead",
  },
  {
    id: "TSK-105",
    title: "Prepare technical article draft for monthly newsletter",
    project: "Newsletter",
    priority: "MEDIUM",
    dueDate: "03 Jun 2026",
    status: "PENDING",
    assignee: "Editorial Wing",
  },
  {
    id: "TSK-106",
    title: "Review Freshers Hub academic notes structure",
    project: "Freshers Hub",
    priority: "LOW",
    dueDate: "05 Jun 2026",
    status: "PENDING",
    assignee: "Community Wing",
  },
];

export const INITIAL_HUB_BUGS: BugItem[] = [
  {
    id: "BUG-23",
    title: "Mobile menu drawer overlaps top bar on Safari iOS",
    page: "/recruitment",
    severity: "HIGH",
    status: "RESOLVED",
    reporter: "student_dev_01",
    date: "1d ago",
  },
  {
    id: "BUG-24",
    title: "Academics syllabus PDF link missing target attribute",
    page: "https://msit.in",
    severity: "HIGH",
    status: "OPEN",
    reporter: "qa_tester_msit",
    date: "3h ago",
  },
  {
    id: "BUG-25",
    title: "Terminal auto-scroll stutter on long command outputs",
    page: "/terminal",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    reporter: "pixel_hunter",
    date: "5h ago",
  },
  {
    id: "BUG-26",
    title: "Footer GitHub commit link redirect URL check",
    page: "/",
    severity: "LOW",
    status: "OPEN",
    reporter: "code_scout",
    date: "1d ago",
  },
];

export const INITIAL_HUB_ASSETS: AssetItem[] = [
  { id: "AST-01", name: "WDS_Official_Logo_HQ.png", category: "LOGOS", size: "1.0 MB", format: "PNG", updated: "26 May" },
  { id: "AST-02", name: "Recruitment_2026_Poster.pdf", category: "POSTERS", size: "3.2 MB", format: "PDF", updated: "24 May" },
  { id: "AST-03", name: "Bug_Hunt_QR_Banner.png", category: "BRAND", size: "640 KB", format: "PNG", updated: "22 May" },
  { id: "AST-04", name: "Design_Tokens_Guide.md", category: "DOCUMENTS", size: "35 KB", format: "MD", updated: "18 May" },
];
