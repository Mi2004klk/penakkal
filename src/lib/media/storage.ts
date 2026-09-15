export interface StorageAdapter {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer>;
  sign(key: string, expiresIn: number): Promise<string>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}
