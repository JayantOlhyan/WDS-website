import { projectRepository, SocietyProject } from "../repositories/ProjectRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateProjectInput } from "../validation/project";

export class ProjectService {
  public async getProjects(): Promise<SocietyProject[]> {
    return projectRepository.getProjects();
  }

  public async getProjectById(id: string): Promise<SocietyProject | null> {
    return projectRepository.getProjectById(id);
  }
}

export const projectService = new ProjectService();
