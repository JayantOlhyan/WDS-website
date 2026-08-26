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
 * Resilient query helper that retrieves all database pages with automatic start_cursor pagination
 * and handles transient 429 rate-limits with exponential backoff.
 */
export async function queryNotionDatabaseWithPagination(
  databaseId: string,
  options: {
    maxRecords?: number;
    sorts?: any[];
    filter?: any;
  } = {}
): Promise<any[]> {
  const notion = getNotionClient();
  if (!notion || !databaseId) return [];

  const maxRecords = options.maxRecords || 500;
  const allResults: any[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore && allResults.length < maxRecords) {
    let attempts = 0;
    let success = false;
    let response: any = null;

    while (attempts < 3 && !success) {
      try {
        attempts += 1;
        response = await notion.databases.query({
          database_id: databaseId,
          start_cursor: cursor,
          page_size: Math.min(100, maxRecords - allResults.length),
          sorts: options.sorts,
          filter: options.filter,
        });
        success = true;
      } catch (err: any) {
        // Retry transient 429 Rate Limits and 5xx Server Errors
        const status = err?.status || err?.code;
        if ((status === 429 || status === 500 || status === 502 || status === 503) && attempts < 3) {
          const delayMs = Math.pow(2, attempts) * 500;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          throw err;
        }
      }
    }

    if (response && response.results) {
      allResults.push(...response.results);
      hasMore = response.has_more && !!response.next_cursor;
      cursor = response.next_cursor || undefined;
    } else {
      hasMore = false;
    }
  }

  return allResults;
}
