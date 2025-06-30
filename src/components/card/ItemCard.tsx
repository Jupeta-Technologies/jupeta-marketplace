import React from "react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import ProductAction from "../Shared/ProductAction";
import { useFavorites } from '@/context/FavoriteContext';
import Link from "next/link";
import { Product } from "@/types/api";

// Define the props type for ItemCardglobal
type ItemCardGlobalProps = {
    prodData: Product; // This explicitly says it expects a prop named 'prodData' of type Product
    // If you're also passing 'key', you don't define it here as it's an intrinsic React prop,
    // but it's important to pass it when rendering lists.
};

const ItemCardglobal = ({prodData}:ItemCardGlobalProps) => {
    const {price,productName,imageFileUrl,sellingType,condition,id} = prodData;
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation when clicking heart
        e.stopPropagation(); // Prevent event bubbling
        
        if (isFavorite(id)) {
            removeFavorite(prodData.id);
        } else {
            addFavorite(prodData);
        }
    };

    return ( 
        <div className='card' key={id}>
            <Link href={`/products/${id}`} className='item_link'>
                <div className='itemConditionTag'>{condition}</div>
                {isFavorite(id) ? (
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
                )}
                <div className="card__imagebox">
                <img src={imageFileUrl} className="card__img" alt={productName}/>
                </div>
                
                <p className='card__title'>{productName}</p>
            </Link>
                <span className='card__price'>¢{price}</span>
                <ProductAction buyBidTag={sellingType === 'BuyNow'?'Buy': 'Bid'} item_data={prodData} />
        </div>
    );
}

export default ItemCardglobal;
