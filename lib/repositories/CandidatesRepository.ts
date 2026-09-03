import { queryDatabase, createPage, updatePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  findProp,
  extractTitle,
  extractRichText,
  extractSelect,
  extractStatus,
  extractMultiSelect,
  extractEmail,
  extractPhone,
  extractUrl,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildStatus,
  buildMultiSelect,
  buildEmail,
  buildPhone,
  buildUrl,
} from "../notion/properties";
import { CandidateRecord } from "../types/candidate";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export class CandidatesRepository {
  private getDbId(): string {
    return getNotionDatabaseId("CANDIDATES");
  }

  public async getAll(options: { status?: string; preferredWing?: string; search?: string } = {}): Promise<NotionQueryResult<CandidateRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.status) {
      filters.push({ property: "Status", select: { equals: options.status } });
    }
    if (options.preferredWing) {
      filters.push({ property: "Preferred Team", select: { equals: options.preferredWing } });
    }
    if (options.search) {
      filters.push({ property: "Full Name", title: { contains: options.search } });
    }

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 300,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const candidates: CandidateRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties || {};
      const fullName = extractTitle(
        findProp(props, ["Full Name", "Name", "Candidate Name", "Student Name", "Title"]),
        `Candidate #${idx + 1}`
      );
      const rollNumber = extractRichText(
        findProp(props, ["Enrollment Number", "Enrollment No", "Enrollment No.", "Enrollment", "Roll Number", "Roll No", "Roll No.", "Roll", "University Roll No", "RollNumber", "EnrollmentNo"])
      );
      const email = extractEmail(
        findProp(props, ["College Email", "Email", "Email Address", "Personal Email", "Email ID", "Mail", "Candidate Email"])
      );
      const phone = extractPhone(
        findProp(props, ["Phone", "PhoneNumber", "Phone Number", "WhatsApp", "WhatsApp Number", "Mobile", "Contact", "Contact Number"])
      );
      const branch = extractSelect(
        findProp(props, ["Branch", "Department", "Stream", "Course"]),
        "CSE"
      );
      const section = extractRichText(
        findProp(props, ["Section", "Section / Shift", "Shift", "Sec"]),
        "A"
      );
      const year = extractSelect(
        findProp(props, ["Year of Study", "Year", "Current Year", "Batch"]),
        "1st Year"
      );
      const preferredWing = extractSelect(
        findProp(props, ["Preferred Team", "Preferred Wing", "Wing", "Team", "Domain", "Preferred Domain", "Wing / Team"]),
        "Technical Wing"
      );
      const experienceLevel = extractSelect(
        findProp(props, ["Experience Level", "Experience", "Skill Level", "Level"]),
        "Beginner"
      );
      const timeCommitment = extractSelect(
        findProp(props, ["Time Commitment", "Commitment", "Hours", "Time"]),
        "4-8 hrs"
      );
      const statusRaw = extractStatus(
        findProp(props, ["Status", "Stage", "Application Status", "State"]),
        "RECEIVED"
      );
      const status = (["RECEIVED", "SCREENING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].includes(statusRaw)
        ? statusRaw
        : "RECEIVED") as any;

      const githubUrl = extractUrl(
        findProp(props, ["GitHub URL", "GitHub", "Github", "Github Profile", "GitHub Profile"])
      );
      const linkedinUrl = extractUrl(
        findProp(props, ["LinkedIn URL", "LinkedIn", "Linkedin", "LinkedIn Profile"])
      );
      const portfolioUrl = extractUrl(
        findProp(props, ["Portfolio URL", "Portfolio", "Website", "Personal Website", "Projects URL"])
      );
      const notes = extractRichText(
        findProp(props, ["Notes", "Note", "Scorecard", "Evaluation", "Comments", "Submission", "Answers", "Responses"])
      );

      // Dedicated properties if available
      const whyWds = extractRichText(
        findProp(props, ["Why WDS", "Why WDS?", "Why do you want to join WDS", "Why WDS Statement", "Why Join"])
      );
      const learningGoal = extractRichText(
        findProp(props, ["Learning Goal", "First Year Skill", "Learning Goals", "Goals", "Skill Goal"])
      );
      const scenarioResponse = extractRichText(
        findProp(props, ["Scenario Response", "Scenario", "Real-World Scenario", "Bug Scenario", "Scenario Answer"])
      );
      const projectLinks = extractRichText(
        findProp(props, ["Projects & Work", "Projects", "Project Links", "Work Highlights", "Past Work", "Portfolio Highlights"])
      );
      const rawInterests = extractMultiSelect(
        findProp(props, ["Interests", "Focus Areas", "Fields of Interest", "Areas of Interest"])
      );

      const interviewsRel = extractRelationIds(props.Interviews);

      return {
        id: p.id,
        fullName,
        rollNumber: rollNumber || phone || "N/A",
        email: email || "N/A",
        phone: phone || "N/A",
        branch,
        section,
        year,
        preferredWing,
        experienceLevel,
        timeCommitment,
        status,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        projectLinks: projectLinks || undefined,
        whyWds: whyWds || undefined,
        learningGoal: learningGoal || undefined,
        scenarioResponse: scenarioResponse || undefined,
        interests: rawInterests.length > 0 ? rawInterests : undefined,
        notes,
        interviewsCount: interviewsRel.length,
        appliedDate: new Date(p.created_time).toLocaleDateString(),
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: candidates,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<CandidateRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties || {};
    const fullName = extractTitle(
      findProp(props, ["Full Name", "Name", "Candidate Name", "Student Name", "Title"]),
      "Untitled Candidate"
    );
    const rollNumber = extractRichText(
      findProp(props, ["Enrollment Number", "Enrollment No", "Enrollment No.", "Enrollment", "Roll Number", "Roll No", "Roll No.", "Roll", "University Roll No"])
    );
    const email = extractEmail(
      findProp(props, ["College Email", "Email", "Email Address", "Personal Email", "Email ID", "Mail"])
    );
    const phone = extractPhone(
      findProp(props, ["Phone", "PhoneNumber", "Phone Number", "WhatsApp", "WhatsApp Number", "Mobile", "Contact"])
    );
    const branch = extractSelect(
      findProp(props, ["Branch", "Department", "Stream", "Course"]),
      "CSE"
    );
    const section = extractRichText(
      findProp(props, ["Section", "Section / Shift", "Shift", "Sec"]),
      "A"
    );
    const year = extractSelect(
      findProp(props, ["Year of Study", "Year", "Current Year", "Batch"]),
      "1st Year"
    );
    const preferredWing = extractSelect(
      findProp(props, ["Preferred Team", "Preferred Wing", "Wing", "Team", "Domain", "Preferred Domain"]),
      "Technical Wing"
    );
    const experienceLevel = extractSelect(
      findProp(props, ["Experience Level", "Experience", "Skill Level", "Level"]),
      "Beginner"
    );
    const timeCommitment = extractSelect(
      findProp(props, ["Time Commitment", "Commitment", "Hours", "Time"]),
      "4-8 hrs"
    );
    const statusRaw = extractStatus(
      findProp(props, ["Status", "Stage", "Application Status", "State"]),
      "RECEIVED"
    );
    const status = (["RECEIVED", "SCREENING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].includes(statusRaw)
      ? statusRaw
      : "RECEIVED") as any;

    const githubUrl = extractUrl(
      findProp(props, ["GitHub URL", "GitHub", "Github", "Github Profile", "GitHub Profile"])
    );
    const linkedinUrl = extractUrl(
      findProp(props, ["LinkedIn URL", "LinkedIn", "Linkedin", "LinkedIn Profile"])
    );
    const portfolioUrl = extractUrl(
      findProp(props, ["Portfolio URL", "Portfolio", "Website", "Personal Website", "Projects URL"])
    );
    const notes = extractRichText(
      findProp(props, ["Notes", "Note", "Scorecard", "Evaluation", "Comments", "Submission", "Answers", "Responses"])
    );

    const whyWds = extractRichText(
      findProp(props, ["Why WDS", "Why WDS?", "Why do you want to join WDS", "Why WDS Statement"])
    );
    const learningGoal = extractRichText(
      findProp(props, ["Learning Goal", "First Year Skill", "Learning Goals", "Goals"])
    );
    const scenarioResponse = extractRichText(
      findProp(props, ["Scenario Response", "Scenario", "Real-World Scenario", "Bug Scenario"])
    );
    const projectLinks = extractRichText(
      findProp(props, ["Projects & Work", "Projects", "Project Links", "Work Highlights", "Past Work"])
    );
    const rawInterests = extractMultiSelect(
      findProp(props, ["Interests", "Focus Areas", "Fields of Interest"])
    );

    return {
      success: true,
      data: {
        id: p.id,
        fullName,
        rollNumber: rollNumber || phone || "N/A",
        email: email || "N/A",
        phone: phone || "N/A",
        branch,
        section,
        year,
        preferredWing,
        experienceLevel,
        timeCommitment,
        status,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        whyWds: whyWds || undefined,
        learningGoal: learningGoal || undefined,
        scenarioResponse: scenarioResponse || undefined,
        projectLinks: projectLinks || undefined,
        interests: rawInterests.length > 0 ? rawInterests : undefined,
        notes,
        createdAt: p.created_time,
      },
    };
  }

  public async checkDuplicateByPhone(phone: string): Promise<boolean> {
    const dbId = this.getDbId();
    if (!dbId) return false;

    try {
      const result = await queryDatabase(dbId, {
        filter: { property: "Phone", phone_number: { equals: phone } },
      });
      return result.success && result.data && result.data.length > 0;
    } catch {
      return false;
    }
  }

  public async create(input: {
    fullName: string;
    rollNumber: string;
    email: string;
    phone: string;
    branch: string;
    section: string;
    year?: string;
    preferredWing: string;
    experienceLevel: string;
    timeCommitment: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    notes?: string;
  }): Promise<NotionMutationResult<CandidateRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const properties: Record<string, any> = {
      "Full Name": buildTitle(input.fullName),
      "Enrollment Number": buildRichText(input.rollNumber),
      "College Email": buildEmail(input.email),
      Phone: buildPhone(input.phone),
      Branch: buildSelect(input.branch),
      Section: buildRichText(input.section),
      "Preferred Team": buildSelect(input.preferredWing),
      "Experience Level": buildSelect(input.experienceLevel),
      "Time Commitment": buildSelect(input.timeCommitment),
      Status: buildSelect("RECEIVED"),
    };

    if (input.year) properties["Year of Study"] = buildSelect(input.year);
    if (input.githubUrl) properties["GitHub URL"] = buildUrl(input.githubUrl);
    if (input.linkedinUrl) properties["LinkedIn URL"] = buildUrl(input.linkedinUrl);
    if (input.portfolioUrl) properties["Portfolio URL"] = buildUrl(input.portfolioUrl);
    if (input.notes) properties.Notes = buildRichText(input.notes);

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        fullName: input.fullName,
        rollNumber: input.rollNumber,
        email: input.email,
        phone: input.phone,
        branch: input.branch,
        section: input.section,
        year: input.year,
        preferredWing: input.preferredWing,
        experienceLevel: input.experienceLevel,
        timeCommitment: input.timeCommitment,
        status: "RECEIVED",
        githubUrl: input.githubUrl,
        linkedinUrl: input.linkedinUrl,
        portfolioUrl: input.portfolioUrl,
        notes: input.notes,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: {
      status?: string;
      notes?: string;
      preferredWing?: string;
    }
  ): Promise<NotionMutationResult<CandidateRecord>> {
    const dbId = this.getDbId();
    if (!dbId || id.startsWith("mock-") || id.startsWith("test-")) {
      return {
        success: true,
        data: { id, ...updates } as any,
        id,
      };
    }

    try {
      // First attempt to get the page to match exact Notion property schemas
      const pageRes = await getPage(id);
      const properties: Record<string, any> = {};

      if (pageRes.success && pageRes.data && pageRes.data.properties) {
        const pageProps = pageRes.data.properties;

        // 1. Status update
        if (updates.status !== undefined) {
          const statusPropKey = Object.keys(pageProps).find(
            (k) =>
              k.toLowerCase().replace(/[^a-z0-9]/g, "") === "status" ||
              k.toLowerCase().replace(/[^a-z0-9]/g, "") === "stage"
          );
          if (statusPropKey) {
            const propType = pageProps[statusPropKey]?.type;
            if (propType === "status") {
              properties[statusPropKey] = buildStatus(updates.status);
            } else {
              properties[statusPropKey] = buildSelect(updates.status);
            }
          } else {
            properties.Status = buildSelect(updates.status);
          }
        }

        // 2. Notes update
        if (updates.notes !== undefined) {
          const notesPropKey = Object.keys(pageProps).find((k) =>
            ["notes", "note", "scorecard", "evaluation", "comments", "submission"].includes(
              k.toLowerCase().replace(/[^a-z0-9]/g, "")
            )
          );
          if (notesPropKey) {
            properties[notesPropKey] = buildRichText(updates.notes);
          } else {
            properties.Notes = buildRichText(updates.notes);
          }
        }

        // 3. Preferred Wing update
        if (updates.preferredWing !== undefined) {
          const wingPropKey = Object.keys(pageProps).find((k) =>
            ["preferredteam", "preferredwing", "wing", "team"].includes(
              k.toLowerCase().replace(/[^a-z0-9]/g, "")
            )
          );
          if (wingPropKey) {
            const propType = pageProps[wingPropKey]?.type;
            if (propType === "multi_select") {
              properties[wingPropKey] = buildMultiSelect([updates.preferredWing]);
            } else {
              properties[wingPropKey] = buildSelect(updates.preferredWing);
            }
          } else {
            properties["Preferred Team"] = buildSelect(updates.preferredWing);
          }
        }
      } else {
        if (updates.status !== undefined) properties.Status = buildSelect(updates.status);
        if (updates.notes !== undefined) properties.Notes = buildRichText(updates.notes);
        if (updates.preferredWing !== undefined) properties["Preferred Team"] = buildSelect(updates.preferredWing);
      }

      const res = await updatePage(id, properties);
      if (!res.success) {
        console.error(`[CandidatesRepository.update Error on ${id}]:`, res.error);
        return {
          success: false,
          data: null as any,
          isOffline: res.isOffline,
          error: res.error,
        };
      }

      return {
        success: true,
        data: { id, ...updates } as any,
        id,
      };
    } catch (err: any) {
      console.error(`[CandidatesRepository.update Exception on ${id}]:`, err);
      return {
        success: false,
        data: null as any,
        error: err?.message || "UPDATE_FAILED",
      };
    }
  }
}

export const candidatesRepository = new CandidatesRepository();
export const candidateRepository = candidatesRepository;
