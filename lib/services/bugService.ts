import { bugRepository } from "../repositories/BugRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { BugItem } from "../hub/types";
import { CreateBugInput, BugUpdateInput, BugHuntWebhookInput } from "../validation/bug";
import { RepositoryQueryResult } from "../repositories/types";
import { registerWebhookEventId } from "../webhook";

export class BugService {
  public async getBugs(): Promise<RepositoryQueryResult<BugItem[]>> {
    return bugRepository.getBugs();
  }

  public async createBug(
    input: CreateBugInput,
    actor?: { username: string; role: string }
  ): Promise<RepositoryQueryResult<BugItem>> {
    const bugItem: BugItem = {
      id: "",
      title: input.title,
      page: input.website,
      severity: input.severity,
      status: input.status === "TRIAGED" || input.status === "DUPLICATE" || input.status === "INVALID" ? "OPEN" : input.status,
      reporter: input.reporter,
      date: new Date().toLocaleDateString(),
      assignedTo: input.assignedTo,
    };

    const result = await bugRepository.createBug(bugItem);

    if (result.success && result.data && actor) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "BUG_REPORTED",
        resource: "Bug",
        resourceId: result.data.id,
        details: { title: input.title, website: input.website, severity: input.severity },
      });
    }

    return result;
  }

  public async ingestWebhookBug(
    payload: BugHuntWebhookInput
  ): Promise<{ success: boolean; duplicate?: boolean; bug?: BugItem; isOffline?: boolean; error?: string }> {
    const isNew = registerWebhookEventId(payload.bugId);
    if (!isNew) {
      return {
        success: true,
        duplicate: true,
      };
    }

    const bugItem: BugItem = {
      id: `WEBHOOK-${payload.bugId}`,
      title: `[BugHunt] ${payload.title}`,
      page: payload.website,
      severity: payload.severity,
      status: "OPEN",
      reporter: payload.reporterHandle,
      date: new Date().toLocaleDateString(),
    };

    const result = await bugRepository.createBug(bugItem);

    await auditRepository.logEvent({
      actor: `Webhook:${payload.reporterHandle}`,
      role: "MEMBER",
      action: "BUG_INGESTED_WEBHOOK",
      resource: "Bug",
      resourceId: result.data?.id || bugItem.id,
      details: { bugId: payload.bugId, website: payload.website, severity: payload.severity },
    });

    return {
      success: true,
      bug: result.data || bugItem,
      isOffline: result.isOffline,
    };
  }

  public async updateBug(
    id: string,
    updates: BugUpdateInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<BugItem>> {
    const sanitizedUpdates: Partial<BugItem> = {
      ...updates,
      status: updates.status === "TRIAGED" || updates.status === "DUPLICATE" || updates.status === "INVALID" ? "OPEN" : updates.status,
    };

    const result = await bugRepository.updateBug(id, sanitizedUpdates);

    if (result.success) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "BUG_UPDATED",
        resource: "Bug",
        resourceId: id,
        details: updates,
      });
    }

    return result;
  }
}

export const bugService = new BugService();
