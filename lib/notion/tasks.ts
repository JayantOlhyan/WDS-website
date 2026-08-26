import { getNotionClient, NOTION_TASKS_DB_ID } from "./client";
import { TaskItem } from "@/lib/hub/types";
import { INITIAL_HUB_TASKS } from "@/lib/hub/constants";

export async function fetchNotionTasks(): Promise<{ tasks: TaskItem[]; source: "NOTION" | "LOCAL_FALLBACK" }> {
  const notion = getNotionClient();
  if (!notion || !NOTION_TASKS_DB_ID) {
    return { tasks: INITIAL_HUB_TASKS, source: "LOCAL_FALLBACK" };
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
      const status =
        props.Status?.select?.name?.toUpperCase() === "COMPLETED"
          ? "COMPLETED"
          : props.Status?.select?.name?.toUpperCase() === "IN_PROGRESS"
          ? "IN_PROGRESS"
          : "PENDING";
      const priority =
        props.Priority?.select?.name?.toUpperCase() === "HIGH"
          ? "HIGH"
          : props.Priority?.select?.name?.toUpperCase() === "LOW"
          ? "LOW"
          : "MEDIUM";
      const project = props.Project?.select?.name || props.Project?.rich_text?.[0]?.plain_text || "General";
      const assignee = props.Assignee?.select?.name || props.Assignee?.rich_text?.[0]?.plain_text || "Unassigned";
      const dueDate = props["Due Date"]?.date?.start || "Next Sprint";

      return {
        id: `TSK-${page.id.slice(0, 4).toUpperCase()}`,
        title,
        status,
        priority,
        project,
        assignee,
        dueDate,
      };
    });

    return { tasks: tasks.length > 0 ? tasks : INITIAL_HUB_TASKS, source: "NOTION" };
  } catch (error) {
    console.warn("[Notion Tasks Query Warning - Fallback to Local]:", error);
    return { tasks: INITIAL_HUB_TASKS, source: "LOCAL_FALLBACK" };
  }
}

export async function createNotionTask(task: TaskItem): Promise<boolean> {
  const notion = getNotionClient();
  if (!notion || !NOTION_TASKS_DB_ID) {
    return false;
  }

  try {
    await notion.pages.create({
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
    return true;
  } catch (error) {
    console.error("[Notion Create Task Error]:", error);
    return false;
  }
}
