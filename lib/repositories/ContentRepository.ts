import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractDate,
  extractUrl,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildDate,
  buildUrl,
  buildRelation,
} from "../notion/properties";
import { ContentRecord } from "../types/content";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export type ContentWorkflowStage = "IDEA" | "DRAFT" | "REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type SocietyContentItem = ContentRecord;

export class ContentRepository {
  private getDbId(): string {
    return getNotionDatabaseId("CONTENT");
  }

  public async getAll(options: { status?: string; platform?: string; search?: string } = {}): Promise<NotionQueryResult<ContentRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.status) filters.push({ property: "Status", select: { equals: options.status } });
    if (options.platform) filters.push({ property: "Platform", select: { equals: options.platform } });
    if (options.search) filters.push({ property: "Title", title: { contains: options.search } });

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 150,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const items: ContentRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const title = extractTitle(props.Title || props.Name, `Content #${idx + 1}`);
      const type = (extractSelect(props.Type || props.ContentType) || "POST") as any;
      const platform = (extractSelect(props.Platform) || "INSTAGRAM") as any;
      const rawStatus = (extractSelect(props.Status || props.Stage) || "DRAFT") as any;
      const status: ContentWorkflowStage = ["IDEA", "DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"].includes(rawStatus)
        ? rawStatus
        : "DRAFT";
      const author = extractRichText(props.Author, "WDS Content Lead");
      const publishDate = extractDate(props["Publish Date"] || props.ScheduledDate);
      const url = extractUrl(props.URL || props["Asset URL"]);
      const caption = extractRichText(props.Caption);
      const notes = extractRichText(props.Notes);
      const projectRel = extractRelationIds(props.Project);
      const eventRel = extractRelationIds(props.Event);

      return {
        id: p.id,
        title,
        type,
        platform,
        status,
        stage: status,
        author,
        project: projectRel[0],
        projectId: projectRel[0],
        event: eventRel[0],
        eventId: eventRel[0],
        publishDate,
        url,
        caption,
        notes,
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: items,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<ContentRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const title = extractTitle(props.Title || props.Name, "Untitled Content");
    const type = (extractSelect(props.Type) || "POST") as any;
    const platform = (extractSelect(props.Platform) || "INSTAGRAM") as any;
    const rawStatus = (extractSelect(props.Status || props.Stage) || "DRAFT") as any;
    const status: ContentWorkflowStage = ["IDEA", "DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"].includes(rawStatus)
      ? rawStatus
      : "DRAFT";
    const author = extractRichText(props.Author, "WDS Content Lead");
    const publishDate = extractDate(props["Publish Date"]);
    const url = extractUrl(props.URL);
    const caption = extractRichText(props.Caption);
    const notes = extractRichText(props.Notes);

    return {
      success: true,
      data: {
        id: p.id,
        title,
        type,
        platform,
        status,
        stage: status,
        author,
        publishDate,
        url,
        caption,
        notes,
        createdAt: p.created_time,
      },
    };
  }

  public async create(input: {
    title: string;
    type?: string;
    platform: string;
    status?: string;
    stage?: string;
    author?: string;
    projectId?: string;
    eventId?: string;
    publishDate?: string;
    url?: string;
    caption?: string;
    notes?: string;
  }): Promise<NotionMutationResult<ContentRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const stageValue = input.status || input.stage || "DRAFT";
    const properties: Record<string, any> = {
      Title: buildTitle(input.title),
      Platform: buildSelect(input.platform),
      Type: buildSelect(input.type || "POST"),
      Status: buildSelect(stageValue),
      Author: buildRichText(input.author || "WDS Content Lead"),
    };

    if (input.publishDate) properties["Publish Date"] = buildDate(input.publishDate);
    if (input.url) properties.URL = buildUrl(input.url);
    if (input.caption) properties.Caption = buildRichText(input.caption);
    if (input.notes) properties.Notes = buildRichText(input.notes);
    if (input.projectId && !input.projectId.startsWith("mock-")) properties.Project = buildRelation([input.projectId]);
    if (input.eventId && !input.eventId.startsWith("mock-")) properties.Event = buildRelation([input.eventId]);

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        title: input.title,
        type: (input.type || "POST") as any,
        platform: input.platform as any,
        status: stageValue as any,
        stage: stageValue as any,
        author: input.author || "WDS Content Lead",
        publishDate: input.publishDate,
        url: input.url,
        caption: input.caption,
        notes: input.notes,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<ContentRecord>
  ): Promise<NotionMutationResult<ContentRecord>> {
    const properties: Record<string, any> = {};

    if (updates.title) properties.Title = buildTitle(updates.title);
    if (updates.platform) properties.Platform = buildSelect(updates.platform);
    if (updates.type) properties.Type = buildSelect(updates.type);
    if (updates.status || updates.stage) properties.Status = buildSelect((updates.status || updates.stage)!);
    if (updates.author) properties.Author = buildRichText(updates.author);
    if (updates.publishDate) properties["Publish Date"] = buildDate(updates.publishDate);
    if (updates.url) properties.URL = buildUrl(updates.url);
    if (updates.caption) properties.Caption = buildRichText(updates.caption);

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

  // Compatibility methods
  public async getContentItems() {
    const res = await this.getAll();
    return res.data;
  }

  public async createContentItem(input: any) {
    const res = await this.create(input);
    return res.data;
  }

  public async updateContentStage(id: string, stage: string) {
    const res = await this.update(id, { status: stage as any });
    return res.data;
  }
}

export const contentRepository = new ContentRepository();
export const contentsRepository = contentRepository;
