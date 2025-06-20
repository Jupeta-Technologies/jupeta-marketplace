import React, { useContext, useEffect, useState } from "react";
import {AiFillHeart,AiOutlineShoppingCart,AiOutlineEye} from "react-icons/ai"
import beats from './images/beats.jpg';
//import ItemIMG from './components/cardcomponents/itemIMG';
import ProductAction from "../Shared/ProductAction";
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
    const date = new Date();
    const watchlist = <AiOutlineEye className='shoppingcartIcon' />;
    //const Globalstate = useContext(Cartcontext);
    //const dispatch = Globalstate.dispatch;
    //console.log(Globalstate);


  

    return ( 
        <div className='card' key={id}>
            <Link href={`/product-detail/${id}`} className='item_link'>
                <div className='itemConditionTag'>{condition}</div>
                {/* <p className='auctionTime'>{date.toLocaleString()}</p> */}
                <AiFillHeart  className='favoriteIcon'/>
                <div className="card__imagebox">
                <img src={imageFileUrl} className="card__img"/>
                </div>
                
                    <p className='card__title' onClick={()=>{localStorage.setItem("setQuickbuy","")}}>{productName}</p>
            </Link>
                <span className='card__price'>¢{price}</span>
                <ProductAction buyBidTag={sellingType === 'BuyNow'?'Buy': 'Bid'} item_data={prodData} />
            

        </div>
    );
}

export default ItemCardglobal;
