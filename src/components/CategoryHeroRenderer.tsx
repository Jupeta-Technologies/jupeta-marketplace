// components/CategoryHeroRenderer.tsx
"use client";
import React, { useEffect, useMemo } from "react";
import { useHeroContent } from "@/context/HeroContentContext";
import { CategoryHeroConfig } from "@/types/category";
import heroImage from "@/assets/images/led-speaker.jpg"; // Default fallback image
import { StaticImageData } from "next/image";

// Import all possible images for static heroes (needs to match the `allImportedImages` in HeroWithSubmenu)
import home from "@/assets/images/home.jpg";
import home_2 from "@/assets/images/home_2.png";
import elec from "@/assets/images/electronics.png";
import automob from "@/assets/images/auto_1.png";
import fashion from "@/assets/images/fashion_1.png";
import auto_hero from "@/assets/images/auto_hero.jpg";
import fashion_hero from "@/assets/images/fashion_hero.png";
import electronic_hero from "@/assets/images/electroic_hero.jpg";
import PersonalizedHomepageHero from "@/components/hero-updaters/PersonalizedHomepageHero";

// Map string paths to imported StaticImageData objects for static heroes
const staticHeroImages: { [key: string]: StaticImageData } = {
  "/assets/images/led-speaker.jpg": heroImage,
  "/assets/images/home.jpg": home,
  "/assets/images/home_2.png": home_2,
  "/assets/images/electronics.png": elec,
  "/assets/images/auto_1.png": automob,
  "/assets/images/fashion_1.png": fashion,
  "/assets/images/auto_hero.jpg": auto_hero,
  "/assets/images/fashion_hero.png": fashion_hero,
  "/assets/images/electroic_hero.jpg": electronic_hero,
};

// Dynamically import your updater components
// This map allows you to resolve a string name to an actual React component
const HeroUpdaterComponents: { [key: string]: React.ComponentType<any> } = {
  HomepageInteractiveHero: React.lazy(
    () => import("@/components/hero-updaters/HomepageInteractiveHero")
  ),
  AutoPromotionHero: React.lazy(
    () => import("@/components/hero-updaters/AutoPromotionHero")
  ),
  PersonalizedHomepageHero: React.lazy(
    () => import("@/components/hero-updaters/PersonalizedHomepageHero")
  ),
  // Add other dynamic hero components here
  // ElectronicsDynamicHero: React.lazy(() => import('@/components/hero-updaters/ElectronicsDynamicHero')),
};

interface CategoryHeroRendererProps {
  heroConfig?: CategoryHeroConfig | null;
}

const CategoryHeroRenderer: React.FC<CategoryHeroRendererProps> = ({
  heroConfig,
}) => {
  const { setHeroContent } = useHeroContent();

  // Memoize the dynamic component to avoid re-rendering issues
  const DynamicHeroComponent = useMemo(() => {
    if (heroConfig && "componentName" in heroConfig) {
      return HeroUpdaterComponents[heroConfig.componentName];
    }
    return null;
  }, [heroConfig]);

  useEffect(() => {
    // If it's a static hero configuration
    if (heroConfig && !("componentName" in heroConfig)) {
      const staticHeroImage =
        staticHeroImages[heroConfig.image.src] || heroImage;
      setHeroContent({
        title: heroConfig.title,
        subtitle: heroConfig.subtitle,
        image: staticHeroImage,
      });
    }
    // If it's a component-driven hero, the component itself will call setHeroContent
    // If heroConfig is null or undefined, set to default
    if (!heroConfig) {
      setHeroContent({
        title: "Welcome Home!",
        subtitle: "Your adventure begins here.",
        image: heroImage,
      });
    }
  }, [heroConfig, setHeroContent]);

  // Render the dynamic component if specified
  if (DynamicHeroComponent) {
    return (
      <React.Suspense fallback={null}>
        {" "}
        {/* Add a loading fallback if needed */}
        <DynamicHeroComponent {...(heroConfig as any).props} />
      </React.Suspense>
    );
  }

  return null; // This component itself doesn't render visible UI, just manages the context
};

export default CategoryHeroRenderer;
