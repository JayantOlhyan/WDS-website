import { eventRepository, SocietyEvent, EventLifecycleStage } from "../repositories/EventRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateEventInput, PatchEventStageInput } from "../validation/event";

export class EventService {
  public async getEvents(): Promise<SocietyEvent[]> {
    return eventRepository.getEvents();
  }

  public async createEvent(
    input: CreateEventInput,
    actor: { username: string; role: string }
  ): Promise<SocietyEvent> {
    const event = await eventRepository.createEvent({
      ...input,
      stage: (input.stage || "PLANNING") as EventLifecycleStage,
    });

    await auditRepository.logEvent({
      actor: actor.username,
      role: actor.role,
      action: "EVENT_CREATED",
      resource: "Event",
      resourceId: event.id,
      details: { title: event.title, date: event.date },
    });

    return event;
  }

  public async updateEventStage(
    id: string,
    input: PatchEventStageInput,
    actor: { username: string; role: string }
  ): Promise<SocietyEvent | null> {
    const updated = await eventRepository.updateEventStage(id, input.stage as EventLifecycleStage);

    if (updated) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "EVENT_STAGE_UPDATED",
        resource: "Event",
        resourceId: id,
        details: input,
      });
    }

    return updated;
  }
}

export const eventService = new EventService();
