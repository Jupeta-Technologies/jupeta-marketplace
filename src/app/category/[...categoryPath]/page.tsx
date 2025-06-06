import React from 'react';
import { notFound } from 'next/navigation';
import HeroWithSubmenu from '@/components/HeroWithSubmenu';
import CategoryContent from '@/components/CategoryContent';
import { CategoryData } from '@/types/category';
import { categoryData as initialCategoryData } from '@/types/category';
import getCategoryData from '@/lib/api/getCategoryData';
import heroImage from '@/assets/images/led-speaker.jpg';

interface Pageprops {
  params: Promise<{
    categoryPath: string[];
  }>;
};
export const dynamicParams = true; // Optional fallback behavior in dev

export default async function Page({ params }: Pageprops) {

  const {categoryPath} = await params;

  const { currentCategory, subCategories } = await getCategoryData(categoryPath);

  if (!currentCategory) {
    notFound();
  }

  const hero = currentCategory?.hero || {
    title: 'Browse Category',
    subtitle: '',
    image: heroImage,
  };

  const submenu = subCategories.map((child) => ({
    name: child.name,
    link: `/category/${[...(categoryPath || []), child.slug || child.id].join('/')}`,
    image: child.image,
  }));

  return (
    <>
      <HeroWithSubmenu hero={hero} submenu={submenu} currentCategory={currentCategory} />
      <CategoryContent currentCategory={currentCategory} subCategories={subCategories} />
    </>
  );
}

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
  //console.log('Static category paths:', paths); // delete this before production build

  return paths;
}
