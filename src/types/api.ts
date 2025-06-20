// src/types/api.ts

export interface Product {
    id: string; // "67509f052178adce9ef9be11"
    productName: string; // "Beats Studio Pro Bluetooth Wireless Headphones"
    description: string;
    summary: string;
    price: number; // 199.99
    isAvailable: boolean; // true
    quantity: number; // 1
    category: string; // "Electronics"
    condition: string; // "New"
    sellingType: string; // "BuyNow"
    productImage: string; // "Beats Studio Pro Bluetooth Wireless Headphones-20241204182716.jpg" (just filename)
    imageFileUrl: string; // "https://storage.googleapis.com/..." (full URL)
    imageFile: null; // Or `File | null` if it can be a File object before upload
    addedAt: string; // "2024-12-04T18:27:17.285Z" (ISO date string)
    modifiedOn: string;
    qty: number;
    onAdd: (product: Product) => void; // <--- This line is crucial
    // Add all the fields returned from your API
  }
  
  export interface APIResponse<T> {
    message: string;
    statusCode: number;
    success:boolean;
    code: string;
    responseData: T;
  }
  