import React from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/api";

interface SimpleItemCardProps {
  prodData: Product;
}

const SimpleItemCard: React.FC<SimpleItemCardProps> = ({ prodData }) => {
  const router = useRouter();
  
  // Get the primary image or first image from productImages array, fallback to imageFileUrl
  const getImageUrl = () => {
    if (prodData.productImages && prodData.productImages.length > 0) {
      // Try to find primary image first
      const primaryImage = prodData.productImages.find(img => img.isPrimary);
      if (primaryImage) {
        return primaryImage.imageUrl;
      }
      // If no primary image, use the first one
      return prodData.productImages[0].imageUrl;
    }
    // Fallback to old imageFileUrl for backward compatibility
    return prodData.imageFileUrl;
  };
  
  // Get alt text from primary image or use productName as fallback
  const getAltText = () => {
    if (prodData.productImages && prodData.productImages.length > 0) {
      const primaryImage = prodData.productImages.find(img => img.isPrimary);
      if (primaryImage && primaryImage.altText) {
        return primaryImage.altText;
      }
      if (prodData.productImages[0].altText) {
        return prodData.productImages[0].altText;
      }
    }
    return prodData.productName;
  };
  
  const handleClick = () => {
    router.push(`/products/${prodData.id}`);
  };
  return (
    <div className="card-2 cursor-pointer" onClick={handleClick}>
      <div className="card__imagebox">
        <img
          src={getImageUrl()}
          alt={getAltText()}
          className="card__img"
        />
      </div>
      <div className="card__title">{prodData.productName}</div>
      <div className="card__price">${prodData.price}</div>
    </div>
  );
};

export default SimpleItemCard;
