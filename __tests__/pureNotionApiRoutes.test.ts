import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getTasks, POST as postTasks } from "../app/api/tasks/route";
import { GET as getProjects, POST as postProjects } from "../app/api/projects/route";
import { GET as getCandidates, POST as postCandidates } from "../app/api/candidates/route";
import { GET as getBugs, POST as postBugs } from "../app/api/bugs/route";
import { GET as getEvents } from "../app/api/events/route";
import { GET as getContent } from "../app/api/content/route";
import { GET as getAssets } from "../app/api/assets/route";
import { GET as getFaculty } from "../app/api/faculty/route";
import { GET as getResources } from "../app/api/resources/route";
import { GET as getCollegeInfo } from "../app/api/college-info/route";
import { GET as getDashboard } from "../app/api/dashboard/route";
import { GET as getSearch } from "../app/api/search/route";

vi.mock("../lib/notion/client", () => ({
  queryDatabase: vi.fn(),
  getPage: vi.fn(),
  createPage: vi.fn(),
  updatePage: vi.fn(),
  archivePage: vi.fn(),
  getDatabaseSchema: vi.fn(),
  addCommentBlock: vi.fn(),
  getNotionClient: vi.fn(),
  isNotionConfigured: vi.fn(() => true),
}));

import * as notionClient from "../lib/notion/client";

describe("WDS Pure Notion API Routes Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NOTION_TASKS_DATABASE_ID = "test-tasks-db";
    process.env.NOTION_PROJECTS_DATABASE_ID = "test-projects-db";
    process.env.NOTION_CANDIDATES_DATABASE_ID = "test-candidates-db";
    process.env.NOTION_INTERVIEWS_DATABASE_ID = "test-interviews-db";
    process.env.NOTION_BUGS_DATABASE_ID = "test-bugs-db";
    process.env.NOTION_EVENTS_DATABASE_ID = "test-events-db";
    process.env.NOTION_CONTENT_DATABASE_ID = "test-content-db";
    process.env.NOTION_ASSETS_DATABASE_ID = "test-assets-db";
    process.env.NOTION_FACULTY_DATABASE_ID = "test-faculty-db";
    process.env.NOTION_RESOURCES_DATABASE_ID = "test-resources-db";
    process.env.NOTION_COLLEGE_INFO_DATABASE_ID = "test-college-info-db";
  });

  it("GET /api/tasks returns task lists with pagination headers", async () => {
    (notionClient.queryDatabase as any).mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: "task-1",
          created_time: "2026-08-27T00:00:00.000Z",
          properties: {
            Task: { title: [{ plain_text: "Test Task" }] },
            Status: { select: { name: "TODO" } },
            Priority: { select: { name: "HIGH" } },
            Assignee: { rich_text: [{ plain_text: "Jayant" }] },
          },
        },
      ],
      totalFetched: 1,
    });

    const req = new NextRequest("http://localhost:3000/api/tasks?page=1&limit=20");
    const res = await getTasks(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.length).toBe(1);
    expect(json.data[0].title).toBe("Test Task");
    expect(json.pagination.page).toBe(1);
    expect(res.headers.get("X-Request-ID")).toBeTruthy();
  });

  it("POST /api/tasks validates payload and creates Notion task", async () => {
    (notionClient.createPage as any).mockResolvedValueOnce({
      success: true,
      id: "page-task-created",
    });

    const req = new NextRequest("http://localhost:3000/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: "Integrate Notion Webhook",
        status: "TODO",
        priority: "HIGH",
        assignee: "Jayant",
      }),
    });

    const res = await postTasks(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.title).toBe("Integrate Notion Webhook");
  });

  it("POST /api/tasks returns 400 validation error when title is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        status: "TODO",
      }),
    });

    const res = await postTasks(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("GET /api/dashboard returns dynamically aggregated live counters", async () => {
    (notionClient.queryDatabase as any).mockResolvedValue({
      success: true,
      data: [],
      totalFetched: 0,
    });

    const res = await getDashboard();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.tasks).toBeDefined();
    expect(json.data.bugs).toBeDefined();
    expect(json.data.projects).toBeDefined();
    expect(json.data.events).toBeDefined();
    expect(json.data.content).toBeDefined();
    expect(json.data.candidates).toBeDefined();
  });

  it("GET /api/search filters across tasks and projects without leaking candidate PII", async () => {
    (notionClient.queryDatabase as any).mockResolvedValue({
      success: true,
      data: [
        {
          id: "task-search-1",
          created_time: "2026-08-27T00:00:00.000Z",
          properties: {
            Task: { title: [{ plain_text: "Navbar responsive layout bug" }] },
            Status: { select: { name: "IN_PROGRESS" } },
            Priority: { select: { name: "HIGH" } },
            Assignee: { rich_text: [{ plain_text: "Jayant" }] },
          },
        },
      ],
      totalFetched: 1,
    });

    const req = new NextRequest("http://localhost:3000/api/search?q=navbar");
    const res = await getSearch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].title.toLowerCase()).toContain("navbar");
    expect(json.data.every((r: any) => r.type !== "candidate" && r.type !== "interview")).toBe(true);
  });
});
