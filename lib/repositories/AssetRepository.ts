import { getNotionClient } from "@/lib/notion/client";
import { getNotionDatabaseId } from "@/lib/config/notionDatabases";
import { paginateNotionQuery } from "@/lib/notion/pagination";
import {
  extractTitle,
  extractSelect,
  extractUrl,
  extractRichText,
  buildTitle,
  buildSelect,
  buildUrl,
  buildRichText,
} from "@/lib/notion/properties";
import { RepositoryQueryResult } from "./types";
import { CreateAssetInput } from "@/lib/validation/asset";

export interface SocietyAssetRecord {
  id: string;
  name: string;
  category: "LOGOS" | "POSTERS" | "BRAND" | "DOCUMENTS" | "TEMPLATES";
  format: "PNG" | "SVG" | "PDF" | "FIGMA" | "MD";
  url: string;
  project?: string;
  owner: string;
  notes?: string;
  createdAt?: string;
}

export interface IAssetRepository {
  getAssets(): Promise<RepositoryQueryResult<SocietyAssetRecord[]>>;
  createAsset(asset: CreateAssetInput): Promise<RepositoryQueryResult<SocietyAssetRecord>>;
}

class NotionAssetRepository implements IAssetRepository {
  public async getAssets(): Promise<RepositoryQueryResult<SocietyAssetRecord[]>> {
    const dbId = getNotionDatabaseId("ASSETS");
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
      maxRecords: 200,
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

    const assets: SocietyAssetRecord[] = queryResult.data.map((page: any, idx: number) => {
      const props = page.properties;
      const name = extractTitle(props.Name || props.Title, `Asset #${idx + 1}`);
      const category = (extractSelect(props.Category) || "BRAND") as any;
      const format = (extractSelect(props.Format) || "PNG") as any;
      const url = extractUrl(props.URL, "#");
      const project = extractRichText(props.Project, "General");
      const owner = extractRichText(props.Owner, "WDS Design");
      const notes = extractRichText(props.Notes, "");

      return {
        id: page.id,
        name,
        category,
        format,
        url,
        project,
        owner,
        notes,
        createdAt: page.created_time,
      };
    });

    return {
      success: true,
      data: assets,
    };
  }

  public async createAsset(asset: CreateAssetInput): Promise<RepositoryQueryResult<SocietyAssetRecord>> {
    const dbId = getNotionDatabaseId("ASSETS");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: asset as any,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const properties: Record<string, any> = {
        Name: buildTitle(asset.name),
        Category: buildSelect(asset.category),
        Format: buildSelect(asset.format),
        URL: buildUrl(asset.url),
        Owner: buildRichText(asset.owner),
      };

      if (asset.project) properties.Project = buildRichText(asset.project);
      if (asset.notes) properties.Notes = buildRichText(asset.notes);

      const response = await notion.pages.create({
        parent: { database_id: dbId },
        properties,
      });

      return {
        success: true,
        data: {
          id: response.id,
          ...asset,
        },
      };
    } catch (err: any) {
      console.error("[AssetRepository.createAsset Error]:", err?.message || err);
      return {
        success: false,
        data: asset as any,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }
}

export const assetRepository: IAssetRepository = new NotionAssetRepository();
