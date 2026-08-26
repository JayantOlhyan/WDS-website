export interface HubNotification {
  id: string;
  recipientRole?: string;
  recipientUser?: string;
  type: "TASK" | "BUG" | "RECRUITMENT" | "INCIDENT" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

class MemoryNotificationRepository {
  private notifications: HubNotification[] = [
    {
      id: "NOTIF-01",
      type: "SYSTEM",
      title: "WDS OS v2.1 Activated",
      message: "Fine-grained permissions, project systems, and audit logging are now operational.",
      read: false,
      createdAt: new Date().toISOString(),
      linkTab: "dashboard",
    },
    {
      id: "NOTIF-02",
      type: "RECRUITMENT",
      title: "Recruitment Screening Live",
      message: "Recruitment batch 2026 applicant screening pipeline is open.",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      linkTab: "recruitment",
    },
  ];

  public async getNotifications(): Promise<HubNotification[]> {
    return this.notifications;
  }

  public async createNotification(notif: Omit<HubNotification, "id" | "createdAt" | "read">): Promise<HubNotification> {
    const newNotif: HubNotification = {
      id: `NOTIF-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notif,
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  public async markAllRead(): Promise<void> {
    this.notifications.forEach((n) => {
      n.read = true;
    });
  }
}

export const notificationRepository = new MemoryNotificationRepository();
