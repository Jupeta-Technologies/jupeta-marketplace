// components/hero-custom-content/SellButton.tsx
'use client';
import React from 'react';
import Link from 'next/link';

interface SellButtonProps {
  label?: string;
  targetLink?: string;
  analyticsEvent?: string;
}

const SellButton: React.FC<SellButtonProps> = ({
  label = 'Sell Your Items',
  targetLink = '/sell',
  analyticsEvent = 'sell_button_click',
}) => {
  const handleClick = () => {
    console.log(`Analytics: ${analyticsEvent}`);
    // Example: fire an analytics event
    // window.dataLayer?.push({ event: analyticsEvent });
  };

  return (
    <Link
      href={targetLink}
      onClick={handleClick}
      className="mt-4 px-8 py-4 rounded-full bg-blue-600 text-white text-xl font-bold hover:bg-blue-700 transition duration-300 shadow-lg"
    >
      {label}
    </Link>
  );
};

export default SellButton;