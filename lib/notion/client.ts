import { Client } from "@notionhq/client";
import { NOTION_DATABASES } from "../config/notionDatabases";
import { paginateNotionQuery } from "./pagination";
import { NotionPaginationOptions } from "./types";

export const NOTION_API_KEY = process.env.NOTION_API_KEY;

// Re-export specific database IDs for backward compatibility
export const NOTION_RECRUITMENT_DB_ID = NOTION_DATABASES.RECRUITMENT;
export const NOTION_TASKS_DB_ID = NOTION_DATABASES.TASKS;
export const NOTION_BUGS_DB_ID = NOTION_DATABASES.BUGS;
export const NOTION_WEBSITES_DB_ID = NOTION_DATABASES.PROJECTS;

let notionClientInstance: Client | null = null;

export function getNotionClient(): Client | null {
  if (!NOTION_API_KEY) {
    return null;
  }
  if (!notionClientInstance) {
    notionClientInstance = new Client({
      auth: NOTION_API_KEY,
      timeoutMs: 10000, // 10s request timeout
    });
  }
  return notionClientInstance;
}

export function isNotionConfigured(): boolean {
  return Boolean(NOTION_API_KEY);
}

/**
 * Centrally delegates to paginateNotionQuery
 */
export async function queryNotionDatabaseWithPagination(
  databaseId: string,
  options: NotionPaginationOptions = {}
): Promise<any[]> {
  const result = await paginateNotionQuery(databaseId, options);
  return result.data;
}
