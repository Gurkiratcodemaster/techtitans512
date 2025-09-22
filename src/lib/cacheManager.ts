/**
 * Cache Management Utility
 * Handles client-side caching to improve performance and resolve refresh issues
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set an item in the cache with optional TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    this.cache.set(key, item);
  }

  /**
   * Get an item from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Remove an item from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache items
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache items
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if cache has a valid item
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get or set pattern - fetch data if not in cache
   */
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFunction();
    this.set(key, data, ttl);
    return data;
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Auto-cleanup expired items every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.clearExpired();
  }, 5 * 60 * 1000);
}

export default cacheManager;

// Cache keys for different data types
export const CACHE_KEYS = {
  // Timeline data
  TIMELINE_EVENTS: 'timeline_events',
  TIMELINE_FILTERED: (category: string, priority: string) => `timeline_${category}_${priority}`,
  
  // Career path data
  CAREER_DEGREES: 'career_degrees',
  CAREER_PATH: (degree: string) => `career_path_${degree}`,
  DEGREE_OVERVIEWS: 'degree_overviews',
  
  // User profile data
  USER_PROFILE: (uid: string) => `user_profile_${uid}`,
  PROFILE_QUESTIONS: 'profile_questions',
  AI_RECOMMENDATIONS: (profileId: string) => `ai_recommendations_${profileId}`,
  
  // College and scholarship data
  COLLEGES: 'colleges',
  COLLEGES_FILTERED: (filters: string) => `colleges_${filters}`,
  SCHOLARSHIPS: 'scholarships',
  SCHOLARSHIPS_FILTERED: (filters: string) => `scholarships_${filters}`,
  
  // Study materials
  STUDY_MATERIALS: 'study_materials',
  STUDY_MATERIALS_FILTERED: (filters: string) => `study_materials_${filters}`,
  
  // Skill programs
  SKILL_PROGRAMS: 'skill_programs',
  SKILL_PROGRAMS_FILTERED: (filters: string) => `skill_programs_${filters}`
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,     // 2 minutes
  MEDIUM: 5 * 60 * 1000,    // 5 minutes  
  LONG: 15 * 60 * 1000,     // 15 minutes
  VERY_LONG: 60 * 60 * 1000 // 1 hour
} as const;

/**
 * Higher-order function to add caching to async functions
 */
export function withCache<T extends any[], R>(
  key: string,
  fn: (...args: T) => Promise<R>,
  ttl: number = CACHE_TTL.MEDIUM
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = `${key}_${JSON.stringify(args)}`;
    return cacheManager.getOrSet(cacheKey, () => fn(...args), ttl);
  };
}

/**
 * React hook for cached data fetching
 */
export function useCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  ttl: number = CACHE_TTL.MEDIUM
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await cacheManager.getOrSet(key, fetchFunction, ttl);
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  const refetch = React.useCallback(async () => {
    cacheManager.delete(key);
    setLoading(true);
    
    try {
      const result = await fetchFunction();
      cacheManager.set(key, result, ttl);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, ttl]);

  return { data, loading, error, refetch };
}

// Import React for the hook
import React from 'react';