import { Assets, AssetsManifest, ProgressCallback } from 'pixi.js';

export class AssetService {
  public async addManifest(manifest: AssetsManifest): Promise<void> {
    return Assets.init({ manifest });
  }

  public async load(
    bundleIds: string | string[],
    onProgress?: ProgressCallback,
  ): Promise<void> {
    return Assets.loadBundle(bundleIds, onProgress);
  }

  public getByName<T>(name: string): T {
    return Assets.get<T>(name);
  }
}

export const assetService = new AssetService();
