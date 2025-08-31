// types/category.ts
import { StaticImageData } from "next/image";
import auto_hero from "@/assets/images/auto_hero.jpg";
import electronic_hero from "@/assets/images/electroic_hero.jpg";
import fashion_hero from "@/assets/images/fashion_hero.png";
import heroImage from "@/assets/images/led-speaker.jpg"; // default

// Import dynamic and fallback category data providers
import { getCategoryData, getCategoryDataSync } from '@/lib/categoryDataProvider';
import categoryDataJsonFallback from "@/data/categoryData-3.json";

// API Response Types - Matching actual GetAllCategories endpoint
export interface CategoryAPIResponse {
  code: string;
  message: string;
  responseData: CategoryResponse[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId: string | null;
  level: number;
  path: string[];
  pathIds: string[];
  isActive: boolean;
  displayOrder: number;
  imageUrl: string;
  hero: {
    [key: string]: string; // Flexible hero object
  } | null;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  children: CategoryResponse[];
  parent: CategoryResponse | null;
  hasChildren: boolean;
  productCount: number;
  isRootCategory: boolean;
}

// Legacy types for existing components (keep for backward compatibility)
// 1. Existing static hero content structure
interface StaticHeroData {
  title?: string;
  subtitle?: string;
  image: {
    src: string; // This will be the string path (e.g., '/assets/images/auto_hero.jpg')
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
}

// 2. New structure for component-driven hero
// We'll use a string identifier that maps to an actual React component
interface ComponentHeroData {
  componentName:
    | "HomepageInteractiveHero"
    | "ElectronicsDynamicHero"
    | "AutoPromotionHero"
    | "PersonalizedHomepageHero"
    | "CarouselHero"; // Add more as needed
  props?: Record<string, any>; // Optional props to pass to the dynamic component
}

// Union type: A category's hero can be either static data OR a component reference
export type CategoryHeroConfig = StaticHeroData | ComponentHeroData;

export interface CategoryData {
  id: string | number;
  name: string;
  slug?: string;
  image?: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  }; // For submenu items
  hero?: CategoryHeroConfig; // Use the new union type
  children?: CategoryData[];
}

// --- Dynamic CategoryData Provider ---
// Primary source: API data transformed to legacy format
// Fallback: Static JSON file


/**
 * Get category data dynamically from API with fallback to static JSON
 * @param forceRefresh - Force refresh from API even if cache is valid
 * @returns Promise<CategoryData[]>
 */
export const getCategoryDataDynamic = getCategoryData;

/**
 * Get category data synchronously (cached or fallback)
 * Use when you need immediate data and can't await async calls
 * @returns CategoryData[]
 */
export const getCategoryDataImmediate = getCategoryDataSync;

/**
 * Static fallback category data (for backward compatibility)
 * Use getCategoryDataDynamic() as the primary provider.
 */
export const categoryData: CategoryData[] = categoryDataJsonFallback as CategoryData[];
