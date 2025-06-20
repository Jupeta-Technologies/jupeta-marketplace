// components/AddToCartIcon.tsx
import React from 'react';
import { useCart } from '@/context/CartContext';
import { CartProduct } from '@/types/cart';
import { AiOutlineShoppingCart } from 'react-icons/ai';

interface AddToCartIconProps {
  item_data: CartProduct;
  className?: string; // Optional for styling the icon
}

export const AddToCartIcon: React.FC<AddToCartIconProps> = ({ item_data, className }) => {
  const { addToCart } = useCart();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Essential if this icon is inside a clickable parent (e.g., a card link)
    event.preventDefault(); // Prevent default button behavior

    addToCart(item_data);
    alert(`${item_data.productName} added to cart!`);
    console.log(item_data.productName, 'added to cart');
  };

  return (
    <button
      className={`shoppingcartIcon ${className || ''}`} // Add base class for general icon button styling
      onClick={handleClick}
      type="button" // Important for semantic correctness
      aria-label={`Add ${item_data.productName} to cart`}
    >
      <AiOutlineShoppingCart  />
    </button>
  );
};