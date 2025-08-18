'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useHeroContent } from '@/context/HeroContentContext';
import Image, { StaticImageData } from 'next/image';

// Import hero images for the carousel
import heroImage from '@/assets/images/led-speaker.jpg';
import home from '@/assets/images/home.jpg';
import auto_hero from '@/assets/images/auto_hero.jpg';
import fashion_hero from '@/assets/images/fashion_hero.png';
import electronic_hero from '@/assets/images/electroic_hero.jpg';
import hp_hero from '@/assets/images/hp_hero.jpeg';
import hp_hero2 from '@/assets/images/hp_hero2.jpeg';
import hp_hero3 from '@/assets/images/hp_hero3.png';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: StaticImageData;
  customComponent?: {
    componentName: string;
    props?: any;
  };
}

interface CarouselHeroProps {
  slides?: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  transitionDuration?: number;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: 1,
    title: 'Welcome to Jupeta Marketplace',
    subtitle: 'Discover amazing products at unbeatable prices',
    image: hp_hero3,
  },
  {
    id: 2,
    title: 'Latest Electronics',
    subtitle: 'Shop the newest gadgets and tech essentials',
    image: electronic_hero,
  },
  {
    id: 3,
    title: 'Fashion & Style',
    subtitle: 'Trendy clothes and accessories for every occasion',
    image: fashion_hero,
  },
  {
    id: 4,
    title: 'Automotive Excellence',
    subtitle: 'Quality parts and accessories for your vehicle',
    image: auto_hero,
  },
  {
    id: 5,
    title: 'Home & Garden',
    subtitle: 'Transform your living space with our collection',
    image: home,
  },
];

const CarouselHero: React.FC<CarouselHeroProps> = ({
  slides = defaultSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  transitionDuration = 800,
}) => {
  const { setHeroContent } = useHeroContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update hero content with smooth transition
  const updateHeroContent = useCallback((slideIndex: number, immediate = false) => {
    const slide = slides[slideIndex];
    if (!slide) return;

    if (immediate) {
      // Immediate update without transition (for initial load)
      setHeroContent({
        title: slide.title,
        subtitle: slide.subtitle,
        image: slide.image,
        customComponent: slide.customComponent,
      });
      return;
    }

    // Start transition
    setIsTransitioning(true);
    setContentVisible(false);

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Update content after fade out
    transitionTimeoutRef.current = setTimeout(() => {
      setHeroContent({
        title: slide.title,
        subtitle: slide.subtitle,
        image: slide.image,
        customComponent: slide.customComponent,
      });
      
      // Fade content back in
      setTimeout(() => {
        setContentVisible(true);
        setIsTransitioning(false);
      }, 50);
    }, transitionDuration / 3);

  }, [slides, setHeroContent, transitionDuration]);

  // Initialize with first slide
  useEffect(() => {
    updateHeroContent(0, true);
  }, [updateHeroContent]);

  // Auto-play functionality with smooth transitions
  useEffect(() => {
    if (!autoPlay || isHovered || isTransitioning) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        updateHeroContent(nextSlide);
        return nextSlide;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, isTransitioning, slides.length, updateHeroContent]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    
    setCurrentSlide(index);
    updateHeroContent(index);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    const prevSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevSlide);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    const nextSlide = (currentSlide + 1) % slides.length;
    goToSlide(nextSlide);
  };

  return (
    <div 
      className={`carousel-hero-controls ${isTransitioning ? 'transitioning' : ''} ${contentVisible ? 'content-visible' : 'content-hidden'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            className={`carousel-arrow carousel-arrow-left ${isTransitioning ? 'disabled' : ''}`}
            onClick={goToPrevious}
            disabled={isTransitioning}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className={`carousel-arrow carousel-arrow-right ${isTransitioning ? 'disabled' : ''}`}
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="carousel-counter">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Progress Bar */}
      {autoPlay && !isHovered && (
        <div className="carousel-progress">
          <div 
            className="carousel-progress-bar"
            style={{
              animationDuration: `${autoPlayInterval}ms`,
              animationPlayState: isTransitioning ? 'paused' : 'running'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CarouselHero;
