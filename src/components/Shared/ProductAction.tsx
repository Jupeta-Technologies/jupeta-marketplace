// components/ProductAction.tsx
import React from 'react';
import { Product } from '@/types/api'; // Use API Product type

// Import the newly created separate components
import { AddToCartIcon } from './AddToCartIcon';
import { BuyBidButton } from './BuyBidButton';

// 1. Define Props for the main component.
// This component now acts as a container for the action buttons/icons.
interface ProductActionProps {
    item_data: Product; // The product data from API
    buyBidTag: string; // The tag for the Buy/Bid button ("Buy" or "Bid")
    showAddToCartIcon?: boolean; // Optional prop to control visibility of icon
}

const ProductAction: React.FC<ProductActionProps> = ({ item_data, buyBidTag, showAddToCartIcon = true }) => {
    // No more handleAddtoCart or handleBuyBid directly in this component's scope
    // The logic is now encapsulated within AddToCartIcon and BuyBidButton.

    return (
        <div className="product-actions-container"> {/* A container for your action buttons */}
            {/* Render the AddToCartIcon if needed */}
            {showAddToCartIcon && (
                <AddToCartIcon item_data={item_data} className="some-icon-style" />
            )}

            {/* Render the BuyBidButton */}
            <BuyBidButton tag={buyBidTag} item_data={item_data} />
        </div>
    );
};

export default ProductAction;