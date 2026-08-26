import { getNotionClient } from "@/lib/notion/client";
import { getNotionDatabaseId } from "@/lib/config/notionDatabases";
import { paginateNotionQuery } from "@/lib/notion/pagination";
import {
  extractTitle,
  extractSelect,
  extractRichText,
  extractUrl,
  buildTitle,
  buildSelect,
  buildRichText,
  buildUrl,
} from "@/lib/notion/properties";
import { RepositoryQueryResult } from "./types";
import { CreateDocumentationInput } from "@/lib/validation/documentation";

export interface SocietyDocRecord {
  id: string;
  title: string;
  category: "SOP" | "ONBOARDING" | "HANDOVER" | "TECH_GUIDE" | "POLICY";
  wing: string;
  author: string;
  docLink?: string;
  contentMarkdown?: string;
  createdAt?: string;
}

export interface IDocumentationRepository {
  getDocs(): Promise<RepositoryQueryResult<SocietyDocRecord[]>>;
  createDoc(doc: CreateDocumentationInput): Promise<RepositoryQueryResult<SocietyDocRecord>>;
}

class NotionDocumentationRepository implements IDocumentationRepository {
  public async getDocs(): Promise<RepositoryQueryResult<SocietyDocRecord[]>> {
    const dbId = getNotionDatabaseId("DOCUMENTATION");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    const queryResult = await paginateNotionQuery(dbId, {
      maxRecords: 100,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!queryResult.success) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: queryResult.error,
      };
    }

    const docs: SocietyDocRecord[] = queryResult.data.map((page: any, idx: number) => {
      const props = page.properties;
      const title = extractTitle(props.Title || props.Name, `SOP Document #${idx + 1}`);
      const category = (extractSelect(props.Category) || "SOP") as any;
      const wing = extractRichText(props.Wing, "All Wings");
      const author = extractRichText(props.Author, "WDS Leadership");
      const docLink = extractUrl(props["Doc Link"] || props.URL, "");
      const contentMarkdown = extractRichText(props.Content || props.Markdown, "");

      return {
        id: page.id,
        title,
        category,
        wing,
        author,
        docLink,
        contentMarkdown,
        createdAt: page.created_time,
      };
    });

    return {
      success: true,
      data: docs,
    };
  }

  public async createDoc(doc: CreateDocumentationInput): Promise<RepositoryQueryResult<SocietyDocRecord>> {
    const dbId = getNotionDatabaseId("DOCUMENTATION");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: doc as any,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const properties: Record<string, any> = {
        Title: buildTitle(doc.title),
        Category: buildSelect(doc.category),
        Wing: buildRichText(doc.wing),
        Author: buildRichText(doc.author),
      };

      if (doc.docLink) properties["Doc Link"] = buildUrl(doc.docLink);
      if (doc.contentMarkdown) properties.Content = buildRichText(doc.contentMarkdown);

      const response = await notion.pages.create({
        parent: { database_id: dbId },
        properties,
      });

      return {
        success: true,
        data: {
          id: response.id,
          ...doc,
        },
      };
    } catch (err: any) {
      console.error("[DocumentationRepository.createDoc Error]:", err?.message || err);
      return {
        success: false,
        data: doc as any,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }
}

export const documentationRepository: IDocumentationRepository = new NotionDocumentationRepository();
