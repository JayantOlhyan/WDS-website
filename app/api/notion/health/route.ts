import { NextResponse } from "next/server";
import { getNotionClient, isNotionConfigured } from "@/lib/notion/client";
import { generateRequestId } from "@/lib/errors";

export async function GET() {
  const requestId = generateRequestId();

  if (!isNotionConfigured()) {
    return NextResponse.json(
      {
        success: true,
        data: {
          connected: false,
          configured: false,
          message: "NOTION_API_KEY environment variable is not configured.",
        },
      },
      { status: 200, headers: { "X-Request-ID": requestId } }
    );
  }

  const notion = getNotionClient();
  try {
    const userRes: any = await notion?.users.me({});
    return NextResponse.json(
      {
        success: true,
        data: {
          connected: Boolean(userRes?.id),
          configured: true,
          botName: userRes?.name || "WDS Operational Bot",
        },
      },
      { status: 200, headers: { "X-Request-ID": requestId } }
    );
  } catch (err: any) {
    console.error("[GET /api/notion/health Error]:", err?.message || err);
    return NextResponse.json(
      {
        success: true,
        data: {
          connected: false,
          configured: true,
          message: "Unable to authenticate with Notion API. Verify NOTION_API_KEY.",
        },
      },
      { status: 200, headers: { "X-Request-ID": requestId } }
    );
  }
}
