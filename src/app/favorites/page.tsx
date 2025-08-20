'use client';

import React from 'react';
import { useFavorites } from '@/context/FavoriteContext';
import { useCart } from '@/context/CartContext';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/api';

const FavoritesPage = () => {
  const {favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.Id,
      productName: product.ProductName,
      price: product.Price,
      imageFileUrl: product.ImageFileUrl,
      qty: 1
    });
  };

  const handleRemoveFromFavorites = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(product.Id);
  };

  const handleBuyBidClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.SellingType?.toLowerCase() === 'buynow') {
      // Add product to cart and navigate to cart page
      addToCart({
        id: product.Id,
        productName: product.ProductName,
        price: product.Price,
        imageFileUrl: product.ImageFileUrl,
        qty: 1
      }, 'buy-button');
      router.push('/cart');
    } else {
      // Navigate to the product detail page for bidding
      router.push(`/products/${product.Id}`);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <div className="favorites-header">
            <h1>My Favorites</h1>
          </div>
          <div className="empty-favorites">
            <AiOutlineHeart style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
            <h2>No favorites yet</h2>
            <p>Start adding items to your favorites to see them here!</p>
            <Link href="/products" className="browse-products-btn">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>{favorites.length} item{favorites.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="favorites-grid">
          {favorites.map((product) => (
            <Link href={`/products/${product.Id}`} key={product.Id} className="favorite-card-link">
              <div className="favorite-card">
                <div className="favorite-card-image">
                  <img src={product.ImageFileUrl} alt={product.ProductName} />
                  <button 
                    className="remove-favorite-btn"
                    onClick={(e) => handleRemoveFromFavorites(e, product)}
                    title="Remove from favorites"
                  >
                    <AiFillHeart style={{ color: '#ff4757' }} />
                  </button>
                  <button 
                    className="add-to-cart-icon"
                    onClick={(e) => handleAddToCart(e, product)}
                    title="Add to cart"
                  >
                    <AiOutlineShoppingCart />
                  </button>
                </div>
                
                <div className="favorite-card-content">
                  <h3 className="favorite-card-title">{product.ProductName}</h3>
                  <p className="favorite-card-price">¢{product.Price}</p>
                  
                  <div className="favorite-card-actions">
                    <button 
                      className="buy-btn"
                      onClick={(e) => handleBuyBidClick(e, product)}
                    >
                      {product.SellingType?.toLowerCase() === 'buynow' ? 'Buy' : 'Bid'}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage; 