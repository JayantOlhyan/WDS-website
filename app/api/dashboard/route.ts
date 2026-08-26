import { NextResponse } from "next/server";
import { tasksRepository } from "@/lib/repositories/TasksRepository";
import { bugsRepository } from "@/lib/repositories/BugsRepository";
import { projectsRepository } from "@/lib/repositories/ProjectsRepository";
import { eventsRepository } from "@/lib/repositories/EventsRepository";
import { contentRepository } from "@/lib/repositories/ContentRepository";
import { candidatesRepository } from "@/lib/repositories/CandidatesRepository";
import { generateRequestId } from "@/lib/errors";

export async function GET() {
  const requestId = generateRequestId();

  try {
    const [tasksRes, bugsRes, projectsRes, eventsRes, contentRes, candidatesRes] = await Promise.all([
      tasksRepository.getAll({ limit: 500 }),
      bugsRepository.getAll(),
      projectsRepository.getAll(),
      eventsRepository.getAll(),
      contentRepository.getAll(),
      candidatesRepository.getAll(),
    ]);

    const tasks = tasksRes.data || [];
    const bugs = bugsRes.data || [];
    const projects = projectsRes.data || [];
    const events = eventsRes.data || [];
    const content = contentRes.data || [];
    const candidates = candidatesRes.data || [];

    const now = new Date();

    const dashboardMetrics = {
      tasks: {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "TODO" || t.status === "BLOCKED" || t.status === "REVIEW").length,
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        completed: tasks.filter((t) => t.status === "COMPLETED").length,
        overdue: tasks.filter((t) => {
          if (!t.dueDate || t.status === "COMPLETED") return false;
          const due = new Date(t.dueDate);
          return !isNaN(due.getTime()) && due < now;
        }).length,
      },
      bugs: {
        total: bugs.length,
        open: bugs.filter((b) => b.status === "OPEN" || b.status === "TRIAGED").length,
        inProgress: bugs.filter((b) => b.status === "IN_PROGRESS").length,
        resolved: bugs.filter((b) => b.status === "RESOLVED").length,
        critical: bugs.filter((b) => b.severity === "CRITICAL" && b.status !== "RESOLVED").length,
      },
      projects: {
        total: projects.length,
        active: projects.filter((p) => p.status === "ACTIVE").length,
        maintenance: projects.filter((p) => p.status === "MAINTENANCE").length,
        completed: projects.filter((p) => p.status === "COMPLETED").length,
      },
      events: {
        total: events.length,
        upcoming: events.filter((e) => e.status === "PLANNING" || e.status === "ANNOUNCED" || e.status === "REGISTRATION").length,
        live: events.filter((e) => e.status === "LIVE").length,
        completed: events.filter((e) => e.status === "COMPLETED").length,
      },
      content: {
        total: content.length,
        draft: content.filter((c) => c.status === "DRAFT" || c.status === "IDEA").length,
        review: content.filter((c) => c.status === "REVIEW").length,
        scheduled: content.filter((c) => c.status === "SCHEDULED" || c.status === "APPROVED").length,
        published: content.filter((c) => c.status === "PUBLISHED").length,
      },
      candidates: {
        total: candidates.length,
        received: candidates.filter((c) => c.status === "RECEIVED").length,
        screening: candidates.filter((c) => c.status === "SCREENING" || c.status === "SHORTLISTED").length,
        interview: candidates.filter((c) => c.status === "INTERVIEW").length,
        selected: candidates.filter((c) => c.status === "SELECTED").length,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: dashboardMetrics,
      },
      { status: 200, headers: { "X-Request-ID": requestId } }
    );
  } catch (err) {
    console.error("[GET /api/dashboard Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Failed to aggregate dashboard data.", requestId },
      },
      { status: 500, headers: { "X-Request-ID": requestId } }
    );
  }
}
