"use client"

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react";
import cartReducer, { initCart } from "./cartreducer";
import { Product, CartContextType, CartState } from "@/types/cart";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, dispatch] = useReducer(cartReducer, initCart);
  const [hydrated, setHydrated] = useState(false); // flag to check client-side

  // Load cart from localStorage on client
  useEffect(() => {
    try {
      const cart = localStorage.getItem("Cart");
      if (cart) {
        const parsed = JSON.parse(cart);
        dispatch({ type: "addItem", payload: parsed.products });
        dispatch({ type: "updatePrice", payload: parsed.total });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("Cart", JSON.stringify(cartItems));
    }
  }, [cartItems, hydrated]);

  const addToCart = useCallback(
    (product: Product, source: 'buy-button' | 'cart-page' | 'checkout' = 'cart-page') => {
      dispatch({
        type: 'updateState',
        payload: (prevState: CartState) => {
          const exists = prevState.products.find((x: Product) => x.id === product.id);
          let updated: Product[];

          if (exists) {
            updated = prevState.products.map((x: Product) =>
              x.id === product.id
                ? {
                    ...x,
                    qty: x.qty + 1,
                    source: x.source === 'cart-page' ? 'cart-page' : source,
                  }
                : x
            );
          } else {
            updated = [
              ...prevState.products,
              { ...product, qty: 1, source },
            ];
          }

          const total = updated.reduce((acc, p) => acc + p.price * p.qty, 0);
          return { ...prevState, products: updated, total };
        }
      });
    },
    [dispatch]
  );

  const removeFromcart = useCallback(
    (product: Product) => {
      dispatch({
        type: 'updateState',
        payload: (prevState: CartState) => {
          const exists = prevState.products.find((x: Product) => x.id === product.id);
          let updated: Product[];

          if (exists && exists.qty > 1) {
            updated = prevState.products.map((x: Product) =>
              x.id === product.id
                ? { ...x, qty: x.qty - 1 }
                : x
            );
          } else {
            updated = prevState.products.filter((x: Product) => x.id !== product.id);
          }

          const total = updated.reduce((acc, p) => acc + p.price * p.qty, 0);
          return { ...prevState, products: updated, total };
        }
      });
    },
    [dispatch]
  );

  const clearFromcart = useCallback(
    (product: Product) => {
      dispatch({
        type: 'updateState',
        payload: (prevState: CartState) => {
          const updated = prevState.products.filter((x: Product) => x.id !== product.id);
          const total = updated.reduce((acc, p) => acc + p.price * p.qty, 0);
          return { ...prevState, products: updated, total };
        }
      });
    },
    [dispatch]
  );

  const removeBuyButtonProducts = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: (prevState: CartState) => {
        const updated = prevState.products.filter((x: Product) => x.source !== 'buy-button');
        
        const total = updated.reduce((acc, p) => acc + p.price * p.qty, 0);
        return { ...prevState, products: updated, total };
      }
    });
  }, [dispatch]);

  const preserveBuyButtonProducts = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: (prevState: CartState) => {
        const updated = prevState.products.map((product: Product) => ({
          ...product,
          source: 'cart-page' as const
        }));
        return { ...prevState, products: updated };
      }
    });
  }, [dispatch]);

  const clearCartAll = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: (_prev: CartState) => ({ products: [], total: 0 })
    });
  }, [dispatch]);

  // Global cleanup mechanism
  useEffect(() => {
    if (!hydrated) return;

    const checkAndCleanup = () => {
      const onCartPage = localStorage.getItem('onCartPage');
      const onCheckoutPage = localStorage.getItem('onCheckoutPage');
      
      if (!onCartPage && !onCheckoutPage) {
        // User is not on cart page or checkout page, remove buy-button products
        removeBuyButtonProducts();
      }
    };

    // Wait 2 seconds before first check to give cart page time to load
    const timeout = setTimeout(() => {
      checkAndCleanup();
      
      // Set up interval to check periodically
      const interval = setInterval(checkAndCleanup, 3000); // Check every 3 seconds

      return () => {
        clearInterval(interval);
      };
    }, 2000); // Wait 2 seconds before first check

    return () => {
      clearTimeout(timeout);
    };
  }, [hydrated, removeBuyButtonProducts]);

  const value = {
    total: cartItems.total,
    products: cartItems.products,
    addToCart,
    removeFromcart,
    clearFromcart,
    removeBuyButtonProducts,
    preserveBuyButtonProducts,
  clearCartAll,
  };

  return (
    <CartContext.Provider value={value}>
      {hydrated ? children : null} {/* Only render children when hydrated */}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

 
