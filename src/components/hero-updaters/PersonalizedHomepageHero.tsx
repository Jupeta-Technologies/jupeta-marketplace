// components/hero-updaters/PersonalizedHomepageHero.tsx
"use client";
import React, { useEffect } from "react";
import { useHeroContent } from "@/context/HeroContentContext";
import heroForTechEnthusiast from "@/assets/images/electroic_hero.jpg";
import heroForFashionLover from "@/assets/images/fashion_hero.png";
import defaultHomepageHero from "@/assets/images/led-speaker.jpg";

const PersonalizedHomepageHero: React.FC = () => {
  const { setHeroContent } = useHeroContent();

  useEffect(() => {
    // 1. Simulate fetching user behavior data
    const userPreference =
      localStorage.getItem("user_top_category") || "default"; // Example: get from local storage or API

    let newHeroTitle = "Welcome Back!";
    let newHeroSubtitle = "Explore what's new.";
    let newHeroImage = defaultHomepageHero;

    if (userPreference === "electronics") {
      newHeroTitle = "Just For You, Tech Enthusiast!";
      newHeroSubtitle = "Check out the latest gadgets.";
      newHeroImage = heroForTechEnthusiast;
    } else if (userPreference === "fashion") {
      newHeroTitle = "Your Style Awaits!";
      newHeroSubtitle = "Fresh trends curated for you.";
      newHeroImage = heroForFashionLover;
    }

    setHeroContent({
      title: newHeroTitle,
      subtitle: newHeroSubtitle,
      image: newHeroImage,
    });
  }, [setHeroContent]);

  return null;
};

export default PersonalizedHomepageHero;
