import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { documentationService } from "@/lib/services/documentationService";
import { createDocumentationSchema } from "@/lib/validation/documentation";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  const result = await documentationService.getDocs();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireSession(req);
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createDocumentationSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid documentation payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await documentationService.createDoc(parseResult.data, auth.session);
    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to record SOP documentation in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/documentation Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while recording documentation.", 500, undefined, requestId);
  }
}
