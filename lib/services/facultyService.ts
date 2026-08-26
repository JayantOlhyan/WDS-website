import { facultyRepository, FacultyAdvisorRecord } from "../repositories/FacultyRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateFacultyInput } from "../validation/faculty";
import { RepositoryQueryResult } from "../repositories/types";

export class FacultyService {
  public async getFaculty(): Promise<RepositoryQueryResult<FacultyAdvisorRecord[]>> {
    return facultyRepository.getFaculty();
  }

  public async createFaculty(
    input: CreateFacultyInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<FacultyAdvisorRecord>> {
    const result = await facultyRepository.createFaculty(input);

    if (result.success && result.data) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "FACULTY_RECORDED",
        resource: "FacultyAdvisor",
        resourceId: result.data.id,
        details: { name: input.name, department: input.department, role: input.role },
      });
    }

    return result;
  }
}

export const facultyService = new FacultyService();
