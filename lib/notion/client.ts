import { Client } from "@notionhq/client";
import { NOTION_DATABASES, NotionDatabaseKey } from "../config/notionDatabases";
import { normalizeNotionError } from "./errors";
import { NotionPaginationOptions, NotionQueryResult, NotionMutationResult } from "./types";

export const NOTION_API_KEY = process.env.NOTION_API_KEY;

// Re-export specific database IDs for backward compatibility
export const NOTION_TASKS_DB_ID = NOTION_DATABASES.TASKS;
export const NOTION_PROJECTS_DB_ID = NOTION_DATABASES.PROJECTS;
export const NOTION_CANDIDATES_DB_ID = NOTION_DATABASES.CANDIDATES;
export const NOTION_RECRUITMENT_DB_ID = NOTION_DATABASES.RECRUITMENT;
export const NOTION_INTERVIEWS_DB_ID = NOTION_DATABASES.INTERVIEWS;
export const NOTION_BUGS_DB_ID = NOTION_DATABASES.BUGS;
export const NOTION_EVENTS_DB_ID = NOTION_DATABASES.EVENTS;
export const NOTION_CONTENT_DB_ID = NOTION_DATABASES.CONTENT;
export const NOTION_ASSETS_DB_ID = NOTION_DATABASES.ASSETS;
export const NOTION_FACULTY_DB_ID = NOTION_DATABASES.FACULTY;
export const NOTION_RESOURCES_DB_ID = NOTION_DATABASES.RESOURCES;
export const NOTION_COLLEGE_INFO_DB_ID = NOTION_DATABASES.COLLEGE_INFO;
export const NOTION_COMMENTS_DB_ID = NOTION_DATABASES.COMMENTS;
export const NOTION_WEBSITES_DB_ID = NOTION_DATABASES.PROJECTS;

let notionClientInstance: Client | null = null;

export function getNotionClient(): Client | null {
  const apiKey = process.env.NOTION_API_KEY || NOTION_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!notionClientInstance) {
    notionClientInstance = new Client({
      auth: apiKey,
      timeoutMs: 10000, // 10s request timeout
    });
  }
  return notionClientInstance;
}

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY || NOTION_API_KEY);
}

/**
 * Execute an API operation with bounded exponential backoff for retryable errors (429, 500, 502, 503, 504)
 */
async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      attempts += 1;
      return await operation();
    } catch (err: any) {
      const normalized = normalizeNotionError(err);
      if (normalized.retryable && attempts < maxRetries) {
        const delayMs = Math.pow(2, attempts) * 500;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

/**
 * Centrally executes a query on a Notion database with pagination
 */
export async function queryDatabase(
  databaseId: string,
  options: NotionPaginationOptions = {}
): Promise<NotionQueryResult<any[]>> {
  const notion = getNotionClient();
  if (!notion || !databaseId) {
    return {
      success: false,
      data: [],
      isOffline: true,
      error: "DATABASE_OFFLINE",
    };
  }

  const maxRecords = options.maxRecords || 500;
  const pageSize = Math.min(100, options.pageSize || 100);
  const allResults: any[] = [];
  let cursor: string | undefined = options.startCursor || undefined;
  let hasMore = true;

  try {
    while (hasMore && allResults.length < maxRecords) {
      const response: any = await executeWithRetry(() =>
        notion.databases.query({
          database_id: databaseId,
          start_cursor: cursor,
          page_size: Math.min(pageSize, maxRecords - allResults.length),
          sorts: options.sorts,
          filter: options.filter,
        })
      );

      if (response && response.results) {
        allResults.push(...response.results);
        hasMore = Boolean(response.has_more && response.next_cursor);
        cursor = response.next_cursor || undefined;
      } else {
        hasMore = false;
      }
    }

    return {
      success: true,
      data: allResults,
      hasMore,
      nextCursor: cursor || null,
      totalFetched: allResults.length,
    };
  } catch (err: any) {
    console.error(`[Notion Query Database Error (ID: ${databaseId})]:`, err?.message || err);
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      data: allResults,
      isOffline: true,
      error: normalized.code,
    };
  }
}

/**
 * Creates a new page in a database
 */
export async function createPage(
  databaseId: string,
  properties: Record<string, any>
): Promise<NotionMutationResult<any>> {
  const notion = getNotionClient();
  if (!notion || !databaseId) {
    return {
      success: false,
      data: null,
      isOffline: true,
      error: "DATABASE_OFFLINE",
    };
  }

  try {
    const response: any = await executeWithRetry(() =>
      notion.pages.create({
        parent: { database_id: databaseId },
        properties,
      })
    );

    return {
      success: true,
      data: response,
      id: response.id,
    };
  } catch (err: any) {
    console.error(`[Notion Create Page Error (DB: ${databaseId})]:`, err?.message || err);
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      data: null,
      isOffline: normalized.code === "DATABASE_OFFLINE",
      error: normalized.code,
    };
  }
}

