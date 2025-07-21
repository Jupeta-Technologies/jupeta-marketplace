// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GetAllProdAPI } from "@/lib/api/GetAllProdAPI";
import { CategoryData } from "@/types/category";
import { categoryData } from "@/types/category"; // Make sure this provides the homepage hero config

import CategoryContent from "@/components/CategoryContent";
import HeroWithSubmenu from "@/components/HeroWithSubmenu";
import CategoryHeroRenderer from "@/components/CategoryHeroRenderer"; // Import the renderer!
import { Product } from "@/types/api";
import ItemCardglobal from "@/components/card/ItemCard";
import ListingRow from "@/components/Shared/ListingRow";
import FeaturedSeller from "@/components/Shared/FeaturedSeller";
import AdComponent from "@/components/Shared/AdComponent";

// You no longer need to import heroImage here specifically for the hero section
// import heroImage from '@/assets/images/led-speaker.jpg';

const HomePage = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  // currentCategory and subCategories are likely not needed for the homepage hero context,
  // unless your CategoryContent component implicitly relies on currentCategory being null
  // for a homepage-specific display. For the hero, we directly fetch the homepage config.
  const [currentCategory] = useState<CategoryData | null>(null);
  const [subCategories] = useState<CategoryData[]>([]);

  const recentViewed: Product[] = []; // Still appears to be unused, consider removing if not implemented

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await GetAllProdAPI();
        if (res.code !== "0") {
          throw new Error("Failed to fetch products");
        }
        setProducts(res.responseData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Find the hero configuration for the homepage from your centralized categoryData
  // Assuming 'home' is the id for your homepage entry in categoryData
  const homepageHeroConfig =
    categoryData.find((cat) => cat.id === "home")?.hero || null;

  // The submenu generation logic remains here as it's specific to the homepage structure
  // Filter out the "home" category from the submenu
  const submenu = categoryData
    .filter((cat) => cat.id !== "home" && cat.name.toLowerCase() !== "home") // Exclude by 'id' and 'name'
    .map((cat) => ({
      name: cat.name,
      link: `/category/${cat.slug || cat.id}`,
      image: cat.image,
    }));

  return (
    <>
      {/* This component will set the hero content in the context based on homepageHeroConfig */}
      <CategoryHeroRenderer heroConfig={homepageHeroConfig} />

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
      <CategoryContent
        currentCategory={currentCategory as CategoryData} // Type assertion might be risky if it's genuinely null
        subCategories={subCategories}
      />
      <div className="container">
        {recentViewed.length > 0 && (
          <div className="recentViewed">
            <h6>Recently viewed</h6>
            <div
              style={{
                width: "248px",
                height: "148px",
                backgroundColor: "#F5F5F7",
                borderRadius: "20px",
              }}
            />
          </div>
        )}

        <div style={{ margin: "32px 0" }}>
          <AdComponent
            image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            link="/ad-details"
            tag="Ad"
            alt="Homepage Advertisement"
            style={{ maxWidth: "100%",maxHeight:'500px',overflow:'hidden', margin: "0 auto" }}
          />
        </div>

        <div className="featured-listing">
          <ListingRow
            heading="Auctions"
            tag=""
            items={products.slice(0, 6)}
            viewMoreLink="/featured"
          />
        </div>

        <FeaturedSeller
          products={products}
          name="Apple"
          image="https://www.shareicon.net/data/256x256/2016/04/07/746116_apple_512x512.png"
        />
       
        <div className="sponsored-listing">
          <ListingRow
            heading="New Arrivals"
            tag=""
            items={products.slice(0, 6)}
            viewMoreLink="/sponsored"
          />
        </div>

        <div className="featured-listing">
          <ListingRow
            heading="Engage your style"
            tag=""
            items={products.slice(6, 12)}
            viewMoreLink="/featured"
          />
          </div>
      </div>
    </>
  );
};

export default HomePage;
