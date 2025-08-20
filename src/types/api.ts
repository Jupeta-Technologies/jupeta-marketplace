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
    Id: string; // "67509f052178adce9ef9be11"
    ProductName: string; // "Beats Studio Pro Bluetooth Wireless Headphones"
    Description: string;
    Summary: string;
    Price: number; // 199.99
    IsAvailable: boolean; // true
    quantity: number; // 1
    Category: string; // "Electronics"
    Condition: string; // "New"
    SellingType: string; // "BuyNow
    ProductImage: string; // "Beats Studio Pro Bluetooth Wireless Headphones-20241204182716.jpg" (just filename)
    ImageFileUrl: string; // "https://storage.googleapis.com/..." (full URL) - keeping for backward compatibility
    ProductImages: ProductImage[]; // New array structure
    ImageFile: null; // Or `File | null` if it can be a File object before upload
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
    message: string;
    statusCode: number;
    success:boolean;
    code: string;
    responseData: T;
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
  
