import { assetRepository, SocietyAssetRecord } from "../repositories/AssetRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { CreateAssetInput } from "../validation/asset";
import { RepositoryQueryResult } from "../repositories/types";

export class AssetService {
  public async getAssets(): Promise<RepositoryQueryResult<SocietyAssetRecord[]>> {
    return assetRepository.getAssets();
  }

  public async createAsset(
    input: CreateAssetInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<SocietyAssetRecord>> {
    const result = await assetRepository.createAsset(input);

    if (result.success && result.data) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "ASSET_REGISTERED",
        resource: "Asset",
        resourceId: result.data.id,
        details: { name: input.name, category: input.category, url: input.url },
      });
    }

    return result;
  }
}

export const assetService = new AssetService();
