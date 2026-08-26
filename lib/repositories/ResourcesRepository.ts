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
import { ResourceRecord } from "../types/resource";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export class ResourcesRepository {
  private getDbId(): string {
    return getNotionDatabaseId("RESOURCES");
  }

  public async getAll(options: { type?: string; search?: string } = {}): Promise<NotionQueryResult<ResourceRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.type) filters.push({ property: "Type", select: { equals: options.type } });
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

    const resources: ResourceRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const name = extractTitle(props.Name || props.Title, `Resource #${idx + 1}`);
      const type = (extractSelect(props.Type) || "DOCUMENTATION") as any;
      const url = extractUrl(props.URL, "#");
      const description = extractRichText(props.Description);
      const owner = extractRichText(props.Owner, "WDS Core");
      const projectRel = extractRelationIds(props.Project);

      return {
        id: p.id,
        name,
        type,
        url,
        description,
        owner,
        project: projectRel[0],
        projectId: projectRel[0],
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: resources,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<ResourceRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const name = extractTitle(props.Name || props.Title, "Untitled Resource");
    const type = (extractSelect(props.Type) || "DOCUMENTATION") as any;
    const url = extractUrl(props.URL, "#");
    const description = extractRichText(props.Description);
    const owner = extractRichText(props.Owner, "WDS Core");

    return {
      success: true,
      data: {
        id: p.id,
        name,
        type,
        url,
        description,
        owner,
        createdAt: p.created_time,
      },
    };
  }

  public async create(input: {
    name: string;
    type: string;
    url: string;
    description?: string;
    owner?: string;
    projectId?: string;
  }): Promise<NotionMutationResult<ResourceRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const properties: Record<string, any> = {
      Name: buildTitle(input.name),
      Type: buildSelect(input.type),
      URL: buildUrl(input.url),
      Owner: buildRichText(input.owner || "WDS Core"),
    };

    if (input.description) properties.Description = buildRichText(input.description);
    if (input.projectId && !input.projectId.startsWith("mock-")) properties.Project = buildRelation([input.projectId]);

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        name: input.name,
        type: input.type as any,
        url: input.url,
        description: input.description,
        owner: input.owner || "WDS Core",
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<ResourceRecord>
  ): Promise<NotionMutationResult<ResourceRecord>> {
    const properties: Record<string, any> = {};

    if (updates.name) properties.Name = buildTitle(updates.name);
    if (updates.type) properties.Type = buildSelect(updates.type);
    if (updates.url) properties.URL = buildUrl(updates.url);
    if (updates.description) properties.Description = buildRichText(updates.description);
    if (updates.owner) properties.Owner = buildRichText(updates.owner);

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

export const resourcesRepository = new ResourcesRepository();
export const resourceRepository = resourcesRepository;
