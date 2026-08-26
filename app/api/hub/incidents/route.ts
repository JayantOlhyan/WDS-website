import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { incidentRepository, IncidentStatus } from "@/lib/repositories/IncidentRepository";
import { auditRepository } from "@/lib/repositories/AuditRepository";
import { z } from "zod";

const createIncidentSchema = z.object({
  website: z.string().min(1).max(200).trim(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("HIGH"),
  assignedTo: z.string().max(80).trim().default("Technical Lead"),
  notes: z.string().min(3).max(500).trim(),
  httpStatus: z.number().int().optional(),
});

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "system.health.read");
  if ("response" in auth) return auth.response;

  const incidents = await incidentRepository.getIncidents();
  return NextResponse.json({ success: true, data: incidents }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = requirePermission(req, "system.incidents.manage");
  if ("response" in auth) return auth.response;

  try {
    const rawBody = await req.json();
    const parseResult = createIncidentSchema.safeParse(rawBody);

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

    const incident = await incidentRepository.createIncident({
      ...parseResult.data,
      status: "DETECTED",
    });

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "INCIDENT_DECLARED",
      resource: "Incident",
      resourceId: incident.id,
      details: { website: incident.website, severity: incident.severity },
    });

    return NextResponse.json({ success: true, data: incident }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/hub/incidents Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requirePermission(req, "system.incidents.manage");
  if ("response" in auth) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: "Incident ID required." }, { status: 400 });
    }

    const { status, notes } = await req.json();
    if (!status || !["DETECTED", "INVESTIGATING", "IDENTIFIED", "RESOLVED"].includes(status)) {
      return NextResponse.json({ success: false, error: "VALIDATION_ERROR", message: "Invalid status." }, { status: 400 });
    }

    const updated = await incidentRepository.updateIncidentStatus(id, status as IncidentStatus, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "NOT_FOUND", message: "Incident not found." }, { status: 404 });
    }

    await auditRepository.logEvent({
      actor: auth.session.username,
      role: auth.session.role,
      action: "INCIDENT_STATUS_UPDATED",
      resource: "Incident",
      resourceId: id,
      details: { status, notes },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/hub/incidents Error]:", err);
    return NextResponse.json({ success: false, error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
