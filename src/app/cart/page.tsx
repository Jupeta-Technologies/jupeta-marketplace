'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Tag, Shield, Truck, AlertCircle, Heart, RotateCcw, Clock, Minus, Plus } from 'lucide-react'
import CartItemCard from '@/components/cart/CartItemCard'
import PaymentMethods from '@/components/cart/PaymentMethods'

export default function CartPage() {
  const { products, total, removeBuyButtonProducts, clearCartAll } = useCart()
  const router = useRouter()
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedForLater, setSavedForLater] = useState<any[]>([]);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [recentlyRemoved, setRecentlyRemoved] = useState<any>(null);
  const [showUndoTimer, setShowUndoTimer] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [cartInsights, setCartInsights] = useState({
    potentialSavings: 0,
    freeShippingProgress: 0,
    popularCombo: null as string | null
  });
  
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Undo functionality for recently removed items
  useEffect(() => {
    if (showUndoTimer && recentlyRemoved) {
      const timer = setTimeout(() => {
        setShowUndoTimer(false);
        setRecentlyRemoved(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showUndoTimer, recentlyRemoved]);

  // Save for later functionality  
  const handleSaveForLater = (item: any) => {
    setSavedForLater(prev => [...prev, item]);
    // Remove item from cart by filtering out the specific item
    // Note: This would need to be implemented with proper cart context dispatch
  };

  const handleMoveToCart = (item: any) => {
    setSavedForLater(prev => prev.filter(i => i.id !== item.id));
    // Add back to cart logic would go here
  };

  const handleRemoveWithUndo = (item: any) => {
    setRecentlyRemoved(item);
    setShowUndoTimer(true);
    // Note: For now using existing remove function, would need specific item removal
    removeBuyButtonProducts();
  };

  const handleUndoRemove = () => {
    if (recentlyRemoved) {
      // Add back to cart logic would go here
      setShowUndoTimer(false);
      setRecentlyRemoved(null);
    }
  };

  // Calculate cart insights
  useEffect(() => {
    const currentSubtotal = total;
    const freeShippingProgress = Math.min((currentSubtotal / 50) * 100, 100);
    const potentialSavings = products.length > 2 ? currentSubtotal * 0.05 : 0; // 5% bulk discount potential
    
    setCartInsights({
      potentialSavings,
      freeShippingProgress,
      popularCombo: products.length >= 2 ? 'Electronics Bundle' : null
    });
  }, [total, products]);

  // Mock recommendations based on cart content
  const getRecommendations = () => {
    return [
      { id: 'r1', name: 'Wireless Charger', price: 29.99, discount: 20 },
      { id: 'r2', name: 'Phone Case', price: 19.99, discount: 15 },
      { id: 'r3', name: 'Screen Protector', price: 9.99, discount: 10 }
    ];
  };

  // Set up automatic cleanup after a delay
  useEffect(() => {
    // Set a flag in localStorage to indicate we're on cart page IMMEDIATELY
    localStorage.setItem('onCartPage', 'true')
    
    // Clear any existing timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current)
    }

    // Set up cleanup when component unmounts
    return () => {
      localStorage.removeItem('onCartPage')
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current)
      }
    }
  }, [])

  // Handle navigation away from cart page
  const handleNavigation = (href: string) => {
    localStorage.removeItem('onCartPage')
    // Only remove buy-button products if NOT going to checkout
    if (href !== '/checkout') {
      removeBuyButtonProducts()
    }
    router.push(href)
  }

    const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase()
    setPromoError('')
    
    if (code === 'SAVE10') {
      setDiscount(10)
      setPromoError('')
    } else if (code === 'SAVE5') {
      setDiscount(5)
      setPromoError('')
    } else if (code === 'WELCOME') {
      setDiscount(15)
      setPromoError('')
    } else if (code === '') {
      setDiscount(0)
      setPromoError('Please enter a promo code')
    } else {
      setDiscount(0)
      setPromoError('Invalid promo code')
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // Simulate validation/processing
    await new Promise(resolve => setTimeout(resolve, 800))
    handleNavigation('/checkout')
  }

  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCartAll()
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  const subtotal = total
  const discountAmount = subtotal * (discount / 100)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = 0
  const orderTotal = Math.max(0, subtotal - discountAmount + shipping + tax)

  if (products.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <ShoppingBag />
          </div>
          <h1 className="empty-cart-title">Your Cart is Empty</h1>
          <p className="empty-cart-message">Looks like you haven&apos;t added any items to your cart yet.</p>
          <div className="empty-cart-features">
            <div className="feature-item">
              <Shield size={20} />
              <span>Secure checkout</span>
            </div>
            <div className="feature-item">
              <Truck size={20} />
              <span>Free shipping over GHS 50</span>
            </div>
            <div className="feature-item">
              <Tag size={20} />
              <span>Best prices guaranteed</span>
            </div>
          </div>
          <Link href="/" className="empty-cart-button" onClick={() => removeBuyButtonProducts()}>
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cartpage cart-layout">
      <div className="cartcontainer">
        <section>
          <div className="cart-header">
            <div className="cart-title-section">
              <h3><strong>Your cart</strong></h3>
              <span className="item-count">({products.length} {products.length === 1 ? 'item' : 'items'})</span>
            </div>
            <div className="cart-meta">
              {subtotal > 50 && (
                <div className="free-shipping-badge">
                  <Truck size={16} />
                  <span>Free shipping eligible!</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Undo notification */}
          {showUndoTimer && recentlyRemoved && (
            <div className="undo-notification">
              <div className="undo-content">
                <span>"{recentlyRemoved.name}" removed from cart</span>
                <button onClick={handleUndoRemove} className="undo-btn">
                  <RotateCcw size={16} />
                  Undo
                </button>
              </div>
              <div className="undo-timer">
                <Clock size={14} />
                <span>5s</span>
              </div>
            </div>
          )}
          
          {/* Saved for later toggle */}
          {savedForLater.length > 0 && (
            <div className="saved-items-toggle">
              <button 
                onClick={() => setShowSavedItems(!showSavedItems)}
                className="toggle-saved-btn"
              >
                <Heart size={16} />
                Saved for later ({savedForLater.length})
              </button>
            </div>
          )}

          {/* Show saved items when toggled */}
          {showSavedItems && savedForLater.length > 0 && (
            <div className="saved-items-section">
              <h3>Saved for Later</h3>
              {savedForLater.map((item, i) => (
                <div key={i} className="saved-item">
                  <span>{item.name}</span>
                  <button onClick={() => handleMoveToCart(item)} className="move-to-cart-btn">
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          {products.map((product, i) => (
            <CartItemCard item={product} key={i} />
          ))}
          
          <div className="cart-actions">
            <button 
              className={`btn-secondary ${showClearConfirm ? 'btn-danger' : ''}`} 
              onClick={handleClearCart}
            >
              {showClearConfirm ? 'Confirm clear?' : 'Clear cart'}
            </button>
            <Link href="/" className="link-inline">Continue shopping</Link>
          </div>
        </section>

        {/* Recommendations Section - Below cart items */}
        {products.length !== 0 && showRecommendations && (
          <div className="recommendations-card">
            <div className="recommendations-header">
              <h3>Frequently bought together</h3>
              <button 
                onClick={() => setShowRecommendations(false)}
                className="link-inline close-btn"
              >
                ✕
              </button>
            </div>
            <div className="recommendations-grid">
              {getRecommendations().slice(0, 3).map(rec => (
                <div key={rec.id} className="recommendation-item">
                  <div className="rec-info">
                    <div className="rec-name">{rec.name}</div>
                    <div className="rec-price">
                      GHS {rec.price} <span className="rec-discount">({rec.discount}% off)</span>
                    </div>
                  </div>
                  <button className="add-rec-btn">+ Add</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <aside className="cartinfo">
        {/* Clean Order Summary Card */}
        {products.length !== 0 && (
          <div className="summary-card">
            <h3 className="order-summary-title">Order Summary</h3>
            
            {/* Cart Insights */}
            <div className="cart-insights">
              {cartInsights.freeShippingProgress < 100 && (
                <div className="insight-item">
                  <div className="shipping-progress">
                    <span className="progress-text">
                      Add GHS {(50 - subtotal).toFixed(2)} more for free shipping
                    </span>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${cartInsights.freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {cartInsights.potentialSavings > 0 && (
                <div className="insight-item">
                  <div className="savings-tip">
                    <span>💡 Potential bulk savings: GHS {cartInsights.potentialSavings.toFixed(2)}</span>
                    <small>Add more items from the same category</small>
                  </div>
                </div>
              )}
            </div>
            
            <form className="promo-form" onSubmit={handleApplyPromo}>
              <div className="promo-input-group">
                <label htmlFor="promo" className="sr-only">Promo code</label>
                <div className="input-with-icon">
                  <Tag size={16} className="input-icon" />
                  <input 
                    id="promo" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)} 
                    placeholder="Enter promo code" 
                    className="promo-input" 
                  />
                </div>
                <button type="submit" className="btn-modern btn-primary" style={{height: '32px'}}>Apply</button>
              </div>
              {promoError && (
                <div className="promo-error">
                  <AlertCircle size={14} />
                  <span>{promoError}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="promo-success">
                  <span>✓ {discount}% discount applied!</span>
                </div>
              )}
            </form>

            <section className="order-summary-row">
              <p>Subtotal [{products.length}]</p>
              <p>GHS {subtotal.toFixed(2)}</p>
            </section>
            {discount > 0 && (
              <section className="order-summary-row discount-row">
                <p>Discount ({discount}%)</p>
                <p>- GHS {discountAmount.toFixed(2)}</p>
              </section>
            )}
            <section className="order-summary-row">
              <p>Shipping</p>
              <p>{shipping === 0 ? 'FREE' : `GHS ${shipping.toFixed(2)}`}</p>
            </section>
            {shipping > 0 && (
              <div className="shipping-notice">
                <Truck size={14} />
                <span>Free shipping on orders over GHS 50</span>
              </div>
            )}
            <section className="order-summary-row">
              <p>Estimated Tax</p>
              <p>-</p>
            </section>
            <section className="order-summary-row order-total">
              <h5>Order Total</h5>
              <h5>GHS {orderTotal.toFixed(2)}</h5>
            </section>
            
            <button 
              onClick={handleCheckout} 
              className="btn-modern btn-primary btn-checkout"
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <div className="security-badges">
              <div className="security-item">
                <Shield size={16} />
                <span>Secure checkout</span>
              </div>
            </div>
            
            <div className="payment-methods-section">
              <h4>Accepted Payment Methods</h4>
              <PaymentMethods />
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}