import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { assetService } from "@/lib/services/assetService";
import { createAssetSchema } from "@/lib/validation/asset";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await assetService.getAssets();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createAssetSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid asset payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await assetService.createAsset(parseResult.data, auth.session);
    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to register asset in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/assets Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while registering asset.", 500, undefined, requestId);
  }
}
