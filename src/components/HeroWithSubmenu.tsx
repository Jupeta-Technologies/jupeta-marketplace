// components/HeroWithSubmenu.tsx
'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';
import { CategoryData, CategoryHeroConfig } from '@/types/category';
import { useCategoryDataImmediate } from '@/hooks/useCategoryData'; // Dynamic category data
import { useHeroContent } from '@/context/HeroContentContext'; // Update import for HeroContentToDisplay & HeroCustomComponent

// Import ALL your possible hero images for static hero displays
import heroImage from '@/assets/images/led-speaker.jpg';
import home from '@/assets/images/home.jpg';
import home_2 from '@/assets/images/home_2.png';
import elec from '@/assets/images/electronics.png';
import automob from '@/assets/images/auto_1.png';
import fashion from '@/assets/images/fashion_1.png';
import auto_hero from '@/assets/images/auto_hero.jpg';
import fashion_hero from '@/assets/images/fashion_hero.png';
import electronic_hero from '@/assets/images/electroic_hero.jpg';

const allImportedImages: { [key: string]: StaticImageData } = {
  '/assets/images/led-speaker.jpg': heroImage,
  '/assets/images/home.jpg': home,
  '/assets/images/home_2.png': home_2,
  '/assets/images/electronics.png': elec,
  '/assets/images/auto_1.png': automob,
  '/assets/images/fashion_1.png': fashion,
  '/assets/images/auto_hero.jpg': auto_hero,
  '/assets/images/fashion_hero.png': fashion_hero,
  '/assets/images/electroic_hero.jpg': electronic_hero,
};

// Dynamically import your "hero updater" components (these are the ones that call setHeroContent)
const HeroUpdaterComponents: { [key: string]: React.ComponentType<any> } = {
  HomepageInteractiveHero: React.lazy(() => import('@/components/hero-updaters/HomepageInteractiveHero')),
  AutoPromotionHero: React.lazy(() => import('@/components/hero-updaters/AutoPromotionHero')),
  PersonalizedHomepageHero: React.lazy(() => import('@/components/hero-updaters/PersonalizedHomepageHero')),
  CarouselHero: React.lazy(() => import('@/components/hero-updaters/CarouselHero')),
  // Add other dynamic hero components here
};

// New: Map for custom components that render *within* the hero
const CustomHeroContentComponents: { [key: string]: React.ComponentType<any> } = {
  SellButton: React.lazy(() => import('@/components/hero-custom-content/SellButton')),
  CountdownTimer: React.lazy(() => import('@/components/hero-custom-content/CountdownTimer')),
  // Add more custom content components here
};

interface SubmenuItem {
  name: string;
  link: string;
  image?: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
}

interface HeroWithSubmenuProps {
  currentCategory?: CategoryData | null;
  heroConfig?: CategoryHeroConfig | null;
  submenu?: SubmenuItem[];
}

const HeroWithSubmenu: React.FC<HeroWithSubmenuProps> = ({
  currentCategory,
  heroConfig,
  submenu,
}) => {
  const pathname = usePathname();
  const { heroContent, setHeroContent } = useHeroContent();
  const isSticky = false;

  // Get dynamic category data for submenu generation
  const categoryData = useCategoryDataImmediate();
  console.log(categoryData);

  const normalizedPath = pathname.split('?')[0];
  const isHomepage = normalizedPath === '/';

  // Memoize the dynamic hero *updater* component
  const DynamicHeroUpdaterComponent = useMemo(() => {
    if (heroConfig && 'componentName' in heroConfig) {
      return HeroUpdaterComponents[heroConfig.componentName];
    }
    return null;
  }, [heroConfig]);

  // Memoize the *custom content* component to be rendered within the hero display
  const CustomContentComponent = useMemo(() => {
    if (heroContent.customComponent) {
      return CustomHeroContentComponents[heroContent.customComponent.componentName];
    }
    return null;
  }, [heroContent.customComponent]);


  const initialHeroSetRef = useRef(false);

  useEffect(() => {
    if (heroConfig && !initialHeroSetRef.current) {
      if (!('componentName' in heroConfig)) {
        // It's a static hero: Set the context directly from the prop
        const staticHeroImage = allImportedImages[heroConfig.image.src] || heroImage;
        setHeroContent({
          title: heroConfig.title,
          subtitle: heroConfig.subtitle,
          image: staticHeroImage,
          // If you want static heroes to specify a custom component directly,
          // you'd add `customComponent?: HeroCustomComponent;` to `StaticHeroData`
          // and pass `heroConfig.customComponent` here.
        });
      }
      initialHeroSetRef.current = true;
    } else if (!heroConfig && !initialHeroSetRef.current) {
      // Default content if no heroConfig is provided
      setHeroContent({
        title: 'Welcome!',
        subtitle: 'Explore our site.',
        image: heroImage,
      });
      initialHeroSetRef.current = true;
    }
  }, [heroConfig, setHeroContent]);


  const finalSubmenu: SubmenuItem[] = submenu ?? (isHomepage
    ? categoryData.filter((cat: CategoryData) => cat.slug !== 'home' && cat.name.toLowerCase() !== 'home')
                  .map((cat: CategoryData) => ({
                    name: cat.name,
                    link: `/${cat.slug || cat.id}`,
                    image: cat.image,
                  }))
    : currentCategory?.children?.map((child) => ({
        name: child.name,
        link: `${normalizedPath}/${child.slug || child.id}`,
        image: child.image,
      })) || []);

  const displayHeroImage = heroContent.image || heroImage;

  return (
    <>
      {/* This renders the HeroUpdater component (e.g., HomepageInteractiveHero)
          which then calls setHeroContent to update the context */}
      {DynamicHeroUpdaterComponent && (
        <React.Suspense fallback={null}>
          <DynamicHeroUpdaterComponent {...(heroConfig as any).props} />
        </React.Suspense>
      )}

      {/* The main hero section always renders based on `heroContent` from the context */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${displayHeroImage.src})`,
          backgroundSize: 'cover',
          height: '348px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="hero-content text-white text-center">
          {heroContent.title && (
            <h1 className="text-3xl font-bold">{heroContent.title}</h1>
          )}
          {heroContent.subtitle && (
            <p className="text-lg">{heroContent.subtitle}</p>
          )}

          {/* New: Render the custom component if it exists in heroContent */}
          {CustomContentComponent && (
            <div className="mt-4"> {/* Add a wrapper div for styling or spacing */}
              <React.Suspense fallback={null}> {/* Optional: fallback for custom component */}
                <CustomContentComponent {...heroContent.customComponent?.props} />
              </React.Suspense>
            </div>
          )}
        </div>
      </section>

      {finalSubmenu.length > 0 && (
        <nav className={`GCMenu_Container ${isSticky ? 'sticky' : ''}`}>
          <ul>
            {finalSubmenu.map((item) => {
              const displaySubmenuImage = item.image?.src ? allImportedImages[item.image.src] : null;
              return (
                <li key={item.link}>
                  <Link href={item.link}>
                    <div>
                      {displaySubmenuImage && (
                        <Image
                          src={displaySubmenuImage.src}
                          alt={item.name}
                          width={60}
                          height={60}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
};

export default HeroWithSubmenu;