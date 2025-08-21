// src/types/api.ts

export interface ProductImage {
    imageId: string;
    imageUrl: string;
    imagePath: string;
    isPrimary: boolean;
    displayOrder: number;
    altText: string;
    uploadedAt: string;
}

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
    imageFileUrl: string; // "https://storage.googleapis.com/..." (full URL) - keeping for backward compatibility
    productImages: ProductImage[]; // New array structure
    imageFile: null; // Or `File | null` if it can be a File object before upload
    addedAt: string; // "2024-12-04T18:27:17.285Z" (ISO date string)
    modifiedOn: string;
    qty: number;
    onAdd: (product: Product) => void; // <--- This line is crucial
    // Add all the fields returned from your API
  }

  export interface User{
    id: string,
    name: string,
    cart:[]
    email: string,
    fullName: string,
    phoneNumber: number,
    dateOfBirth: string
  }
  
  export interface APIResponse<T> {
    Message: string;      // Changed from message to Message
    StatusCode: number;   // Changed from statusCode to StatusCode
    Success: boolean;     // Changed from success to Success
    Code: string;         // Changed from code to Code
    ResponseData: T;      // Changed from responseData to ResponseData
  }

  export interface MockProduct extends Product {
    seller: string;
    location: string;
    tradeValue?: string;
    tradeLookingFor?: string;
  }

  export interface TradeItem {
    id: string;
    name: string;
    image: string;
    condition: string;
    estimatedValue: number;
    description: string;
    category: string;
    seller: string;
    location: string;
    lookingFor: string;
  }
  