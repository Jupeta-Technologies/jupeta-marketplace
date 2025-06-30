// components/BuyBidButton.tsx
import React from 'react';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import { useCart } from '@/context/CartContext'; // Import cart context
import { Product } from '@/types/api'; // Use API Product type

interface BuyBidButtonProps {
  tag: string; // "Buy" or "Bid"
  item_data: Product; // Product data from API
  className?: string; // Optional for styling
}

export const BuyBidButton: React.FC<BuyBidButtonProps> = ({ tag, item_data, className }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  // Event handler for the button click
  const handleBuyClick = () => {
    addToCart(item_data, 'buy-button');
    router.push('/cart');
  };

  const handleBidClick = () => {
    router.push(`/products/${item_data.id}`);
  };

  return (
    <span
      className={`card__button ${className || ''}`}
      onClick={tag === 'Buy' ? handleBuyClick : handleBidClick}
      aria-label={tag === 'Buy' ? `Buy ${item_data.productName}` : `Place bid on ${item_data.productName}`}
      style={{ cursor: 'pointer' }}
    >
      {tag}
    </span>
  );
};