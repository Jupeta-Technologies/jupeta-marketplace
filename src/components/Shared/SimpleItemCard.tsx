import React from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/api";

interface SimpleItemCardProps {
  prodData: Product;
}

const SimpleItemCard: React.FC<SimpleItemCardProps> = ({ prodData }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/products/${prodData.id}`);
  };
  return (
    <div className="card-2 cursor-pointer" onClick={handleClick}>
      <div className="card__imagebox">
        <img
          src={prodData.imageFileUrl}
          alt={prodData.productName}
          className="card__img"
        />
      </div>
      <div className="card__title">{prodData.productName}</div>
      <div className="card__price">${prodData.price}</div>
    </div>
  );
};

export default SimpleItemCard;
