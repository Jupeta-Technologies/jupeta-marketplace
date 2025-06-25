export interface Product {
    id: string;
    productName: string;
    price: number;
    qty: number;
    imageFileUrl: string;
    source?: 'buy-button' | 'cart-page' | 'checkout'; // Track how product was added
  };
  
 export interface CartContextType{
    total: number;
    products: Product[];
    addToCart: (product: Product, source?: 'buy-button' | 'cart-page' | 'checkout') => void;
    removeFromcart: (product: Product) => void;
    clearFromcart: (product: Product) => void;
    removeBuyButtonProducts: () => void;
    preserveBuyButtonProducts: () => void;
  };
  
 export interface CartState {
    products: Product[];
    total: number;
  };

 export interface CartProduct extends Product{
    qty : number;
 }