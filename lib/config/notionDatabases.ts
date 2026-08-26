export const NOTION_DATABASES = {
  RECRUITMENT: process.env.NOTION_RECRUITMENT_DATABASE_ID || process.env.NOTION_DATABASE_ID || "",
  INTERVIEWS: process.env.NOTION_INTERVIEWS_DATABASE_ID || "",
  TASKS: process.env.NOTION_TASKS_DATABASE_ID || "",
  BUGS: process.env.NOTION_BUGS_DATABASE_ID || "",
  PROJECTS: process.env.NOTION_PROJECTS_DATABASE_ID || "",
  EVENTS: process.env.NOTION_EVENTS_DATABASE_ID || "",
  CONTENT: process.env.NOTION_CONTENT_DATABASE_ID || "",
  MEMBERS: process.env.NOTION_MEMBERS_DATABASE_ID || "",
  ASSETS: process.env.NOTION_ASSETS_DATABASE_ID || "",
  FACULTY: process.env.NOTION_FACULTY_DATABASE_ID || "",
  MEETINGS: process.env.NOTION_MEETINGS_DATABASE_ID || "",
  INCIDENTS: process.env.NOTION_INCIDENTS_DATABASE_ID || "",
  DOCUMENTATION: process.env.NOTION_DOCUMENTATION_DATABASE_ID || "",
  AUDIT: process.env.NOTION_AUDIT_DATABASE_ID || "",
} as const;

export type NotionDatabaseKey = keyof typeof NOTION_DATABASES;

export function getNotionDatabaseId(key: NotionDatabaseKey): string {
  return NOTION_DATABASES[key] || "";
}

export function isDatabaseConfigured(key: NotionDatabaseKey): boolean {
  return Boolean(NOTION_DATABASES[key]);
}
