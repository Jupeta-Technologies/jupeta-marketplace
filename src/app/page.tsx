// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GetAllProdAPI } from "@/lib/api/GetAllProdAPI";
import { CategoryData } from "@/types/category";
import { useCategoryDataImmediate } from "@/hooks/useCategoryData"; // Dynamic category data

import CategoryContent from "@/components/CategoryContent";
import HeroWithSubmenu from "@/components/HeroWithSubmenu";
import CategoryHeroRenderer from "@/components/CategoryHeroRenderer"; // Import the renderer!
import { Product } from "@/types/api";
import ItemCard from "@/components/card/ItemCard";
import ItemCardSkeleton from "@/components/card/ItemCardSkeleton";
import ListingRow from "@/components/Shared/ListingRow";
import ListingRowSkeleton from "@/components/Shared/ListingRowSkeleton";
import FeaturedSeller from "@/components/Shared/FeaturedSeller";
import FeaturedSellerSkeleton from "@/components/Shared/FeaturedSellerSkeleton";
import AdComponent from "@/components/Shared/AdComponent";
import ItemCardExamples from "@/components/examples/ItemCardExamples";
import RecentlyViewed from "@/components/Shared/RecentlyViewed";

// You no longer need to import heroImage here specifically for the hero section
// import heroImage from '@/assets/images/led-speaker.jpg';

