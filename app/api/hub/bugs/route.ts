import { NextRequest, NextResponse } from "next/server";
import { getHubSessionFromRequest } from "@/lib/auth";
import { fetchNotionBugs, createNotionBug } from "@/lib/notion/bugs";
import { BugItem } from "@/lib/hub/types";

export async function GET(req: NextRequest) {
  const session = getHubSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Hub session required." }, { status: 401 });
  }

  const { bugs, source } = await fetchNotionBugs();
  return NextResponse.json({ success: true, bugs, source }, { status: 200 });
}

// POST endpoint can also accept bugs reported directly from the Bug Hunt platform webhook
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BugItem;
    if (!body.title || !body.page) {
      return NextResponse.json(
        { error: "Bug title and target page are required." },
        { status: 400 }
      );
    }

    const created = await createNotionBug(body);
    return NextResponse.json(
      { success: true, persistedToNotion: created, bug: body },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[Hub Bugs POST Error]:", err);
    return NextResponse.json({ error: "Failed to log bug report." }, { status: 500 });
  }
}
