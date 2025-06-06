'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { CategoryData } from '@/types/category';
import { StaticImageData } from 'next/image';
import { categoryData } from '@/types/category';

// Import images
import heroImage from '@/assets/images/led-speaker.jpg';
import home from '@/assets/images/home.jpg';
import home_2 from '@/assets/images/home_2.png';
import elec from '@/assets/images/electronics.png';
import automob from '@/assets/images/auto_1.png';
import fashion from '@/assets/images/fashion_1.png';
import auto_hero from '@/assets/images/auto_hero.jpg';
import fashion_hero from '@/assets/images/fashion_hero.png';
import electronic_hero from '@/assets/images/electroic_hero.jpg';

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

interface HeroContent {
  title?: string;
  subtitle?: string;
  image: StaticImageData;
}

interface HeroWithSubmenuProps {
  currentCategory?: CategoryData | null;
  subCategories?: CategoryData[];
  hero?: HeroContent;
  submenu?: SubmenuItem[];
}

const HeroWithSubmenu: React.FC<HeroWithSubmenuProps> = ({
  currentCategory,
  subCategories = [],
  hero,
  submenu,
}) => {
  const pathname = usePathname();
  const isSticky = false;

  const defaultHero: HeroContent = {
    title: 'Welcome Home!',
    subtitle: 'Your adventure begins here.',
    image: heroImage,
  };

  const defaultSubmenu: SubmenuItem[] = categoryData.map((cat) => ({
    name: cat.name,
    link: `/${cat.slug || cat.id}`,
    image: cat.image,
  }));

  const normalizedPath = pathname.split('?')[0];
  const isHomepage = normalizedPath === '/';

  const finalHero: HeroContent = hero ?? (isHomepage
    ? defaultHero
    : currentCategory?.hero || { image: heroImage });

  const finalSubmenu: SubmenuItem[] = submenu ?? (isHomepage
    ? defaultSubmenu
    : currentCategory?.children?.map((child) => ({
        name: child.name,
        link: `${normalizedPath}/${child.slug || child.id}`,
      })) || []);

  const categoryImages: { [key: string]: StaticImageData } = {
    '/home_2.png': home_2,
    '/home.jpg': home,
    '/electronics.png': elec,
    '/auto_1.png': automob,
    '/fashion_1.png': fashion,
    '/auto_hero.jpg': auto_hero,
    '/fashion_hero.jpg': fashion_hero,
    '/electroic_hero.jpg': electronic_hero,
    '/led-speaker.jpg': heroImage,
  };

    /* console.log(currentCategory,"-",currentCategory?.children)
    console.log(pathname);
    console.log(finalSubmenu); */
  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `url(${
            finalHero?.image?.src
              ? categoryImages[finalHero.image.src]?.src || heroImage.src
              : heroImage.src
          })`,
          backgroundSize: 'cover',
          height: '348px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="hero-content text-white text-center">
          {finalHero?.title && (
            <h1 className="text-3xl font-bold">{finalHero.title}</h1>
          )}
          {finalHero?.subtitle && (
            <p className="text-lg">{finalHero.subtitle}</p>
          )}
        </div>
      </section>

      {finalSubmenu.length > 0 && (
        <nav className={`GCMenu_Container ${isSticky ? 'sticky' : ''}`}>
          <ul className="flex justify-around bg-white shadow py-4">
            {finalSubmenu.map((item) => {
              const displayImage = item.image?.src ? categoryImages[item.image.src] : null;
              return (
                <li key={item.link} className="text-center">
                  <Link href={item.link}>
                    <div>
                      {displayImage && (
                        <Image
                          src={displayImage.src}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="mx-auto rounded-full"
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
