import { recruitmentRepository, isValidLifecycleTransition } from "../repositories/RecruitmentRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CandidateApplication, ApplicationStatus } from "../notion/recruitment";
import { CandidateApplicationInput, RecruitmentStatusUpdateInput } from "../validation/recruitment";
import { RepositoryQueryResult } from "../repositories/types";

export class RecruitmentService {
  public async getApplications(): Promise<RepositoryQueryResult<CandidateApplication[]>> {
    return recruitmentRepository.getApplications();
  }

  public async submitApplication(
    input: CandidateApplicationInput
  ): Promise<{ success: boolean; data?: CandidateApplication; error?: string }> {
    const notion = await import("../notion/client").then((m) => m.getNotionClient());
    const dbId = await import("../config/notionDatabases").then((m) => m.getNotionDatabaseId("RECRUITMENT"));

    if (!notion || !dbId) {
      return {
        success: false,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const response = await notion.pages.create({
        parent: { database_id: dbId },
        properties: {
          "Full Name": {
            title: [{ text: { content: input.fullName } }],
          },
          "Enrollment Number": {
            rich_text: [{ text: { content: input.enrollmentNo } }],
          },
          Branch: {
            select: { name: input.branch },
          },
          Section: {
            rich_text: [{ text: { content: input.section } }],
          },
          "College Email": {
            email: input.collegeEmail,
          },
          Phone: {
            phone_number: input.phone,
          },
          "Preferred Team": {
            select: { name: input.preferredTeam },
          },
          "Experience Level": {
            select: { name: input.experienceLevel },
          },
          "Time Commitment": {
            select: { name: input.timeCommitment },
          },
          Status: {
            select: { name: "RECEIVED" },
          },
        },
      });

      const candidate: CandidateApplication = {
        id: response.id,
        fullName: input.fullName,
        enrollmentNo: input.enrollmentNo,
        branch: input.branch,
        section: input.section,
        collegeEmail: input.collegeEmail,
        phone: input.phone,
        interests: ["Web Development", input.preferredTeam],
        experienceLevel: input.experienceLevel,
        preferredTeam: input.preferredTeam,
        timeCommitment: input.timeCommitment,
        status: "RECEIVED",
        appliedDate: new Date().toLocaleDateString(),
      };

      await auditRepository.logEvent({
        actor: `Applicant:${input.fullName}`,
        role: "MEMBER",
        action: "CANDIDATE_APPLIED",
        resource: "CandidateApplication",
        resourceId: response.id,
        details: { branch: input.branch, preferredTeam: input.preferredTeam },
      });

      return {
        success: true,
        data: candidate,
      };
    } catch (err: any) {
      console.error("[RecruitmentService.submitApplication Error]:", err?.message || err);
      return {
        success: false,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }

  public async updateStatus(
    id: string,
    input: RecruitmentStatusUpdateInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<CandidateApplication>> {
    const result = await recruitmentRepository.updateApplicationStatus(
      id,
      input.status,
      input.notes,
      input.interviewer
    );

    if (result.success) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "CANDIDATE_STATUS_UPDATED",
        resource: "CandidateApplication",
        resourceId: id,
        details: input,
      });
    }

    return result;
  }
}

export const recruitmentService = new RecruitmentService();
