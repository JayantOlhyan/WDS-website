import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractDate,
  extractUrl,
  extractNumber,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildDate,
  buildUrl,
  buildNumber,
  buildRelation,
} from "../notion/properties";
import { EventRecord } from "../types/event";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export type EventLifecycleStage = "IDEA" | "PLANNING" | "ANNOUNCED" | "REGISTRATION" | "LIVE" | "COMPLETED" | "ARCHIVED";
export type SocietyEvent = EventRecord;

export class EventsRepository {
  private getDbId(): string {
    return getNotionDatabaseId("EVENTS");
  }

  public async getAll(options: { status?: string; search?: string } = {}): Promise<NotionQueryResult<EventRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.status) filters.push({ property: "Status", select: { equals: options.status } });
    if (options.search) filters.push({ property: "Name", title: { contains: options.search } });

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 100,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const events: EventRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const name = extractTitle(props.Name || props.Title, `Event #${idx + 1}`);
      const description = extractRichText(props.Description);
      const rawStatus = (extractSelect(props.Status || props.Stage) || "PLANNING") as any;
      const status: EventLifecycleStage = ["IDEA", "PLANNING", "ANNOUNCED", "REGISTRATION", "LIVE", "COMPLETED", "ARCHIVED"].includes(rawStatus)
        ? rawStatus
        : "PLANNING";
      const date = extractDate(props.Date, new Date(p.created_time).toISOString().split("T")[0]);
      const venue = extractRichText(props.Venue, "MSIT Campus");
      const lead = extractRichText(props.Lead, "WDS Events Lead");
      const registrationUrl = extractUrl(props["Registration URL"] || props.RegistrationLink);
      const expectedAttendance = extractNumber(props["Expected Attendance"] || props.Attendance, 50);
      const projectRel = extractRelationIds(props.Project);

      return {
        id: p.id,
        name,
        title: name,
        description,
        status,
        stage: status,
        date,
        venue,
        lead,
        project: projectRel[0],
        projectId: projectRel[0],
        registrationUrl,
        expectedAttendance,
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: events,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<EventRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const name = extractTitle(props.Name || props.Title, "Untitled Event");
    const description = extractRichText(props.Description);
    const rawStatus = (extractSelect(props.Status || props.Stage) || "PLANNING") as any;
    const status: EventLifecycleStage = ["IDEA", "PLANNING", "ANNOUNCED", "REGISTRATION", "LIVE", "COMPLETED", "ARCHIVED"].includes(rawStatus)
      ? rawStatus
      : "PLANNING";
    const date = extractDate(props.Date, new Date(p.created_time).toISOString().split("T")[0]);
    const venue = extractRichText(props.Venue, "MSIT Campus");
    const lead = extractRichText(props.Lead, "WDS Events Lead");
    const registrationUrl = extractUrl(props["Registration URL"] || props.RegistrationLink);

    return {
      success: true,
      data: {
        id: p.id,
        name,
        title: name,
        description,
        status,
        stage: status,
        date,
        venue,
        lead,
        registrationUrl,
        createdAt: p.created_time,
      },
    };
  }

  public async create(input: {
    name: string;
    description: string;
    status?: string;
    stage?: string;
    date: string;
    venue: string;
    lead?: string;
    projectId?: string;
    registrationUrl?: string;
    expectedAttendance?: number;
  }): Promise<NotionMutationResult<EventRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const stageValue = input.status || input.stage || "PLANNING";
    const properties: Record<string, any> = {
      Name: buildTitle(input.name),
      Description: buildRichText(input.description),
      Status: buildSelect(stageValue),
      Date: buildDate(input.date),
      Venue: buildRichText(input.venue),
      Lead: buildRichText(input.lead || "WDS Events Lead"),
    };

    if (input.registrationUrl) properties["Registration URL"] = buildUrl(input.registrationUrl);
    if (input.expectedAttendance) properties["Expected Attendance"] = buildNumber(input.expectedAttendance);
    if (input.projectId && !input.projectId.startsWith("mock-")) {
      properties.Project = buildRelation([input.projectId]);
    }

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        name: input.name,
        title: input.name,
        description: input.description,
        status: stageValue as any,
        stage: stageValue as any,
        date: input.date,
        venue: input.venue,
        lead: input.lead || "WDS Events Lead",
        registrationUrl: input.registrationUrl,
        expectedAttendance: input.expectedAttendance,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<EventRecord>
  ): Promise<NotionMutationResult<EventRecord>> {
    const properties: Record<string, any> = {};

    if (updates.name || updates.title) properties.Name = buildTitle((updates.name || updates.title)!);
    if (updates.description) properties.Description = buildRichText(updates.description);
    if (updates.status || updates.stage) properties.Status = buildSelect((updates.status || updates.stage)!);
    if (updates.date) properties.Date = buildDate(updates.date);
    if (updates.venue) properties.Venue = buildRichText(updates.venue);
    if (updates.lead) properties.Lead = buildRichText(updates.lead);
    if (updates.registrationUrl) properties["Registration URL"] = buildUrl(updates.registrationUrl);

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

export const eventsRepository = new EventsRepository();
export const eventRepository = eventsRepository;
