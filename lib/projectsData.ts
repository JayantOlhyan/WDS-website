export interface Project {
  id: string;
  name: string;
  shortTitle?: string;
  tagline: string;
  description: string;
  status: "LIVE" | "ACTIVE" | "IN DEVELOPMENT" | "COMING SOON";
  category: "Core Platform" | "Community" | "Open Source" | "Internal Tool";
  url: string;
  githubUrl?: string;
  tags: string[];
  features?: string[];
  iconType: "globe" | "bug" | "mail" | "users" | "terminal" | "code";
  metrics?: { label: string; value: string }[];
}

export const WDS_PROJECTS: Project[] = [
  {
    id: "msit-website",
    name: "MSIT Website",
    shortTitle: "MSIT PORTAL",
    tagline: "The digital experience for Maharaja Surajmal Institute of Technology.",
    description:
      "The official website of MSIT, designed, developed and actively maintained by WDS. Built for performance, accessibility and modern student navigation across all departments, notices, and academic portals.",
    status: "LIVE",
    category: "Core Platform",
    url: "https://msit.in",
    githubUrl: "https://github.com/wds-msit/msit-website",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "CMS"],
    iconType: "globe",
    features: [
      "Dynamic Department & Faculty Directory",
      "Real-time Notices & Circulars System",
      "Mobile-first responsive architecture",
      "Strict accessibility & high Lighthouse score",
    ],
  },
  {
    id: "bug-hunt",
    name: "WDS Bug Hunt",
    shortTitle: "BUG HUNT",
    tagline: "Find bugs. Report issues. Earn points. Get rewarded.",
    description:
      "A student-driven website QA and engagement platform where students explore the MSIT digital ecosystem, identify UI bugs, broken links, performance bottlenecks and usability issues, report them, earn points and compete on the leaderboard.",
    status: "LIVE",
    category: "Core Platform",
    url: "https://wds-bug-hunt.netlify.app/bug-hunt",
    githubUrl: "https://github.com/wds-msit/bug-hunt",
    tags: ["React", "FastAPI", "PostgreSQL", "Gamification"],
    iconType: "bug",
    features: [
      "Real-time submission & verification workflow",
      "Live student leaderboard with tier badges",
      "Interactive QA checklist & bug categorization",
      "Exclusive swag & recognition reward tiers",
    ],
  },
  {
    id: "wds-newsletter",
    name: "WDS Newsletter",
    shortTitle: "NEWSLETTER",
    tagline: "Choose what you want to hear about.",
    description:
      "Curated tech updates, student project spotlights, engineering deep-dives, hackathon announcements, and college tech trends delivered straight to your inbox.",
    status: "LIVE",
    category: "Community",
    url: "https://newsletter.wds-msit.org",
    tags: ["Email Engine", "Markdown", "Automation"],
    iconType: "mail",
    features: [
      "Topic preference customization (Dev, Design, AI, Events)",
      "Student project breakdowns and postmortems",
      "Curated engineering blogs & tech job drops",
    ],
  },
  {
    id: "freshers-hub",
    name: "Freshers Hub",
    shortTitle: "FRESHERS HUB",
    tagline: "Your one-stop hub for everything you need as a fresher at MSIT.",
    description:
      "Events, announcements, syllabus guides, senior notes, coding roadmaps, and community channels for first-year students to connect, learn and level up smoothly.",
    status: "LIVE",
    category: "Community",
    url: "https://freshers.wds-msit.org",
    tags: ["Next.js", "Resource Base", "Student Guide"],
    iconType: "users",
    features: [
      "First-year survival guide & campus map",
      "Curated tech stacks and beginner roadmaps",
      "Direct Q&A forum with senior developers",
    ],
  },
  {
    id: "wds-terminal",
    name: "WDS Web Terminal",
    shortTitle: "TERMINAL OS",
    tagline: "Interactive browser terminal for the WDS ecosystem.",
    description:
      "A retro UNIX-inspired interactive web CLI allowing students to query society status, explore open source projects, inspect system metrics, and trigger easter eggs.",
    status: "ACTIVE",
    category: "Internal Tool",
    url: "/terminal",
    tags: ["React", "TypeScript", "CLI Engine"],
    iconType: "terminal",
    features: [
      "Custom simulated shell commands (`whoami`, `ls`, `join`)",
      "Autocomplete & keyboard navigation",
      "Direct execution of society workflows",
    ],
  },
  {
    id: "future-projects",
    name: "More Projects Cooking",
    shortTitle: "IN DEVELOPMENT",
    tagline: "Something awesome is in the works!",
    description:
      "We are constantly ideating and building new platforms that make a tangible difference in the MSIT student experience. Got an idea? Join WDS and lead it.",
    status: "IN DEVELOPMENT",
    category: "Open Source",
    url: "/recruitment",
    tags: ["R&D", "Open Source", "Next-Gen"],
    iconType: "code",
    features: [
      "Campus event ticketing platform",
      "WDS Open Source Component Library",
      "Student project showcase gallery",
    ],
  },
];
