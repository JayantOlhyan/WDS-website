import { Client } from "@notionhq/client";
import { RecruitmentApplicationInput } from "./validation";

export interface NotionSubmissionResult {
  success: boolean;
  status: "PERSISTED" | "DUPLICATE" | "DATABASE_UNCONFIGURED" | "PERSISTENCE_FAILED";
  message: string;
  recordId?: string;
}

export async function submitToNotionDatabase(
  data: RecruitmentApplicationInput
): Promise<NotionSubmissionResult> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  // Truthful check: If database is unconfigured, return explicit status
  if (!notionApiKey || !notionDatabaseId) {
    console.warn(
      "[WDS Recruitment] NOTION_API_KEY or NOTION_DATABASE_ID is unconfigured in environment."
    );
    return {
      success: false,
      status: "DATABASE_UNCONFIGURED",
      message:
        "The society recruitment database is currently being initialized. Please contact hello@wds.msit or try again shortly.",
    };
  }

  try {
    const notion = new Client({ auth: notionApiKey });

    // Step 1: Duplicate check by Phone
    try {
      const existingQuery = await notion.databases.query({
        database_id: notionDatabaseId,
        filter: {
          property: "Phone",
          phone_number: {
            equals: data.phone,
          },
        },
      });

      if (existingQuery.results.length > 0) {
        return {
          success: false,
          status: "DUPLICATE",
          message: `An application with phone number ${data.phone} has already been submitted for WDS 2026.`,
        };
      }
    } catch (queryErr) {
      console.warn("[WDS Recruitment] Duplicate query check error (skipping):", queryErr);
    }

    // Step 2: Create new Notion record
    const response = await notion.pages.create({
      parent: { database_id: notionDatabaseId },
      properties: {
        "Name": {
          title: [{ text: { content: data.fullName } }],
        },
        "Enrollment Number": {
          rich_text: [{ text: { content: data.year } }],
        },
        "Branch": {
          select: { name: data.branch },
        },
        "Section": {
          rich_text: [{ text: { content: data.section } }],
        },
        "Email": {
          email: data.collegeEmail,
        },
        "Phone": {
          phone_number: data.phone,
        },
        "Interests": {
          multi_select: data.interests.map((item) => ({ name: item.substring(0, 50) })),
        },
        "Experience Level": {
          select: { name: data.experienceLevel },
        },
        "GitHub": {
          url: data.githubUrl && data.githubUrl.startsWith("http") ? data.githubUrl : null,
        },
        "LinkedIn": {
          url: data.linkedinUrl && data.linkedinUrl.startsWith("http") ? data.linkedinUrl : null,
        },
        "Portfolio": {
          url: data.portfolioUrl && data.portfolioUrl.startsWith("http") ? data.portfolioUrl : null,
        },
        "Projects & Work": {
          rich_text: [
            { text: { content: (data.projectLinks || "None provided").substring(0, 2000) } },
          ],
        },
        "Why WDS": {
          rich_text: [{ text: { content: data.whyWds.substring(0, 2000) } }],
        },
        "Learning Goal": {
          rich_text: [{ text: { content: data.learningGoal.substring(0, 2000) } }],
        },
        "Scenario Response": {
          rich_text: [{ text: { content: data.scenarioResponse.substring(0, 2000) } }],
        },
        "Time Commitment": {
          select: { name: data.timeCommitment },
        },
        "Preferred Team": {
          select: { name: data.preferredTeam },
        },
        "Application Status": {
          status: { name: "NEW" },
        },
      },
    });

    return {
      success: true,
      status: "PERSISTED",
      message: "Application submitted and recorded in WDS Recruitment Database.",
      recordId: response.id,
    };
  } catch (error: unknown) {
    console.error("[WDS Recruitment] Error persisting application:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal error connecting to database.";
    return {
      success: false,
      status: "PERSISTENCE_FAILED",
      message: `Failed to save application: ${errorMessage}. Please retry or email hello@wds.msit.`,
    };
  }
}
