import {
  getNotionClient,
  NOTION_RECRUITMENT_DB_ID,
  NOTION_TASKS_DB_ID,
  NOTION_BUGS_DB_ID,
} from "./client";

export interface DatabaseStatus {
  name: string;
  configured: boolean;
  accessible: boolean;
  error?: string;
}

export interface SystemConfigurationReport {
  timestamp: string;
  notion: {
    connected: boolean;
    tokenConfigured: boolean;
    databases: {
      recruitment: DatabaseStatus;
      tasks: DatabaseStatus;
      bugs: DatabaseStatus;
    };
  };
  webhook: {
    configured: boolean;
  };
  auth: {
    adminConfigured: boolean;
    coreConfigured: boolean;
    leadConfigured: boolean;
    memberConfigured: boolean;
  };
  environment: string;
}

export async function validateNotionSchema(): Promise<SystemConfigurationReport> {
  const notion = getNotionClient();
  const tokenConfigured = !!process.env.NOTION_API_KEY;
  const webhookConfigured = !!process.env.BUG_HUNT_WEBHOOK_SECRET;

  const recruitmentStatus: DatabaseStatus = {
    name: "Recruitment Applications",
    configured: !!NOTION_RECRUITMENT_DB_ID,
    accessible: false,
  };

  const tasksStatus: DatabaseStatus = {
    name: "Sprint Tasks",
    configured: !!NOTION_TASKS_DB_ID,
    accessible: false,
  };

  const bugsStatus: DatabaseStatus = {
    name: "Bug Hunt Queue",
    configured: !!NOTION_BUGS_DB_ID,
    accessible: false,
  };

  let connected = false;

  if (notion) {
    // Check Recruitment DB
    if (NOTION_RECRUITMENT_DB_ID) {
      try {
        await notion.databases.retrieve({ database_id: NOTION_RECRUITMENT_DB_ID });
        recruitmentStatus.accessible = true;
        connected = true;
      } catch (err: any) {
        recruitmentStatus.error = err.message || "Failed to retrieve database.";
      }
    }

    // Check Tasks DB
    if (NOTION_TASKS_DB_ID) {
      try {
        await notion.databases.retrieve({ database_id: NOTION_TASKS_DB_ID });
        tasksStatus.accessible = true;
        connected = true;
      } catch (err: any) {
        tasksStatus.error = err.message || "Failed to retrieve database.";
      }
    }

    // Check Bugs DB
    if (NOTION_BUGS_DB_ID) {
      try {
        await notion.databases.retrieve({ database_id: NOTION_BUGS_DB_ID });
        bugsStatus.accessible = true;
        connected = true;
      } catch (err: any) {
        bugsStatus.error = err.message || "Failed to retrieve database.";
      }
    }
  }

  return {
    timestamp: new Date().toISOString(),
    notion: {
      connected,
      tokenConfigured,
      databases: {
        recruitment: recruitmentStatus,
        tasks: tasksStatus,
        bugs: bugsStatus,
      },
    },
    webhook: {
      configured: webhookConfigured,
    },
    auth: {
      adminConfigured: !!process.env.HUB_ADMIN_KEY,
      coreConfigured: !!process.env.HUB_CORE_KEY,
      leadConfigured: !!process.env.HUB_LEAD_KEY,
      memberConfigured: !!process.env.HUB_MEMBER_KEY,
    },
    environment: process.env.NODE_ENV || "development",
  };
}
