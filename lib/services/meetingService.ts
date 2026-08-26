import { meetingRepository, SocietyMeetingRecord } from "../repositories/MeetingRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateMeetingInput } from "../validation/meeting";
import { RepositoryQueryResult } from "../repositories/types";

export class MeetingService {
  public async getMeetings(): Promise<RepositoryQueryResult<SocietyMeetingRecord[]>> {
    return meetingRepository.getMeetings();
  }

  public async createMeeting(
    input: CreateMeetingInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<SocietyMeetingRecord>> {
    const result = await meetingRepository.createMeeting(input);

    if (result.success && result.data) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "MEETING_RECORDED",
        resource: "Meeting",
        resourceId: result.data.id,
        details: { title: input.title, date: input.date },
      });
    }

    return result;
  }
}

export const meetingService = new MeetingService();
