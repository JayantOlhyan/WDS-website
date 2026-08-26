import { getNotionClient } from "@/lib/notion/client";
import { getNotionDatabaseId } from "@/lib/config/notionDatabases";
import { paginateNotionQuery } from "@/lib/notion/pagination";
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
} from "@/lib/notion/properties";
import { RepositoryQueryResult } from "./types";
import { InterviewEvaluationInput, InterviewUpdateInput } from "@/lib/validation/interview";

export interface InterviewEvaluationRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  interviewer: string;
  round: "ROUND_1_TECHNICAL" | "ROUND_2_HR_CULTURE" | "ROUND_3_FINAL";
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  teamFitScore: number;
  overallScore: number;
  strengths: string;
  weaknesses: string;
  questionsAsked?: string;
  interviewNotes?: string;
  recommendation: "STRONG_HIRE" | "HIRE" | "LEAN_HIRE" | "LEAN_REJECT" | "REJECT";
  decisionStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "WAITLISTED";
  interviewDate: string;
  createdAt?: string;
}

export interface IInterviewRepository {
  getInterviews(candidateId?: string): Promise<RepositoryQueryResult<InterviewEvaluationRecord[]>>;
  createInterview(evaluation: InterviewEvaluationInput): Promise<RepositoryQueryResult<InterviewEvaluationRecord>>;
  updateInterview(id: string, updates: InterviewUpdateInput): Promise<RepositoryQueryResult<InterviewEvaluationRecord>>;
}

class NotionInterviewRepository implements IInterviewRepository {
  public async getInterviews(candidateId?: string): Promise<RepositoryQueryResult<InterviewEvaluationRecord[]>> {
    const dbId = getNotionDatabaseId("INTERVIEWS");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    const filter = candidateId
      ? {
          property: "Candidate",
          relation: { contains: candidateId },
        }
      : undefined;

    const queryResult = await paginateNotionQuery(dbId, {
      maxRecords: 300,
      filter,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!queryResult.success) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: queryResult.error,
      };
    }

    const records: InterviewEvaluationRecord[] = queryResult.data.map((page: any, idx: number) => {
      const props = page.properties;
      const candidateName = extractTitle(props["Candidate Name"] || props.Name, `Candidate #${idx + 1}`);
      const candidateRel = extractRelationIds(props.Candidate);
      const interviewer = extractRichText(props.Interviewer, "Interviewer");
      const round = (extractSelect(props["Interview Round"]) || "ROUND_1_TECHNICAL") as any;
      const technicalScore = extractNumber(props["Technical Score"], 5);
      const communicationScore = extractNumber(props["Communication Score"], 5);
      const problemSolvingScore = extractNumber(props["Problem Solving Score"], 5);
      const teamFitScore = extractNumber(props["Team Fit Score"], 5);
      const overallScore = extractNumber(
        props["Overall Score"],
        Math.round(((technicalScore + communicationScore + problemSolvingScore + teamFitScore) / 4) * 10) / 10
      );
      const strengths = extractRichText(props.Strengths, "");
      const weaknesses = extractRichText(props.Weaknesses, "");
      const questionsAsked = extractRichText(props["Questions Asked"], "");
      const interviewNotes = extractRichText(props["Interview Notes"], "");
      const recommendation = (extractSelect(props.Recommendation) || "LEAN_HIRE") as any;
      const decisionStatus = (extractSelect(props["Decision Status"]) || "PENDING") as any;
      const interviewDate = extractDate(props["Interview Date"], new Date(page.created_time).toISOString().split("T")[0]);

      return {
        id: page.id,
        candidateId: candidateRel[0] || "",
        candidateName,
        interviewer,
        round,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        teamFitScore,
        overallScore,
        strengths,
        weaknesses,
        questionsAsked,
        interviewNotes,
        recommendation,
        decisionStatus,
        interviewDate,
        createdAt: page.created_time,
      };
    });

