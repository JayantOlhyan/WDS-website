import { describe, it, expect, vi, beforeEach } from "vitest";
import { tasksRepository } from "../lib/repositories/TasksRepository";
import { projectsRepository } from "../lib/repositories/ProjectsRepository";
import { candidatesRepository } from "../lib/repositories/CandidatesRepository";
import { interviewsRepository } from "../lib/repositories/InterviewsRepository";
import { bugsRepository } from "../lib/repositories/BugsRepository";
import { eventsRepository } from "../lib/repositories/EventsRepository";
import { contentRepository } from "../lib/repositories/ContentRepository";
import { assetsRepository } from "../lib/repositories/AssetsRepository";
import { facultyRepository } from "../lib/repositories/FacultyRepository";
import { resourcesRepository } from "../lib/repositories/ResourcesRepository";
import { collegeInfoRepository } from "../lib/repositories/CollegeInfoRepository";

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

describe("WDS Pure Notion Repositories Test Suite", () => {
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

  it("TasksRepository transforms Notion pages to TaskRecord correctly", async () => {
    (notionClient.queryDatabase as any).mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: "page-task-1",
          created_time: "2026-08-27T00:00:00.000Z",
          last_edited_time: "2026-08-27T01:00:00.000Z",
          properties: {
            Task: { title: [{ plain_text: "Refactor Notion Repositories" }] },
            Status: { select: { name: "IN_PROGRESS" } },
            Priority: { select: { name: "HIGH" } },
            Assignee: { rich_text: [{ plain_text: "Jayant" }] },
            "Due Date": { date: { start: "2026-08-30" } },
            Tags: { multi_select: [{ name: "Backend" }] },
          },
        },
      ],
      totalFetched: 1,
    });

    const res = await tasksRepository.getAll();
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(1);
    expect(res.data[0].title).toBe("Refactor Notion Repositories");
    expect(res.data[0].status).toBe("IN_PROGRESS");
    expect(res.data[0].priority).toBe("HIGH");
    expect(res.data[0].assignee).toBe("Jayant");
    expect(res.data[0].dueDate).toBe("2026-08-30");
  });

  it("ProjectsRepository creates project page in Notion", async () => {
    (notionClient.createPage as any).mockResolvedValueOnce({
      success: true,
      id: "page-project-123",
    });

    const res = await projectsRepository.create({
      name: "WDS Main Website",
      description: "Official society web portal and operating platform",
      status: "ACTIVE",
      lead: "Jayant Olhyan",
    });

    expect(res.success).toBe(true);
    expect(res.id).toBe("page-project-123");
    expect(res.data.name).toBe("WDS Main Website");
    expect(notionClient.createPage).toHaveBeenCalled();
  });

  it("CandidatesRepository maps candidate application fields properly", async () => {
    (notionClient.queryDatabase as any).mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: "page-cand-1",
          created_time: "2026-08-27T00:00:00.000Z",
          properties: {
            "Full Name": { title: [{ plain_text: "Aarav Sharma" }] },
            "Enrollment Number": { rich_text: [{ plain_text: "0123456789" }] },
            "College Email": { email: "aarav@msit.in" },
            Phone: { phone_number: "+919876543210" },
            Branch: { select: { name: "CSE" } },
            Section: { rich_text: [{ plain_text: "3A" }] },
            Status: { select: { name: "SHORTLISTED" } },
            "Preferred Team": { select: { name: "Technical Wing" } },
          },
        },
      ],
    });

    const res = await candidatesRepository.getAll();
    expect(res.success).toBe(true);
    expect(res.data[0].fullName).toBe("Aarav Sharma");
    expect(res.data[0].email).toBe("aarav@msit.in");
    expect(res.data[0].status).toBe("SHORTLISTED");
  });

  it("InterviewsRepository calculates weighted overall scores when omitted", async () => {
    (notionClient.createPage as any).mockResolvedValueOnce({
      success: true,
      id: "page-int-1",
    });

    const res = await interviewsRepository.create({
      candidateName: "Aarav Sharma",
      interviewer: "Jayant Olhyan",
      round: "ROUND_1_TECHNICAL",
      date: "2026-08-27",
      technicalScore: 9,
      problemSolvingScore: 8,
      communicationScore: 8,
      teamFitScore: 8,
      strengths: "Fast learner",
      weaknesses: "Docker",
      recommendation: "STRONG_HIRE",
    });

    expect(res.success).toBe(true);
    expect(res.data.overallScore).toBe(8.4);
  });

  it("BugsRepository normalizes severity, priority and reports correctly", async () => {
    (notionClient.createPage as any).mockResolvedValueOnce({
      success: true,
      id: "page-bug-1",
    });

    const res = await bugsRepository.create({
      title: "Broken link on opportunities page",
      url: "https://msit.in/opportunities",
      severity: "LOW",
      priority: "P3",
      reporter: "hunter_01",
    });

    expect(res.success).toBe(true);
    expect(res.data.title).toBe("Broken link on opportunities page");
    expect(res.data.severity).toBe("LOW");
  });

  it("EventsRepository, ContentRepository, AssetsRepository, FacultyRepository, ResourcesRepository, CollegeInfoRepository return offline flag when Notion database is offline", async () => {
    (notionClient.queryDatabase as any).mockResolvedValue({
      success: false,
      isOffline: true,
      error: "DATABASE_OFFLINE",
      data: [],
    });

    const [eRes, cRes, aRes, fRes, rRes, clgRes] = await Promise.all([
      eventsRepository.getAll(),
      contentRepository.getAll(),
      assetsRepository.getAll(),
      facultyRepository.getAll(),
      resourcesRepository.getAll(),
      collegeInfoRepository.getAll(),
    ]);

    expect(eRes.isOffline).toBe(true);
    expect(cRes.isOffline).toBe(true);
    expect(aRes.isOffline).toBe(true);
    expect(fRes.isOffline).toBe(true);
    expect(rRes.isOffline).toBe(true);
    expect(clgRes.isOffline).toBe(true);
  });
});
