'use client';

import React, { useState, useEffect } from 'react';
import { GetAllProdAPI } from '@/lib/api/GetAllProdAPI';
import { CategoryData } from '@/types/category';
import { categoryData } from '@/types/category';

import CategoryContent from '@/components/CategoryContent';
import HeroWithSubmenu from '@/components/HeroWithSubmenu';
import { Product } from '@/types/api';
import ItemCardglobal from '@/components/card/ItemCard';

import heroImage from '@/assets/images/led-speaker.jpg';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory] = useState<CategoryData | null>(null);
  const [subCategories] = useState<CategoryData[]>([]);

  const recentViewed: Product[] = [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await GetAllProdAPI();
    
        if (res.code !== "0") {
          throw new Error('Failed to fetch products');
        }
    
        setProducts(res.responseData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const hero = {
    title: 'Welcome Home!',
    subtitle: 'Your adventure begins here.',
    image: heroImage,
  };

  const submenu = categoryData.map((cat) => ({
    name: cat.name,
    link: `/category/${cat.slug || cat.id}`,
    image: cat.image,
  }));

  return (
    <>
      <HeroWithSubmenu
        hero={hero}
        submenu={submenu}
      />
      <CategoryContent
        currentCategory={currentCategory as CategoryData}
        subCategories={subCategories}
      />
      <div className="container">
        {recentViewed.length > 0 && (
          <div className="recentViewed">
            <h6>Recently viewed</h6>
            <div
              style={{
                width: '248px',
                height: '148px',
                backgroundColor: '#F5F5F7',
                borderRadius: '20px'
              }}
            />
          </div>
        )}
        <div className='grid grid-cols-4' style={{rowGap:'32px', justifyItems:'center'}}>
        {
          products.map((item,index) =>{
            return <ItemCardglobal prodData={item} key={index} />
          })
        }
        </div>
        </div>
    </>
  );
};

export default HomePage;

