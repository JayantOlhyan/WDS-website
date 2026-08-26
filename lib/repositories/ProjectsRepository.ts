import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractMultiSelect,
  extractUrl,
  buildTitle,
  buildRichText,
  buildSelect,
  buildMultiSelect,
  buildUrl,
} from "../notion/properties";
import { ProjectRecord } from "../types/project";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export class ProjectsRepository {
  private getDbId(): string {
    return getNotionDatabaseId("PROJECTS");
  }

  public async getAll(): Promise<NotionQueryResult<ProjectRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const result = await queryDatabase(dbId, {
      maxRecords: 100,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const projects: ProjectRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const name = extractTitle(props.Name || props.Title, `Project #${idx + 1}`);
      const slug = extractRichText(props.Slug) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const description = extractRichText(props.Description);
      const status = (extractSelect(props.Status) || "ACTIVE") as any;
      const type = extractSelect(props.Type) || "WEB_APPLICATION";
      const lead = extractRichText(props.Lead, "WDS Tech Lead");
      const wing = extractSelect(props.Wing) || "Technical Wing";
      const websiteUrl = extractUrl(props.URL || props["Website URL"]);
      const githubUrl = extractUrl(props.Repository || props["GitHub URL"]);
      const techStack = extractMultiSelect(props["Tech Stack"] || props.TechStack);

      return {
        id: p.id,
        name,
        slug,
        description,
        status: ["ACTIVE", "MAINTENANCE", "COMPLETED", "PLANNING"].includes(status) ? status : "ACTIVE",
        type,
        lead,
        wing,
        websiteUrl,
        githubUrl,
        techStack,
        createdAt: p.created_time,
        updatedAt: p.last_edited_time,
      };
    });

    return {
      success: true,
      data: projects,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<ProjectRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const name = extractTitle(props.Name || props.Title, "Untitled Project");
    const slug = extractRichText(props.Slug) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = extractRichText(props.Description);
    const status = (extractSelect(props.Status) || "ACTIVE") as any;
    const lead = extractRichText(props.Lead, "WDS Tech Lead");
    const wing = extractSelect(props.Wing) || "Technical Wing";
    const websiteUrl = extractUrl(props.URL || props["Website URL"]);
    const githubUrl = extractUrl(props.Repository || props["GitHub URL"]);
    const techStack = extractMultiSelect(props["Tech Stack"] || props.TechStack);

    return {
      success: true,
      data: {
        id: p.id,
        name,
        slug,
        description,
        status,
        lead,
        wing,
        websiteUrl,
        githubUrl,
        techStack,
        createdAt: p.created_time,
        updatedAt: p.last_edited_time,
      },
    };
  }

  public async create(input: {
    name: string;
    slug?: string;
    description: string;
    status?: string;
    type?: string;
    lead?: string;
    wing?: string;
    websiteUrl?: string;
    githubUrl?: string;
    techStack?: string[];
  }): Promise<NotionMutationResult<ProjectRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const properties: Record<string, any> = {
      Name: buildTitle(input.name),
      Slug: buildRichText(slug),
      Description: buildRichText(input.description),
      Status: buildSelect(input.status || "ACTIVE"),
      Lead: buildRichText(input.lead || "WDS Tech Lead"),
    };

    if (input.wing) properties.Wing = buildSelect(input.wing);
    if (input.type) properties.Type = buildSelect(input.type);
    if (input.websiteUrl) properties.URL = buildUrl(input.websiteUrl);
    if (input.githubUrl) properties.Repository = buildUrl(input.githubUrl);
    if (input.techStack && input.techStack.length > 0) properties["Tech Stack"] = buildMultiSelect(input.techStack);

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        name: input.name,
        slug,
        description: input.description,
        status: (input.status || "ACTIVE") as any,
        lead: input.lead || "WDS Tech Lead",
        wing: input.wing || "Technical Wing",
        websiteUrl: input.websiteUrl,
        githubUrl: input.githubUrl,
        techStack: input.techStack,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: {
      name?: string;
      slug?: string;
      description?: string;
      status?: string;
      lead?: string;
      wing?: string;
      websiteUrl?: string;
      githubUrl?: string;
      techStack?: string[];
    }
  ): Promise<NotionMutationResult<ProjectRecord>> {
    const properties: Record<string, any> = {};

    if (updates.name !== undefined) properties.Name = buildTitle(updates.name);
    if (updates.slug !== undefined) properties.Slug = buildRichText(updates.slug);
    if (updates.description !== undefined) properties.Description = buildRichText(updates.description);
    if (updates.status !== undefined) properties.Status = buildSelect(updates.status);
    if (updates.lead !== undefined) properties.Lead = buildRichText(updates.lead);
    if (updates.wing !== undefined) properties.Wing = buildSelect(updates.wing);
    if (updates.websiteUrl !== undefined) properties.URL = buildUrl(updates.websiteUrl);
    if (updates.githubUrl !== undefined) properties.Repository = buildUrl(updates.githubUrl);
    if (updates.techStack !== undefined) properties["Tech Stack"] = buildMultiSelect(updates.techStack);

    const res = await updatePage(id, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: { id, ...updates } as any,
      id,
    };
  }

  public async archive(id: string): Promise<NotionMutationResult<boolean>> {
    return archivePage(id);
  }
}

export const projectsRepository = new ProjectsRepository();
export const projectRepository = projectsRepository;
