import { SecureStorage } from '@nativescript/secure-storage';

export class StorageService {
  private static secureStorage = new SecureStorage();

  static async saveSecure(key: string, value: string): Promise<void> {
    await this.secureStorage.set({
      key,
      value
    });
  }

  static async getSecure(key: string): Promise<string | null> {
    try {
      return await this.secureStorage.get({
        key
      });
    } catch {
      return null;
    }
  }

  static async removeSecure(key: string): Promise<void> {
    await this.secureStorage.remove({
      key
    });
  }

  static async clearSecure(): Promise<void> {
    await this.secureStorage.removeAll();
  }
}