// components/AddToCartIcon.tsx
"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { Product } from '@/types/api'; // Use API Product type
import { AiOutlineShoppingCart, AiOutlineCheck } from 'react-icons/ai';

interface AddToCartIconProps {
  item_data: Product; // Product data from API
  className?: string; // Optional for styling the icon
}

export const AddToCartIcon: React.FC<AddToCartIconProps> = ({ item_data, className }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent multiple clicks
    if (isAdding || isAdded) return;
    
    setIsAdding(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      addToCart(item_data);
      const maxLen = 30;
      const name = item_data.productName.length > maxLen
        ? item_data.productName.slice(0, maxLen - 1) + '…'
        : item_data.productName;
      
      showNotification({
        title: 'Added to Cart',
        message: `${name} - ${item_data.price}`,
        type: 'success',
        icon: <img src={item_data.imageFileUrl} alt={item_data.productName} style={{ width: 24, height: 24, borderRadius: '50%' }} />,
        duration: 4000,
      });
      
      setIsAdding(false);
      setIsAdded(true);
      
      // Reset the success state after animation
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 200);
  };

  const getButtonClass = () => {
    let classes = `shoppingcartIcon ${className || ''}`;
    if (isAdding) classes += ' adding';
    if (isAdded) classes += ' added';
    return classes;
  };

  const getIcon = () => {
    if (isAdded) {
      return <AiOutlineCheck />;
    }
    return <AiOutlineShoppingCart />;
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleAddToCart}
      type="button"
      disabled={isAdding}
      aria-label={
        isAdded 
          ? `${item_data.productName} added to cart` 
          : `Add ${item_data.productName} to cart`
      }
    >
      {getIcon()}
    </button>
  );
};