import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { contentService } from "@/lib/services/contentService";
import { patchContentStageSchema } from "@/lib/validation/content";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "content.review");
  if ("response" in auth) return auth.response;

  const contentId = params.id;
  if (!contentId) {
    return createErrorResponse("VALIDATION_ERROR", "Content ID is required.", 400, undefined, requestId);
  }

  try {
    const rawBody = await req.json();
    const parseResult = patchContentStageSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid content stage payload.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const updated = await contentService.updateContentStage(contentId, parseResult.data, auth.session);
    if (!updated) {
      return createErrorResponse("NOT_FOUND", "Content item not found.", 404, undefined, requestId);
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200, headers: { "X-Request-ID": requestId } });
  } catch (err) {
    console.error("[PATCH /api/content/[id] Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error while updating content.", 500, undefined, requestId);
  }
}
