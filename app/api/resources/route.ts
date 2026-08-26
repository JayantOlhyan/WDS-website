import { NextRequest, NextResponse } from "next/server";
import { resourcesRepository } from "@/lib/repositories/ResourcesRepository";
import { createResourceSchema } from "@/lib/validation/resources";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || undefined;
  const search = searchParams.get("search") || undefined;

  const result = await resourcesRepository.getAll({ type, search });

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion Resources database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    const rawBody = await req.json();
    const parseResult = createResourceSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid resource payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await resourcesRepository.create(parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to register resource in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/resources Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while registering resource.", 500, undefined, requestId);
  }
}
