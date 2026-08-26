import { getNotionClient } from "@/lib/notion/client";
import { getNotionDatabaseId } from "@/lib/config/notionDatabases";
import { paginateNotionQuery } from "@/lib/notion/pagination";
import {
  extractTitle,
  extractDate,
  extractMultiSelect,
  extractRichText,
  buildTitle,
  buildDate,
  buildMultiSelect,
  buildRichText,
} from "@/lib/notion/properties";
import { RepositoryQueryResult } from "./types";
import { CreateMeetingInput } from "@/lib/validation/meeting";

export interface SocietyMeetingRecord {
  id: string;
  title: string;
  date: string;
  participants: string[];
  agenda: string;
  decisions?: string;
  actionItems?: string;
  project?: string;
  followUpDate?: string;
  createdAt?: string;
}

export interface IMeetingRepository {
  getMeetings(): Promise<RepositoryQueryResult<SocietyMeetingRecord[]>>;
  createMeeting(meeting: CreateMeetingInput): Promise<RepositoryQueryResult<SocietyMeetingRecord>>;
}

class NotionMeetingRepository implements IMeetingRepository {
  public async getMeetings(): Promise<RepositoryQueryResult<SocietyMeetingRecord[]>> {
    const dbId = getNotionDatabaseId("MEETINGS");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    const queryResult = await paginateNotionQuery(dbId, {
      maxRecords: 100,
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

    const meetings: SocietyMeetingRecord[] = queryResult.data.map((page: any, idx: number) => {
      const props = page.properties;
      const title = extractTitle(props.Title || props.Name, `Meeting #${idx + 1}`);
      const date = extractDate(props.Date, new Date(page.created_time).toISOString().split("T")[0]);
      const participants = extractMultiSelect(props.Participants);
      const agenda = extractRichText(props.Agenda, "");
      const decisions = extractRichText(props.Decisions, "");
      const actionItems = extractRichText(props["Action Items"], "");
      const project = extractRichText(props.Project, "General");
      const followUpDate = extractDate(props["Follow Up Date"], "");

      return {
        id: page.id,
        title,
        date,
        participants,
        agenda,
        decisions,
        actionItems,
        project,
        followUpDate,
        createdAt: page.created_time,
      };
    });

    return {
      success: true,
      data: meetings,
    };
  }

  public async createMeeting(meeting: CreateMeetingInput): Promise<RepositoryQueryResult<SocietyMeetingRecord>> {
    const dbId = getNotionDatabaseId("MEETINGS");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: meeting as any,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const properties: Record<string, any> = {
        Title: buildTitle(meeting.title),
        Date: buildDate(meeting.date),
        Participants: buildMultiSelect(meeting.participants),
        Agenda: buildRichText(meeting.agenda),
      };

      if (meeting.decisions) properties.Decisions = buildRichText(meeting.decisions);
      if (meeting.actionItems) properties["Action Items"] = buildRichText(meeting.actionItems);
      if (meeting.project) properties.Project = buildRichText(meeting.project);
      if (meeting.followUpDate) properties["Follow Up Date"] = buildDate(meeting.followUpDate);

      const response = await notion.pages.create({
        parent: { database_id: dbId },
        properties,
      });

      return {
        success: true,
        data: {
          id: response.id,
          ...meeting,
        },
      };
    } catch (err: any) {
      console.error("[MeetingRepository.createMeeting Error]:", err?.message || err);
      return {
        success: false,
        data: meeting as any,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }
}

export const meetingRepository: IMeetingRepository = new NotionMeetingRepository();
