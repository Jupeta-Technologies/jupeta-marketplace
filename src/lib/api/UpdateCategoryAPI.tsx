// lib/api/UpdateCategoryAPI.tsx

import APIManager from './APIManager';
import { CategoryResponse } from '@/types/category';

export interface UpdateCategoryRequest {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string | null;
  imageUrl?: string; // Made optional
  hero?: {
    [key: string]: string;
  } | null;
  metaTitle?: string;
  metaDescription?: string;
  displayOrder?: number;
  isActive?: boolean;
}
export interface UpdateCategoryAPIResponse {
  code: string;
  message: string;
  responseData: CategoryResponse | null;
}
export async function UpdateCategoryAPI(categoryData: UpdateCategoryRequest): Promise<UpdateCategoryAPIResponse> {
  try {
    // Validate required fields
    if (!categoryData.id || !categoryData.name) {
      throw new Error('Category ID and Name are required');
    }

    const response = await APIManager('/User/UpdateCategory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data: categoryData,
    });

    const data: UpdateCategoryAPIResponse = response.data;
    if (data.code !== "0") {
      throw new Error(data.message || 'Failed to update category');
    }
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}


// Helper function to validate category data before update
export function validateUpdateCategoryData(data: Partial<UpdateCategoryRequest>): string[] {
  const errors: string[] = [];

  if (!data.id) {
    errors.push('Category ID is required');
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Category name is required');
  }

  if (data.name && data.name.trim().length > 100) {
    errors.push('Category name must be less than 100 characters');
  }

  if (data.slug && data.slug.trim().length > 150) {
    errors.push('Slug must be less than 150 characters');
  }

  // imageUrl is now optional - only validate if provided
  if (data.imageUrl && data.imageUrl.trim() && !isValidImageUrl(data.imageUrl)) {
    errors.push('Please provide a valid image URL or path');
  }

  return errors;
}

// Helper function to validate image URL
function isValidImageUrl(url: string): boolean {
  // Check if it's a valid URL or a valid local path
  try {
    // Check if it's a URL
    new URL(url);
    return true;
  } catch {
    // Check if it's a valid local path (starts with / or relative path)
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
}

// Helper function to create hero object for static heroes
export function CreateStaticHeroForUpdate(title: string, subtitle: string, imageUrl: string) {
  return {
    title,
    subtitle,
    image: imageUrl
  };
}

// Helper function to create hero object for component heroes
export function CreateComponentHeroForUpdate(componentName: string, props: string = '{}') {
  try {
    const parsedProps = JSON.parse(props);
    return {
      componentName,
      props: JSON.stringify(parsedProps)
    };
  } catch (error) {
    throw new Error('Invalid JSON props format');
  }
}
