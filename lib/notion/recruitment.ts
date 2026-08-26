import { getNotionClient, NOTION_RECRUITMENT_DB_ID } from "./client";

export type ApplicationStatus =
  | "RECEIVED"
  | "SCREENING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export interface CandidateApplication {
  id: string;
  fullName: string;
  enrollmentNo: string;
  branch: string;
  section: string;
  collegeEmail: string;
  phone: string;
  interests: string[];
  experienceLevel: string;
  preferredTeam: string;
  timeCommitment: string;
  status: ApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  interviewer?: string;
  notes?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export const INITIAL_RECRUITMENT_APPLICATIONS: CandidateApplication[] = [
  {
    id: "APP-2026-01",
    fullName: "Aarav Sharma",
    enrollmentNo: "01215002724",
    branch: "Computer Science & Engineering (CSE)",
    section: "CSE-1",
    collegeEmail: "aarav.cse@msit.in",
    phone: "9876543210",
    interests: ["Next.js", "TypeScript", "Tailwind CSS"],
    experienceLevel: "Some Projects",
    preferredTeam: "Technical Wing",
    timeCommitment: "4–8 hours / week",
    status: "SHORTLISTED",
    appliedDate: "24 May 2026",
    interviewer: "Jayant Olhyan",
    notes: "Solid portfolio with 2 Next.js side projects.",
    githubUrl: "https://github.com/example-aarav",
  },
  {
    id: "APP-2026-02",
    fullName: "Sneha Patel",
    enrollmentNo: "04515003124",
    branch: "Information Technology (IT)",
    section: "IT-2",
    collegeEmail: "sneha.it@msit.in",
    phone: "9876543211",
    interests: ["Figma", "UI/UX", "Design Systems"],
    experienceLevel: "Comfortable",
    preferredTeam: "Design & UI/UX Wing",
    timeCommitment: "4–8 hours / week",
    status: "INTERVIEW",
    appliedDate: "25 May 2026",
    interviewDate: "29 May 2026 • 4:00 PM",
    interviewer: "Design Lead",
    notes: "Great typography and wireframe case studies.",
  },
  {
    id: "APP-2026-03",
    fullName: "Rohan Verma",
    enrollmentNo: "08915002824",
    branch: "Electronics & Communication Engineering (ECE)",
    section: "ECE-1",
    collegeEmail: "rohan.ece@msit.in",
    phone: "9876543212",
    interests: ["Technical Writing", "Documentation", "Git"],
    experienceLevel: "Basic Knowledge",
    preferredTeam: "Content & Editorial Wing",
    timeCommitment: "2–4 hours / week",
    status: "SCREENING",
    appliedDate: "26 May 2026",
    notes: "Strong writing sample in application essay.",
  },
  {
    id: "APP-2026-04",
    fullName: "Meera Nair",
    enrollmentNo: "01815002724",
    branch: "Computer Science & Engineering (CSE)",
    section: "CSE-2",
    collegeEmail: "meera.cse@msit.in",
    phone: "9876543213",
    interests: ["React", "API Design", "PostgreSQL"],
    experienceLevel: "Real-world",
    preferredTeam: "Technical Wing",
    timeCommitment: "8–12 hours / week",
    status: "SELECTED",
    appliedDate: "22 May 2026",
    notes: "Exceptional frontend & backend foundation. Ready for sprint assignments.",
  },
  {
    id: "APP-2026-05",
    fullName: "Tanmay Gupta",
    enrollmentNo: "05415003124",
    branch: "Information Technology (IT)",
    section: "IT-1",
    collegeEmail: "tanmay.it@msit.in",
    phone: "9876543214",
    interests: ["Event Management", "Operations", "Sponsorships"],
    experienceLevel: "Basic Knowledge",
    preferredTeam: "Events & Operations Wing",
    timeCommitment: "4–8 hours / week",
    status: "RECEIVED",
    appliedDate: "26 May 2026",
  },
];

export async function fetchRecruitmentApplications(): Promise<{
  applications: CandidateApplication[];
  source: "NOTION" | "LOCAL_FALLBACK";
}> {
  const notion = getNotionClient();
  if (!notion || !NOTION_RECRUITMENT_DB_ID) {
    return { applications: INITIAL_RECRUITMENT_APPLICATIONS, source: "LOCAL_FALLBACK" };
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_RECRUITMENT_DB_ID,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    const applications: CandidateApplication[] = response.results.map((page: any, idx: number) => {
      const props = page.properties;
      const fullName =
        props["Full Name"]?.title?.[0]?.plain_text ||
        props.Name?.title?.[0]?.plain_text ||
        `Applicant #${idx + 1}`;
      const enrollmentNo =
        props["Enrollment Number"]?.rich_text?.[0]?.plain_text ||
        props.Enrollment?.rich_text?.[0]?.plain_text ||
        "N/A";
      const branch = props.Branch?.select?.name || "General";
      const section = props.Section?.rich_text?.[0]?.plain_text || "1";
      const collegeEmail = props["College Email"]?.email || "";
      const phone = props.Phone?.phone_number || "";
      const preferredTeam = props["Preferred Team"]?.select?.name || "Technical Wing";
      const experienceLevel = props["Experience Level"]?.select?.name || "Beginner";
      const timeCommitment = props["Time Commitment"]?.select?.name || "4-8 hrs";
      const rawStatus = props.Status?.select?.name?.toUpperCase() || "RECEIVED";
      const status: ApplicationStatus = [
        "RECEIVED",
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED",
      ].includes(rawStatus)
        ? (rawStatus as ApplicationStatus)
        : "RECEIVED";

      return {
        id: `APP-2026-${page.id.slice(0, 4).toUpperCase()}`,
        fullName,
        enrollmentNo,
        branch,
        section,
        collegeEmail,
        phone,
        interests: ["Web Development", preferredTeam],
        experienceLevel,
        preferredTeam,
        timeCommitment,
        status,
        appliedDate: "Recent",
      };
    });

    return {
      applications: applications.length > 0 ? applications : INITIAL_RECRUITMENT_APPLICATIONS,
      source: "NOTION",
    };
  } catch (error) {
    console.warn("[Notion Recruitment Fetch Warning - Fallback]:", error);
    return { applications: INITIAL_RECRUITMENT_APPLICATIONS, source: "LOCAL_FALLBACK" };
  }
}
