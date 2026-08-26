import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractNumber,
  extractDate,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildNumber,
  buildDate,
  buildRelation,
} from "../notion/properties";
import { InterviewRecord } from "../types/interview";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export interface InterviewFilterOptions {
  candidateId?: string;
  interviewer?: string;
  round?: string;
  recommendation?: string;
  date?: string;
}

export class InterviewsRepository {
  private getDbId(): string {
    return getNotionDatabaseId("INTERVIEWS");
  }

  public async getAll(options: InterviewFilterOptions = {}): Promise<NotionQueryResult<InterviewRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.candidateId) {
      filters.push({ property: "Candidate", relation: { contains: options.candidateId } });
    }
    if (options.round) {
      filters.push({ property: "Interview Round", select: { equals: options.round } });
    }
    if (options.recommendation) {
      filters.push({ property: "Recommendation", select: { equals: options.recommendation } });
    }
    if (options.interviewer) {
      filters.push({ property: "Interviewer", rich_text: { contains: options.interviewer } });
    }

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 200,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const records: InterviewRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const candidateName = extractTitle(props["Candidate Name"] || props.Name, `Candidate #${idx + 1}`);
      const candidateRel = extractRelationIds(props.Candidate);
      const interviewer = extractRichText(props.Interviewer, "Interviewer");
      const round = (extractSelect(props["Interview Round"]) || "ROUND_1_TECHNICAL") as any;
      const technicalScore = extractNumber(props["Technical Score"] || props.Technical, 5);
      const communicationScore = extractNumber(props["Communication Score"] || props.Communication, 5);
      const problemSolvingScore = extractNumber(props["Problem Solving Score"] || props.ProblemSolving, 5);
      const teamFitScore = extractNumber(props["Team Fit Score"] || props.TeamFit, 5);
      const overallScore = extractNumber(
        props["Overall Score"] || props.OverallScore,
        Math.round(((technicalScore + communicationScore + problemSolvingScore + teamFitScore) / 4) * 10) / 10
      );
      const strengths = extractRichText(props.Strengths);
      const weaknesses = extractRichText(props.Weaknesses);
      const questionsAsked = extractRichText(props["Questions Asked"]);
      const recommendation = (extractSelect(props.Recommendation) || "LEAN_HIRE") as any;
      const decisionStatus = (extractSelect(props["Decision Status"]) || "PENDING") as any;
      const date = extractDate(props["Interview Date"] || props.Date, new Date(p.created_time).toISOString().split("T")[0]);
      const notes = extractRichText(props["Interview Notes"] || props.Notes);

      return {
        id: p.id,
        candidateId: candidateRel[0] || "",
        candidateName,
        interviewer,
        round,
        date,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        teamFitScore,
        overallScore,
        strengths,
        weaknesses,
        questionsAsked,
        recommendation,
        decisionStatus,
        notes,
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: records,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<InterviewRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const candidateName = extractTitle(props["Candidate Name"] || props.Name, "Untitled Candidate");
    const candidateRel = extractRelationIds(props.Candidate);
    const interviewer = extractRichText(props.Interviewer, "Interviewer");
    const round = (extractSelect(props["Interview Round"]) || "ROUND_1_TECHNICAL") as any;
    const technicalScore = extractNumber(props["Technical Score"], 5);
    const communicationScore = extractNumber(props["Communication Score"], 5);
    const problemSolvingScore = extractNumber(props["Problem Solving Score"], 5);
    const teamFitScore = extractNumber(props["Team Fit Score"], 5);
    const overallScore = extractNumber(props["Overall Score"], 5);
    const strengths = extractRichText(props.Strengths);
    const weaknesses = extractRichText(props.Weaknesses);
    const questionsAsked = extractRichText(props["Questions Asked"]);
    const recommendation = (extractSelect(props.Recommendation) || "LEAN_HIRE") as any;
    const decisionStatus = (extractSelect(props["Decision Status"]) || "PENDING") as any;
    const date = extractDate(props["Interview Date"], new Date(p.created_time).toISOString().split("T")[0]);
    const notes = extractRichText(props["Interview Notes"] || props.Notes);

    return {
      success: true,
      data: {
        id: p.id,
        candidateId: candidateRel[0] || "",
        candidateName,
        interviewer,
        round,
        date,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        teamFitScore,
        overallScore,
        strengths,
        weaknesses,
        questionsAsked,
        recommendation,
        decisionStatus,
        notes,
        createdAt: p.created_time,
      },
    };
  }

  public async create(input: {
    candidateId?: string;
    candidateName: string;
    interviewer: string;
    round: string;
    date: string;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    teamFitScore: number;
    overallScore?: number;
    strengths: string;
    weaknesses: string;
    questionsAsked?: string;
    recommendation: string;
    decisionStatus?: string;
    notes?: string;
  }): Promise<NotionMutationResult<InterviewRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const computedOverall =
      input.overallScore ||
      Math.round(
        (input.technicalScore * 0.35 +
          input.problemSolvingScore * 0.3 +
          input.communicationScore * 0.2 +
          input.teamFitScore * 0.15) *
          10
      ) / 10;

    const properties: Record<string, any> = {
      "Candidate Name": buildTitle(input.candidateName),
      Interviewer: buildRichText(input.interviewer),
      "Interview Round": buildSelect(input.round),
      "Technical Score": buildNumber(input.technicalScore),
      "Communication Score": buildNumber(input.communicationScore),
      "Problem Solving Score": buildNumber(input.problemSolvingScore),
      "Team Fit Score": buildNumber(input.teamFitScore),
      "Overall Score": buildNumber(computedOverall),
      Strengths: buildRichText(input.strengths),
      Weaknesses: buildRichText(input.weaknesses),
      Recommendation: buildSelect(input.recommendation),
      "Decision Status": buildSelect(input.decisionStatus || "PENDING"),
      "Interview Date": buildDate(input.date),
    };

    if (input.questionsAsked) properties["Questions Asked"] = buildRichText(input.questionsAsked);
    if (input.notes) properties["Interview Notes"] = buildRichText(input.notes);
    if (input.candidateId && !input.candidateId.startsWith("mock-")) {
      properties.Candidate = buildRelation([input.candidateId]);
    }

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        ...input,
        overallScore: computedOverall,
        round: input.round as any,
        recommendation: input.recommendation as any,
        decisionStatus: (input.decisionStatus || "PENDING") as any,
        candidateId: input.candidateId || "",
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<InterviewRecord>
  ): Promise<NotionMutationResult<InterviewRecord>> {
    const properties: Record<string, any> = {};

    if (updates.decisionStatus) properties["Decision Status"] = buildSelect(updates.decisionStatus);
    if (updates.recommendation) properties.Recommendation = buildSelect(updates.recommendation);
    if (updates.notes) properties["Interview Notes"] = buildRichText(updates.notes);
    if (updates.technicalScore !== undefined) properties["Technical Score"] = buildNumber(updates.technicalScore);
    if (updates.communicationScore !== undefined) properties["Communication Score"] = buildNumber(updates.communicationScore);
    if (updates.problemSolvingScore !== undefined) properties["Problem Solving Score"] = buildNumber(updates.problemSolvingScore);
    if (updates.teamFitScore !== undefined) properties["Team Fit Score"] = buildNumber(updates.teamFitScore);
    if (updates.overallScore !== undefined) properties["Overall Score"] = buildNumber(updates.overallScore);

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

  public async archive(id: string): Promise<NotionMutationResult<boolean>> {
    return archivePage(id);
  }
}

export const interviewsRepository = new InterviewsRepository();
export const interviewRepository = interviewsRepository;
