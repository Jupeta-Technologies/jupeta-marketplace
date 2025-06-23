import React from "react";
import {AiFillHeart} from "react-icons/ai"
import ProductAction from "../Shared/ProductAction";
import { useFavorites } from '@/context/FavoriteContext';
import { useWatchlist } from '@/context/WatchlistContext';
//import { Cartcontext } from "./context/context";
import Link from "next/link";
import { Product } from "@/types/api";

// Define the props type for ItemCardglobal
type ItemCardGlobalProps = {
    prodData: Product; // This explicitly says it expects a prop named 'prodData' of type Product
    // If you're also passing 'key', you don't define it here as it's an intrinsic React prop,
    // but it's important to pass it when rendering lists.
};

const ItemCardglobal = ({prodData}:ItemCardGlobalProps) => {
    const {price,productName,imageFileUrl,sellingType,condition,id,summary,onAdd} = prodData;
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { addToWatchlist, removeFromWatchlist, isOnWatchlist } = useWatchlist();
    const isCurrentlyFavorite = isFavorite(prodData.id);
    const isCurrentlyOnWatchlist = isOnWatchlist(prodData.id);
    const date = new Date();
    const watchlist = <AiOutlineEye className='shoppingcartIcon' />;
    //const Globalstate = useContext(Cartcontext);
    //const dispatch = Globalstate.dispatch;
    //console.log(Globalstate);

    const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite(prodData.id);
      console.log("Favorite Removed :",isCurrentlyFavorite)
    } else {
      addFavorite(prodData);
      console.log("Favorite :",isCurrentlyFavorite)
    }
  };

  const handleToggleWatchlist = () => {
    if (isCurrentlyOnWatchlist) {
      removeFromWatchlist(prodData.id);
    } else {
      addToWatchlist(prodData);
    }
  };


  
    const {price,productName,imageFileUrl,sellingType,condition,id} = prodData;

    return ( 
        <div className='card' key={id}>
            <Link href={`/products/${id}`} className='item_link'>
                <div className='itemConditionTag'>{condition}</div>
                {/* <p className='auctionTime'>{date.toLocaleString()}</p> */}
                
                <AiFillHeart  className='favoriteIcon'/>
                <div className="card__imagebox">
                <img src={imageFileUrl} className="card__img" alt={productName}/>
                </div>
                
                <p className='card__title'>{productName}</p>
            </Link>
                <span className='card__price'>¢{price}</span>
                <AiFillHeart  className={isCurrentlyFavorite ? 'currentFav':'favoriteIcon'} onClick={handleToggleFavorite}/>
                <ProductAction buyBidTag={sellingType === 'BuyNow'?'Buy': 'Bid'} item_data={prodData} />
            

            <span className='card__price'>¢{price}</span>
            <ProductAction buyBidTag={sellingType === 'BuyNow'?'Buy': 'Bid'} item_data={prodData} />
        </div>
    );
}

export default ItemCardglobal;
