import { Client } from "@notionhq/client";

export const NOTION_API_KEY = process.env.NOTION_API_KEY;
export const NOTION_RECRUITMENT_DB_ID = process.env.NOTION_DATABASE_ID;
export const NOTION_TASKS_DB_ID = process.env.NOTION_TASKS_DATABASE_ID;
export const NOTION_BUGS_DB_ID = process.env.NOTION_BUGS_DATABASE_ID;
export const NOTION_WEBSITES_DB_ID = process.env.NOTION_WEBSITES_DATABASE_ID;

let notionClientInstance: Client | null = null;

export function getNotionClient(): Client | null {
  if (!NOTION_API_KEY) {
    return null;
  }
  if (!notionClientInstance) {
    notionClientInstance = new Client({ auth: NOTION_API_KEY });
  }
  return notionClientInstance;
}

export function isNotionConfigured(): boolean {
  return Boolean(NOTION_API_KEY);
}
