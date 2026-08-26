import { NextRequest, NextResponse } from "next/server";
import { contentRepository } from "@/lib/repositories/ContentRepository";
import { createContentSchema } from "@/lib/validation/content";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || undefined;
  const platform = searchParams.get("platform") || undefined;
  const search = searchParams.get("search") || undefined;

  const result = await contentRepository.getAll({ status, platform, search });

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Content database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createContentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid content item payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await contentRepository.create(parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to schedule content in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/content Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating content.", 500, undefined, requestId);
  }
}
