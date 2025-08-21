// lib/api/GetAllCategoriesAPI.tsx
import APIManager from './APIManager';
import { CategoryAPIResponse, CategoryResponse } from '@/types/category';

/**
 * Fetches all categories from the User/GetAllCategories endpoint
 * @returns Promise<CategoryResponse[]> - Array of categories with hierarchy
 */
export async function GetAllCategories(): Promise<CategoryResponse[]> {
  try {
    const response = await APIManager.get<CategoryAPIResponse>('User/GetAllCategories');

    if (response.data.code === "0" && response.data.message === "Success") {
      return organizeCategoriesHierarchy(response.data.responseData);
    } else {
      throw new Error(response.data.message || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('GetAllCategories API Error:', error);
    throw error;
  }
}

/**
 * Organizes flat category array into hierarchical structure
 * @param categories - Flat array of categories from API
 * @returns Organized hierarchy with children populated
 */
export function organizeCategoriesHierarchy(categories: CategoryResponse[]): CategoryResponse[] {
  // Create a map for quick lookup
  const categoryMap = new Map<string, CategoryResponse>();
  
  // First pass: create map and prepare children arrays
  categories.forEach(category => {
    categoryMap.set(category.Id, { ...category, Children: [] });
  });
  
  // Second pass: organize hierarchy
  const rootCategories: CategoryResponse[] = [];
  
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.Id)!;
    
    if (category.ParentId && category.ParentId !== "") {
      // This is a child category
      const parent = categoryMap.get(category.ParentId);
      if (parent) {
        parent.Children.push(categoryWithChildren);
        parent.HasChildren = true;
      }
    } else {
      // This is a root category
      rootCategories.push(categoryWithChildren);
    }
  });
  
  // Sort by display order
  sortByDisplayOrder(rootCategories);
  
  return rootCategories;
}

/**
 * Sorts categories by display order recursively
 * @param categories - Categories to sort
 */
function sortByDisplayOrder(categories: CategoryResponse[]): void {
  categories.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
  categories.forEach(category => {
    if (category.Children && category.Children.length > 0) {
      sortByDisplayOrder(category.Children);
    }
  });
}

/**
 * Flattens hierarchical categories into a flat array
 * @param categories - Hierarchical category structure
 * @returns Flat array of all categories
 */
export function flattenCategories(categories: CategoryResponse[]): CategoryResponse[] {
  const flattened: CategoryResponse[] = [];
  
  function flatten(cats: CategoryResponse[], level: number = 0) {
    cats.forEach(category => {
      flattened.push({ ...category, Level: level });
      if (category.Children && category.Children.length > 0) {
        flatten(category.Children, level + 1);
      }
    });
  }
  
  flatten(categories);
  return flattened;
}

/**
 * Gets categories by level (0 = root, 1 = first level children, etc.)
 * @param categories - Array of categories
 * @param level - Level to filter by
 * @returns Categories at specified level
 */
export function getCategoriesByLevel(categories: CategoryResponse[], level: number): CategoryResponse[] {
  return categories.filter(category => category.Level === level);
}

/**
 * Finds a category by ID in hierarchical structure
 * @param categories - Hierarchical category structure
 * @param id - Category ID to find
 * @returns Found category or null
 */
export function findCategoryById(categories: CategoryResponse[], id: string): CategoryResponse | null {
  for (const category of categories) {
    if (category.Id === id) {
      return category;
    }
    if (category.Children && category.Children.length > 0) {
      const found = findCategoryById(category.Children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Gets only root categories (Level 0)
 * @param categories - Array of categories
 * @returns Root categories only
 */
export function getRootCategories(categories: CategoryResponse[]): CategoryResponse[] {
  return categories.filter(category => category.IsRootCategory || category.Level === 0);
}

/**
 * Gets subcategories for a given parent ID
 * @param categories - Array of categories
 * @param parentId - Parent category ID
 * @returns Subcategories of the parent
 */
export function getSubcategories(categories: CategoryResponse[], parentId: string): CategoryResponse[] {
  return categories.filter(category => category.ParentId === parentId);
}
