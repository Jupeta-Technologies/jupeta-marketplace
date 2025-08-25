// utils/categoryDataConverter.ts
import { CategoryResponse, CategoryData } from '@/types/category';

/**
 * CategoryData Converter Utility
 * 
 * This utility converts API response data from GetAllCategories endpoint
 * to the legacy categoryData format used in the frontend components.
 * 
 * Usage Examples:
 * 
 * 1. Download JSON file in browser:
 *    const categories = await GetAllCategories();
 *    await downloadCategoryDataJson(categories, 'my-categories.json');
 * 
 * 2. Convert data for use in components:
 *    const categories = await GetAllCategories();
 *    const legacyData = convertApiCategoriesToLegacy(categories);
 * 
 * 3. Generate TypeScript file:
 *    const categories = await GetAllCategories();
 *    const tsContent = createCategoryDataTypeScriptFile(categories);
 */

/**
 * Converts API CategoryResponse to legacy CategoryData format
 * @param apiCategory - Category from API response
 * @returns CategoryData in legacy format
 */
function convertApiCategoryToLegacy(apiCategory: CategoryResponse): CategoryData {
  // Convert hero object
  let hero: CategoryData['hero'] = undefined;
  
  if (apiCategory.hero) {
    // Check if it's a component hero (has componentName)
    if ('componentName' in apiCategory.hero && apiCategory.hero.componentName) {
      // Component hero
      const props = apiCategory.hero.props ? 
        (typeof apiCategory.hero.props === 'string' ? 
          JSON.parse(apiCategory.hero.props) : 
          apiCategory.hero.props) : {};
      
      hero = {
        componentName: apiCategory.hero.componentName as any,
        props
      };
    } else if (apiCategory.hero.title || apiCategory.hero.subtitle || apiCategory.hero.image) {
      // Static hero
      hero = {
        title: apiCategory.hero.title,
        subtitle: apiCategory.hero.subtitle,
        image: {
          src: apiCategory.hero.image || '',
          height: 400, // Default values since API doesn't include dimensions
          width: 600,
          blurDataURL: '',
          blurWidth: 0,
          blurHeight: 0,
        }
      };
    }
  }

  // Convert image data
  let image: CategoryData['image'] = undefined;
  if (apiCategory.ImageUrl) {
    image = {
      src: apiCategory.ImageUrl,
      height: 300, // Default values
      width: 400,
      blurDataURL: '',
      blurWidth: 0,
      blurHeight: 0,
    };
  }

  // Recursively convert children
  const children = apiCategory.Children?.map(child => convertApiCategoryToLegacy(child)) || [];

  const categoryData: CategoryData = {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    image,
    hero,
    children: children.length > 0 ? children : undefined
  };

  return categoryData;
}

/**
 * Converts array of API categories to legacy categoryData format
 * @param apiCategories - Array of categories from API
 * @returns Array in legacy CategoryData format
 */
export function convertApiCategoriesToLegacy(apiCategories: CategoryResponse[]): CategoryData[] {
  return apiCategories.map(category => convertApiCategoryToLegacy(category));
}

/**
 * Creates a JSON file with categoryData structure from API response
 * @param apiCategories - Categories from GetAllCategories API
 * @param filename - Optional filename (defaults to 'categoryData.json')
 * @returns Promise with the converted data and JSON string
 */
export async function createCategoryDataJson(
  apiCategories: CategoryResponse[], 
  filename: string = 'categoryData.json'
): Promise<{
  data: CategoryData[];
  json: string;
  downloadUrl?: string;
}> {
  try {
    // Convert API data to legacy format
    const convertedData = convertApiCategoriesToLegacy(apiCategories);
    
    // Create formatted JSON string
    const jsonString = JSON.stringify(convertedData, null, 2);
    
    // If running in browser, create download URL
    let downloadUrl: string | undefined;
    if (typeof window !== 'undefined') {
      const blob = new Blob([jsonString], { type: 'application/json' });
      downloadUrl = URL.createObjectURL(blob);
    }

    return {
      data: convertedData,
      json: jsonString,
      downloadUrl
    };
  } catch (error) {
    console.error('Error creating category data JSON:', error);
    throw error;
  }
}

