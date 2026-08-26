import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/webhook";
import { bugService } from "@/lib/services/bugService";
import { bugHuntWebhookSchema } from "@/lib/validation/bug";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const signature = req.headers.get("x-wds-signature-256");
  const secret = process.env.BUG_HUNT_WEBHOOK_SECRET || "";

  try {
    const rawBody = await req.text();

    if (!signature || !secret || !verifyWebhookSignature(rawBody, signature, secret)) {
      return createErrorResponse(
        "WEBHOOK_INVALID",
        "Invalid or missing HMAC SHA-256 signature.",
        401,
        undefined,
        requestId
      );
    }

    let jsonPayload: any;
    try {
      jsonPayload = JSON.parse(rawBody);
    } catch {
      return createErrorResponse("VALIDATION_ERROR", "Invalid JSON payload.", 400, undefined, requestId);
    }

    const parseResult = bugHuntWebhookSchema.safeParse(jsonPayload);
    if (!parseResult.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid Bug Hunt webhook payload format.",
        400,
        parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        requestId
      );
    }

    const result = await bugService.ingestWebhookBug(parseResult.data);

    if (result.duplicate) {
      return NextResponse.json(
        { success: true, duplicate: true, message: "Webhook event already processed.", bugId: parseResult.data.bugId },
        { status: 200, headers: { "X-Request-ID": requestId } }
      );
    }

    if (!result.success) {
      return createErrorResponse("PERSISTENCE_FAILED", "Failed to persist webhook bug in Notion.", 500, undefined, requestId);
    }

    return NextResponse.json(
      { success: true, ingested: true, bugId: result.bug?.id },
      { status: 201, headers: { "X-Request-ID": requestId } }
    );
  } catch (err) {
    console.error("[POST /api/bugs/webhook Error]:", err);
    return createErrorResponse("INTERNAL_ERROR", "Server error processing webhook.", 500, undefined, requestId);
  }
}
