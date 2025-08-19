// Example usage of categoryDataConverter
// This file demonstrates how to use the converter utility

import { GetAllCategories } from '@/lib/api/GetAllCategoriesAPI';
import { 
  convertApiCategoriesToLegacy, 
  downloadCategoryDataJson, 
  createCategoryDataTypeScriptFile,
  getRootCategoriesInLegacyFormat 
} from '@/utils/categoryDataConverter';

/**
 * Example 1: Convert API data to legacy format for use in components
 */
export async function convertCategoriesForComponent() {
  try {
    // Fetch categories from API
    const apiCategories = await GetAllCategories();
    
    // Convert to legacy format
    const legacyCategories = convertApiCategoriesToLegacy(apiCategories);
    
    // Use in your component
    console.log('Legacy format categories:', legacyCategories);
    return legacyCategories;
  } catch (error) {
    console.error('Error converting categories:', error);
    return [];
  }
}

/**
 * Example 2: Download categories as JSON file
 */
export async function downloadCategoriesAsJson() {
  try {
    // Fetch categories from API
    const apiCategories = await GetAllCategories();
    
    // Download as JSON file
    await downloadCategoryDataJson(apiCategories, 'marketplace-categories.json');
    
    console.log('Categories downloaded successfully');
  } catch (error) {
    console.error('Error downloading categories:', error);
  }
}

/**
 * Example 3: Generate TypeScript file content
 */
export async function generateTypeScriptFile() {
  try {
    // Fetch categories from API
    const apiCategories = await GetAllCategories();
    
    // Generate TypeScript file content
    const tsContent = createCategoryDataTypeScriptFile(apiCategories);
    
    console.log('TypeScript content:', tsContent);
    return tsContent;
  } catch (error) {
    console.error('Error generating TypeScript file:', error);
    return '';
  }
}

/**
 * Example 4: Get only root categories in legacy format
 */
export async function getRootCategoriesOnly() {
  try {
    // Fetch categories from API
    const apiCategories = await GetAllCategories();
    
    // Get only root categories
    const rootCategories = getRootCategoriesInLegacyFormat(apiCategories);
    
    console.log('Root categories only:', rootCategories);
    return rootCategories;
  } catch (error) {
    console.error('Error getting root categories:', error);
    return [];
  }
}

/**
 * Example 5: Use in a React component
 */
/*
import React, { useState, useEffect } from 'react';
import { convertCategoriesForComponent } from './examples/categoryConverterExamples';

export function CategoryDisplayComponent() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      const legacyCategories = await convertCategoriesForComponent();
      setCategories(legacyCategories);
    };
    
    loadCategories();
  }, []);
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          {category.hero?.componentName && (
            <p>Hero Component: {category.hero.componentName}</p>
          )}
        </div>
      ))}
    </div>
  );
}
*/
