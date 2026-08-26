import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { eventRepository, EventLifecycleStage } from "@/lib/repositories/EventRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(3).max(120).trim(),
  stage: z.enum(["IDEA", "PLANNING", "ANNOUNCED", "REGISTRATION", "LIVE", "COMPLETED", "ARCHIVED"]).default("PLANNING"),
  date: z.string().min(4).max(50).trim(),
  venue: z.string().min(2).max(100).trim(),
  lead: z.string().max(80).trim().default("WDS Lead"),
  description: z.string().min(5).max(500).trim(),
  expectedAttendance: z.number().int().positive().default(50),
  registrationLink: z.string().max(200).optional(),
});

const patchEventStageSchema = z.object({
  stage: z.enum(["IDEA", "PLANNING", "ANNOUNCED", "REGISTRATION", "LIVE", "COMPLETED", "ARCHIVED"]),
});

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "events.read");
  if ("response" in auth) return auth.response;

  const events = await eventRepository.getEvents();
  return NextResponse.json({ success: true, data: events }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requirePermission(req, "events.manage");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createEventSchema.safeParse(rawBody);

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

    const event = await eventRepository.createEvent(parseResult.data);

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "EVENT_CREATED",
      resource: "Event",
      resourceId: event.id,
      details: { title: event.title, date: event.date },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/hub/events Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requirePermission(req, "events.manage");
  if ("response" in auth) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: "Event ID required." }, { status: 400 });
    }

    const rawBody = await req.json();
    const parseResult = patchEventStageSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: "VALIDATION_ERROR" }, { status: 400 });
    }

    const updated = await eventRepository.updateEventStage(id, parseResult.data.stage as EventLifecycleStage);
    if (!updated) {
      return NextResponse.json({ success: false, error: "NOT_FOUND", message: "Event not found." }, { status: 404 });
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "EVENT_STAGE_UPDATED",
      resource: "Event",
      resourceId: id,
      details: { stage: parseResult.data.stage },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/hub/events Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
