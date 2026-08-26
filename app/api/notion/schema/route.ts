import { NextResponse } from "next/server";
import { getDatabaseSchema } from "@/lib/notion/client";
import { NOTION_DATABASES, NotionDatabaseKey } from "@/lib/config/notionDatabases";
import { generateRequestId } from "@/lib/errors";

interface ExpectedDatabaseSchema {
  requiredProperties: string[];
}

const EXPECTED_SCHEMAS: Record<string, ExpectedDatabaseSchema> = {
  tasks: {
    requiredProperties: ["Task", "Status", "Priority", "Assignee"],
  },
  projects: {
    requiredProperties: ["Name", "Status", "Lead"],
  },
  candidates: {
    requiredProperties: ["Full Name", "Branch", "Status", "College Email"],
  },
  interviews: {
    requiredProperties: ["Candidate Name", "Technical Score", "Recommendation"],
  },
  bugs: {
    requiredProperties: ["Title", "Severity", "Status", "Reporter"],
  },
  events: {
    requiredProperties: ["Name", "Status", "Date", "Venue"],
  },
  content: {
    requiredProperties: ["Title", "Platform", "Status"],
  },
  assets: {
    requiredProperties: ["Name", "Category", "URL"],
  },
  faculty: {
    requiredProperties: ["Name", "Department", "Email"],
  },
  resources: {
    requiredProperties: ["Name", "Type", "URL"],
  },
  collegeInfo: {
    requiredProperties: ["Name", "Value"],
  },
};

const DB_KEY_MAP: Record<string, NotionDatabaseKey> = {
  tasks: "TASKS",
  projects: "PROJECTS",
  candidates: "CANDIDATES",
  interviews: "INTERVIEWS",
  bugs: "BUGS",
  events: "EVENTS",
  content: "CONTENT",
  assets: "ASSETS",
  faculty: "FACULTY",
  resources: "RESOURCES",
  collegeInfo: "COLLEGE_INFO",
};

export async function GET() {
  const requestId = generateRequestId();
  const report: Record<string, any> = {};

  for (const [key, expected] of Object.entries(EXPECTED_SCHEMAS)) {
    const dbKey = DB_KEY_MAP[key];
    const dbId = NOTION_DATABASES[dbKey];

    if (!dbId) {
      report[key] = {
        configured: false,
        schemaValid: false,
        message: `Database ID environment variable for ${key} is not configured.`,
      };
      continue;
    }

    try {
      const schemaRes = await getDatabaseSchema(dbId);

      if (!schemaRes.success || !schemaRes.properties) {
        report[key] = {
          configured: true,
          schemaValid: false,
          error: schemaRes.error || "DATABASE_SCHEMA_MISMATCH",
          message: "Failed to retrieve properties from Notion database.",
        };
        continue;
      }

      const existingProps = Object.keys(schemaRes.properties);
      // Case-insensitive / alternative matching
      const missingProperties: string[] = [];

      for (const required of expected.requiredProperties) {
        const found = existingProps.some(
          (p) => p.toLowerCase() === required.toLowerCase() || (required === "Task" && (p === "Title" || p === "Name"))
        );
        if (!found) {
          missingProperties.push(required);
        }
      }

      report[key] = {
        configured: true,
        schemaValid: missingProperties.length === 0,
        missingProperties,
        existingPropertiesCount: existingProps.length,
      };
    } catch (err: any) {
      report[key] = {
        configured: true,
        schemaValid: false,
        error: "SCHEMA_FETCH_EXCEPTION",
        message: err?.message || "Unknown error verifying database schema.",
      };
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: report,
    },
    { status: 200, headers: { "X-Request-ID": requestId } }
  );
}
