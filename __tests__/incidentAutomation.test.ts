import { describe, it, expect } from "vitest";
import { incidentRepository } from "../lib/repositories/IncidentRepository";

describe("Website State-Change Incident Lifecycle Automation", () => {
  it("creates an incident when site status transitions to DOWN", async () => {
    const incident = await incidentRepository.createIncident({
      website: "wds-bug-hunt.netlify.app",
      severity: "CRITICAL",
      status: "DETECTED",
      assignedTo: "Tech Lead",
      notes: "Health check reported HTTP 502 Bad Gateway.",
    });

    expect(incident.id).toMatch(/^INC-/);
    expect(incident.website).toBe("wds-bug-hunt.netlify.app");
    expect(incident.status).toBe("DETECTED");
    expect(incident.severity).toBe("CRITICAL");
  });

  it("resolves an active incident when service recovers ONLINE", async () => {
    const incident = await incidentRepository.createIncident({
      website: "msit.in",
      severity: "HIGH",
      status: "DETECTED",
      assignedTo: "Lead Dev",
      notes: "Connection timeout detected.",
    });

    const updated = await incidentRepository.updateIncidentStatus(incident.id, "RESOLVED");
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("RESOLVED");
    expect(updated?.resolvedAt).toBeDefined();
  });
});