    return {
      success: true,
      data: records,
    };
  }

  public async createInterview(
    evaluation: InterviewEvaluationInput
  ): Promise<RepositoryQueryResult<InterviewEvaluationRecord>> {
    const dbId = getNotionDatabaseId("INTERVIEWS");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: evaluation as any,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const computedOverall =
        evaluation.overallScore ||
        Math.round(
          ((evaluation.technicalScore +
            evaluation.communicationScore +
            evaluation.problemSolvingScore +
            evaluation.teamFitScore) /
            4) *
            10
        ) / 10;

      const properties: Record<string, any> = {
        "Candidate Name": buildTitle(evaluation.candidateName),
        Interviewer: buildRichText(evaluation.interviewer),
        "Interview Round": buildSelect(evaluation.round),
        "Technical Score": buildNumber(evaluation.technicalScore),
        "Communication Score": buildNumber(evaluation.communicationScore),
        "Problem Solving Score": buildNumber(evaluation.problemSolvingScore),
        "Team Fit Score": buildNumber(evaluation.teamFitScore),
        "Overall Score": buildNumber(computedOverall),
        Strengths: buildRichText(evaluation.strengths),
        Weaknesses: buildRichText(evaluation.weaknesses),
        Recommendation: buildSelect(evaluation.recommendation),
        "Decision Status": buildSelect(evaluation.decisionStatus || "PENDING"),
        "Interview Date": buildDate(evaluation.interviewDate),
      };

      if (evaluation.questionsAsked) {
        properties["Questions Asked"] = buildRichText(evaluation.questionsAsked);
      }
      if (evaluation.interviewNotes) {
        properties["Interview Notes"] = buildRichText(evaluation.interviewNotes);
      }
      if (evaluation.candidateId && !evaluation.candidateId.startsWith("mock-")) {
        properties.Candidate = buildRelation([evaluation.candidateId]);
      }

      const response = await notion.pages.create({
        parent: { database_id: dbId },
        properties,
      });

      return {
        success: true,
        data: {
          id: response.id,
          ...evaluation,
          overallScore: computedOverall,
        },
      };
    } catch (err: any) {
      console.error("[InterviewRepository.createInterview Error]:", err?.message || err);
      return {
        success: false,
        data: evaluation as any,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }

  public async updateInterview(
    id: string,
    updates: InterviewUpdateInput
  ): Promise<RepositoryQueryResult<InterviewEvaluationRecord>> {
    const notion = getNotionClient();
    if (!notion) {
      return {
        success: false,
        data: updates as any,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const properties: Record<string, any> = {};

      if (updates.decisionStatus) properties["Decision Status"] = buildSelect(updates.decisionStatus);
      if (updates.recommendation) properties.Recommendation = buildSelect(updates.recommendation);
      if (updates.interviewNotes) properties["Interview Notes"] = buildRichText(updates.interviewNotes);
      if (updates.technicalScore !== undefined) properties["Technical Score"] = buildNumber(updates.technicalScore);
      if (updates.communicationScore !== undefined) properties["Communication Score"] = buildNumber(updates.communicationScore);
      if (updates.problemSolvingScore !== undefined) properties["Problem Solving Score"] = buildNumber(updates.problemSolvingScore);
      if (updates.teamFitScore !== undefined) properties["Team Fit Score"] = buildNumber(updates.teamFitScore);
      if (updates.overallScore !== undefined) properties["Overall Score"] = buildNumber(updates.overallScore);

      await notion.pages.update({
        page_id: id,
        properties,
      });

      return {
        success: true,
        data: { id, ...updates } as any,
      };
    } catch (err: any) {
      console.error("[InterviewRepository.updateInterview Error]:", err?.message || err);
      return {
        success: false,
        data: { id, ...updates } as any,
        error: "DATABASE_UPDATE_FAILED",
      };
    }
  }
}

export const interviewRepository: IInterviewRepository = new NotionInterviewRepository();
