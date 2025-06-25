"use client"

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react";
import { Product } from "@/types/api";

interface FavoritesState {
  products: Product[];
  total: number;
}

interface FavoritesContextType {
  total: number;
  products: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
}

type FavoritesAction = 
  | { type: 'addItem'; payload: Product }
  | { type: 'addItems'; payload: Product[] }
  | { type: 'removeItem'; payload: Product }
  | { type: 'updateState'; payload: (prevState: FavoritesState) => FavoritesState };

const initFavorites: FavoritesState = {
  products: [],
  total: 0,
};

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'addItem':
      const exists = state.products.find((x: Product) => x.id === action.payload.id);
      if (exists) {
        return state; // Already in favorites
      }
      return {
        ...state,
        products: [...state.products, action.payload],
        total: state.total + 1,
      };
    
    case 'addItems':
      return {
        ...state,
        products: action.payload,
        total: action.payload.length,
      };
    
    case 'removeItem':
      return {
        ...state,
        products: state.products.filter((x: Product) => x.id !== action.payload.id),
        total: state.total - 1,
      };
    
    case 'updateState':
      return action.payload(state);
    
    default:
      return state;
  }
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, initFavorites);
  const [hydrated, setHydrated] = useState(false);

  // Load favorites from localStorage on client
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("Favorites");
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        dispatch({ type: "addItems", payload: parsed.products });
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save favorites to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("Favorites", JSON.stringify(favorites));
    }
  }, [favorites, hydrated]);

  const addToFavorites = useCallback((product: Product) => {
    dispatch({ type: 'addItem', payload: product });
  }, []);

  const removeFromFavorites = useCallback((product: Product) => {
    dispatch({ type: 'removeItem', payload: product });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.products.some(product => product.id === productId);
  }, [favorites.products]);

  const value = {
    total: favorites.total,
    products: favorites.products,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {hydrated ? children : null}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
} 