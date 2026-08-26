import { incidentRepository, WebsiteIncident, IncidentStatus } from "../repositories/IncidentRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateIncidentInput, UpdateIncidentInput } from "../validation/incident";

export class IncidentService {
  public async getIncidents(): Promise<WebsiteIncident[]> {
    return incidentRepository.getIncidents();
  }

  public async createIncident(
    input: CreateIncidentInput,
    actor?: { username: string; role: string }
  ): Promise<WebsiteIncident> {
    const incident = await incidentRepository.createIncident({
      website: input.website,
      severity: input.severity,
      assignedTo: input.assignedTo,
      notes: input.notes,
      httpStatus: input.httpStatus,
      status: "DETECTED",
    });

    if (actor) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "INCIDENT_DECLARED",
        resource: "Incident",
        resourceId: incident.id,
        details: { website: incident.website, severity: incident.severity },
      });
    }

    return incident;
  }

  public async updateIncidentStatus(
    id: string,
    input: UpdateIncidentInput,
    actor: { username: string; role: string }
  ): Promise<WebsiteIncident | null> {
    const updated = await incidentRepository.updateIncidentStatus(
      id,
      input.status as IncidentStatus,
      input.notes
    );

    if (updated) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "INCIDENT_STATUS_UPDATED",
        resource: "Incident",
        resourceId: id,
        details: input,
      });
    }

    return updated;
  }
}

export const incidentService = new IncidentService();
