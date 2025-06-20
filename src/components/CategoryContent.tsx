import React from 'react';
import { CategoryData } from '@/types/category'; // Import the CategoryData type
import Link from 'next/link';
//import { cn } from "@/lib/utils" // uncomment to apply conditional css classes

interface CategoryContentProps {
  currentCategory: CategoryData;
  subCategories: CategoryData[];
}

const CategoryContent: React.FC<CategoryContentProps> = ({ currentCategory, subCategories }) => {
  if (!currentCategory) {
    return; // Or a more sophisticated loading indicator
  }

  if (subCategories && subCategories.length > 0) {
    // If the current category has subcategories, display them
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">
          {currentCategory.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <Link
                href={`/category/${subCategory.slug || subCategory.id}`} // Construct the link
                className="block"
              >
                <h3 className="text-lg font-medium">{subCategory.name}</h3>
                {subCategory.image && ( //check if image exists
                  <img
                    src={subCategory.image.src}
                    alt={subCategory.name}
                    className="w-full h-48 object-cover rounded-md mt-2"
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // If the current category has no subcategories, display products (or a message)
    //  This is a placeholder.  In a real e-commerce site, you'd fetch and display
    //  the products associated with this category.
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">
          Products in {currentCategory.name}
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700">
            {/* Placeholder:  */}
            This is a placeholder for the product listing page.  You would fetch and display the actual products
            for the &quot;{currentCategory.name}&quot; category here.
          </p>
          {/* Example of a grid of product cards (you'd replace this with your actual product data) */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="border rounded-md p-4">Product 1</div>
            <div className="border rounded-md p-4">Product 2</div>
            <div className="border rounded-md p-4">Product 3</div>
          </div>
          */}
        </div>
      </div>
    );
  }
};

export default CategoryContent;
