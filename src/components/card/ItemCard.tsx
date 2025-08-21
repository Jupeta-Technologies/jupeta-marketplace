import React from "react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import ProductAction from "../Shared/ProductAction";
import { useFavorites } from '@/context/FavoriteContext';
import Link from "next/link";
import { Product } from "@/types/api";

// Define display variants for the card
type CardVariant = 'default' | 'compact' | 'minimal' | 'custom';

// Define the props type for ItemCard
type ItemCardProps = {
    prodData: Product;
    variant?: CardVariant;
    width?: number;
    height?: number;
    showCondition?: boolean;
    showFavorite?: boolean;
    showPrice?: boolean;
    showActions?: boolean;
    showDescription?: boolean;
    className?: string;
    onClick?: (product: Product) => void;
    auctionEndDate?: string; // Optional auction end date for auction items
    endingSoonThreshold?: number; // Hours threshold for "ending soon" (default: 24)
    // Custom render function for complete customization
    customRender?: (product: Product, defaultElements: {
        image: React.ReactNode;
        title: React.ReactNode;
        price: React.ReactNode;
        condition: React.ReactNode;
        favorite: React.ReactNode;
        actions: React.ReactNode;
        endingSoon?: React.ReactNode;
    }) => React.ReactNode;
};

const ItemCard = ({
    prodData,
    variant = 'default',
    width,
    height,
    showCondition = true,
    showFavorite = true,
    showPrice = true,
    showActions = true,
    showDescription = false,
    className = '',
    onClick,
    customRender,
    auctionEndDate,
    endingSoonThreshold = 24
}: ItemCardProps) => {
    // Validate prodData exists and is an object
    if (!prodData || typeof prodData !== 'object') {
        console.error('ItemCard: prodData is required and must be an object', prodData);
        return (
            <div className="card error-card">
                <p>Error: Invalid product data</p>
            </div>
        );
    }

    const {price, productName, imageFileUrl, productImages, sellingType, condition, id} = prodData;
    const description = prodData.description || '';
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    
    // Debug logging to see what data we're actually receiving
    console.log('ItemCard prodData:', {
        id,
        productName,
        price,
        imageFileUrl,
        productImages,
        sellingType,
        condition,
        hasProductImages: productImages?.length > 0,
        fullProdData: prodData
    });
    
    // Get the primary image or first image from productImages array, fallback to imageFileUrl
    const getImageUrl = () => {
        if (productImages && productImages.length > 0) {
            // Try to find primary image first
            const primaryImage = productImages.find(img => img.isPrimary);
            if (primaryImage) {
                return primaryImage.imageUrl;
            }
            // If no primary image, use the first one
            return productImages[0].imageUrl;
        }
        // Fallback to old imageFileUrl for backward compatibility
        return imageFileUrl;
    };
    
    // Get alt text from primary image or use productName as fallback
    const getAltText = () => {
        if (productImages && productImages.length > 0) {
            const primaryImage = productImages.find(img => img.isPrimary);
            if (primaryImage && primaryImage.altText) {
                return primaryImage.altText;
            }
            if (productImages[0].altText) {
                return productImages[0].altText;
            }
        }
        return productName;
    };
    
    // Check if auction is ending soon
    const isAuctionEndingSoon = () => {
        if (sellingType !== 'Auction' || !auctionEndDate) return false;
        
        const now = new Date();
        const endDate = new Date(auctionEndDate);
        const hoursRemaining = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return hoursRemaining > 0 && hoursRemaining <= endingSoonThreshold;
    };
    
    // Get time remaining for auction
    const getTimeRemaining = () => {
        if (sellingType !== 'Auction' || !auctionEndDate) return null;
        
        const now = new Date();
        const endDate = new Date(auctionEndDate);
        const timeRemaining = endDate.getTime() - now.getTime();
        
        if (timeRemaining <= 0) return 'Ended';
        
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation when clicking heart
        e.stopPropagation(); // Prevent event bubbling
        
        if (isFavorite(id)) {
            removeFavorite(prodData.id);
        } else {
            addFavorite(prodData);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick(prodData);
        }
    };

    // Get card className based on variant and custom dimensions
    const getCardClassName = () => {
        let baseClass = '';
        
        switch (variant) {
            case 'compact':
                baseClass = 'card-compact';
                break;
            case 'minimal':
                baseClass = 'card-minimal';
                break;
            case 'custom':
                baseClass = 'card-custom';
                break;
            default:
                baseClass = 'card';
        }
        
        return `${baseClass} ${className}`.trim();
    };

    // Get inline styles for custom dimensions
    const getCardStyles = () => {
        const styles: React.CSSProperties = {};
        if (width) styles.width = `${width}px`;
        if (height) styles.height = `${height}px`;
        return styles;
    };

    // Create reusable elements for custom rendering
    const defaultElements = {
        image: (
            <div className="card__imagebox">
                <img src={getImageUrl()} className="card__img" alt={getAltText()}/>
            </div>
        ),
        title: <p className='card__title'>{productName}</p>,
        price: showPrice ? <span className='card__price'>¢{price}</span> : null,
        condition: showCondition ? <div className='itemConditionTag'>{condition}</div> : null,
        favorite: showFavorite ? (
            isFavorite(id) ? (
                <AiFillHeart 
                    className='favoriteIcon' 
                    onClick={handleFavoriteClick}
                    style={{ color: '#ff4757' }}
                />
            ) : (
                <AiOutlineHeart 
                    className='favoriteIcon' 
                    onClick={handleFavoriteClick}
                />
            )
        ) : null,
        actions: showActions ? (
            <ProductAction buyBidTag={sellingType === 'BuyNow'?'Buy': 'Bid'} item_data={prodData} />
        ) : null,
        endingSoon: (sellingType === 'Auction' && isAuctionEndingSoon()) ? (
            <div className='auctionEndingSoon'>
                <span className='endingSoonText'>Ending Soon</span>
                {getTimeRemaining() && (
                    <span className='timeRemaining'>{getTimeRemaining()}</span>
                )}
            </div>
        ) : null
    };

    // If custom render function is provided, use it
    if (customRender) {
        return (
            <div 
                className={getCardClassName()} 
                style={getCardStyles()}
                onClick={handleCardClick}
            >
                {customRender(prodData, defaultElements)}
            </div>
        );
    }

    // Default rendering logic based on variant
    if (variant === 'minimal') {
        return (
            <div 
                className={getCardClassName()} 
                style={getCardStyles()}
                onClick={handleCardClick}
            >
                {defaultElements.endingSoon}
                <Link href={`/products/${id}`} className='item_link'>
                    {defaultElements.image}
                    {defaultElements.title}
                </Link>
                {defaultElements.price}
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div 
                className={getCardClassName()} 
                style={getCardStyles()}
                onClick={handleCardClick}
            >
                {defaultElements.endingSoon}
                <Link href={`/products/${id}`} className='item_link'>
                    {defaultElements.condition}
                    {defaultElements.favorite}
                    {defaultElements.image}
                    {defaultElements.title}
                </Link>
                {defaultElements.price}
            </div>
        );
    }

    // Default variant rendering
    return ( 
        <div 
            className={getCardClassName()} 
            style={getCardStyles()}
            onClick={handleCardClick}
            key={id}
        >
            {defaultElements.endingSoon}
            <Link href={`/products/${id}`} className='item_link'>
                {defaultElements.condition}
                {defaultElements.favorite}
                {defaultElements.image}
                {defaultElements.title}
                {showDescription && description && (
                    <p className='card__description'>{description}</p>
                )}
            </Link>
            {defaultElements.price}
            {defaultElements.actions}
        </div>
    );
}

export default ItemCard;

// Backward compatibility export
export const ItemCardglobal = ItemCard;
