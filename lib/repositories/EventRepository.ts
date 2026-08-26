/**
 * EventRepository.ts — Compatibility wrapper around the Notion-backed EventsRepository.
 * Services and routes import from this file using the old API (getEvents, createEvent, updateEventStage).
 * Internally delegates to EventsRepository which calls the Notion API.
 */
import { eventsRepository, EventsRepository } from "./EventsRepository";
import { EventRecord } from "../types/event";

export type EventLifecycleStage =
  | "IDEA"
  | "PLANNING"
  | "ANNOUNCED"
  | "REGISTRATION"
  | "LIVE"
  | "COMPLETED"
  | "ARCHIVED";

export type SocietyEvent = EventRecord;

class EventRepositoryWrapper {
  private repo: EventsRepository;

  constructor(repo: EventsRepository) {
    this.repo = repo;
  }

  public async getEvents(): Promise<SocietyEvent[]> {
    const result = await this.repo.getAll();
    return result.data || [];
  }

  /**
   * Accepts a flexible input shape for backward compatibility.
   * Old callers may pass { title, stage } or { name, status } — both work.
   */
  public async createEvent(event: Record<string, any>): Promise<SocietyEvent> {
    const name = event.name || event.title || "Untitled Event";
    const title = event.title || event.name || "Untitled Event";
    const stage = event.stage || event.status || "PLANNING";

    const result = await this.repo.create({
      name,
      description: event.description || "",
      status: stage,
      stage,
      date: event.date || new Date().toISOString().split("T")[0],
      venue: event.venue || "MSIT Campus",
      lead: event.lead || "WDS Events Lead",
      projectId: event.projectId,
      registrationUrl: event.registrationUrl || event.registrationLink,
      expectedAttendance: event.expectedAttendance,
    });

    if (!result.success || !result.data) {
      return {
        id: result.id || `EVT-${Date.now()}`,
        name,
        title,
        description: event.description || "",
        status: stage as EventLifecycleStage,
        stage: stage as EventLifecycleStage,
        date: event.date || new Date().toISOString().split("T")[0],
        venue: event.venue || "MSIT Campus",
        lead: event.lead || "WDS Events Lead",
        createdAt: new Date().toISOString(),
      };
    }

    return result.data;
  }

  public async updateEventStage(id: string, stage: EventLifecycleStage): Promise<SocietyEvent | null> {
    const result = await this.repo.update(id, { status: stage, stage });
    if (!result.success) return null;
    return result.data || null;
  }
}

export const eventRepository = new EventRepositoryWrapper(eventsRepository);
