'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import CartItemCard from '@/components/cart/CartItemCard'
import PaymentMethods from '@/components/cart/PaymentMethods'
import '@/styles/Cartpage.css'

export default function CartPage() {
  const { products, total } = useCart()

  if (products.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <ShoppingBag />
          </div>
          <h1 className="empty-cart-title">Your Cart is Empty</h1>
          <p className="empty-cart-message">Looks like you haven&apos;t added any items to your cart yet.</p>
          <Link href="/products" className="empty-cart-button">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cartpage">
      <div className="cartcontainer">
        <section>
          <h3><strong>Your cart</strong></h3>
          <h4>Total: {'[ ' + products.length + ' ]'}</h4>
          
          {products.map((product, i) => (
            <CartItemCard item={product} key={i} />
          ))}
        </section>
      </div>
      
      <div className="cartinfo">
        {products.length !== 0 && (
          <>
            <h3 className="order-summary-title"><strong>Order Summary</strong></h3>
            <h4 className="promo-code-title">Do you have a promo code?</h4>
            
            <section className="order-summary-row">
              <p>Subtotal [{products.length}]</p>
              <p>GHS {total.toFixed(2)}</p>
            </section>
            
            <section className="order-summary-row">
              <p>Estimated Shipping/Delivery</p>
              <p>FREE</p>
            </section>
            
            <section className="order-summary-row">
              <p>Estimated Tax</p>
              <h5>-</h5>
            </section>
            
            <hr className="order-summary-divider" />
            
            <section className="order-summary-row order-total">
              <h5>Order Total</h5>
              <h5>GHS {total.toFixed(2)}</h5>
            </section>
            
            <Link href="/checkout" className="checkout-button">
              Checkout
            </Link>
            
            <section className="payment-methods-section">
              <h4>ACCEPTED PAYMENT METHODS</h4>
              <PaymentMethods />
            </section>
          </>
        )}
      </div>
    </div>
  )
} 