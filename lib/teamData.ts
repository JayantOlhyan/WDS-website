export interface TeamMember {
  role: string;
  domain: "Technical" | "Design & UI/UX" | "Content & Media" | "Events & Ops";
  focus: string;
  github?: string;
  linkedin?: string;
  badge: string;
}

export interface TeamDomain {
  name: string;
  description: string;
  stack: string[];
  members: TeamMember[];
}

export const TEAM_DOMAINS: TeamDomain[] = [
  {
    name: "Technical Wing",
    description: "Architecting, developing, maintaining, and scaling the digital ecosystem of MSIT.",
    stack: ["Next.js", "TypeScript", "Python", "PostgreSQL", "DevOps", "QA / Bug Hunting"],
    members: [
      {
        role: "Lead Full-Stack Developer",
        domain: "Technical",
        focus: "Web Architecture, System Performance, Next.js Platforms",
        badge: "ARCHITECT",
        github: "https://github.com/wds-msit",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
      {
        role: "Frontend & UI Systems Lead",
        domain: "Technical",
        focus: "Design Systems, Motion, Micro-interactions, Accessibility",
        badge: "FRONTEND",
        github: "https://github.com/wds-msit",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
      {
        role: "Backend & Systems Engineer",
        domain: "Technical",
        focus: "APIs, Databases, Serverless Logic, Security Auditing",
        badge: "BACKEND",
        github: "https://github.com/wds-msit",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
      {
        role: "QA & Website Maintenance Coordinator",
        domain: "Technical",
        focus: "Bug Hunt Platform, Cross-browser Testing, Issue Triage",
        badge: "QA LEAD",
        github: "https://github.com/wds-msit",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
    ],
  },
  {
    name: "Design & UI/UX Wing",
    description: "Crafting retro-modern visual systems, brand posters, product interfaces, and interactive prototypes.",
    stack: ["Figma", "Pixel Art", "SVG Motion", "Brand Identity", "Design Systems"],
    members: [
      {
        role: "Head of Product Design",
        domain: "Design & UI/UX",
        focus: "UI Architecture, Design Tokens, User Research, Accessibility",
        badge: "UI/UX LEAD",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
      {
        role: "Visual & Pixel Art Designer",
        domain: "Design & UI/UX",
        focus: "Brand Identity, Poster Graphics, Retro-Computing Art",
        badge: "CREATIVE",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
    ],
  },
  {
    name: "Content & Community Wing",
    description: "Managing society communications, newsletter publishing, workshops, events, and external outreach.",
    stack: ["Technical Writing", "Newsletters", "Workshops", "Public Relations"],
    members: [
      {
        role: "Editorial & Content Lead",
        domain: "Content & Media",
        focus: "WDS Newsletter, Tech Blogs, Social Copy, Documentation",
        badge: "EDITORIAL",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
      {
        role: "Community & Events Coordinator",
        domain: "Events & Ops",
        focus: "Hackathons, Orientation, Tech Workshops, Student Onboarding",
        badge: "OPERATIONS",
        linkedin: "https://linkedin.com/company/wds-msit",
      },
    ],
  },
];
