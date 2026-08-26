import {
  getNotionClient,
  NOTION_RECRUITMENT_DB_ID,
  queryNotionDatabaseWithPagination,
} from "@/lib/notion/client";
import { IRecruitmentRepository, RepositoryQueryResult } from "./types";
import { CandidateApplication, ApplicationStatus } from "@/lib/notion/recruitment";

// Valid candidate transition rules
export const VALID_LIFECYCLE_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  RECEIVED: ["SCREENING", "REJECTED"],
  SCREENING: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["SELECTED", "REJECTED"],
  SELECTED: ["REJECTED"],
  REJECTED: ["SCREENING"], // Allow reconsideration
};

export function isValidLifecycleTransition(
  currentStatus: ApplicationStatus,
  targetStatus: ApplicationStatus,
  isAdmin: boolean = false
): boolean {
  if (currentStatus === targetStatus) return true;
  if (isAdmin) return true; // Admins can override
  const allowed = VALID_LIFECYCLE_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

class NotionRecruitmentRepository implements IRecruitmentRepository {
  public async getApplications(): Promise<RepositoryQueryResult<CandidateApplication[]>> {
    const notion = getNotionClient();
    if (!notion || !NOTION_RECRUITMENT_DB_ID) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const results = await queryNotionDatabaseWithPagination(NOTION_RECRUITMENT_DB_ID, {
        maxRecords: 500,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      });

      const applications: CandidateApplication[] = results.map((page: any, idx: number) => {
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
          id: page.id,
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
          appliedDate: new Date(page.created_time).toLocaleDateString(),
        };
      });

      return { success: true, data: applications };
    } catch (error) {
      console.error("[RecruitmentRepository.getApplications Error]:", error);
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "DATABASE_QUERY_FAILED",
      };
    }
  }

  public async updateApplicationStatus(
    id: string,
    newStatus: ApplicationStatus,
    notes?: string,
    interviewer?: string
  ): Promise<RepositoryQueryResult<CandidateApplication>> {
    const notion = getNotionClient();
    if (!notion) {
      return {
        success: false,
        data: { id, status: newStatus } as CandidateApplication,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const propertiesToUpdate: Record<string, any> = {
        Status: { select: { name: newStatus } },
      };

      if (notes) {
        propertiesToUpdate.Notes = { rich_text: [{ text: { content: notes } }] };
      }
      if (interviewer) {
        propertiesToUpdate.Interviewer = { rich_text: [{ text: { content: interviewer } }] };
      }

      await notion.pages.update({
        page_id: id,
        properties: propertiesToUpdate,
      });

      return {
        success: true,
        data: { id, status: newStatus, notes, interviewer } as CandidateApplication,
      };
    } catch (error) {
      console.error("[RecruitmentRepository.updateApplicationStatus Error]:", error);
      return {
        success: false,
        data: { id, status: newStatus } as CandidateApplication,
        error: "DATABASE_UPDATE_FAILED",
      };
    }
  }
}

export const recruitmentRepository: IRecruitmentRepository = new NotionRecruitmentRepository();
