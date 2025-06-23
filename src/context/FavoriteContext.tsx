// FavoriteContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from "@/types/cart"; // Assuming Product type is defined here

// Define the shape of the context value
interface FavoriteContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

// Create the context
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Define the props for the provider
interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false); // Flag for client-side hydration

  // Load favorites from localStorage on client
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, hydrated]);

  const addFavorite = (product: Product) => {
    setFavorites((prevFavorites) => {
      // Check if the product already exists by its ID
      if (!prevFavorites.some(fav => fav.id === product.id)) {
        return [...prevFavorites, product];
      }
      return prevFavorites; // Product already exists
    });
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== productId));
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some((fav) => fav.id === productId);
  };

  const contextValue: FavoriteContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {hydrated ? children : null} {/* Only render children when hydrated */}
    </FavoriteContext.Provider>
  );
};

// Custom hook to consume the FavoriteContext
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};