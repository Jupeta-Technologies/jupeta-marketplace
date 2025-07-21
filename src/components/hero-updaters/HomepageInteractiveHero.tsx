// components/hero-updaters/HomepageInteractiveHero.tsx
'use client';
import React, { useEffect } from 'react';
import { useHeroContent } from '@/context/HeroContentContext';
import dynamicHomepageHero from '@/assets/images/hp_hero3.png';

interface HomepageInteractiveHeroProps {
  featuredProductSlug?: string;
}

const HomepageInteractiveHero: React.FC<HomepageInteractiveHeroProps> = ({ featuredProductSlug }) => {
  const { setHeroContent } = useHeroContent();

  useEffect(() => {
    const newHeroContent = {
      title: `Discover ${featuredProductSlug ? featuredProductSlug.replace('-', ' ') : 'Our New Arrivals'}!`,
      subtitle: 'Experience the future with our latest innovations.',
      image: dynamicHomepageHero,
      customComponent: { // New: Reference your custom component here
        componentName: 'SellButton',
        props: {
          label: 'Sell Your Old Gear',
          targetLink: '/start-selling',
          analyticsEvent: 'homepage_sell_cta',
        },
      },
    };
    setHeroContent(newHeroContent);

  }, [featuredProductSlug, setHeroContent]);

  return null;
};

export default HomepageInteractiveHero;