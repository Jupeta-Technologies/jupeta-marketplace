// components/AddToCartIcon.tsx
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/api'; // Use API Product type
import { AiOutlineShoppingCart } from 'react-icons/ai';

interface AddToCartIconProps {
  item_data: Product; // Product data from API
  className?: string; // Optional for styling the icon
}

export const AddToCartIcon: React.FC<AddToCartIconProps> = ({ item_data, className }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item_data);
  };

  return (
    <button
      className={`shoppingcartIcon ${className || ''}`} // Add base class for general icon button styling
      onClick={handleAddToCart}
      type="button" // Important for semantic correctness
      aria-label={`Add ${item_data.productName} to cart`}
    >
      <AiOutlineShoppingCart  />
    </button>
  );
};