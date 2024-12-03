export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set(key: string, data: any, duration: number = this.DEFAULT_CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + duration
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}