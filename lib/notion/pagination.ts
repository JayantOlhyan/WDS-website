import { getNotionClient } from "./client";
import { NotionPaginationOptions, NotionQueryResult } from "./types";
import { normalizeNotionError } from "./errors";

/**
 * Executes a resilient, bounded paginated query on a Notion database with exponential backoff on 429/5xx errors
 */
export async function paginateNotionQuery(
  databaseId: string,
  options: NotionPaginationOptions = {}
): Promise<NotionQueryResult<any[]>> {
  const notion = getNotionClient();
  if (!notion || !databaseId) {
    return {
      success: false,
      data: [],
      isOffline: true,
      error: "NOTION_NOT_CONFIGURED",
    };
  }

  const maxRecords = options.maxRecords || 500;
  const pageSize = Math.min(100, options.pageSize || 100);
  const allResults: any[] = [];
  let cursor: string | undefined = options.startCursor || undefined;
  let hasMore = true;

  try {
    while (hasMore && allResults.length < maxRecords) {
      let attempts = 0;
      let success = false;
      let response: any = null;
      let lastError: any = null;

      while (attempts < 3 && !success) {
        try {
          attempts += 1;
          response = await notion.databases.query({
            database_id: databaseId,
            start_cursor: cursor,
            page_size: Math.min(pageSize, maxRecords - allResults.length),
            sorts: options.sorts,
            filter: options.filter,
          });
          success = true;
        } catch (err: any) {
          lastError = err;
          const normalized = normalizeNotionError(err);
          if (normalized.retryable && attempts < 3) {
            const delayMs = Math.pow(2, attempts) * 500;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          } else {
            throw err;
          }
        }
      }

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
    console.error(`[Notion Pagination Query Error on DB: ${databaseId}]:`, err?.message || err);
    const normalized = normalizeNotionError(err);
    return {
      success: false,
      data: allResults,
      isOffline: true,
      error: normalized.code,
    };
  }
}
