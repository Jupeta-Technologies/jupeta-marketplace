// lib/categoryDataProvider.ts
import { CategoryData, CategoryResponse } from '@/types/category';
import { GetAllCategories } from '@/lib/api/GetAllCategoriesAPI';
import { convertApiCategoriesToLegacy } from '@/utils/categoryDataConverter';
import categoryDataJsonFallback from '@/data/categoryData.json';

// Cache for the transformed category data
let cachedCategoryData: CategoryData[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get category data with API-first approach and fallback to static JSON
 * @param forceRefresh - Force refresh from API even if cache is valid
 * @returns Promise<CategoryData[]>
 */
export async function getCategoryData(forceRefresh: boolean = false): Promise<CategoryData[]> {
  const now = Date.now();
  const isCacheValid = cachedCategoryData && (now - lastFetchTime) < CACHE_DURATION;

  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid) {
    console.log('📦 Using cached category data');
    return cachedCategoryData!;
  }

  try {
    console.log('🔄 Fetching fresh category data from API...');
    
    // Attempt to fetch from API
    const apiResponse = await GetAllCategories();
    
    if (apiResponse && apiResponse.length > 0) {
      // Transform API data to legacy format
      const transformedData = convertApiCategoriesToLegacy(apiResponse);
      
      // Cache the transformed data
      cachedCategoryData = transformedData;
      lastFetchTime = now;
      
      console.log(`✅ Successfully fetched and cached ${transformedData.length} categories from API`);
      return transformedData;
    } else {
      throw new Error('No categories returned from API');
    }
  } catch (error) {
    console.warn('⚠️ Failed to fetch from API, falling back to static data:', error);
    
    // Fallback to static JSON data
    const fallbackData = categoryDataJsonFallback as CategoryData[];
    
    // Cache the fallback data but with a shorter cache time
    cachedCategoryData = fallbackData;
    lastFetchTime = now - (CACHE_DURATION * 0.8); // Cache for shorter time to retry API sooner
    
    console.log(`📄 Using static fallback data (${fallbackData.length} categories)`);
    return fallbackData;
  }
}

/**
 * Get category data synchronously (returns cached data or fallback)
 * Use this when you need immediate data and can't await async calls
 * @returns CategoryData[]
 */
export function getCategoryDataSync(): CategoryData[] {
  if (cachedCategoryData) {
    return cachedCategoryData;
  }
  
  // Return static fallback immediately
  console.log('📄 Using static fallback data (sync)');
  return categoryDataJsonFallback as CategoryData[];
}

/**
 * Invalidate the cache to force fresh API fetch on next call
 */
export function invalidateCategoryCache(): void {
  cachedCategoryData = null;
  lastFetchTime = 0;
  console.log('🗑️ Category data cache invalidated');
}

/**
 * Check if we have cached data
 */
export function hasCachedData(): boolean {
  return cachedCategoryData !== null;
}

/**
 * Get cache status information
 */
export function getCacheStatus(): {
  hasCachedData: boolean;
  cacheAge: number;
  isValid: boolean;
  source: 'api' | 'fallback' | 'none';
} {
  const now = Date.now();
  const cacheAge = now - lastFetchTime;
  const isValid = cachedCategoryData !== null && cacheAge < CACHE_DURATION;
  
  let source: 'api' | 'fallback' | 'none' = 'none';
  if (cachedCategoryData) {
    // Check if cache was created with shorter time (indicates fallback)
    source = cacheAge < (CACHE_DURATION * 0.9) ? 'api' : 'fallback';
  }

  return {
    hasCachedData: cachedCategoryData !== null,
    cacheAge,
    isValid,
    source
  };
}

/**
 * Initialize category data on app startup
 * Call this early in your app lifecycle
 */
export async function initializeCategoryData(): Promise<void> {
  try {
    await getCategoryData();
    console.log('🚀 Category data initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize category data:', error);
  }
}
