"use client";

import React from "react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import ItemCard from "@/components/card/ItemCard";

const RecentlyViewedPage: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed, getViewCount } = useRecentlyViewed();

  return (
    <div className="container">
      <div className="recently-viewed-page-header">
        <h2>All Recently Viewed Items</h2>
        {recentlyViewed.length > 0 && (
          <button onClick={clearRecentlyViewed} className="recently-viewed-clear" aria-label="Clear all recently viewed items">
            Clear All
          </button>
        )}
      </div>
      <div className="recently-viewed-page-list">
        {recentlyViewed.length === 0 ? (
          <p>No recently viewed items.</p>
        ) : (
          <div className="recently-viewed-grid">
            {recentlyViewed.map((product) => (
              <ItemCard key={product.id} prodData={product} variant="minimal" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewedPage;
