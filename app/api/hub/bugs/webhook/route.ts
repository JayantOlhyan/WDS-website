import { NextRequest, NextResponse } from "next/server";
import { bugRepository } from "@/lib/repositories/BugRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { bugHuntWebhookPayloadSchema } from "@/lib/validation";
import { verifyWebhookSignature } from "@/lib/webhook";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.BUG_HUNT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Bug Hunt Webhook Error]: BUG_HUNT_WEBHOOK_SECRET is not configured on the server.");
    return NextResponse.json(
      { success: false, error: "WEBHOOK_NOT_CONFIGURED", message: "Server webhook secret unconfigured." },
      { status: 503 }
    );
  }

  const rawPayload = await req.text();
  const signatureHeader = req.headers.get("x-wds-signature-256") || req.headers.get("x-hub-signature-256");

  const isValid = verifyWebhookSignature(rawPayload, signatureHeader, webhookSecret);
  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "INVALID_SIGNATURE", message: "HMAC signature verification failed." },
      { status: 401 }
    );
  }

  try {
    const jsonBody = JSON.parse(rawPayload);
    const parseResult = bugHuntWebhookPayloadSchema.safeParse(jsonBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          details: parseResult.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        },
        { status: 400 }
      );
    }

    const payload = parseResult.data;
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
        { success: false, error: "PERSISTENCE_FAILED", message: "Failed to persist bug to database." },
        { status: 500 }
      );
    }

    await auditRepository.logEvent({
      actor: "BUG_HUNT_WEBHOOK",
      role: "INTEGRATION",
      action: "WEBHOOK_BUG_INGESTED",
      resource: "Bug",
      resourceId: result.data.id,
      details: { title: payload.title, site: payload.website, reporter: payload.reporterHandle },
    });

    return NextResponse.json({ success: true, ingested: true, bugId: result.data.id }, { status: 201 });
  } catch (err) {
    console.error("[Webhook Ingestion Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
