// contexts/HeroContentContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StaticImageData } from 'next/image';
import heroImage from '@/assets/images/led-speaker.jpg'; // Default image

// New: Interface for a custom component to be rendered within the hero
export interface HeroCustomComponent {
  componentName: string; // A string identifier to map to the actual React component
  props?: Record<string, any>; // Optional props to pass to the custom component
}

// Updated: Interface for the content that HeroWithSubmenu expects to *receive*
export interface HeroContentToDisplay {
  title?: string;
  subtitle?: string;
  image: StaticImageData; // The actual StaticImageData object
  customComponent?: HeroCustomComponent; // New: Optional custom component to render
}

interface HeroContentContextType {
  heroContent: HeroContentToDisplay;
  setHeroContent: (content: HeroContentToDisplay) => void;
}

// Default hero content for when nothing else is specified
const defaultHeroContent: HeroContentToDisplay = {
  title: 'Welcome Home!',
  subtitle: 'Your adventure begins here.',
  image: heroImage, // Using the actual imported image
};

export const HeroContentContext = createContext<HeroContentContextType | undefined>(undefined);

interface HeroContentProviderProps {
  children: ReactNode;
}

export const HeroContentProvider: React.FC<HeroContentProviderProps> = ({ children }) => {
  const [heroContent, setHeroContent] = useState<HeroContentToDisplay>(defaultHeroContent);

  return (
    <HeroContentContext.Provider value={{ heroContent, setHeroContent }}>
      {children}
    </HeroContentContext.Provider>
  );
};

export const useHeroContent = () => {
  const context = useContext(HeroContentContext);
  if (context === undefined) {
    throw new Error('useHeroContent must be used within a HeroContentProvider');
  }
  return context;
};