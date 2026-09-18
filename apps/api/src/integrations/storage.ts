export interface StorageProvider {
  createUploadUrl(input: { key: string; contentType: string }): Promise<{ url: string; key: string; simulated: boolean }>;
  getDownloadUrl(key: string): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  async createUploadUrl(input: { key: string; contentType: string }) { return { url: `/development/uploads/${encodeURIComponent(input.key)}`, key: input.key, simulated: true }; }
  async getDownloadUrl(key: string) { return `/development/downloads/${encodeURIComponent(key)}`; }
}
