// components/CategoryDataInitializer.tsx
"use client";

import { useEffect } from 'react';
import { initializeCategoryData } from '@/lib/categoryDataProvider';

/**
 * Component to initialize category data on app startup
 * Should be included in the app layout or main page
 */
export default function CategoryDataInitializer() {
  useEffect(() => {
    // Initialize category data as soon as the app loads
    initializeCategoryData();
  }, []);

  // This component doesn't render anything
  return null;
}
