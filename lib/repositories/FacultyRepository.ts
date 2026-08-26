import { queryDatabase, createPage, updatePage, archivePage, getPage } from "../notion/client";
import { getNotionDatabaseId } from "../config/notionDatabases";
import {
  extractTitle,
  extractSelect,
  extractRichText,
  extractEmail,
  extractPhone,
  extractUrl,
  buildTitle,
  buildSelect,
  buildRichText,
  buildEmail,
  buildPhone,
  buildUrl,
} from "../notion/properties";
import { FacultyRecord } from "../types/faculty";
import { NotionQueryResult, NotionMutationResult } from "../notion/types";

export type FacultyAdvisorRecord = FacultyRecord;

export class FacultyRepository {
  private getDbId(): string {
    return getNotionDatabaseId("FACULTY");
  }

  public async getAll(options: { department?: string; search?: string } = {}): Promise<NotionQueryResult<FacultyRecord[]>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: [], isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const filters: any[] = [];
    if (options.department) filters.push({ property: "Department", select: { equals: options.department } });
    if (options.search) filters.push({ property: "Name", title: { contains: options.search } });

    const filterObj = filters.length === 1 ? filters[0] : filters.length > 1 ? { and: filters } : undefined;

    const result = await queryDatabase(dbId, {
      maxRecords: 50,
      filter: filterObj,
      sorts: [{ timestamp: "created_time", direction: "ascending" }],
    });

    if (!result.success) {
      return { success: false, data: [], isOffline: result.isOffline, error: result.error };
    }

    const facultyList: FacultyRecord[] = result.data.map((p: any, idx: number) => {
      const props = p.properties;
      const name = extractTitle(props.Name || props.Title, `Faculty Advisor #${idx + 1}`);
      const department = extractSelect(props.Department) || "CSE";
      const designation = extractRichText(props.Designation, "Faculty Mentor");
      const email = extractEmail(props.Email);
      const phone = extractPhone(props.Phone);
      const office = extractRichText(props.Office);
      const profileUrl = extractUrl(props["Profile URL"] || props.Profile);
      const notes = extractRichText(props.Notes);
      const role = (extractSelect(props.Role) || "FACULTY_ADVISOR") as any;

      return {
        id: p.id,
        name,
        department,
        designation,
        email,
        phone,
        office,
        profileUrl,
        notes,
        role,
        createdAt: p.created_time,
      };
    });

    return {
      success: true,
      data: facultyList,
    };
  }

  public async getById(id: string): Promise<NotionQueryResult<FacultyRecord | null>> {
    const res = await getPage(id);
    if (!res.success || !res.data) {
      return { success: false, data: null, error: res.error || "NOT_FOUND" };
    }

    const p = res.data;
    const props = p.properties;
    const name = extractTitle(props.Name || props.Title, "Untitled Faculty");
    const department = extractSelect(props.Department) || "CSE";
    const designation = extractRichText(props.Designation, "Faculty Mentor");
    const email = extractEmail(props.Email);
    const phone = extractPhone(props.Phone);
    const office = extractRichText(props.Office);
    const profileUrl = extractUrl(props["Profile URL"]);
    const notes = extractRichText(props.Notes);

    return {
      success: true,
      data: {
        id: p.id,
        name,
        department,
        designation,
        email,
        phone,
        office,
        profileUrl,
        notes,
        createdAt: p.created_time,
      },
    };
  }

  public async create(input: {
    name: string;
    department: string;
    designation: string;
    email: string;
    phone?: string;
    office?: string;
    profileUrl?: string;
    notes?: string;
    role?: string;
  }): Promise<NotionMutationResult<FacultyRecord>> {
    const dbId = this.getDbId();
    if (!dbId) {
      return { success: false, data: null as any, isOffline: true, error: "DATABASE_OFFLINE" };
    }

    const properties: Record<string, any> = {
      Name: buildTitle(input.name),
      Department: buildSelect(input.department),
      Designation: buildRichText(input.designation),
      Email: buildEmail(input.email),
    };

    if (input.phone) properties.Phone = buildPhone(input.phone);
    if (input.office) properties.Office = buildRichText(input.office);
    if (input.profileUrl) properties["Profile URL"] = buildUrl(input.profileUrl);
    if (input.notes) properties.Notes = buildRichText(input.notes);
    if (input.role) properties.Role = buildSelect(input.role);

    const res = await createPage(dbId, properties);
    if (!res.success) {
      return { success: false, data: null as any, error: res.error };
    }

    return {
      success: true,
      data: {
        id: res.id || "",
        ...input,
        role: (input.role || "FACULTY_ADVISOR") as any,
      },
      id: res.id,
    };
  }

  public async update(
    id: string,
    updates: Partial<FacultyRecord>
  ): Promise<NotionMutationResult<FacultyRecord>> {
    const properties: Record<string, any> = {};

    if (updates.name) properties.Name = buildTitle(updates.name);
    if (updates.department) properties.Department = buildSelect(updates.department);
    if (updates.designation) properties.Designation = buildRichText(updates.designation);
    if (updates.email) properties.Email = buildEmail(updates.email);
    if (updates.phone) properties.Phone = buildPhone(updates.phone);
    if (updates.office) properties.Office = buildRichText(updates.office);
    if (updates.profileUrl) properties["Profile URL"] = buildUrl(updates.profileUrl);
    if (updates.notes) properties.Notes = buildRichText(updates.notes);

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

  // Compatibility wrapper
  public async getFaculty() {
    return this.getAll();
  }

  public async createFaculty(input: any) {
    return this.create(input);
  }
}

export const facultyRepository = new FacultyRepository();