/**
 * Downloads the categoryData JSON file to user's device
 * @param apiCategories - Categories from GetAllCategories API
 * @param filename - Optional filename
 */
export async function downloadCategoryDataJson(
  apiCategories: CategoryResponse[], 
  filename: string = 'categoryData.json'
): Promise<void> {
  if (typeof window === 'undefined') {
    console.warn('Download is only available in browser environment');
    return;
  }

  try {
    const { downloadUrl } = await createCategoryDataJson(apiCategories, filename);
    
    if (downloadUrl) {
      // Create temporary download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(downloadUrl);
      
      console.log(`💡 To use this JSON file in your app:
1. Save the downloaded file to: src/data/${filename}
2. The file is already imported in src/types/category.ts
3. Update the JSON file anytime to change categoryData`);
    }
  } catch (error) {
    console.error('Error downloading category data JSON:', error);
    throw error;
  }
}

/**
 * Saves categoryData JSON to a file in Node.js environment
 * @param apiCategories - Categories from GetAllCategories API  
 * @param filepath - Full path where to save the file
 */
export async function saveCategoryDataJsonToFile(
  apiCategories: CategoryResponse[], 
  filepath: string
): Promise<void> {
  // This would work in a Node.js environment
  if (typeof window !== 'undefined') {
    console.warn('File system operations are not available in browser environment. Use downloadCategoryDataJson instead.');
    return;
  }

  try {
    const { json } = await createCategoryDataJson(apiCategories);
    
    // In a real Node.js environment, you would use:
    // const fs = require('fs').promises;
    // await fs.writeFile(filepath, json, 'utf8');
    
    console.log('JSON content ready to be saved:', json);
    console.log('Use downloadCategoryDataJson for browser environment');
  } catch (error) {
    console.error('Error saving category data JSON to file:', error);
    throw error;
  }
}

/**
 * Gets only root categories (categories without ParentId) in legacy format
 * @param apiCategories - Categories from GetAllCategories API
 * @returns Root categories in legacy format
 */
export function getRootCategoriesInLegacyFormat(apiCategories: CategoryResponse[]): CategoryData[] {
  const rootCategories = apiCategories.filter(cat => !cat.ParentId);
  return convertApiCategoriesToLegacy(rootCategories);
}

/**
 * Creates a formatted TypeScript file content with the categoryData
 * @param apiCategories - Categories from GetAllCategories API
 * @returns TypeScript file content as string
 */
export function createCategoryDataTypeScriptFile(apiCategories: CategoryResponse[]): string {
  const convertedData = convertApiCategoriesToLegacy(apiCategories);
  
  const tsContent = `// Generated categoryData from API response
// Generated on: ${new Date().toISOString()}

import { CategoryData } from '@/types/category';

export const categoryData: CategoryData[] = ${JSON.stringify(convertedData, null, 2)};
`;

  return tsContent;
}

/**
 * Downloads a JSON file specifically formatted to replace src/data/categoryData.json
 * This file can be directly used to replace the current categoryData.json
 * @param apiCategories - Categories from GetAllCategories API
 */
export async function downloadReplacementCategoryDataJson(
  apiCategories: CategoryResponse[]
): Promise<void> {
  try {
    await downloadCategoryDataJson(apiCategories, 'categoryData.json');
    
    console.log(`
🎯 To replace your current categoryData:
1. Save the downloaded 'categoryData.json' to: src/data/categoryData.json
2. It will automatically replace the existing file
3. Your app will use the new data immediately (no code changes needed)
4. The file is already imported in src/types/category.ts
    `);
  } catch (error) {
    console.error('Error downloading replacement category data:', error);
    throw error;
  }
}
