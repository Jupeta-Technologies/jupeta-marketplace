// WatchlistContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from "@/types/cart"; // Assuming Product type is defined here

// Define the shape of the context value
interface WatchlistContextType {
  watchlist: Product[];
  addToWatchlist: (product: Product) => void;
  removeFromWatchlist: (productId: string) => void;
  isOnWatchlist: (productId: string) => boolean;
}

// Create the context
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// Define the props for the provider
interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false); // Flag for client-side hydration

  // Load watchlist from localStorage on client
  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to load watchlist from localStorage", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, hydrated]);

  const addToWatchlist = (product: Product) => {
    setWatchlist((prevWatchlist) => {
      // Check if the product already exists by its ID
      if (!prevWatchlist.some(item => item.id === product.id)) {
        return [...prevWatchlist, product];
      }
      return prevWatchlist; // Product already exists
    });
  };

  const removeFromWatchlist = (productId: string) => {
    setWatchlist((prevWatchlist) => prevWatchlist.filter((item) => item.id !== productId));
  };

  const isOnWatchlist = (productId: string): boolean => {
    return watchlist.some((item) => item.id === productId);
  };

  const contextValue: WatchlistContextType = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isOnWatchlist,
  };

  return (
    <WatchlistContext.Provider value={contextValue}>
      {hydrated ? children : null} {/* Only render children when hydrated */}
    </WatchlistContext.Provider>
  );
};

// Custom hook to consume the WatchlistContext
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};