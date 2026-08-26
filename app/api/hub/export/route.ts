import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireMinimumRole } from "@/lib/auth";
import { recruitmentRepository } from "@/lib/repositories/RecruitmentRepository";
import { taskRepository } from "@/lib/repositories/TaskRepository";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { projectRepository } from "@/lib/repositories/ProjectRepository";

function arrayToCsv(data: Record<string, any>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const val = row[header] ?? "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "tasks";

  if (type === "recruitment") {
    const auth = requireMinimumRole(req, "CORE_TEAM");
    if ("response" in auth) return auth.response;

    const result = await recruitmentRepository.getApplications();
    const csv = arrayToCsv(result.data);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_recruitment_${Date.now()}.csv"`,
      },
    });
  }

  if (type === "audit") {
    const auth = requireMinimumRole(req, "ADMIN");
    if ("response" in auth) return auth.response;

    const logs = await auditRepository.getRecentLogs(200);
    const csv = arrayToCsv(logs);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_audit_${Date.now()}.csv"`,
      },
    });
  }

  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  if (type === "tasks") {
    const result = await taskRepository.getTasks();
    const csv = arrayToCsv(result.data);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_tasks_${Date.now()}.csv"`,
      },
    });
  }

  if (type === "bugs") {
    const result = await bugRepository.getBugs();
    const csv = arrayToCsv(result.data);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_bugs_${Date.now()}.csv"`,
      },
    });
  }

  if (type === "projects") {
    const projects = await projectRepository.getProjects();
    const csv = arrayToCsv(projects);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_projects_${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ success: false, error: "INVALID_EXPORT_TYPE" }, { status: 400 });
}
