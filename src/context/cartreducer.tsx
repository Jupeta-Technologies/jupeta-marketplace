import { Product, CartState } from "@/types/cart"; // adjust path as needed



  type CartAction =
    | { type: 'addItem'; payload: Product[] }
    | { type: 'removeItem'; payload: Product[] }
    | { type: 'updatePrice'; payload: number }
    | { type: 'updateState'; payload: (prevState: CartState) => CartState };
  
  export const initCart: CartState = {
    products: [],
    total: 0,
  };
  
  export default function cartReducer(
    cartItems: CartState,
    action: CartAction
  ): CartState {
    switch (action.type) {
      case 'addItem':
        return { ...cartItems, products: action.payload };
  
      case 'removeItem':
        return { ...cartItems, products: action.payload };
  
      case 'updatePrice':
        return { ...cartItems, total: action.payload };
  
      case 'updateState':
        return action.payload(cartItems);
  
      default:
        throw new Error('Unknown action: ' + (action as { type: string }).type);
    }
  }
  