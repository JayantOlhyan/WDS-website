import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { bugService } from "@/lib/services/bugService";
import { createBugSchema } from "@/lib/validation/bug";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await bugService.getBugs();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createBugSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid bug payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await bugService.createBug(parseResult.data);

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to report bug in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/bugs Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while reporting bug.", 500, undefined, requestId);
  }
}
