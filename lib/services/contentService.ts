import { contentRepository, SocietyContentItem, ContentWorkflowStage } from "../repositories/ContentRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateContentInput, PatchContentStageInput } from "../validation/content";

export class ContentService {
  public async getContentItems(): Promise<SocietyContentItem[]> {
    return contentRepository.getContentItems();
  }

  public async createContentItem(
    input: CreateContentInput,
    actor: { username: string; role: string }
  ): Promise<SocietyContentItem> {
    const item = await contentRepository.createContentItem(input);

    await auditRepository.logEvent({
      actor: actor.username,
      role: actor.role,
      action: "CONTENT_ITEM_CREATED",
      resource: "ContentItem",
      resourceId: item.id,
      details: { title: item.title, platform: item.platform },
    });

    return item;
  }

  public async updateContentStage(
    id: string,
    input: PatchContentStageInput,
    actor: { username: string; role: string }
  ): Promise<SocietyContentItem | null> {
    const updated = await contentRepository.updateContentStage(id, input.stage as ContentWorkflowStage);

    if (updated) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "CONTENT_STAGE_UPDATED",
        resource: "ContentItem",
        resourceId: id,
        details: input,
      });
    }

    return updated;
  }
}

export const contentService = new ContentService();
