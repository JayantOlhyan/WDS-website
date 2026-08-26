import { Client } from "@notionhq/client";

export interface RecruitmentFormData {
  fullName: string;
  enrollmentNo: string;
  branch: string;
  section: string;
  collegeEmail: string;
  phone: string;
  interests: string[];
  experienceLevel: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  projectLinks?: string;
  whyWds: string;
  learningGoal: string;
  scenarioResponse: string;
  timeCommitment: string;
  preferredTeam: string;
}

export async function submitToNotionDatabase(data: RecruitmentFormData): Promise<{
  success: boolean;
  message: string;
  recordId?: string;
  isMock?: boolean;
}> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !notionDatabaseId) {
    console.warn(
      "[WDS Recruitment] NOTION_API_KEY or NOTION_DATABASE_ID not detected in environment. Application logged locally and mock success returned."
    );
    console.log("[WDS Recruitment Payload]:", JSON.stringify(data, null, 2));

    // Return successful mock response so applicants have a seamless experience
    return {
      success: true,
      message: "Application received and logged successfully (Fallback Mode: configure NOTION_API_KEY & NOTION_DATABASE_ID for live sync).",
      recordId: "mock-" + Date.now(),
      isMock: true,
    };
  }

  try {
    const notion = new Client({ auth: notionApiKey });

    const response = await notion.pages.create({
      parent: { database_id: notionDatabaseId },
      properties: {
        "Name": {
          title: [
            {
              text: { content: data.fullName },
            },
          ],
        },
        "Enrollment Number": {
          rich_text: [
            {
              text: { content: data.enrollmentNo },
            },
          ],
        },
        "Branch": {
          select: {
            name: data.branch || "Unknown",
          },
        },
        "Section": {
          rich_text: [
            {
              text: { content: data.section },
            },
          ],
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
          select: {
            name: data.experienceLevel || "Beginner",
          },
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
            {
              text: { content: (data.projectLinks || "None provided").substring(0, 2000) },
            },
          ],
        },
        "Why WDS": {
          rich_text: [
            {
              text: { content: data.whyWds.substring(0, 2000) },
            },
          ],
        },
        "Learning Goal": {
          rich_text: [
            {
              text: { content: data.learningGoal.substring(0, 2000) },
            },
          ],
        },
        "Scenario Response": {
          rich_text: [
            {
              text: { content: data.scenarioResponse.substring(0, 2000) },
            },
          ],
        },
        "Time Commitment": {
          select: {
            name: data.timeCommitment || "2-4 hours",
          },
        },
        "Preferred Team": {
          select: {
            name: data.preferredTeam || "General Tech",
          },
        },
        "Application Status": {
          status: {
            name: "NEW",
          },
        },
      },
    });

    return {
      success: true,
      message: "Application submitted directly to WDS Notion Database.",
      recordId: response.id,
      isMock: false,
    };
  } catch (error: unknown) {
    console.error("[WDS Recruitment] Error sending to Notion:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error connecting to Notion";
    return {
      success: false,
      message: errorMessage,
    };
  }
}
