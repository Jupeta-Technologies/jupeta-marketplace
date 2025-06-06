"use client"

import { createContext, useContext, useReducer, useEffect, useState } from "react";
import cartReducer, { initCart } from "./cartreducer";
import { Product, CartContextType } from "@/types/cart";

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

  const addToCart = (product: Product) => {
    const exists = cartItems.products.find((x) => x.id === product.id);
    const updateCart = [...cartItems.products]; // clone
    let updateQty: Product[] = [];

    if (exists) {
      updateQty = updateCart.map((x) =>
        x.id === product.id ? { ...exists, qty: exists.qty + 1 } : x
      );
      cartTotal(updateQty);
    } else {
      updateCart.push({ ...product, qty: 1 });
      cartTotal(updateCart);
    }

    dispatch({
      type: "addItem",
      payload: exists ? updateQty : updateCart,
    });
  };

  const removeFromcart = (product: Product) => {
    if (product.qty > 1) {
      const updated = cartItems.products.map((x) =>
        x.id === product.id ? { ...product, qty: product.qty - 1 } : x
      );
      cartTotal(updated);
      dispatch({ type: "removeItem", payload: updated });
    } else {
      const updated = cartItems.products.filter((x) => x.id !== product.id);
      cartTotal(updated);
      dispatch({ type: "removeItem", payload: updated });
    }
  };

  const clearFromcart = (product: Product) => {
    const updated = cartItems.products.filter((x) => x.id !== product.id);
    cartTotal(updated);
    dispatch({ type: "removeItem", payload: updated });
  };

  const cartTotal = (products: Product[]) => {
    const total = products.reduce((acc, p) => acc + p.price * p.qty, 0);
    dispatch({ type: "updatePrice", payload: total });
  };

  const value = {
    total: cartItems.total,
    products: cartItems.products,
    addToCart,
    removeFromcart,
    clearFromcart,
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

 
