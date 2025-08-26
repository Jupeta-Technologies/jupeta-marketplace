"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '@/types/api';

interface CachedProduct {
  product: Product;
  timestamp: number;
  viewCount: number;
}

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  getViewCount: (productId: string) => number;
  isRecentlyViewed: (productId: string) => boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

interface RecentlyViewedProviderProps {
  children: ReactNode;
}

// Cache configuration
const CACHE_CONFIG = {
  MAX_ITEMS: 10,
  DISPLAY_ITEMS: 4,
  TTL_HOURS: 30 * 24, // 30 days
  STORAGE_KEY: 'recentlyViewed_v2',
  DEBOUNCE_MS: 500,
} as const;

export const RecentlyViewedProvider: React.FC<RecentlyViewedProviderProps> = ({ children }) => {
  const [cachedItems, setCachedItems] = useState<CachedProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized recently viewed products (for performance)
  const recentlyViewed = useMemo(() => {
    return cachedItems
      .slice(0, CACHE_CONFIG.DISPLAY_ITEMS)
      .map(item => item.product);
  }, [cachedItems]);

  // Debounce utility function
  function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  }

  // Debounced save to localStorage
  const saveToStorage = useCallback(
    debounce((items: CachedProduct[]) => {
      try {
        const dataToStore = {
          items,
          lastUpdated: Date.now(),
          version: '2.0'
        };
        localStorage.setItem(CACHE_CONFIG.STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error('Error saving recently viewed items:', error);
        // If localStorage is full, try to clear old data
        try {
          localStorage.removeItem('recentlyViewed'); // Remove old version
          localStorage.setItem(CACHE_CONFIG.STORAGE_KEY, JSON.stringify({
            items: items.slice(0, 5), // Keep only 5 items if storage is full
            lastUpdated: Date.now(),
            version: '2.0'
          }));
        } catch (retryError) {
          console.error('Failed to save even reduced data:', retryError);
        }
      }
    }, CACHE_CONFIG.DEBOUNCE_MS),
    []
  );

  // Load from localStorage with validation
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        // Try new format first
        const stored = localStorage.getItem(CACHE_CONFIG.STORAGE_KEY);
        if (stored) {
          const { items, lastUpdated, version } = JSON.parse(stored);
          
          if (version === '2.0' && Array.isArray(items)) {
            // Filter out expired items
            const now = Date.now();
            const validItems = items.filter((item: CachedProduct) => {
              const ageHours = (now - item.timestamp) / (1000 * 60 * 60);
              return ageHours < CACHE_CONFIG.TTL_HOURS && item.product?.id;
            });
            
            setCachedItems(validItems);
            setIsInitialized(true);
            return;
          }
        }

        // Fallback: try old format and migrate
        const oldStored = localStorage.getItem('recentlyViewed');
        if (oldStored) {
          const oldItems: Product[] = JSON.parse(oldStored);
          const migratedItems: CachedProduct[] = oldItems
            .filter(product => product?.id)
            .map(product => ({
              product,
              timestamp: Date.now() - Math.random() * 24 * 60 * 60 * 1000, // Random timestamp within last day
              viewCount: 1
            }));
          
          setCachedItems(migratedItems);
          localStorage.removeItem('recentlyViewed'); // Clean up old data
          saveToStorage(migratedItems);
        }
      } catch (error) {
        console.error('Error loading recently viewed items:', error);
        // Clear corrupted data
        localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY);
        localStorage.removeItem('recentlyViewed');
      }
      
      setIsInitialized(true);
    };

    loadFromStorage();
  }, [saveToStorage]);

  // Save to localStorage whenever cachedItems changes (debounced)
  useEffect(() => {
    if (isInitialized && cachedItems.length > 0) {
      saveToStorage(cachedItems);
    }
  }, [cachedItems, isInitialized, saveToStorage]);

  // Add product to recently viewed with enhanced caching
  const addToRecentlyViewed = useCallback((product: Product) => {
    if (!product?.id) return;

    setCachedItems(prevItems => {
      // Check if product already exists
      const existingIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingIndex !== -1) {
        // Update existing item - move to front and increment view count
        const existingItem = prevItems[existingIndex];
        const updatedItem: CachedProduct = {
          ...existingItem,
          timestamp: Date.now(),
          viewCount: existingItem.viewCount + 1
        };
        
        return [
          updatedItem,
          ...prevItems.slice(0, existingIndex),
          ...prevItems.slice(existingIndex + 1)
        ];
      } else {
        // Add new item to front
        const newItem: CachedProduct = {
          product,
          timestamp: Date.now(),
          viewCount: 1
        };
        
        return [newItem, ...prevItems].slice(0, CACHE_CONFIG.MAX_ITEMS);
      }
    });
  }, []);

  // Clear all recently viewed items
  const clearRecentlyViewed = useCallback(() => {
    setCachedItems([]);
    try {
      localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY);
      localStorage.removeItem('recentlyViewed'); // Clean up old format too
    } catch (error) {
      console.error('Error clearing recently viewed items:', error);
    }
  }, []);

  // Get view count for a specific product
  const getViewCount = useCallback((productId: string): number => {
    const item = cachedItems.find(item => item.product.id === productId);
    return item?.viewCount || 0;
  }, [cachedItems]);

  // Check if a product is in recently viewed
  const isRecentlyViewed = useCallback((productId: string): boolean => {
    return cachedItems.some(item => item.product.id === productId);
  }, [cachedItems]);

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
      getViewCount,
      isRecentlyViewed
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = (): RecentlyViewedContextType => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
