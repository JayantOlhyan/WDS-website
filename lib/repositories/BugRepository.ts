import { getNotionClient, NOTION_BUGS_DB_ID } from "@/lib/notion/client";
import { IBugRepository, RepositoryQueryResult } from "./types";
import { BugItem } from "@/lib/hub/types";

class NotionBugRepository implements IBugRepository {
  public async getBugs(): Promise<RepositoryQueryResult<BugItem[]>> {
    const notion = getNotionClient();
    if (!notion || !NOTION_BUGS_DB_ID) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const response = await notion.databases.query({
        database_id: NOTION_BUGS_DB_ID,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      });

      const bugs: BugItem[] = response.results.map((page: any, idx: number) => {
        const props = page.properties;
        const title =
          props.Title?.title?.[0]?.plain_text ||
          props["Bug ID"]?.rich_text?.[0]?.plain_text ||
          `Issue #${idx + 1}`;
        const pageTarget = props.Website?.url || props.Website?.rich_text?.[0]?.plain_text || "msit.in";
        const rawSeverity = props.Severity?.select?.name?.toUpperCase();
        const severity =
          rawSeverity === "CRITICAL"
            ? "CRITICAL"
            : rawSeverity === "HIGH"
            ? "HIGH"
            : rawSeverity === "LOW"
            ? "LOW"
            : "MEDIUM";
        const rawStatus = props.Status?.select?.name?.toUpperCase();
        const status =
          rawStatus === "RESOLVED" ? "RESOLVED" : rawStatus === "IN_PROGRESS" ? "IN_PROGRESS" : "OPEN";
        const reporter = props.Reporter?.rich_text?.[0]?.plain_text || "anonymous_hunter";

        return {
          id: page.id,
          title,
          page: pageTarget,
          severity,
          status,
          reporter,
          date: new Date(page.created_time).toLocaleDateString(),
        };
      });

      return { success: true, data: bugs };
    } catch (error) {
      console.error("[BugRepository.getBugs Error]:", error);
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "DATABASE_QUERY_FAILED",
      };
    }
  }

  public async createBug(bug: BugItem): Promise<RepositoryQueryResult<BugItem>> {
    const notion = getNotionClient();
    if (!notion || !NOTION_BUGS_DB_ID) {
      return {
        success: false,
        data: bug,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_BUGS_DB_ID },
        properties: {
          Title: {
            title: [{ text: { content: bug.title } }],
          },
          Website: {
            rich_text: [{ text: { content: bug.page } }],
          },
          Severity: {
            select: { name: bug.severity },
          },
          Status: {
            select: { name: bug.status },
          },
          Reporter: {
            rich_text: [{ text: { content: bug.reporter } }],
          },
        },
      });

      return {
        success: true,
        data: { ...bug, id: response.id },
      };
    } catch (error) {
      console.error("[BugRepository.createBug Error]:", error);
      return {
        success: false,
        data: bug,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }

  public async updateBug(id: string, updates: Partial<BugItem>): Promise<RepositoryQueryResult<BugItem>> {
    const notion = getNotionClient();
    if (!notion) {
      return {
        success: false,
        data: { id, ...updates } as BugItem,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const propertiesToUpdate: Record<string, any> = {};

      if (updates.status) {
        propertiesToUpdate.Status = { select: { name: updates.status } };
      }
      if (updates.severity) {
        propertiesToUpdate.Severity = { select: { name: updates.severity } };
      }

      await notion.pages.update({
        page_id: id,
        properties: propertiesToUpdate,
      });

      return {
        success: true,
        data: { id, ...updates } as BugItem,
      };
    } catch (error) {
      console.error("[BugRepository.updateBug Error]:", error);
      return {
        success: false,
        data: { id, ...updates } as BugItem,
        error: "DATABASE_UPDATE_FAILED",
      };
    }
  }
}

export const bugRepository: IBugRepository = new NotionBugRepository();
