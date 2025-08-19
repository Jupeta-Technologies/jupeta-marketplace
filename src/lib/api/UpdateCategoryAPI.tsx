// lib/api/UpdateCategoryAPI.tsx
import { CategoryResponse } from '@/types/category';

export interface UpdateCategoryRequest {
  Id: string;
  Name: string;
  Description?: string;
  Slug: string;
  ParentId?: string | null;
  ImageUrl: string;
  Hero?: {
    [key: string]: string;
  } | null;
  MetaTitle?: string;
  MetaDescription?: string;
  DisplayOrder?: number;
  IsActive?: boolean;
}

export interface UpdateCategoryAPIResponse {
  Code: string;
  Message: string;
  ResponseData: CategoryResponse | null;
}

export async function UpdateCategoryAPI(categoryData: UpdateCategoryRequest): Promise<UpdateCategoryAPIResponse> {
  try {
    // Validate required fields
    if (!categoryData.Id || !categoryData.Name) {
      throw new Error('Category ID and Name are required');
    }

    const response = await fetch('/api/User/UpdateCategory', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UpdateCategoryAPIResponse = await response.json();
    
    if (data.Code !== "0") {
      throw new Error(data.Message || 'Failed to update category');
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

  if (!data.Id) {
    errors.push('Category ID is required');
  }

  if (!data.Name || data.Name.trim().length === 0) {
    errors.push('Category name is required');
  }

  if (data.Name && data.Name.trim().length > 100) {
    errors.push('Category name must be less than 100 characters');
  }

  if (data.Slug && data.Slug.trim().length > 150) {
    errors.push('Slug must be less than 150 characters');
  }

  if (data.ImageUrl && !isValidImageUrl(data.ImageUrl)) {
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
