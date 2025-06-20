// components/BuyBidButton.tsx
import React from 'react';
import Link from 'next/link'; // For navigation
import { CartProduct } from '@/types/cart';

interface BuyBidButtonProps {
  tag: string; // "Buy" or "Bid"
  item_data: CartProduct; // Product data
  className?: string; // Optional for styling
}

export const BuyBidButton: React.FC<BuyBidButtonProps> = ({ tag, item_data, className }) => {
  // Determine the navigation path based on the tag
  let hrefPath: string;
  if (tag.toLowerCase() === 'buy') {
    // Navigate to cart/checkout page. You might pass item_data via query params or context.
    hrefPath = `/checkout?productId=${item_data.id}`; 
  } else if (tag.toLowerCase() === 'bid') {
    // Navigate to the product detail page for bidding
    hrefPath = `/products/${item_data.id}`; // Assuming item_data has a slug or ID for URL
  } else {
    // Fallback or error if tag is unexpected
    hrefPath = '/';
  }

  // Event handler for the navigation link (optional, for custom behavior before navigation)
  const handleNavigationClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // You could add analytics here, or a confirmation, etc.
    console.log(`Navigating to ${hrefPath} for ${tag} action.`);
    // event.preventDefault(); // If you want to stop default navigation and do something custom
    // then manually router.push(hrefPath)
  };

  return (
    <Link href={hrefPath} passHref>
      <span
        className={`card__button ${className || ''}`}
        onClick={handleNavigationClick}
        aria-label={tag === 'Buy' ? `Buy ${item_data.productName}` : `Place bid on ${item_data.productName}`}
      >
        {tag}
      </span>
    </Link>
  );
};