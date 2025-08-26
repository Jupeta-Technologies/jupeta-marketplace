"use client";

import React from 'react';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import Image from 'next/image';
import Link from 'next/link';

const RecentlyViewed: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed, getViewCount } = useRecentlyViewed();

  // Show only the first 4 items
  const displayItems = recentlyViewed.slice(0, 4);

  if (displayItems.length === 0) {
    return null; // Don't render anything if no items
  }

  return (
    <div className="recently-viewed-container">
      <div className="recently-viewed-header">
        <h3 className="recently-viewed-title">
          Recently Viewed ({recentlyViewed.length})
        </h3>
        <button 
          onClick={clearRecentlyViewed}
          className="recently-viewed-clear"
          aria-label="Clear recently viewed items"
        >
          Clear All
        </button>
      </div>
      
      <div className="recently-viewed-grid">
        {displayItems.map((product) => {
          const viewCount = getViewCount(product.id);
          return (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className="recently-viewed-item"
            >
              <div className="recently-viewed-image-container">
                <Image
                  src={product.imageFileUrl || '/placeholder-image.jpg'}
                  alt={product.productName}
                  width={200}
                  height={248}
                  className="recently-viewed-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="recently-viewed-overlay">
                  <span className="recently-viewed-view-text">View</span>
                </div>
                {viewCount > 1 && (
                  <div className="recently-viewed-count-badge">
                    <span className="recently-viewed-count-text">
                      {viewCount}x
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;
