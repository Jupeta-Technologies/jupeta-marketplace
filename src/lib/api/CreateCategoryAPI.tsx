// lib/api/CreateCategoryAPI.tsx
import APIManager from './APIManager';

// Request interface matching your API structure
interface CreateCategoryRequest {
  name: string;
  description?: string; // Made optional
  slug: string;
  parentId?: string | null; // Optional for subcategories
  displayOrder: number;
  imageUrl?: string; // Made optional
  // Hero object (only for main categories, not subcategories)
  hero?: {
    title?: string; // Already optional
    subtitle?: string; // Already optional
    image?: string; // Made optional
    [key: string]: any; // Allow flexible hero properties
  } | null;
  // SEO fields (optional for subcategories)
  metaTitle?: string; // Already optional
  metaDescription?: string; // Already optional
}

// API Response interface
interface CreateCategoryResponse {
  code: string;
  message: string;
  responseData: {
    id: string;
    name: string;
    slug: string;
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

    if (response.data.code === "0") {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create category');
    }
  } catch (error) {
    console.error('CreateCategory API Error:', error);
    throw error;
  }
}

/**
 * Helper function to create main category with hero content
 * @param name - Category name
 * @param description - Category description (optional)
 * @param imageUrl - Category image URL
 * @param heroData - Hero section data (optional fields)
 * @param metaData - SEO metadata (optional)
 * @returns Promise<CreateCategoryResponse>
 */
export async function CreateMainCategory(
  name: string,
  description: string = '',
  imageUrl: string = '',
  heroData: {
    title?: string;
    subtitle?: string;
    image?: string;
  } = {},
  metaData: {
    metaTitle?: string;
    metaDescription?: string;
  } = {},
  displayOrder: number = 0
): Promise<CreateCategoryResponse> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return CreateCategory({
    name: name,
    description: description,
    slug: slug,
    displayOrder: displayOrder,
    ...(imageUrl && { imageUrl: imageUrl }),
    hero: Object.keys(heroData).length > 0 ? {
      title: heroData.title || '',
      subtitle: heroData.subtitle || '',
      image: heroData.image || '',
    } : null,
    metaTitle: metaData.metaTitle || '',
    metaDescription: metaData.metaDescription || '',
  });
}

/**
 * Helper function to create subcategory (no hero content)
 * @param name - Category name
 * @param description - Category description (optional)
 * @param parentId - Parent category ID
 * @param imageUrl - Category image URL
 * @returns Promise<CreateCategoryResponse>
 */
export async function CreateSubcategory(
  name: string,
  description: string = '',
  parentId: string,
  imageUrl: string = '',
  displayOrder: number = 0
): Promise<CreateCategoryResponse> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return CreateCategory({
    name: name,
    description: description,
    slug: slug,
    parentId: parentId,
    displayOrder: displayOrder,
    ...(imageUrl && { imageUrl: imageUrl }),
    // No hero object for subcategories
    // No metaTitle/metaDescription for subcategories
  });
}

/**
 * Helper function to create component hero category
 * @param name - Category name
 * @param description - Category description (optional)
 * @param imageUrl - Category image URL
 * @param componentName - Hero component name
 * @param componentProps - Component props (optional)
 * @param metaData - SEO metadata (optional)
 * @returns Promise<CreateCategoryResponse>
 */
export async function CreateComponentHeroCategory(
  name: string,
  description: string = '',
  imageUrl: string = '',
  componentName: string,
  componentProps: Record<string, any> = {},
  metaData: {
    metaTitle?: string;
    metaDescription?: string;
  } = {},
  displayOrder: number = 0
): Promise<CreateCategoryResponse> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return CreateCategory({
    name: name,
    description: description,
    slug: slug,
    displayOrder: displayOrder,
    ...(imageUrl && { imageUrl: imageUrl }),
    hero: {
      componentName: componentName,
      props: JSON.stringify(componentProps),
    },
    metaTitle: metaData.metaTitle || '',
    metaDescription: metaData.metaDescription || '',
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

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Category name is required');
  }

  // Description is now optional - no validation needed

  // Image is now optional for both main categories and subcategories
  // No image validation required

  // For main categories, validate hero content and SEO
  if (isMainCategory) {
    // Hero is optional now - only validate if provided
    if (data.hero) {
      // Check if it's a static hero or component hero
      const isStaticHero = data.hero.title || data.hero.subtitle || data.hero.image;
      const isComponentHero = data.hero.componentName;

      // Only validate if it's actually a component hero (not static)
      if (isComponentHero) {
        // Validate component hero
        if (!data.hero.componentName || data.hero.componentName.trim().length === 0) {
          errors.push('Component name is required for component hero');
        }
        // Validate JSON props if provided
        if (data.hero.props) {
          try {
            JSON.parse(data.hero.props);
          } catch (e) {
            errors.push('Component props must be valid JSON');
          }
        }
      } else if (!isStaticHero) {
        // If it's neither static nor component, it might be an empty hero
        // This is allowed now - no error needed for empty heroes
        // Only throw error if hero object exists but has invalid structure
        const hasAnyHeroContent = Object.keys(data.hero).some(key =>
          data.hero![key] && data.hero![key].toString().trim().length > 0
        );
        
        if (hasAnyHeroContent) {
          // Hero has some content but doesn't match static or component pattern
          errors.push('Hero must be either static (title/subtitle/image) or component (componentName)');
        }
      }
    }
    
    // MetaTitle and MetaDescription are now optional for main categories
    // No validation required - they can be empty
  } else {
    // For subcategories, validate parent ID
    if (!data.parentId || data.parentId.trim().length === 0) {
      errors.push('Parent category is required for subcategories');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
