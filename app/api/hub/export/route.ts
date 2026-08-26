import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireMinimumRole } from "@/lib/auth";
import { recruitmentRepository } from "@/lib/repositories/RecruitmentRepository";
import { taskRepository } from "@/lib/repositories/TaskRepository";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { projectRepository } from "@/lib/repositories/ProjectRepository";
import { generateRequestId } from "@/lib/errors";
import { arrayToCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "tasks";

  if (type === "recruitment") {
    const auth = requireMinimumRole(req, "CORE_TEAM");
    if ("response" in auth) return auth.response;

    const result = await recruitmentRepository.getApplications();
    const csv = arrayToCsv(result.data);

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "RECRUITMENT_EXPORT_GENERATED",
      resource: "CandidateApplications",
      resourceId: "ALL",
      details: { count: result.data.length, requestId },
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_recruitment_${Date.now()}.csv"`,
        "X-Request-ID": requestId,
      },
    });
  }

  if (type === "audit") {
    const auth = requireMinimumRole(req, "ADMIN");
    if ("response" in auth) return auth.response;

    const logs = await auditRepository.getRecentLogs(200);
    const csv = arrayToCsv(logs);

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "AUDIT_LOG_EXPORT_GENERATED",
      resource: "AuditLog",
      resourceId: "ALL",
      details: { count: logs.length, requestId },
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wds_audit_${Date.now()}.csv"`,
        "X-Request-ID": requestId,
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
        "X-Request-ID": requestId,
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
        "X-Request-ID": requestId,
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
        "X-Request-ID": requestId,
      },
    });
  }

  return NextResponse.json(
    { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid export type.", requestId } },
    { status: 400, headers: { "X-Request-ID": requestId } }
  );
}
