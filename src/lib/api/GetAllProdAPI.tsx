import APIManager from './APIManager'
import { APIResponse, Product } from '@/types/api'; // adjust path if needed

export const GetAllProdAPI = async (): Promise<APIResponse<Product[]>> => {
  const response = await APIManager.get<APIResponse<Product[]>>('/User/GetAllProducts', {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
  });

  return response.data;
};
