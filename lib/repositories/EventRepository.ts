export type EventLifecycleStage =
  | "IDEA"
  | "PLANNING"
  | "ANNOUNCED"
  | "REGISTRATION"
  | "LIVE"
  | "COMPLETED"
  | "ARCHIVED";

export interface SocietyEvent {
  id: string;
  title: string;
  stage: EventLifecycleStage;
  date: string;
  venue: string;
  lead: string;
  description: string;
  expectedAttendance: number;
  registrationLink?: string;
  createdAt: string;
}

class MemoryEventRepository {
  private events: SocietyEvent[] = [
    {
      id: "EVT-01",
      title: "WDS Annual HackSprint '26",
      stage: "PLANNING",
      date: "2026-10-15",
      venue: "MSIT Main Auditorium / Virtual",
      lead: "Jayant Olhyan",
      description: "24-hour campus hackathon focusing on full-stack web platforms and open-source tooling.",
      expectedAttendance: 150,
      createdAt: new Date().toISOString(),
    },
    {
      id: "EVT-02",
      title: "Git & Open Source Orientation Workshop",
      stage: "REGISTRATION",
      date: "2026-09-05",
      venue: "Seminar Hall 1",
      lead: "Technical Lead",
      description: "Hands-on beginner workshop introducing Git, GitHub branching, and contributing to WDS repos.",
      expectedAttendance: 80,
      registrationLink: "/opportunities#workshops",
      createdAt: new Date().toISOString(),
    },
  ];

  public async getEvents(): Promise<SocietyEvent[]> {
    return this.events;
  }

  public async createEvent(event: Omit<SocietyEvent, "id" | "createdAt">): Promise<SocietyEvent> {
    const newEvent: SocietyEvent = {
      id: `EVT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...event,
    };
    this.events.unshift(newEvent);
    return newEvent;
  }

  public async updateEventStage(id: string, stage: EventLifecycleStage): Promise<SocietyEvent | null> {
    const ev = this.events.find((e) => e.id === id);
    if (!ev) return null;
    ev.stage = stage;
    return ev;
  }
}

export const eventRepository = new MemoryEventRepository();
