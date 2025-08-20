import APIManager from './APIManager'
import { APIResponse, Product } from '@/types/api'; // adjust path if needed

// Interface for the API response with PascalCase properties
interface ApiProduct {
  Id: string;
  ProductName: string;
  Description: string;
  Summary: string;
  Price: number;
  IsAvailable: boolean;
  Quantity: number;
  Category: string;
  Condition: string;
  SellingType: string;
  ProductImage: string;
  ImageFileUrl: string;
  ProductImages: any[]; // ProductImage array
  ImageFile: null;
  addedAt: string;
  modifiedOn: string;
  qty?: number;
}

// Function to convert API response from PascalCase to camelCase
const convertApiProductToProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.Id,
  productName: apiProduct.ProductName,
  description: apiProduct.Description,
  summary: apiProduct.Summary,
  price: apiProduct.Price,
  isAvailable: apiProduct.IsAvailable,
  quantity: apiProduct.Quantity,
  category: apiProduct.Category,
  condition: apiProduct.Condition,
  sellingType: apiProduct.SellingType,
  productImage: apiProduct.ProductImage,
  imageFileUrl: apiProduct.ImageFileUrl,
  productImages: apiProduct.ProductImages || [],
  imageFile: apiProduct.ImageFile,
  addedAt: apiProduct.addedAt,
  modifiedOn: apiProduct.modifiedOn,
  qty: apiProduct.qty || 1,
  onAdd: () => {} // Default empty function
});

export const GetAllProdAPI = async (): Promise<APIResponse<Product[]>> => {
  const response = await APIManager.get<APIResponse<ApiProduct[]>>('/User/GetAllProducts', {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
  });

  // Convert the API response from PascalCase to camelCase
  const convertedData: Product[] = response.data.ResponseData.map(convertApiProductToProduct);

  return {
    ...response.data,
    ResponseData: convertedData
  };
};
