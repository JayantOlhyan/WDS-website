import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractSelect,
  extractUrl,
  extractRichText,
  extractRelationIds,
  buildTitle,
  buildSelect,
  buildUrl,
  buildRichText,
  buildRelation,
} from "../notion/properties";
import { AssetRecord } from "../types/asset";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export class AssetsRepository {
  private getDbId(): string {
    return getNotionDatabaseId("ASSETS");
  }

  public async getAll(options: { category?: string; search?: string } = {}): Promise<NotionQueryResult<AssetRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.category) filters.push({ property: "Category", select: { equals: options.category } });
    if (options.search) filters.push({ property: "Name", title: { contains: options.search } });

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 150,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const assets: AssetRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const name = extractTitle(props.Name || props.Title, `Asset #${idx + 1}`);
      const type = (extractSelect(props.Type || props.Format) || "PNG") as any;
      const category = (extractSelect(props.Category) || "BRAND") as any;
      const url = extractUrl(props.URL, "#");
      const owner = extractRichText(props.Owner, "WDS Design");
      const version = extractRichText(props.Version, "1.0");
      const description = extractRichText(props.Description || props.Notes);
      const projectRel = extractRelationIds(props.Project);
      const eventRel = extractRelationIds(props.Event);

      return {
        id: p.id,
        name,
        type,
        category,
        url,
        owner,
        version,
        description,
        project: projectRel[0],
        projectId: projectRel[0],
        event: eventRel[0],
        eventId: eventRel[0],
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: assets,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<AssetRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const name = extractTitle(props.Name || props.Title, "Untitled Asset");
    const type = (extractSelect(props.Type || props.Format) || "PNG") as any;
    const category = (extractSelect(props.Category) || "BRAND") as any;
    const url = extractUrl(props.URL, "#");
    const owner = extractRichText(props.Owner, "WDS Design");
    const version = extractRichText(props.Version, "1.0");
    const description = extractRichText(props.Description || props.Notes);

    return {
      success: true,
      data: {
        id: p.id,
        name,
        type,
        category,
        url,
        owner,
        version,
        description,
        createdAt: p.created_time,
      },
    };
  }

  public async create(input: {
    name: string;
    type?: string;
    category: string;
    url: string;
    owner?: string;
    version?: string;
    description?: string;
    projectId?: string;
    eventId?: string;
  }): Promise<NotionMutationResult<AssetRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const properties: Record<string, any> = {
      Name: buildTitle(input.name),
      Category: buildSelect(input.category),
      Type: buildSelect(input.type || "PNG"),
      URL: buildUrl(input.url),
      Owner: buildRichText(input.owner || "WDS Design"),
    };

    if (input.version) properties.Version = buildRichText(input.version);
    if (input.description) properties.Description = buildRichText(input.description);
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
        name: input.name,
        type: (input.type || "PNG") as any,
        category: input.category as any,
        url: input.url,
        owner: input.owner || "WDS Design",
        version: input.version,
        description: input.description,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<AssetRecord>
  ): Promise<NotionMutationResult<AssetRecord>> {
    const properties: Record<string, any> = {};

    if (updates.name) properties.Name = buildTitle(updates.name);
    if (updates.category) properties.Category = buildSelect(updates.category);
    if (updates.type) properties.Type = buildSelect(updates.type);
    if (updates.url) properties.URL = buildUrl(updates.url);
    if (updates.owner) properties.Owner = buildRichText(updates.owner);
    if (updates.version) properties.Version = buildRichText(updates.version);
    if (updates.description) properties.Description = buildRichText(updates.description);

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
  public async getAssets() {
    return this.getAll();
  }

  public async createAsset(input: any) {
    return this.create(input);
  }
}

export const assetsRepository = new AssetsRepository();
export const assetRepository = assetsRepository;
