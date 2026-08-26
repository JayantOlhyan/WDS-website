import { getNotionClient, NOTION_TASKS_DB_ID } from "@/lib/notion/client";
import { ITaskRepository, RepositoryQueryResult } from "./types";
import { TaskItem } from "@/lib/hub/types";

class NotionTaskRepository implements ITaskRepository {
  public async getTasks(): Promise<RepositoryQueryResult<TaskItem[]>> {
    const notion = getNotionClient();
    if (!notion || !NOTION_TASKS_DB_ID) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const response = await notion.databases.query({
        database_id: NOTION_TASKS_DB_ID,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      });

      const tasks: TaskItem[] = response.results.map((page: any, idx: number) => {
        const props = page.properties;
        const title =
          props.Task?.title?.[0]?.plain_text ||
          props.Name?.title?.[0]?.plain_text ||
          props.Title?.title?.[0]?.plain_text ||
          `Task #${idx + 1}`;
        const rawStatus = props.Status?.select?.name?.toUpperCase();
        const status =
          rawStatus === "COMPLETED" ? "COMPLETED" : rawStatus === "IN_PROGRESS" ? "IN_PROGRESS" : "PENDING";
        const rawPriority = props.Priority?.select?.name?.toUpperCase();
        const priority =
          rawPriority === "HIGH" ? "HIGH" : rawPriority === "LOW" ? "LOW" : "MEDIUM";
        const project = props.Project?.select?.name || props.Project?.rich_text?.[0]?.plain_text || "General";
        const assignee = props.Assignee?.select?.name || props.Assignee?.rich_text?.[0]?.plain_text || "Unassigned";
        const dueDate = props["Due Date"]?.date?.start || "Next Sprint";

        return {
          id: page.id,
          title,
          status,
          priority,
          project,
          assignee,
          dueDate,
        };
      });

      return { success: true, data: tasks };
    } catch (error) {
      console.error("[TaskRepository.getTasks Error]:", error);
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "DATABASE_QUERY_FAILED",
      };
    }
  }

  public async createTask(task: TaskItem): Promise<RepositoryQueryResult<TaskItem>> {
    const notion = getNotionClient();
    if (!notion || !NOTION_TASKS_DB_ID) {
      return {
        success: false,
        data: task,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_TASKS_DB_ID },
        properties: {
          Task: {
            title: [{ text: { content: task.title } }],
          },
          Status: {
            select: { name: task.status },
          },
          Priority: {
            select: { name: task.priority },
          },
          Project: {
            select: { name: task.project },
          },
          Assignee: {
            rich_text: [{ text: { content: task.assignee } }],
          },
        },
      });

      return {
        success: true,
        data: { ...task, id: response.id },
      };
    } catch (error) {
      console.error("[TaskRepository.createTask Error]:", error);
      return {
        success: false,
        data: task,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }

  public async updateTask(id: string, updates: Partial<TaskItem>): Promise<RepositoryQueryResult<TaskItem>> {
    const notion = getNotionClient();
    if (!notion) {
      return {
        success: false,
        data: updates as TaskItem,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const propertiesToUpdate: Record<string, any> = {};

      if (updates.status) {
        propertiesToUpdate.Status = { select: { name: updates.status } };
      }
      if (updates.priority) {
        propertiesToUpdate.Priority = { select: { name: updates.priority } };
      }
      if (updates.assignee) {
        propertiesToUpdate.Assignee = { rich_text: [{ text: { content: updates.assignee } }] };
      }
      if (updates.title) {
        propertiesToUpdate.Task = { title: [{ text: { content: updates.title } }] };
      }

      await notion.pages.update({
        page_id: id,
        properties: propertiesToUpdate,
      });

      return {
        success: true,
        data: { id, ...updates } as TaskItem,
      };
    } catch (error) {
      console.error("[TaskRepository.updateTask Error]:", error);
      return {
        success: false,
        data: { id, ...updates } as TaskItem,
        error: "DATABASE_UPDATE_FAILED",
      };
    }
  }
}

export const taskRepository: ITaskRepository = new NotionTaskRepository();
