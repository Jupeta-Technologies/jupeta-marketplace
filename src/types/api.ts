// src/types/api.ts

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    // Add all the fields returned from your API
  }
  
  export interface APIResponse<T> {
    code: string;
    responseData: T;
  }
  