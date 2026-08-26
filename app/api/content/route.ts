import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { contentService } from "@/lib/services/contentService";
import { createContentSchema } from "@/lib/validation/content";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "content.read");
  if ("response" in auth) return auth.response;

  const content = await contentService.getContentItems();
  return NextResponse.json({ success: true, data: content }, { status: 200, headers: { "X-Request-ID": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "content.create");
  if ("response" in auth) return auth.response;

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

    const item = await contentService.createContentItem(parseResult.data, auth.session);
    return NextResponse.json({ success: true, data: item }, { status: 201, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[POST /api/content Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while creating content.", 500, undefined, requestId);
  }
}