const HomePage = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  // currentCategory and subCategories are likely not needed for the homepage hero context,
  // unless your CategoryContent component implicitly relies on currentCategory being null
  // for a homepage-specific display. For the hero, we directly fetch the homepage config.
  const [currentCategory] = useState<CategoryData | null>(null);
  const [subCategories] = useState<CategoryData[]>([]);

  // Get dynamic category data with immediate fallback
  const categoryData = useCategoryDataImmediate();

  console.log("Category Data:", categoryData);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const res = await GetAllProdAPI();
        if (res.code !== "0") {
          throw new Error(res.message || "Failed to fetch products");
        }
        setProducts(res.responseData);
        console.log("Fetched Products:", res.responseData.length, "items");
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsError(error instanceof Error ? error.message : "Failed to fetch products");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Find the hero configuration for the homepage from dynamic categoryData
  // Assuming 'home' is the slug for your homepage entry in categoryData
  const homepageHeroConfig =
    categoryData.find((cat: CategoryData) => cat.slug === "home")?.hero || null;

  // The submenu generation logic remains here as it's specific to the homepage structure
  // Filter out the "home" category from the submenu
  const submenu = categoryData
    .filter((cat: CategoryData) => cat && cat.slug !== "home" && cat.name && cat.name.toLowerCase() !== "home") // Exclude by 'slug' and 'name'
    .map((cat: CategoryData) => ({
      name: cat.name,
      link: `/category/${cat.slug || cat.id}`,
      image: cat.image,
    }));

  return (
    <>
      {/* This component will set the hero content in the context based on homepageHeroConfig */}
      {/* <CategoryHeroRenderer heroConfig={homepageHeroConfig} /> */}

      {/* HeroWithSubmenu now automatically reads from the context that CategoryHeroRenderer populates */}
      <HeroWithSubmenu
        // The `hero` prop is removed as HeroWithSubmenu now gets it from context
        submenu={submenu}
        // currentCategory is also not directly consumed by HeroWithSubmenu for the hero display itself
        // but might be needed for the submenu derivation if `submenu` prop wasn't provided.
        // If `currentCategory` is truly null on homepage, consider how your CategoryContent handles it.
        // It might be better to pass the 'home' CategoryData object here if CategoryContent expects it.
        currentCategory={currentCategory}
      />
      {/* <CategoryContent
        currentCategory={currentCategory as CategoryData} // Type assertion might be risky if it's genuinely null
        subCategories={subCategories}
      /> */}
      
      {/* Recently Viewed Component */}
      <div className="container">
        <RecentlyViewed />
      </div>
      
      <div className="container">
        {/* Products Loading/Error States */}
        {productsLoading && (
          <div className="space-y-8">
            {/* Hero product skeletons */}
            <div className="scroll-horizontal mb-8">
              <ItemCardSkeleton variant="minimal" />
              <ItemCardSkeleton variant="minimal" />
              <ItemCardSkeleton variant="minimal" />
              <ItemCardSkeleton variant="minimal" />
            </div>
            
            {/* Featured custom card skeleton */}
            <ItemCardSkeleton variant="custom" width={348} height={448} />
            
            {/* Main products grid skeleton */}
            <div className="scroll-horizontal mb-8">
              <ItemCardSkeleton variant="custom" width={300} height={448} />
              <ItemCardSkeleton variant="custom" width={300} height={448} />
              <ItemCardSkeleton variant="custom" width={300} height={448} />
              <ItemCardSkeleton variant="custom" width={300} height={448} />
            </div>
            
            {/* Listing rows skeletons */}
            <ListingRowSkeleton itemCount={6} />
            
            {/* Featured seller skeleton */}
            <FeaturedSellerSkeleton itemCount={4} />
            
            {/* Additional listing rows */}
            <ListingRowSkeleton itemCount={6} />
            <ListingRowSkeleton itemCount={6} />
          </div>
        )}
        
        {productsError && (
          <div className="text-center py-8 text-red-600">
            <p>Error: {productsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Show products count for debugging */}
        {!productsLoading && !productsError && (
          <div className="text-sm text-gray-600 mb-4">
            Loaded {products.length} products
          </div>
        )}

        <div style={{ margin: "32px 0" }}>

          {/* Example auction cards with different ending states */}
          <div className="scroll-horizontal mb-8">
            {/* Only render ItemCards if we have enough products */}
            {products.length >= 1 && (
              <ItemCard
                prodData={{
                  ...products[0],
                  sellingType: 'Auction'
                }}
                variant="minimal"
                auctionEndDate={new Date(Date.now() + 30 * 60 * 1000).toISOString()}
              />
            )}
            
            {products.length >= 2 && (
              <ItemCard
                prodData={{
                  ...products[1],
                  sellingType: 'Auction'
                }}
                variant="minimal"
                auctionEndDate={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()}
              />
            )}
            
            {products.length >= 3 && (
              <ItemCard
                prodData={{
                  ...products[2],
                  sellingType: 'Auction'
                }}
                variant="minimal"
                auctionEndDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
              />
            )}
            
            {products.length >= 4 && (
              <ItemCard
                prodData={{
                  ...products[3],
                  sellingType: 'BuyNow'
                }}
                variant="minimal"
              />
            )}
          </div>

          
        </div>
        <div className="scroll-horizontal mb-8">
          {products.length >= 4 ? (
            products.slice(0, 4).map((product, key) => (
              <ItemCard
                key={key}
                prodData={{
                  ...product,
                  sellingType: 'BuyNow'
                }}
                variant="custom"
                width={300}
                height={448}
              />
            ))
          ) : !productsLoading && !productsError ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>No products available at the moment.</p>
            </div>
          ) : null}
        </div>

        {products.length > 0 && (
          <div className="featured-listing">
            <ListingRow
              heading="Auctions"
              tag=""
              items={products.slice(0, 6)}
              viewMoreLink="/featured"
            />
          </div>
        )}

        {products.length > 0 && (
          <FeaturedSeller
            products={products}
            name="Apple"
            image="https://www.shareicon.net/data/256x256/2016/04/07/746116_apple_512x512.png"
          />
        )}
       
        {products.length > 0 && (
          <div className="sponsored-listing">
            <ListingRow
              heading="New Arrivals"
              tag=""
              items={products.slice(0, 6)}
              viewMoreLink="/sponsored"
            />
          </div>
        )}

        {products.length > 6 && (
          <div className="featured-listing">
            <ListingRow
              heading="Engage your style"
              tag=""
              items={products.slice(6, 12)}
              viewMoreLink="/featured"
            />
          </div>
        )}

      </div>
    </>
  );
};

export default HomePage;
