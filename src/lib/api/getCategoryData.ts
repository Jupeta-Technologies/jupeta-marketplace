// lib/api/getCategoryData.ts

import { CategoryData } from '@/types/category';
import { categoryData as initialCategoryData } from '@/types/category'; // or wherever you store your initial categories

export default async function getCategoryData(
  categoryPath?: string[]
): Promise<{ currentCategory: CategoryData | null; subCategories: CategoryData[] }> {
  let currentLevelCategories: CategoryData[] = initialCategoryData;
  let currentCategory: CategoryData | null = null;

  if (categoryPath) {
    for (const segment of categoryPath) {
      const foundCategory = currentLevelCategories.find(
        (cat) => cat.slug === segment || cat.id.toString() === segment
      );

      if (foundCategory) {
        currentCategory = foundCategory;
        currentLevelCategories = foundCategory.children || [];
      } else {
        return { currentCategory: null, subCategories: [] };
      }
    }
  } else {
    currentCategory = {
      id: 0,
      slug: '',
      name: 'All Categories',
      image: { src: '', height: 0, width: 0 },
      hero: { title: '', subtitle: '', image: { src: '', height: 0, width: 0 } },
      children: initialCategoryData,
    };
    currentLevelCategories = initialCategoryData;
  }

  return { currentCategory, subCategories: currentLevelCategories };
}
