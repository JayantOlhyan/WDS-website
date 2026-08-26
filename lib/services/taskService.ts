import { taskRepository } from "../repositories/TaskRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { TaskItem } from "../hub/types";
import { CreateTaskInput, TaskUpdateInput } from "../validation/task";
import { RepositoryQueryResult } from "../repositories/types";

function mapToTaskItemStatus(status?: string): "PENDING" | "IN_PROGRESS" | "COMPLETED" {
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  if (status === "COMPLETED") return "COMPLETED";
  return "PENDING";
}

export class TaskService {
  public async getTasks(): Promise<RepositoryQueryResult<TaskItem[]>> {
    return taskRepository.getTasks();
  }

  public async createTask(
    input: CreateTaskInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<TaskItem>> {
    const taskItem: TaskItem = {
      id: "",
      title: input.title,
      project: input.project,
      priority: input.priority,
      status: mapToTaskItemStatus(input.status),
      assignee: input.assignee,
      dueDate: input.dueDate || "Next Sprint",
      tags: input.tags,
      blockedBy: input.blockedBy,
    };

    const result = await taskRepository.createTask(taskItem);

    if (result.success && result.data) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "TASK_CREATED",
        resource: "Task",
        resourceId: result.data.id,
        details: { title: input.title, project: input.project, assignee: input.assignee },
      });
    }

    return result;
  }

  public async updateTask(
    id: string,
    updates: TaskUpdateInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<TaskItem>> {
    const sanitizedUpdates: Partial<TaskItem> = {
      ...updates,
      status: updates.status ? mapToTaskItemStatus(updates.status) : undefined,
    };

    const result = await taskRepository.updateTask(id, sanitizedUpdates);

    if (result.success) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "TASK_UPDATED",
        resource: "Task",
        resourceId: id,
        details: updates,
      });
    }

    return result;
  }
}

export const taskService = new TaskService();
