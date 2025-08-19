// lib/api/CreateCategoryAPI.tsx
import APIManager from './APIManager';

// Request interface matching your API structure
interface CreateCategoryRequest {
  Name: string;
  Description: string;
  Slug: string;
  ParentId?: string | null; // Optional for subcategories
  DisplayOrder: number;
  ImageUrl: string;
  // Hero object (only for main categories, not subcategories)
  Hero?: {
    title?: string;
    subtitle?: string;
    image?: string;
    [key: string]: any; // Allow flexible hero properties
  } | null;
  // SEO fields (optional for subcategories)
  MetaTitle?: string;
  MetaDescription?: string;
}

// API Response interface
interface CreateCategoryResponse {
  Code: string;
  Message: string;
  ResponseData: {
    Id: string;
    Name: string;
    Slug: string;
    [key: string]: any;
  };
}

/**
 * Creates a new category (main category or subcategory)
 * @param categoryData - Category information
 * @returns Promise<CreateCategoryResponse> - API response
 */
export async function CreateCategory(categoryData: CreateCategoryRequest): Promise<CreateCategoryResponse> {
  try {
    const response = await APIManager.post<CreateCategoryResponse>('User/CreateCategory', categoryData);
    
    if (response.data.Code === "0") {
      return response.data;
    } else {
      throw new Error(response.data.Message || 'Failed to create category');
    }
  } catch (error) {
    console.error('CreateCategory API Error:', error);
    throw error;
  }
}

/**
 * Helper function to create main category with hero content
 * @param name - Category name
 * @param description - Category description
 * @param imageUrl - Category image URL
 * @param heroData - Hero section data
 * @param metaData - SEO metadata
 * @returns Promise<CreateCategoryResponse>
 */
export async function CreateMainCategory(
  name: string,
  description: string,
  imageUrl: string,
  heroData: {
    title: string;
    subtitle: string;
    image: string;
  },
  metaData: {
    metaTitle: string;
    metaDescription: string;
  },
  displayOrder: number = 0
): Promise<CreateCategoryResponse> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return CreateCategory({
    Name: name,
    Description: description,
    Slug: slug,
    DisplayOrder: displayOrder,
    ImageUrl: imageUrl,
    Hero: {
      title: heroData.title,
      subtitle: heroData.subtitle,
      image: heroData.image,
    },
    MetaTitle: metaData.metaTitle,
    MetaDescription: metaData.metaDescription,
  });
}

/**
 * Helper function to create subcategory (no hero content)
 * @param name - Category name
 * @param description - Category description
 * @param parentId - Parent category ID
 * @param imageUrl - Category image URL
 * @returns Promise<CreateCategoryResponse>
 */
export async function CreateSubcategory(
  name: string,
  description: string,
  parentId: string,
  imageUrl: string,
  displayOrder: number = 0
): Promise<CreateCategoryResponse> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return CreateCategory({
    Name: name,
    Description: description,
    Slug: slug,
    ParentId: parentId,
    DisplayOrder: displayOrder,
    ImageUrl: imageUrl,
    // No Hero object for subcategories
    // No MetaTitle/MetaDescription for subcategories
  });
}

/**
 * Validates category data before submission
 * @param data - Category data to validate
 * @param isMainCategory - Whether this is a main category (requires hero data)
 * @returns Object with validation result
 */
export function validateCategoryData(
  data: Partial<CreateCategoryRequest>,
  isMainCategory: boolean = true
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.Name || data.Name.trim().length === 0) {
    errors.push('Category name is required');
  }

  if (!data.Description || data.Description.trim().length === 0) {
    errors.push('Category description is required');
  }

  if (!data.ImageUrl || data.ImageUrl.trim().length === 0) {
    errors.push('Category image is required');
  }

  // For main categories, validate hero content and SEO
  if (isMainCategory) {
    if (!data.Hero?.title || data.Hero.title.trim().length === 0) {
      errors.push('Hero title is required for main categories');
    }
    if (!data.Hero?.subtitle || data.Hero.subtitle.trim().length === 0) {
      errors.push('Hero subtitle is required for main categories');
    }
    if (!data.Hero?.image || data.Hero.image.trim().length === 0) {
      errors.push('Hero image is required for main categories');
    }
    if (!data.MetaTitle || data.MetaTitle.trim().length === 0) {
      errors.push('Meta title is required for main categories');
    }
    if (!data.MetaDescription || data.MetaDescription.trim().length === 0) {
      errors.push('Meta description is required for main categories');
    }
  } else {
    // For subcategories, validate parent ID
    if (!data.ParentId || data.ParentId.trim().length === 0) {
      errors.push('Parent category is required for subcategories');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
