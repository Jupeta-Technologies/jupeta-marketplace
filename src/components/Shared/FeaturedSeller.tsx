import React from "react";
import { Product } from "@/types/api";

type SellerType = "brand" | "store";

interface FeaturedSellerProps {
  products: Product[];
  name: string;
  image: string;
  type?: SellerType;
}

const FeaturedSeller: React.FC<FeaturedSellerProps> = ({ products, name, image, type = "store" }) => {
  const heading = type === "brand"
    ? `${name} Brand's Featured Products`
    : `${name} Store's Featured Products`;

  // Helper function to get image URL from product
  const getProductImageUrl = (product: Product) => {
    if (product.productImages && product.productImages.length > 0) {
      // Try to find primary image first
      const primaryImage = product.productImages.find(img => img.isPrimary);
      if (primaryImage) {
        return primaryImage.imageUrl;
      }
      // If no primary image, use the first one
      return product.productImages[0].imageUrl;
    }
    // Fallback to old imageFileUrl for backward compatibility
    return product.imageFileUrl;
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <img
          src={image}
          alt={name}
          style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "contain", border: "2px solid #eee" }}
        />
        <h2 style={{ fontWeight: 600, fontSize: "1.3rem", margin: 0 }}>{heading}</h2>
      </div>
      <div className="featuredItemgrid">
        {products.slice(0, 8).map((x, index) => (
          <a
            className="ftgridItems"
            key={index}
            href={`/products/${x.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img 
              src={getProductImageUrl(x)} 
              alt={x.productName} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0
              }} 
            />
            <span 
              className="price-tag"
              style={{ 
                position: "absolute", 
                bottom: "10px", 
                left: "10px", 
                padding: "4px 12px", 
                borderRadius: "12px", 
                backgroundColor: "#FFF",
                fontSize: "0.875rem",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 2
              }}
            >
              {x.price}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSeller;
          