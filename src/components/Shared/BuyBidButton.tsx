// components/BuyBidButton.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import { Product } from '@/types/api'; // Use API Product type

interface BuyBidButtonProps {
  tag: string; // "Buy" or "Bid"
  item_data: Product; // Product data from API
  className?: string; // Optional for styling
}

export const BuyBidButton: React.FC<BuyBidButtonProps> = ({ tag, item_data, className }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Event handler for the button click - both Buy and Bid go to product detail page
  const handleClick = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Add a brief delay for visual feedback
    setTimeout(() => {
      router.push(`/products/${item_data.id}`);
      setIsNavigating(false);
    }, 200);
  };

  const getButtonClass = () => {
    let classes = `card__button ${className || ''}`;
    if (isNavigating) {
      classes += ' navigating';
    }
    return classes;
  };

  const getButtonText = () => {
    if (isNavigating) {
      return 'Loading...';
    }
    return tag;
  };

  return (
    <span
      className={getButtonClass()}
      onClick={handleClick}
      aria-label={`View ${item_data.productName} details`}
      style={{ 
        cursor: isNavigating ? 'not-allowed' : 'pointer',
        opacity: isNavigating ? 0.8 : 1
      }}
    >
      {getButtonText()}
    </span>
  );
};