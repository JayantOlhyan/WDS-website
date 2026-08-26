import { documentationRepository, SocietyDocRecord } from "../repositories/DocumentationRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateDocumentationInput } from "../validation/documentation";
import { RepositoryQueryResult } from "../repositories/types";

export class DocumentationService {
  public async getDocs(): Promise<RepositoryQueryResult<SocietyDocRecord[]>> {
    return documentationRepository.getDocs();
  }

  public async createDoc(
    input: CreateDocumentationInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<SocietyDocRecord>> {
    const result = await documentationRepository.createDoc(input);

    if (result.success && result.data) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "SOP_DOCUMENT_RECORDED",
        resource: "Documentation",
        resourceId: result.data.id,
        details: { title: input.title, category: input.category },
      });
    }

    return result;
  }
}

export const documentationService = new DocumentationService();
