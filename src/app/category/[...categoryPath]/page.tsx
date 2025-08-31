// app/category/[...categoryPath]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import HeroWithSubmenu from '@/components/HeroWithSubmenu';
import CategoryContent from '@/components/CategoryContent';
import { CategoryData } from '@/types/category'; // Ensure CategoryHeroConfig is imported via CategoryData
import { categoryData as initialCategoryData } from '@/types/category'; // Used for generateStaticParams
import { getCategoryDataDynamic } from '@/types/category';
import getCategoryData from '@/lib/api/getCategoryData'; // Your server-side data fetching
import heroImage from '@/assets/images/led-speaker.jpg'; // Default fallback image for page.tsx itself

interface Pageprops {
  params: Promise<{
    categoryPath: string[];
  }>;
};
export const dynamicParams = true;


export default async function Page({ params }: Pageprops) {
  const { categoryPath } = await params;
  console.log('categoryPath:', categoryPath);

  // If categoryPath is undefined or empty, treat as root category
  const effectiveCategoryPath = !categoryPath || categoryPath.length === 0 ? undefined : categoryPath;
  const { currentCategory, subCategories } = await getCategoryData(effectiveCategoryPath);
  console.log('currentCategory:', currentCategory);

  if (!currentCategory) {
    // Show a more helpful error for debugging
    console.error('404: No category found for path', categoryPath);
    notFound();
  }

  // Determine the heroConfig to pass to HeroWithSubmenu
  // If currentCategory.hero is undefined, provide a default static one
  const heroConfig = currentCategory?.hero || {
    title: 'Browse Category',
    subtitle: '',
    image: { src: heroImage.src, width: heroImage.width, height: heroImage.height },
  };

  const submenu = subCategories.map((child) => ({
    name: child.name,
    link: `/category/${[...(categoryPath || []), child.slug || child.id].join('/')}`,
    image: child.image,
  }));

  return (
    <>
      <HeroWithSubmenu
        heroConfig={heroConfig}
        submenu={submenu}
        currentCategory={currentCategory}
      />
      <CategoryContent currentCategory={currentCategory} subCategories={subCategories} />
    </>
  );
}

// generateStaticParams remains the same as it's for pre-building paths
export async function generateStaticParams() {
  const flattenCategories = (
    categories: CategoryData[],
    path: string[] = []
  ): { categoryPath: string[] }[] => {
    return categories.flatMap((cat) => {
      const currentPath = [...path, cat.slug || String(cat.id)];
      const childPaths = cat.children
        ? flattenCategories(cat.children, currentPath)
        : [];
      return [{ categoryPath: currentPath }, ...childPaths];
    });
  };

  // Use dynamic fetching to get the most up-to-date category data
  const paths = flattenCategories(await getCategoryDataDynamic());

  return paths;
}