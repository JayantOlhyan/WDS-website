import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractUrl,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildUrl,
  buildRelation,
} from "../notion/properties";
import { BugRecord } from "../types/bug";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export interface BugFilterOptions {
  severity?: string;
  priority?: string;
  status?: string;
  project?: string;
  assignee?: string;
  source?: string;
  search?: string;
}

export class BugsRepository {
  private getDbId(): string {
    return getNotionDatabaseId("BUGS");
  }

  public async getAll(options: BugFilterOptions = {}): Promise<NotionQueryResult<BugRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.severity) filters.push({ property: "Severity", select: { equals: options.severity } });
    if (options.priority) filters.push({ property: "Priority", select: { equals: options.priority } });
    if (options.status) filters.push({ property: "Status", select: { equals: options.status } });
    if (options.assignee) filters.push({ property: "Assignee", rich_text: { contains: options.assignee } });
    if (options.search) filters.push({ property: "Title", title: { contains: options.search } });

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 300,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const bugs: BugRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const title = extractTitle(props.Title || props.Name, `Bug #${idx + 1}`);
      const description = extractRichText(props.Description);
      const url = extractUrl(props.URL || props.Website);
      const rawSeverity = (extractSelect(props.Severity) || "MEDIUM") as any;
      const rawPriority = (extractSelect(props.Priority) || "P2") as any;
      const rawStatus = (extractSelect(props.Status) || "OPEN") as any;
      const projectRel = extractRelationIds(props.Project);
      const project = extractRichText(props.ProjectName) || (projectRel[0] ? `Project (${projectRel[0].slice(0, 6)})` : "msit.in");
      const assignee = extractRichText(props.Assignee || props.AssignedTo);
      const reporter = extractRichText(props.Reporter, "anonymous_hunter");
      const source = extractSelect(props.Source) || "MANUAL";
      const externalId = extractRichText(props["External ID"] || props.ExternalId);

      return {
        id: p.id,
        title,
        description,
        url,
        severity: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(rawSeverity) ? rawSeverity : "MEDIUM",
        priority: ["P0", "P1", "P2", "P3"].includes(rawPriority) ? rawPriority : "P2",
        status: ["OPEN", "TRIAGED", "IN_PROGRESS", "RESOLVED", "DUPLICATE", "INVALID"].includes(rawStatus) ? rawStatus : "OPEN",
        project,
        projectId: projectRel[0],
        assignee,
        reporter,
        source,
        externalId,
        reportedAt: new Date(p.created_time).toLocaleDateString(),
      };
    });

    return {
      success: true,
      data: bugs,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<BugRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const title = extractTitle(props.Title || props.Name, "Untitled Bug");
    const description = extractRichText(props.Description);
    const url = extractUrl(props.URL || props.Website);
    const severity = (extractSelect(props.Severity) || "MEDIUM") as any;
    const priority = (extractSelect(props.Priority) || "P2") as any;
    const status = (extractSelect(props.Status) || "OPEN") as any;
    const projectRel = extractRelationIds(props.Project);
    const project = extractRichText(props.ProjectName) || "msit.in";
    const assignee = extractRichText(props.Assignee || props.AssignedTo);
    const reporter = extractRichText(props.Reporter, "anonymous_hunter");

    return {
      success: true,
      data: {
        id: p.id,
        title,
        description,
        url,
        severity,
        priority,
        status,
        project,
        projectId: projectRel[0],
        assignee,
        reporter,
        reportedAt: new Date(p.created_time).toLocaleDateString(),
      },
    };
  }

  public async create(input: {
    title: string;
    description?: string;
    url?: string;
    severity?: string;
    priority?: string;
    status?: string;
    project?: string;
    projectId?: string;
    assignee?: string;
    reporter: string;
    source?: string;
    externalId?: string;
    reproductionSteps?: string;
  }): Promise<NotionMutationResult<BugRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const properties: Record<string, any> = {
      Title: buildTitle(input.title),
      Severity: buildSelect(input.severity || "MEDIUM"),
      Priority: buildSelect(input.priority || "P2"),
      Status: buildSelect(input.status || "OPEN"),
      Reporter: buildRichText(input.reporter || "anonymous_hunter"),
    };

    if (input.description) properties.Description = buildRichText(input.description);
    if (input.url) properties.URL = buildUrl(input.url);
    if (input.assignee) properties.Assignee = buildRichText(input.assignee);
    if (input.source) properties.Source = buildSelect(input.source);
    if (input.externalId) properties["External ID"] = buildRichText(input.externalId);
    if (input.projectId && !input.projectId.startsWith("mock-")) {
      properties.Project = buildRelation([input.projectId]);
    } else if (input.project) {
      properties.Website = buildRichText(input.project);
    }

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        title: input.title,
        description: input.description,
        url: input.url,
        severity: (input.severity || "MEDIUM") as any,
        priority: (input.priority || "P2") as any,
        status: (input.status || "OPEN") as any,
        project: input.project || "msit.in",
        projectId: input.projectId,
        assignee: input.assignee,
        reporter: input.reporter,
        source: input.source,
        externalId: input.externalId,
        reportedAt: new Date().toLocaleDateString(),
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<BugRecord>
  ): Promise<NotionMutationResult<BugRecord>> {
    const properties: Record<string, any> = {};

    if (updates.title) properties.Title = buildTitle(updates.title);
    if (updates.description) properties.Description = buildRichText(updates.description);
    if (updates.severity) properties.Severity = buildSelect(updates.severity);
    if (updates.priority) properties.Priority = buildSelect(updates.priority);
    if (updates.status) properties.Status = buildSelect(updates.status);
    if (updates.assignee) properties.Assignee = buildRichText(updates.assignee);
    if (updates.url) properties.URL = buildUrl(updates.url);
    if (updates.resolutionNotes) properties["Resolution Notes"] = buildRichText(updates.resolutionNotes);

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

export const bugsRepository = new BugsRepository();
export const bugRepository = bugsRepository;
