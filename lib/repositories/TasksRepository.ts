import { getNotionClient, queryDatabase, createPage, updatePage, archivePage, getPage, addCommentBlock } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractStatus,
  extractMultiSelect,
  extractDate,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildMultiSelect,
  buildDate,
  buildRelation,
} from "../notion/properties";
import { TaskRecord, TaskComment } from "../types/task";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export interface TaskFilterOptions {
  status?: string;
  priority?: string;
  project?: string;
  assignee?: string;
  dueDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class TasksRepository {
  private getDbId(): string {
    return getNotionDatabaseId("TASKS");
  }

  public async getAll(options: TaskFilterOptions = {}): Promise<NotionQueryResult<TaskRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.status) {
      filters.push({
        or: [
          { property: "Status", select: { equals: options.status } },
          { property: "Status", status: { equals: options.status } },
        ],
      });
    }
    if (options.priority) {
      filters.push({ property: "Priority", select: { equals: options.priority } });
    }
    if (options.assignee) {
      filters.push({ property: "Assignee", rich_text: { contains: options.assignee } });
    }
    if (options.search) {
      filters.push({ property: "Task", title: { contains: options.search } });
    }

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const limit = options.limit || 100;
    const page = options.page || 1;

    const result = await queryDatabase(dbId, {
      maxRecords: limit * page,
      pageSize: limit,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const tasks: TaskRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const title = extractTitle(props.Task || props.Title || props.Name, `Task #${idx + 1}`);
      const description = extractRichText(props.Description);
      const status = (extractStatus(props.Status) || extractSelect(props.Status) || "TODO") as any;
      const priority = (extractSelect(props.Priority) || "MEDIUM") as any;
      const projectRel = extractRelationIds(props.Project);
      const project = extractRichText(props.ProjectName) || (projectRel[0] ? `Project (${projectRel[0].slice(0, 6)})` : "General");
      const assignee = extractRichText(props.Assignee, "Unassigned");
      const dueDate = extractDate(props["Due Date"] || props.DueDate);
      const tags = extractMultiSelect(props.Tags);
      const blockedBy = extractRichText(props["Blocked By"]);

      return {
        id: p.id,
        title,
        description,
        status: ["TODO", "IN_PROGRESS", "BLOCKED", "REVIEW", "COMPLETED", "CANCELLED"].includes(status) ? status : "TODO",
        priority: ["HIGH", "MEDIUM", "LOW"].includes(priority) ? priority : "MEDIUM",
        project,
        projectId: projectRel[0],
        assignee,
        dueDate,
        tags,
        blockedBy,
        createdAt: p.created_time,
        updatedAt: p.last_edited_time,
      };
    });

    // Handle pagination slice
    const startIndex = (page - 1) * limit;
    const paginated = tasks.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      totalFetched: tasks.length,
      hasMore: tasks.length > page * limit,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<TaskRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const title = extractTitle(props.Task || props.Title || props.Name, "Untitled Task");
    const description = extractRichText(props.Description);
    const status = (extractStatus(props.Status) || extractSelect(props.Status) || "TODO") as any;
    const priority = (extractSelect(props.Priority) || "MEDIUM") as any;
    const projectRel = extractRelationIds(props.Project);
    const project = extractRichText(props.ProjectName) || (projectRel[0] ? `Project (${projectRel[0].slice(0, 6)})` : "General");
    const assignee = extractRichText(props.Assignee, "Unassigned");
    const dueDate = extractDate(props["Due Date"] || props.DueDate);
    const tags = extractMultiSelect(props.Tags);

    return {
      success: true,
      data: {
        id: p.id,
        title,
        description,
        status,
        priority,
        project,
        projectId: projectRel[0],
        assignee,
        dueDate,
        tags,
        createdAt: p.created_time,
        updatedAt: p.last_edited_time,
      },
    };
  }

  public async create(input: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    project?: string;
    projectId?: string;
    assignee?: string;
    dueDate?: string;
    tags?: string[];
    blockedBy?: string;
  }): Promise<NotionMutationResult<TaskRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const properties: Record<string, any> = {
      Task: buildTitle(input.title),
      Status: buildSelect(input.status || "TODO"),
      Priority: buildSelect(input.priority || "MEDIUM"),
      Assignee: buildRichText(input.assignee || "Unassigned"),
    };

    if (input.description) properties.Description = buildRichText(input.description);
    if (input.dueDate) properties["Due Date"] = buildDate(input.dueDate);
    if (input.tags && input.tags.length > 0) properties.Tags = buildMultiSelect(input.tags);
    if (input.blockedBy) properties["Blocked By"] = buildRichText(input.blockedBy);

    if (input.projectId && !input.projectId.startsWith("mock-")) {
      properties.Project = buildRelation([input.projectId]);
    } else if (input.project) {
      properties.ProjectName = buildRichText(input.project);
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
        status: (input.status || "TODO") as any,
        priority: (input.priority || "MEDIUM") as any,
        project: input.project || "General",
        projectId: input.projectId,
        assignee: input.assignee || "Unassigned",
        dueDate: input.dueDate,
        tags: input.tags,
        blockedBy: input.blockedBy,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      project?: string;
      projectId?: string;
      assignee?: string;
      dueDate?: string;
      tags?: string[];
      blockedBy?: string;
    }
  ): Promise<NotionMutationResult<TaskRecord>> {
    const properties: Record<string, any> = {};

    if (updates.title !== undefined) properties.Task = buildTitle(updates.title);
    if (updates.description !== undefined) properties.Description = buildRichText(updates.description);
    if (updates.status !== undefined) properties.Status = buildSelect(updates.status);
    if (updates.priority !== undefined) properties.Priority = buildSelect(updates.priority);
    if (updates.assignee !== undefined) properties.Assignee = buildRichText(updates.assignee);
    if (updates.dueDate !== undefined) properties["Due Date"] = buildDate(updates.dueDate);
    if (updates.tags !== undefined) properties.Tags = buildMultiSelect(updates.tags);
    if (updates.blockedBy !== undefined) properties["Blocked By"] = buildRichText(updates.blockedBy);
    if (updates.projectId && !updates.projectId.startsWith("mock-")) {
      properties.Project = buildRelation([updates.projectId]);
    }

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

  public async addComment(
    taskId: string,
    comment: string,
    author: string,
    type = "NOTE"
  ): Promise<{ success: boolean; comment?: TaskComment; error?: string }> {
    const commentsDbId = getNotionDatabaseId("COMMENTS");

    if (commentsDbId) {
      const res = await createPage(commentsDbId, {
        Comment: buildTitle(comment),
        Author: buildRichText(author),
        Type: buildSelect(type),
        Task: buildRelation([taskId]),
      });

      if (res.success) {
        return {
          success: true,
          comment: {
            id: res.id || "",
            taskId,
            author,
            comment,
            type: type as any,
            createdAt: new Date().toISOString(),
          },
        };
      }
    }

    // Fallback to page callout block
    const blockSuccess = await addCommentBlock(taskId, comment, author, type);
    return {
      success: blockSuccess,
      comment: {
        id: `block-${Date.now()}`,
        taskId,
        author,
        comment,
        type: type as any,
        createdAt: new Date().toISOString(),
      },
    };
  }

  public async getComments(taskId: string): Promise<TaskComment[]> {
    const commentsDbId = getNotionDatabaseId("COMMENTS");
    if (!commentsDbId) return [];

    const res = await queryDatabase(commentsDbId, {
      filter: { property: "Task", relation: { contains: taskId } },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!res.success) return [];

    return res.data.map((p: any) => ({
      id: p.id,
      taskId,
      author: extractRichText(p.properties.Author, "Member"),
      comment: extractTitle(p.properties.Comment || p.properties.Name, ""),
      type: (extractSelect(p.properties.Type) || "NOTE") as any,
      createdAt: p.created_time,
    }));
  }
}

export const tasksRepository = new TasksRepository();
// Alias for backward compatibility
export const taskRepository = tasksRepository;
