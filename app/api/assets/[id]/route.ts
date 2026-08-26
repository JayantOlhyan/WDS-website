import { NextRequest, NextResponse } from "next/server";
import { assetsRepository } from "@/lib/repositories/AssetsRepository";
import { updateAssetSchema } from "@/lib/validation/assets";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const assetId = params.id;

  const result = await assetsRepository.getById(assetId);
  if (!result.success || !result.data) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "NOT_FOUND",
      "Asset not found or Notion offline.",
      result.isOffline ? 503 : 404,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const assetId = params.id;

  try {
    const rawBody = await req.json();
    const parseResult = updateAssetSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid asset update payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await assetsRepository.update(assetId, parseResult.data as any);

    if (!result.success) {
      return createErrorResponse(
        result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
        "Failed to update asset in Notion.",
        result.isOffline ? 503 : 500,
        undefined,
        requestId
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/assets/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating asset.", 500, undefined, requestId);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const assetId = params.id;

  const result = await assetsRepository.archive(assetId);
  if (!result.success) {
    return createErrorResponse(
      result.isOffline ? "DATABASE_OFFLINE" : "PERSISTENCE_FAILED",
      "Failed to archive asset in Notion.",
      result.isOffline ? 503 : 500,
      undefined,
      requestId
    );
  }

  return NextResponse.json({ success: true, message: "Asset archived successfully." }, { status: 200, headers: { "X-Request-ID": requestId } });
}
