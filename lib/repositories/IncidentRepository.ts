export type IncidentStatus = "DETECTED" | "INVESTIGATING" | "IDENTIFIED" | "RESOLVED";

export interface WebsiteIncident {
  id: string;
  website: string;
  detectedAt: string;
  resolvedAt?: string;
  status: IncidentStatus;
  httpStatus?: number;
  assignedTo: string;
  notes: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

class MemoryIncidentRepository {
  private incidents: WebsiteIncident[] = [];

  public async getIncidents(): Promise<WebsiteIncident[]> {
    return this.incidents;
  }

  public async createIncident(incident: Omit<WebsiteIncident, "id" | "detectedAt">): Promise<WebsiteIncident> {
    const newInc: WebsiteIncident = {
      id: `INC-${Date.now()}`,
      detectedAt: new Date().toISOString(),
      ...incident,
    };
    this.incidents.unshift(newInc);
    return newInc;
  }

  public async updateIncidentStatus(
    id: string,
    status: IncidentStatus,
    notes?: string
  ): Promise<WebsiteIncident | null> {
    const inc = this.incidents.find((i) => i.id === id);
    if (!inc) return null;
    inc.status = status;
    if (status === "RESOLVED") {
      inc.resolvedAt = new Date().toISOString();
    }
    if (notes) {
      inc.notes = notes;
    }
    return inc;
  }
}

export const incidentRepository = new MemoryIncidentRepository();
