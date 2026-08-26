export type ProjectStatus = "LIVE" | "ACTIVE" | "IN DEVELOPMENT" | "COMING SOON";
export type ProjectCategory = "Core Platform" | "Community" | "Open Source" | "Internal Tool";

export interface Project {
  id: string;
  name: string;
  shortTitle: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  features?: string[];
  featured?: boolean;
  iconType: "code" | "bug" | "mail" | "users" | "terminal" | "hub";
}

export const WDS_PROJECTS: Project[] = [
  {
    id: "msit-website",
    name: "MSIT Official Website",
    shortTitle: "MSIT PORTAL",
    tagline: "Official institutional web portal for MSIT.",
    description:
      "Modern institutional web portal engineered for students, faculty, and administration of Maharaja Surajmal Institute of Technology.",
    status: "LIVE",
    category: "Core Platform",
    url: "https://msit.in",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    features: [
      "Departmental syllabi, circulars and notices",
      "Faculty profiles and research publications",
      "Examination schedules and academic calendar",
      "Responsive accessibility for desktop and mobile",
    ],
    featured: true,
    iconType: "code",
  },
  {
    id: "bug-hunt",
    name: "WDS Bug Hunt",
    shortTitle: "BUG HUNT",
    tagline: "Find bugs. Report issues. Earn points. Get rewarded.",
    description:
      "A student-driven website QA and engagement platform where students explore MSIT digital platforms, identify UI bugs, broken links, or performance issues, report them, and compete on the leaderboard.",
    status: "LIVE",
    category: "Community",
    url: "https://wds-bug-hunt.netlify.app/bug-hunt",
    githubUrl: "https://github.com/JayantOlhyan/WDS-website",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    features: [
      "Step-by-step bug reporting workflow with screenshot attachments",
      "Live bug discovery leaderboard and points calculation",
      "Direct integration with WDS developer triage queue",
      "Tiered reward milestones and developer recognition",
    ],
    featured: true,
    iconType: "bug",
  },
  {
    id: "newsletter",
    name: "WDS Tech Newsletter",
    shortTitle: "NEWSLETTER",
    tagline: "Curated web tech, engineering insights, and campus updates.",
    description:
      "A student-authored digital publication curating deep-dives into modern web development, browser engineering, open-source projects, and student developer spotlights.",
    status: "IN DEVELOPMENT",
    category: "Community",
    technologies: ["Next.js", "MDX", "Tailwind CSS"],
    features: [
      "Technical breakdowns of modern web protocols and tools",
      "Student project showcases and open-source spotlights",
      "Curated campus tech news and hackathon recaps",
    ],
    featured: true,
    iconType: "mail",
  },
  {
    id: "freshers-hub",
    name: "MSIT Freshers Hub",
    shortTitle: "FRESHERS HUB",
    tagline: "The definitive survival guide & resource repository for first-year students.",
    description:
      "An onboarding portal curated by senior developers with notes, lab manuals, roadmaps, society guides, campus maps, and previous year examination papers.",
    status: "IN DEVELOPMENT",
    category: "Core Platform",
    technologies: ["Next.js", "TypeScript", "Search Index"],
    features: [
      "Subject-wise notes and verified lab manual archives",
      "Interactive campus guide and department directory",
      "First-year coding roadmap and society onboarding",
    ],
    featured: true,
    iconType: "users",
  },
  {
    id: "terminal-cli",
    name: "WDS Interactive Terminal",
    shortTitle: "TERMINAL",
    tagline: "UNIX-like browser shell for exploring the WDS ecosystem.",
    description:
      "A browser-based command line interface allowing developers to navigate society projects, inspect system status, query member directory, and execute custom commands.",
    status: "LIVE",
    category: "Internal Tool",
    url: "/terminal",
    technologies: ["TypeScript", "Web Audio API", "CSS Grid"],
    features: [
      "Command history navigation with Arrow keys",
      "Built-in commands: whoami, ls, status, events, bughunt, join",
      "Keyboard shortcut hints and mobile quick chips",
    ],
    featured: false,
    iconType: "terminal",
  },
  {
    id: "wds-hub",
    name: "WDS Website Hub",
    shortTitle: "WEBSITE HUB",
    tagline: "Internal operational control panel & system monitor.",
    description:
      "Administrative dashboard used by WDS leads to monitor active websites, track development sprints, triage reported bugs, and manage assets.",
    status: "ACTIVE",
    category: "Internal Tool",
    url: "/hub",
    technologies: ["Next.js App Router", "TypeScript", "Zod", "Command Palette"],
    features: [
      "Active websites registry and response time monitor",
      "Command Palette (⌘K) for quick navigation and task execution",
      "Sprint task checklist and Bug Hunt issue triage board",
      "Responsive layout for desktop, tablet, and mobile",
    ],
    featured: false,
    iconType: "hub",
  },
];