/**
 * Updates properties on an existing page
 */
export async function updatePage(
  pageId: string,
  properties: Record<string, any>
): Promise<NotionMutationResult<any>> {
  const notion = getNotionClient();
  if (!notion || !pageId) {
    return {
      success: false,
      data: null,
      isOffline: true,
      error: "DATABASE_OFFLINE",
    };
  }

  try {
    const response: any = await executeWithRetry(() =>
      notion.pages.update({
        page_id: pageId,
        properties,
      })
    );

    return {
      success: true,
      data: response,
      id: response.id,
    };
  } catch (err: any) {
    console.error(`[Notion Update Page Error (Page: ${pageId})]:`, err?.message || err);
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      data: null,
      isOffline: normalized.code === "DATABASE_OFFLINE",
      error: normalized.code,
    };
  }
}

/**
 * Archives a page (Notion soft delete)
 */
export async function archivePage(pageId: string): Promise<NotionMutationResult<boolean>> {
  const notion = getNotionClient();
  if (!notion || !pageId) {
    return {
      success: false,
      data: false,
      isOffline: true,
      error: "DATABASE_OFFLINE",
    };
  }

  try {
    await executeWithRetry(() =>
      notion.pages.update({
        page_id: pageId,
        archived: true,
      })
    );

    return {
      success: true,
      data: true,
      id: pageId,
    };
  } catch (err: any) {
    console.error(`[Notion Archive Page Error (Page: ${pageId})]:`, err?.message || err);
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      data: false,
      error: normalized.code,
    };
  }
}

/**
 * Fetches a single page by ID
 */
export async function getPage(pageId: string): Promise<NotionQueryResult<any | null>> {
  const notion = getNotionClient();
  if (!notion || !pageId) {
    return {
      success: false,
      data: null,
      isOffline: true,
      error: "DATABASE_OFFLINE",
    };
  }

  try {
    const response: any = await executeWithRetry(() =>
      notion.pages.retrieve({
        page_id: pageId,
      })
    );

    return {
      success: true,
      data: response,
    };
  } catch (err: any) {
    console.error(`[Notion Retrieve Page Error (Page: ${pageId})]:`, err?.message || err);
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      data: null,
      error: normalized.code,
    };
  }
}

/**
 * Retrieves database metadata and schema properties
 */
export async function getDatabaseSchema(databaseId: string): Promise<{
  success: boolean;
  properties?: Record<string, { type: string }>;
  error?: string;
}> {
  const notion = getNotionClient();
  if (!notion || !databaseId) {
    return {
      success: false,
      error: "DATABASE_OFFLINE",
    };
  }

  try {
    const db: any = await executeWithRetry(() =>
      notion.databases.retrieve({ database_id: databaseId })
    );

    const properties: Record<string, { type: string }> = {};
    if (db && db.properties) {
      for (const [name, prop] of Object.entries(db.properties)) {
        properties[name] = { type: (prop as any).type };
      }
    }

    return {
      success: true,
      properties,
    };
  } catch (err: any) {
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      error: normalized.code,
    };
  }
}

/**
 * Appends a comment/callout block to a page
 */
export async function addCommentBlock(
  pageId: string,
  comment: string,
  author: string,
  type = "NOTE"
): Promise<boolean> {
  const notion = getNotionClient();
  if (!notion || !pageId) return false;

  try {
    await executeWithRetry(() =>
      notion.blocks.children.append({
        block_id: pageId,
        children: [
          {
            object: "block",
            type: "callout",
            callout: {
              rich_text: [
                {
                  type: "text",
                  text: { content: `[${type}] ${author} (${new Date().toLocaleString()}):\n${comment}` },
                },
              ],
              icon: { emoji: type === "BLOCKER" ? "🚫" : type === "TECHNICAL" ? "⚙️" : "💬" },
            },
          },
        ],
      })
    );
    return true;
  } catch (err) {
    console.error(`[Notion addCommentBlock Error on Page: ${pageId}]:`, err);
    return false;
  }
}

/**
 * Backward compatibility wrapper
 */
export async function queryNotionDatabaseWithPagination(
  databaseId: string,
  options: NotionPaginationOptions = {}
): Promise<any[]> {
  const result = await queryDatabase(databaseId, options);
  return result.data;
}
