import { queryDatabase, updatePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractSelect,
  extractRichText,
  buildTitle,
  buildSelect,
  buildRichText,
} from "../notion/properties";
import { CollegeInfoRecord } from "../types/collegeInfo";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export class CollegeInfoRepository {
  private getDbId(): string {
    return getNotionDatabaseId("COLLEGE_INFO");
  }

  public async getAll(): Promise<NotionQueryResult<CollegeInfoRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const result = await queryDatabase(dbId, {
      maxRecords: 100,
      sorts: [{ timestamp: "created_time", direction: "ascending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const records: CollegeInfoRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const name = extractTitle(props.Name || props.Title, `Info Record #${idx + 1}`);
      const category = (extractSelect(props.Category) || "GENERAL") as any;
      const value = extractRichText(props.Value);
      const source = extractRichText(props.Source);

      return {
        id: p.id,
        name,
        category,
        value,
        source,
        lastUpdated: new Date(p.last_edited_time).toLocaleDateString(),
      };
    });

    return {
      success: true,
      data: records,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<CollegeInfoRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const name = extractTitle(props.Name || props.Title, "Untitled Info Record");
    const category = (extractSelect(props.Category) || "GENERAL") as any;
    const value = extractRichText(props.Value);
    const source = extractRichText(props.Source);

    return {
      success: true,
      data: {
        id: p.id,
        name,
        category,
        value,
        source,
        lastUpdated: new Date(p.last_edited_time).toLocaleDateString(),
      },
    };
  }

  public async update(
    id: string,
    updates: {
      name?: string;
      category?: string;
      value?: string;
      source?: string;
    }
  ): Promise<NotionMutationResult<CollegeInfoRecord>> {
    const properties: Record<string, any> = {};

    if (updates.name) properties.Name = buildTitle(updates.name);
    if (updates.category) properties.Category = buildSelect(updates.category);
    if (updates.value) properties.Value = buildRichText(updates.value);
    if (updates.source) properties.Source = buildRichText(updates.source);

    const res = await updatePage(id, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id,
        ...updates,
        lastUpdated: new Date().toLocaleDateString(),
      } as any,
      id,
    };
  }
}

export const collegeInfoRepository = new CollegeInfoRepository();
