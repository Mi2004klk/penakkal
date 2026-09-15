import { StorageAdapter } from "./storage";

export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, Buffer>();

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    this.store.set(key, body);
  }

  async get(key: string): Promise<Buffer> {
    const data = this.store.get(key);
    if (!data) throw new Error(`File not found: ${key}`);
    return data;
  }

  async sign(key: string, expiresIn: number): Promise<string> {
    return `https://memory-storage.local/presigned/${key}`;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async list(prefix: string): Promise<string[]> {
    return Array.from(this.store.keys()).filter(k => k.startsWith(prefix));
  }
}
