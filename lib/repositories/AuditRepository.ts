import { IAuditRepository, AuditLogEntry } from "./types";

class MemoryAuditRepository implements IAuditRepository {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 200;

  public async logEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const logItem: AuditLogEntry = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.logs.unshift(logItem);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  public async getRecentLogs(limit: number = 50): Promise<AuditLogEntry[]> {
    return this.logs.slice(0, limit);
  }
}

export const auditRepository: IAuditRepository = new MemoryAuditRepository();
