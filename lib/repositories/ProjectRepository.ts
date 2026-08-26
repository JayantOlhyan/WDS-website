export interface SocietyProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "ACTIVE" | "MAINTENANCE" | "COMPLETED" | "PLANNING";
  lead: string;
  wing: string;
  websiteUrl?: string;
  githubUrl?: string;
  techStack: string[];
  lastUpdated: string;
}

class MemoryProjectRepository {
  private projects: SocietyProject[] = [
    {
      id: "PRJ-01",
      name: "WDS Main Ecosystem Website",
      slug: "wds-main-website",
      description: "Official public portal and internal Hub operating system for Web Development Society MSIT.",
      status: "ACTIVE",
      lead: "Jayant Olhyan",
      wing: "Technical Wing",
      websiteUrl: "https://msit.in",
      githubUrl: "https://github.com/JayantOlhyan/WDS-website",
      techStack: ["Next.js 14", "TypeScript", "TailwindCSS", "Notion API", "Vitest"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "PRJ-02",
      name: "WDS Bug Hunt Platform",
      slug: "wds-bug-hunt",
      description: "Campus-wide vulnerability triage portal and student bounty hunt challenge platform.",
      status: "ACTIVE",
      lead: "Frontend & QA Lead",
      wing: "Technical Wing",
      websiteUrl: "https://wds-bug-hunt.netlify.app/bug-hunt",
      githubUrl: "https://github.com/JayantOlhyan/WDS-website",
      techStack: ["React", "Netlify", "HMAC Webhook API"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "PRJ-03",
      name: "Recruitment 2026 Pipeline",
      slug: "recruitment-2026",
      description: "Multi-stage screening, interview scorecard, and onboarding engine for MSIT batch 2026.",
      status: "ACTIVE",
      lead: "Core Team",
      wing: "Core Operations",
      websiteUrl: "/recruitment",
      techStack: ["Next.js", "Zod Validation", "Notion DB"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "PRJ-04",
      name: "Freshers Hub & Resource Kit",
      slug: "freshers-hub",
      description: "Curated beginner roadmaps, semester notes, and hands-on starter repositories for MSIT freshers.",
      status: "PLANNING",
      lead: "UI/UX & Editorial Lead",
      wing: "Design & Content",
      techStack: ["Markdown", "Next.js", "Asset Drive"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "PRJ-05",
      name: "WDS Tech Newsletter & Radar",
      slug: "wds-newsletter",
      description: "Monthly tech briefs, developer spotlights, and campus open-source project showcases.",
      status: "PLANNING",
      lead: "Editorial Lead",
      wing: "Content & Editorial Wing",
      techStack: ["MDX", "Editorial Workflow"],
      lastUpdated: new Date().toISOString(),
    },
  ];

  public async getProjects(): Promise<SocietyProject[]> {
    return this.projects;
  }

  public async getProjectById(id: string): Promise<SocietyProject | null> {
    return this.projects.find((p) => p.id === id || p.slug === id) || null;
  }
}

export const projectRepository = new MemoryProjectRepository();
