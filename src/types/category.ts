// types/category.ts
import { StaticImageData } from "next/image";
import auto_hero from "@/assets/images/auto_hero.jpg";
import electronic_hero from "@/assets/images/electroic_hero.jpg";
import fashion_hero from "@/assets/images/fashion_hero.png";
import heroImage from "@/assets/images/led-speaker.jpg"; // default

// 1. Existing static hero content structure
interface StaticHeroData {
  title?: string;
  subtitle?: string;
  image: {
    src: string; // This will be the string path (e.g., '/assets/images/auto_hero.jpg')
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
}

// 2. New structure for component-driven hero
// We'll use a string identifier that maps to an actual React component
interface ComponentHeroData {
  componentName:
    | "HomepageInteractiveHero"
    | "ElectronicsDynamicHero"
    | "AutoPromotionHero"
    | "PersonalizedHomepageHero"; // Add more as needed
  props?: Record<string, any>; // Optional props to pass to the dynamic component
}

// Union type: A category's hero can be either static data OR a component reference
export type CategoryHeroConfig = StaticHeroData | ComponentHeroData;

export interface CategoryData {
  id: string | number;
  name: string;
  slug?: string;
  image?: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  }; // For submenu items
  hero?: CategoryHeroConfig; // Use the new union type
  children?: CategoryData[];
}

// --- Example categoryData with both types ---
export const categoryData: CategoryData[] = [
  {
    id: 1,
    slug: "home-kitchen",
    name: "Home & Kitchen",
    image: {
      src: "/assets/images/home_2.png", //  Use relative paths that Next.js can resolve
      height: 300, //  set actual values
      width: 400,
    },
    hero: {
      title: "Home & Kitchen!",
      subtitle: "Your adventure begins here.",
      image: {
        src: "/assets/images/home.jpg",
        height: 400,
        width: 600,
      },
    },
    children: [
      {
        id: 201,
        slug: "furniture",
        name: "Furniture",
        image: { src: "", height: 0, width: 0 },
      },
      {
        id: 202,
        slug: "appliances",
        name: "Appliances",
        image: { src: "", height: 0, width: 0 },
      },
    ],
  },
  {
    id: "2",
    name: "Electronics",
    slug: "electronics",
    image: { src: "/assets/images/electronics.png", width: 60, height: 60 },
    hero: {
      // This is a static hero
      title: "Cutting-Edge Electronics",
      subtitle: "Explore the latest in tech innovations.",
      image: { src: "/assets/images/electroic_hero.jpg", width: 1920, height: 1080 },
    },
    children: [
      {
        id: 101,
        slug: "laptops",
        name: "Laptops",
        image: { src: "", height: 0, width: 0 },
        children: [
          {
            id: 1001,
            slug: "gaming-laptops",
            name: "Gaming Laptops",
            image: { src: "", height: 0, width: 0 },
          },
          {
            id: 1002,
            slug: "ultrabooks",
            name: "Ultrabooks",
            image: { src: "", height: 0, width: 0 },
          },
        ],
      },
      {
        id: 102,
        slug: "smartphones",
        name: "Smartphones",
        image: { src: "", height: 0, width: 0 },
        children: [
          {
            id: 1003,
            slug: "android-phones",
            name: "Android Phones",
            image: { src: "", height: 0, width: 0 },
          },
          {
            id: 1004,
            slug: "iphones",
            name: "iPhones",
            image: { src: "", height: 0, width: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Automotive",
    slug: "automotive",
    image: { src: "/assets/images/auto_1.png", width: 60, height: 60 },
    hero: {
      // This hero is driven by a component
      componentName: "AutoPromotionHero",
      props: { promoCode: "DRIVEFAST", campaignId: "summer-2025" }, // Example props
    },
    children: [
      {
        id: "101",
        slug: "care",
        name: "Care",
        image: { src: "", height: 0, width: 0 },
        children: [
          {
            id: "1001",
            slug: "interior",
            name: "Interior",
            image: { src: "", height: 0, width: 0 },
          },
          {
            id: "1002",
            slug: "exterior",
            name: "Exterior",
            image: { src: "", height: 0, width: 0 },
          },
        ],
      },
      {
        id: "102",
        slug: "parts",
        name: "Parts",
        image: { src: "", height: 0, width: 0 },
        children: [
          {
            id: "1003",
            slug: "lighting",
            name: "Lighting",
            image: { src: "", height: 0, width: 0 },
          },
          {
            id: "1004",
            slug: "filter",
            name: "Filter",
            image: { src: "", height: 0, width: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Fashion",
    slug: "fashion",
    image: { src: "/assets/images/fashion_1.png", width: 60, height: 60 },
    hero: {
      // Another static hero
      title: "Style That Speaks",
      subtitle: "Dress to impress with our curated collections.",
      image: { src: "/assets/images/fashion_hero.png", width: 1920, height: 1080 },
    },
    children: [
      {
        id: 101,
        slug: "men",
        name: "Men",
        image: { src: "", height: 0, width: 0 },
        children: [
          {
            id: 1001,
            slug: "shoes",
            name: "Shoes",
            image: { src: "", height: 0, width: 0 },
          },
          {
            id: 1002,
            slug: "pants",
            name: "Pants",
            image: { src: "", height: 0, width: 0 },
          },
        ],
      },
      {
        id: 102,
        slug: "women",
        name: "Women",
        image: { src: "", height: 0, width: 0 },
        children: [
          {
            id: 1003,
            slug: "shoes",
            name: "Shoes",
            image: { src: "", height: 0, width: 0 },
          },
          {
            id: 1004,
            slug: "dresses",
            name: "Dresses",
            image: { src: "", height: 0, width: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "home",
    name: "Home",
    slug: "",
    hero: {
      componentName: "PersonalizedHomepageHero", // Now points to the personalized component
      props: {}, // No specific props needed if logic is internal
    },
  },
];
