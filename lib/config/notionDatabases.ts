export const NOTION_DATABASES = {
  TASKS: process.env.NOTION_TASKS_DATABASE_ID || "",
  PROJECTS: process.env.NOTION_PROJECTS_DATABASE_ID || process.env.NOTION_WEBSITES_DATABASE_ID || "",
  CANDIDATES: process.env.NOTION_CANDIDATES_DATABASE_ID || process.env.NOTION_RECRUITMENT_DATABASE_ID || process.env.NOTION_DATABASE_ID || "",
  INTERVIEWS: process.env.NOTION_INTERVIEWS_DATABASE_ID || "",
  BUGS: process.env.NOTION_BUGS_DATABASE_ID || "",
  EVENTS: process.env.NOTION_EVENTS_DATABASE_ID || "",
  CONTENT: process.env.NOTION_CONTENT_DATABASE_ID || "",
  ASSETS: process.env.NOTION_ASSETS_DATABASE_ID || "",
  FACULTY: process.env.NOTION_FACULTY_DATABASE_ID || "",
  RESOURCES: process.env.NOTION_RESOURCES_DATABASE_ID || "",
  COLLEGE_INFO: process.env.NOTION_COLLEGE_INFO_DATABASE_ID || "",
  COMMENTS: process.env.NOTION_COMMENTS_DATABASE_ID || "",
  // Aliases for backward compatibility
  RECRUITMENT: process.env.NOTION_CANDIDATES_DATABASE_ID || process.env.NOTION_RECRUITMENT_DATABASE_ID || process.env.NOTION_DATABASE_ID || "",
  MEMBERS: process.env.NOTION_MEMBERS_DATABASE_ID || "",
  MEETINGS: process.env.NOTION_MEETINGS_DATABASE_ID || "",
  INCIDENTS: process.env.NOTION_INCIDENTS_DATABASE_ID || "",
  DOCUMENTATION: process.env.NOTION_DOCUMENTATION_DATABASE_ID || "",
  AUDIT: process.env.NOTION_AUDIT_DATABASE_ID || "",
} as const;

export type NotionDatabaseKey = keyof typeof NOTION_DATABASES;

export function getNotionDatabaseId(key: NotionDatabaseKey): string {
  switch (key) {
    case "TASKS":
      return process.env.NOTION_TASKS_DATABASE_ID || NOTION_DATABASES.TASKS || "";
    case "PROJECTS":
      return process.env.NOTION_PROJECTS_DATABASE_ID || process.env.NOTION_WEBSITES_DATABASE_ID || NOTION_DATABASES.PROJECTS || "";
    case "CANDIDATES":
    case "RECRUITMENT":
      return (
        process.env.NOTION_CANDIDATES_DATABASE_ID ||
        process.env.NOTION_RECRUITMENT_DATABASE_ID ||
        process.env.NOTION_DATABASE_ID ||
        NOTION_DATABASES.CANDIDATES ||
        ""
      );
    case "INTERVIEWS":
      return process.env.NOTION_INTERVIEWS_DATABASE_ID || NOTION_DATABASES.INTERVIEWS || "";
    case "BUGS":
      return process.env.NOTION_BUGS_DATABASE_ID || NOTION_DATABASES.BUGS || "";
    case "EVENTS":
      return process.env.NOTION_EVENTS_DATABASE_ID || NOTION_DATABASES.EVENTS || "";
    case "CONTENT":
      return process.env.NOTION_CONTENT_DATABASE_ID || NOTION_DATABASES.CONTENT || "";
    case "ASSETS":
      return process.env.NOTION_ASSETS_DATABASE_ID || NOTION_DATABASES.ASSETS || "";
    case "FACULTY":
      return process.env.NOTION_FACULTY_DATABASE_ID || NOTION_DATABASES.FACULTY || "";
    case "RESOURCES":
      return process.env.NOTION_RESOURCES_DATABASE_ID || NOTION_DATABASES.RESOURCES || "";
    case "COLLEGE_INFO":
      return process.env.NOTION_COLLEGE_INFO_DATABASE_ID || NOTION_DATABASES.COLLEGE_INFO || "";
    case "COMMENTS":
      return process.env.NOTION_COMMENTS_DATABASE_ID || NOTION_DATABASES.COMMENTS || "";
    case "MEMBERS":
      return process.env.NOTION_MEMBERS_DATABASE_ID || NOTION_DATABASES.MEMBERS || "";
    case "MEETINGS":
      return process.env.NOTION_MEETINGS_DATABASE_ID || NOTION_DATABASES.MEETINGS || "";
    case "INCIDENTS":
      return process.env.NOTION_INCIDENTS_DATABASE_ID || NOTION_DATABASES.INCIDENTS || "";
    case "DOCUMENTATION":
      return process.env.NOTION_DOCUMENTATION_DATABASE_ID || NOTION_DATABASES.DOCUMENTATION || "";
    case "AUDIT":
      return process.env.NOTION_AUDIT_DATABASE_ID || NOTION_DATABASES.AUDIT || "";
    default:
      return (NOTION_DATABASES as any)[key] || "";
  }
}

export function isDatabaseConfigured(key: NotionDatabaseKey): boolean {
  return Boolean(getNotionDatabaseId(key));
}
