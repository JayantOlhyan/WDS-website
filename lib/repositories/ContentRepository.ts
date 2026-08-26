export type ContentWorkflowStage =
  | "IDEA"
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export interface SocietyContentItem {
  id: string;
  title: string;
  platform: "INSTAGRAM" | "LINKEDIN" | "NEWSLETTER" | "WEBSITE_BLOG";
  stage: ContentWorkflowStage;
  author: string;
  reviewer?: string;
  scheduledDate?: string;
  caption?: string;
  project?: string;
  createdAt: string;
}

class MemoryContentRepository {
  private contentItems: SocietyContentItem[] = [
    {
      id: "CNT-01",
      title: "Recruitment 2026 Orientation Announcement Post",
      platform: "INSTAGRAM",
      stage: "PUBLISHED",
      author: "Design & Content Lead",
      reviewer: "Jayant Olhyan",
      scheduledDate: "2026-08-25",
      caption: "Level Up Yourself with Web Development Society MSIT. Applications now live!",
      project: "Recruitment 2026",
      createdAt: new Date().toISOString(),
    },
    {
      id: "CNT-02",
      title: "Bug Hunt Hall of Fame Spotlight & Leaderboard Recap",
      platform: "LINKEDIN",
      stage: "REVIEW",
      author: "Editorial Lead",
      reviewer: "Core Team",
      scheduledDate: "2026-09-01",
      caption: "Saluting the student vulnerability hunters of MSIT.",
      project: "WDS Bug Hunt",
      createdAt: new Date().toISOString(),
    },
  ];

  public async getContentItems(): Promise<SocietyContentItem[]> {
    return this.contentItems;
  }

  public async createContentItem(item: Omit<SocietyContentItem, "id" | "createdAt">): Promise<SocietyContentItem> {
    const newItem: SocietyContentItem = {
      id: `CNT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item,
    };
    this.contentItems.unshift(newItem);
    return newItem;
  }

  public async updateContentStage(id: string, stage: ContentWorkflowStage): Promise<SocietyContentItem | null> {
    const item = this.contentItems.find((c) => c.id === id);
    if (!item) return null;
    item.stage = stage;
    return item;
  }
}

export const contentRepository = new MemoryContentRepository();
