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
            <img src={x.imageFileUrl} alt={x.productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "relative", bottom: "30px", left: "10px", padding: "2px 14px", borderRadius: "14px", backgroundColor: "#FFF" }}>
              {x.price}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSeller;
          