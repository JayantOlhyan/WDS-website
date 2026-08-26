import { getNotionClient } from "@/lib/notion/client";
import { getNotionDatabaseId } from "@/lib/config/notionDatabases";
import { paginateNotionQuery } from "@/lib/notion/pagination";
import {
  extractTitle,
  extractSelect,
  extractRichText,
  extractEmail,
  buildTitle,
  buildSelect,
  buildRichText,
  buildEmail,
} from "@/lib/notion/properties";
import { RepositoryQueryResult } from "./types";
import { CreateFacultyInput } from "@/lib/validation/faculty";

export interface FacultyAdvisorRecord {
  id: string;
  name: string;
  department: "CSE" | "IT" | "ECE" | "Applied Sciences" | "Administration";
  designation: string;
  email: string;
  role: "FACULTY_ADVISOR" | "MENTOR" | "HOD" | "COORDINATOR";
}

export interface IFacultyRepository {
  getFaculty(): Promise<RepositoryQueryResult<FacultyAdvisorRecord[]>>;
  createFaculty(faculty: CreateFacultyInput): Promise<RepositoryQueryResult<FacultyAdvisorRecord>>;
}

class NotionFacultyRepository implements IFacultyRepository {
  public async getFaculty(): Promise<RepositoryQueryResult<FacultyAdvisorRecord[]>> {
    const dbId = getNotionDatabaseId("FACULTY");
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
      maxRecords: 50,
      sorts: [{ timestamp: "created_time", direction: "ascending" }],
    });

    if (!queryResult.success) {
      return {
        success: false,
        data: [],
        isOffline: true,
        error: queryResult.error,
      };
    }

    const facultyList: FacultyAdvisorRecord[] = queryResult.data.map((page: any, idx: number) => {
      const props = page.properties;
      const name = extractTitle(props.Name || props.Title, `Faculty Advisor #${idx + 1}`);
      const department = (extractSelect(props.Department) || "CSE") as any;
      const designation = extractRichText(props.Designation, "Faculty Mentor");
      const email = extractEmail(props.Email, "");
      const role = (extractSelect(props.Role) || "FACULTY_ADVISOR") as any;

      return {
        id: page.id,
        name,
        department,
        designation,
        email,
        role,
      };
    });

    return {
      success: true,
      data: facultyList,
    };
  }

  public async createFaculty(faculty: CreateFacultyInput): Promise<RepositoryQueryResult<FacultyAdvisorRecord>> {
    const dbId = getNotionDatabaseId("FACULTY");
    const notion = getNotionClient();

    if (!notion || !dbId) {
      return {
        success: false,
        data: faculty as any,
        isOffline: true,
        error: "NOTION_NOT_CONFIGURED",
      };
    }

    try {
      const properties: Record<string, any> = {
        Name: buildTitle(faculty.name),
        Department: buildSelect(faculty.department),
        Designation: buildRichText(faculty.designation),
        Email: buildEmail(faculty.email),
        Role: buildSelect(faculty.role),
      };

      const response = await notion.pages.create({
        parent: { database_id: dbId },
        properties,
      });

      return {
        success: true,
        data: {
          id: response.id,
          ...faculty,
        },
      };
    } catch (err: any) {
      console.error("[FacultyRepository.createFaculty Error]:", err?.message || err);
      return {
        success: false,
        data: faculty as any,
        error: "DATABASE_INSERT_FAILED",
      };
    }
  }
}

export const facultyRepository: IFacultyRepository = new NotionFacultyRepository();
