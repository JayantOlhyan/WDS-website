import { getNotionClient, NOTION_BUGS_DB_ID } from "./client";
import { BugItem } from "@/lib/hub/types";
import { INITIAL_HUB_BUGS } from "@/lib/hub/constants";

export async function fetchNotionBugs(): Promise<{ bugs: BugItem[]; source: "NOTION" | "LOCAL_FALLBACK" }> {
  const notion = getNotionClient();
  if (!notion || !NOTION_BUGS_DB_ID) {
    return { bugs: INITIAL_HUB_BUGS, source: "LOCAL_FALLBACK" };
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
      const severity =
        props.Severity?.select?.name?.toUpperCase() === "CRITICAL"
          ? "CRITICAL"
          : props.Severity?.select?.name?.toUpperCase() === "HIGH"
          ? "HIGH"
          : props.Severity?.select?.name?.toUpperCase() === "LOW"
          ? "LOW"
          : "MEDIUM";
      const status =
        props.Status?.select?.name?.toUpperCase() === "RESOLVED"
          ? "RESOLVED"
          : props.Status?.select?.name?.toUpperCase() === "IN_PROGRESS"
          ? "IN_PROGRESS"
          : "OPEN";
      const reporter = props.Reporter?.rich_text?.[0]?.plain_text || "anonymous_hunter";
      const date = "Recent";

      return {
        id: `BUG-${page.id.slice(0, 3).toUpperCase()}`,
        title,
        page: pageTarget,
        severity,
        status,
        reporter,
        date,
      };
    });

    return { bugs: bugs.length > 0 ? bugs : INITIAL_HUB_BUGS, source: "NOTION" };
  } catch (error) {
    console.warn("[Notion Bugs Query Warning - Fallback to Local]:", error);
    return { bugs: INITIAL_HUB_BUGS, source: "LOCAL_FALLBACK" };
  }
}

export async function createNotionBug(bug: BugItem): Promise<boolean> {
  const notion = getNotionClient();
  if (!notion || !NOTION_BUGS_DB_ID) {
    return false;
  }

  try {
    await notion.pages.create({
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
    return true;
  } catch (error) {
    console.error("[Notion Create Bug Error]:", error);
    return false;
  }
}
