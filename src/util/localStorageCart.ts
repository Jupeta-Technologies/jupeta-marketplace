import { CartState } from "@/types/cart"; // adjust path

export const getCartFromLocalStorage = (): CartState => {
  try {
    const cart = localStorage.getItem("Cart");
    return cart ? JSON.parse(cart) : { products: [], total: 0 };
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return { products: [], total: 0 };
  }
};

export const saveCartToLocalStorage = (cart: CartState) => {
  try {
    localStorage.setItem("Cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
};
