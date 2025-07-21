// app/category/[...categoryPath]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import HeroWithSubmenu from '@/components/HeroWithSubmenu';
import CategoryContent from '@/components/CategoryContent';
import { CategoryData } from '@/types/category'; // Ensure CategoryHeroConfig is imported via CategoryData
import { categoryData as initialCategoryData } from '@/types/category'; // Used for generateStaticParams
import getCategoryData from '@/lib/api/getCategoryData'; // Your server-side data fetching
import heroImage from '@/assets/images/led-speaker.jpg'; // Default fallback image for page.tsx itself

interface Pageprops {
  params: Promise<{
    categoryPath: string[];
  }>;
};
export const dynamicParams = true;

export default async function Page({ params }: Pageprops) {
  const {categoryPath} = await params;

  // getCategoryData should ideally return the CategoryData with the 'hero' property
  const { currentCategory, subCategories } = await getCategoryData(categoryPath);

  if (!currentCategory) {
    notFound();
  }

  // Determine the heroConfig to pass to HeroWithSubmenu
  // If currentCategory.hero is undefined, provide a default static one
  const heroConfig = currentCategory?.hero || {
    title: 'Browse Category',
    subtitle: '',
    // Note: You must pass the string path for the image here, not the StaticImageData object
    image: { src: heroImage.src, width: heroImage.width, height: heroImage.height },
  };

  const submenu = subCategories.map((child) => ({
    name: child.name,
    link: `/category/${[...(categoryPath || []), child.slug || child.id].join('/')}`,
    image: child.image, // Ensure child.image is structured correctly { src, width, height }
  }));

  return (
    <>
      {/* Pass the heroConfig to HeroWithSubmenu */}
      <HeroWithSubmenu
        heroConfig={heroConfig}
        submenu={submenu}
        currentCategory={currentCategory} // Still useful for submenu derivation
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

  const paths = flattenCategories(initialCategoryData);

  return paths;
}