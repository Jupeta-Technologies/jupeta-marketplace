// hooks/useCategoryData.ts
import { useState, useEffect } from 'react';
import { CategoryData } from '@/types/category';
import { getCategoryData, getCategoryDataSync, invalidateCategoryCache, getCacheStatus } from '@/lib/categoryDataProvider';

interface UseCategoryDataOptions {
  autoRefresh?: boolean; // Automatically refresh data
  refreshInterval?: number; // Refresh interval in ms (default: 5 minutes)
  immediate?: boolean; // Return cached/fallback data immediately, then update
}

interface UseCategoryDataReturn {
  data: CategoryData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
  source: 'api' | 'fallback' | 'none';
}

/**
 * React hook for dynamic category data with caching and fallback
 * @param options Configuration options
 * @returns Category data state and controls
 */
export function useCategoryData(options: UseCategoryDataOptions = {}): UseCategoryDataReturn {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    immediate = true
  } = options;

  const [data, setData] = useState<CategoryData[]>(() => {
    // Initialize with sync data if immediate is true
    return immediate ? getCategoryDataSync() : [];
  });
  
  const [loading, setLoading] = useState(!immediate);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<'api' | 'fallback' | 'none'>('none');

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const freshData = await getCategoryData(true); // Force refresh
      setData(freshData);
      setLastUpdated(new Date());
      
      // Update source based on cache status
      const cacheStatus = getCacheStatus();
      setSource(cacheStatus.source);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category data';
      setError(errorMessage);
      console.error('Error refreshing category data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const initialData = await getCategoryData();
        setData(initialData);
        setLastUpdated(new Date());
        
        const cacheStatus = getCacheStatus();
        setSource(cacheStatus.source);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (!immediate || data.length === 0) {
      fetchInitialData();
    } else {
      // We have immediate data, but still check cache status
      const cacheStatus = getCacheStatus();
      setSource(cacheStatus.source);
      setLoading(false);
    }
  }, [immediate, data.length]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated,
    source
  };
}

/**
 * Hook for simple category data access (no loading states)
 * Always returns data immediately (cached or fallback)
 */
export function useCategoryDataImmediate(): CategoryData[] {
  const [data, setData] = useState<CategoryData[]>(() => getCategoryDataSync());

  useEffect(() => {
    // Try to get fresh data in the background
    getCategoryData().then(freshData => {
      setData(freshData);
    }).catch(error => {
      console.warn('Background category data fetch failed:', error);
    });
  }, []);

  return data;
}

/**
 * Hook for category data with admin controls
 * Includes cache management and refresh capabilities
 */
export function useCategoryDataAdmin() {
  const categoryData = useCategoryData({ immediate: true });
  
  const invalidateCache = () => {
    invalidateCategoryCache();
    categoryData.refresh();
  };

  const getCacheInfo = () => getCacheStatus();

  return {
    ...categoryData,
    invalidateCache,
    getCacheInfo
  };
}
