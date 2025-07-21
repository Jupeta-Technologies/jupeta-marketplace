// components/hero-updaters/AutoPromotionHero.tsx
'use client';
import React, { useEffect } from 'react';
import { useHeroContent } from '@/context/HeroContentContext';
import autoPromoImage from '@/assets/images/auto_hero.jpg';

interface AutoPromotionHeroProps {
  promoCode?: string;
  campaignId?: string;
}

const AutoPromotionHero: React.FC<AutoPromotionHeroProps> = ({ promoCode, campaignId }) => {
  const { setHeroContent } = useHeroContent();

  useEffect(() => {
    const newHeroContent = {
      title: `Limited Time Auto Deals!`,
      subtitle: `Don't miss out on savings with code ${promoCode || 'SAVEBIG'}.`,
      image: autoPromoImage,
      customComponent: { // New: Reference your custom component here
        componentName: 'CountdownTimer',
        props: {
          endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
          message: 'Offer ends in:',
        },
      },
    };
    setHeroContent(newHeroContent);
  }, [promoCode, campaignId, setHeroContent]);

  return null;
};

export default AutoPromotionHero;