import { queryDatabase, createPage, updatePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractEmail,
  extractPhone,
  extractUrl,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
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
      const props = p.properties;
      const fullName = extractTitle(props["Full Name"] || props.Name, `Candidate #${idx + 1}`);
      const rollNumber = extractRichText(props["Enrollment Number"] || props["Roll Number"] || props.RollNo);
      const email = extractEmail(props["College Email"] || props.Email);
      const phone = extractPhone(props.Phone || props.PhoneNumber);
      const branch = extractSelect(props.Branch) || "CSE";
      const section = extractRichText(props.Section) || "A";
      const year = extractSelect(props.Year) || "1st Year";
      const preferredWing = extractSelect(props["Preferred Team"] || props["Preferred Wing"]) || "Technical Wing";
      const experienceLevel = extractSelect(props["Experience Level"]) || "Beginner";
      const timeCommitment = extractSelect(props["Time Commitment"]) || "4-8 hrs";
      const status = (extractSelect(props.Status) || "RECEIVED") as any;
      const githubUrl = extractUrl(props["GitHub URL"] || props.GitHub);
      const linkedinUrl = extractUrl(props["LinkedIn URL"] || props.LinkedIn);
      const portfolioUrl = extractUrl(props["Portfolio URL"] || props.Portfolio);
      const notes = extractRichText(props.Notes);
      const interviewsRel = extractRelationIds(props.Interviews);

      return {
        id: p.id,
        fullName,
        rollNumber,
        email,
        phone,
        branch,
        section,
        year,
        preferredWing,
        experienceLevel,
        timeCommitment,
        status: ["RECEIVED", "SCREENING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].includes(status) ? status : "RECEIVED",
        githubUrl,
        linkedinUrl,
        portfolioUrl,
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
    const props = p.properties;
    const fullName = extractTitle(props["Full Name"] || props.Name, "Untitled Candidate");
    const rollNumber = extractRichText(props["Enrollment Number"] || props["Roll Number"]);
    const email = extractEmail(props["College Email"] || props.Email);
    const phone = extractPhone(props.Phone);
    const branch = extractSelect(props.Branch) || "CSE";
    const section = extractRichText(props.Section) || "A";
    const preferredWing = extractSelect(props["Preferred Team"] || props["Preferred Wing"]) || "Technical Wing";
    const experienceLevel = extractSelect(props["Experience Level"]) || "Beginner";
    const timeCommitment = extractSelect(props["Time Commitment"]) || "4-8 hrs";
    const status = (extractSelect(props.Status) || "RECEIVED") as any;
    const githubUrl = extractUrl(props["GitHub URL"] || props.GitHub);
    const linkedinUrl = extractUrl(props["LinkedIn URL"] || props.LinkedIn);
    const portfolioUrl = extractUrl(props["Portfolio URL"] || props.Portfolio);
    const notes = extractRichText(props.Notes);

    return {
      success: true,
      data: {
        id: p.id,
        fullName,
        rollNumber,
        email,
        phone,
        branch,
        section,
        preferredWing,
        experienceLevel,
        timeCommitment,
        status,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        notes,
        createdAt: p.created_time,
      },
    };
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

    if (input.year) properties.Year = buildSelect(input.year);
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
    const properties: Record<string, any> = {};

    if (updates.status !== undefined) properties.Status = buildSelect(updates.status);
    if (updates.notes !== undefined) properties.Notes = buildRichText(updates.notes);
    if (updates.preferredWing !== undefined) properties["Preferred Team"] = buildSelect(updates.preferredWing);

    const res = await updatePage(id, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: { id, ...updates } as any,
      id,
    };
  }
}

export const candidatesRepository = new CandidatesRepository();
export const candidateRepository = candidatesRepository;
