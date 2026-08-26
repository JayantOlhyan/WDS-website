import { NextRequest, NextResponse } from "next/server";
import { tasksRepository } from "@/lib/repositories/TasksRepository";
import { projectsRepository } from "@/lib/repositories/ProjectsRepository";
import { bugsRepository } from "@/lib/repositories/BugsRepository";
import { eventsRepository } from "@/lib/repositories/EventsRepository";
import { contentRepository } from "@/lib/repositories/ContentRepository";
import { resourcesRepository } from "@/lib/repositories/ResourcesRepository";
import { generateRequestId } from "@/lib/errors";

export interface NormalizedSearchResult {
  type: "task" | "project" | "bug" | "event" | "content" | "resource";
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  status?: string;
}

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, data: [] }, { status: 200, headers: { "X-Request-ID": requestId } });
  }

  try {
    const [tasksRes, projectsRes, bugsRes, eventsRes, contentRes, resourcesRes] = await Promise.all([
      tasksRepository.getAll({ search: query }),
      projectsRepository.getAll(),
      bugsRepository.getAll({ search: query }),
      eventsRepository.getAll({ search: query }),
      contentRepository.getAll({ search: query }),
      resourcesRepository.getAll({ search: query }),
    ]);

    const results: NormalizedSearchResult[] = [];

    // 1. Tasks
    (tasksRes.data || []).forEach((t) => {
      if (t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query))) {
        results.push({
          type: "task",
          id: t.id,
          title: t.title,
          url: `/hub?tab=tasks&id=${t.id}`,
          subtitle: `${t.project} • ${t.assignee}`,
          status: t.status,
        });
      }
    });

    // 2. Projects
    (projectsRes.data || []).forEach((p) => {
      if (p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query)) || p.slug.includes(query)) {
        results.push({
          type: "project",
          id: p.id,
          title: p.name,
          url: `/hub?tab=projects&id=${p.id}`,
          subtitle: p.wing,
          status: p.status,
        });
      }
    });

    // 3. Bugs
    (bugsRes.data || []).forEach((b) => {
      if (b.title.toLowerCase().includes(query) || (b.description && b.description.toLowerCase().includes(query))) {
        results.push({
          type: "bug",
          id: b.id,
          title: b.title,
          url: `/hub?tab=bugs&id=${b.id}`,
          subtitle: `${b.project} • ${b.severity}`,
          status: b.status,
        });
      }
    });

    // 4. Events
    (eventsRes.data || []).forEach((e) => {
      if (e.name.toLowerCase().includes(query) || (e.description && e.description.toLowerCase().includes(query))) {
        results.push({
          type: "event",
          id: e.id,
          title: e.name,
          url: `/hub?tab=events&id=${e.id}`,
          subtitle: `${e.date} • ${e.venue}`,
          status: e.status,
        });
      }
    });

    // 5. Content
    (contentRes.data || []).forEach((c) => {
      if (c.title.toLowerCase().includes(query) || (c.caption && c.caption.toLowerCase().includes(query))) {
        results.push({
          type: "content",
          id: c.id,
          title: c.title,
          url: `/hub?tab=content&id=${c.id}`,
          subtitle: `${c.platform} • ${c.type}`,
          status: c.status,
        });
      }
    });

    // 6. Resources
    (resourcesRes.data || []).forEach((r) => {
      if (r.name.toLowerCase().includes(query) || (r.description && r.description.toLowerCase().includes(query))) {
        results.push({
          type: "resource",
          id: r.id,
          title: r.name,
          url: r.url || `/hub?tab=resources&id=${r.id}`,
          subtitle: `${r.type} • ${r.owner}`,
        });
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: results.slice(0, 30),
      },
      { status: 200, headers: { "X-Request-ID": requestId } }
    );
  } catch (err) {
    console.error("[GET /api/search Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Search execution failed.", requestId },
      },
      { status: 500, headers: { "X-Request-ID": requestId } }
    );
  }
}
