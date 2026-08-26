import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { contentRepository, ContentWorkflowStage } from "@/lib/repositories/ContentRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { z } from "zod";

const createContentSchema = z.object({
  title: z.string().min(3).max(150).trim(),
  platform: z.enum(["INSTAGRAM", "LINKEDIN", "NEWSLETTER", "WEBSITE_BLOG"]),
  stage: z.enum(["IDEA", "DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"]).default("DRAFT"),
  author: z.string().max(80).trim().default("WDS Creator"),
  reviewer: z.string().max(80).optional(),
  scheduledDate: z.string().max(50).optional(),
  caption: z.string().max(1000).optional(),
  project: z.string().max(80).optional(),
});

const patchContentStageSchema = z.object({
  stage: z.enum(["IDEA", "DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"]),
});

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "content.read");
  if ("response" in auth) return auth.response;

  const content = await contentRepository.getContentItems();
  return NextResponse.json({ success: true, data: content }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requirePermission(req, "content.create");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createContentSchema.safeParse(rawBody);

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

    const item = await contentRepository.createContentItem(parseResult.data);

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "CONTENT_ITEM_CREATED",
      resource: "ContentItem",
      resourceId: item.id,
      details: { title: item.title, platform: item.platform },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/hub/content Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requirePermission(req, "content.review");
  if ("response" in auth) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: "Content ID required." }, { status: 400 });
    }

    const rawBody = await req.json();
    const parseResult = patchContentStageSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: "VALIDATION_ERROR" }, { status: 400 });
    }

    const updated = await contentRepository.updateContentStage(id, parseResult.data.stage as ContentWorkflowStage);
    if (!updated) {
      return NextResponse.json({ success: false, error: "NOT_FOUND", message: "Content item not found." }, { status: 404 });
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "CONTENT_STAGE_UPDATED",
      resource: "ContentItem",
      resourceId: id,
      details: { stage: parseResult.data.stage },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/hub/content Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
