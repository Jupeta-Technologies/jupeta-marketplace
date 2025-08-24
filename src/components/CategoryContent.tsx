//CategoryContent.tsx
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
      <div className="container">
        <h2 className="category-title">
          {currentCategory.name}
        </h2>
        <div className="category-grid">
          {subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="category-card"
            >
              <Link
                href={`/category/${subCategory.slug || subCategory.id}`} // Construct the link
                className="category-link"
              >
                <h3 className="category-label">{subCategory.name}</h3>
                {subCategory.image && ( //check if image exists
                  <img
                    src={subCategory.image.src}
                    alt={subCategory.name}
                    className="category-image"
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
      <div className="container">
        <h2 className="category-title">
          Products in {currentCategory.name}
        </h2>
        <div className="category-card">
          <p className="category-description">
            {/* Placeholder:  */}
            This is a placeholder for the product listing page.  You would fetch and display the actual products
            for the &quot;{currentCategory.name}&quot; category here.
          </p>
          {/* Example of a grid of product cards (you'd replace this with your actual product data) */}
          {/*
          <div className="category-grid">
            <div className="category-card">Product 1</div>
            <div className="category-card">Product 2</div>
            <div className="category-card">Product 3</div>
          </div>
          */}
        </div>
      </div>
    );
  }
};

export default CategoryContent;
