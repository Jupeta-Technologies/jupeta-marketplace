export interface Product {
    id: string;
    productName: string;
    price: number;
    qty: number;
    imageFileUrl: string;
  };
  
 export interface CartContextType{
    total: number;
    products: Product[];
    addToCart: (product: Product) => void;
    removeFromcart: (product: Product) => void;
    clearFromcart: (product: Product) => void;
  };
  
 export interface CartState {
    products: Product[];
    total: number;
  };

 export interface CartProduct extends Product{
    qty : number;
 }