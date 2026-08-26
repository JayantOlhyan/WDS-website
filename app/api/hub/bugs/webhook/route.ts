import { NextRequest, NextResponse } from "next/server";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { bugHuntWebhookPayloadSchema } from "@/lib/validation";
import { verifyWebhookSignature, registerWebhookEventId } from "@/lib/webhook";
import { generateRequestId } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const webhookSecret = process.env.BUG_HUNT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Bug Hunt Webhook Error]: BUG_HUNT_WEBHOOK_SECRET is not configured on the server.");
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "WEBHOOK_NOT_CONFIGURED",
          message: "Server webhook secret unconfigured.",
          requestId,
        },
      },
      { status: 503, headers: { "X-Request-ID": requestId } }
    );
  }

  const rawPayload = await req.text();
  const signatureHeader = req.headers.get("x-wds-signature-256") || req.headers.get("x-hub-signature-256");

  const isValid = verifyWebhookSignature(rawPayload, signatureHeader, webhookSecret);
  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_SIGNATURE",
          message: "HMAC signature verification failed.",
          requestId,
        },
      },
      { status: 401, headers: { "X-Request-ID": requestId } }
    );
  }

  try {
    const jsonBody = JSON.parse(rawPayload);
    const parseResult = bugHuntWebhookPayloadSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Malformed bug hunt webhook payload.",
            requestId,
            details: parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
          },
        },
        { status: 400, headers: { "X-Request-ID": requestId } }
      );
    }

    const payload = parseResult.data;

    // Enforce Idempotency (prevent duplicate bug creation)
    const isNew = registerWebhookEventId(payload.bugId);
    if (!isNew) {
      return NextResponse.json(
        { success: true, duplicate: true, message: "Webhook event already processed.", bugId: payload.bugId },
        { status: 200, headers: { "X-Request-ID": requestId } }
      );
    }

    const result = await bugRepository.createBug({
      id: payload.bugId,
      title: payload.title,
      page: payload.website,
      severity: payload.severity,
      status: "OPEN",
      reporter: payload.reporterHandle,
      date: new Date().toISOString(),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PERSISTENCE_FAILED",
            message: "Failed to persist bug to database.",
            requestId,
          },
        },
        { status: 500, headers: { "X-Request-ID": requestId } }
      );
    }

    await auditRepository.logEvent({
      actor: "BUG_HUNT_WEBHOOK",
      role: "INTEGRATION",
      action: "WEBHOOK_BUG_INGESTED",
      resource: "Bug",
      resourceId: result.data.id,
      details: { title: payload.title, site: payload.website, reporter: payload.reporterHandle, requestId },
    });

    return NextResponse.json(
      { success: true, ingested: true, bugId: result.data.id },
      { status: 201, headers: { "X-Request-ID": requestId } }
    );
  } catch (err) {
    console.error("[Webhook Ingestion Error]:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Server parsing failure.", requestId } },
      { status: 500, headers: { "X-Request-ID": requestId } }
    );
  }
}
