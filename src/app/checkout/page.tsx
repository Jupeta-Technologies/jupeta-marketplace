'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, Lock, Shield } from 'lucide-react'
import PaymentMethods from '@/components/cart/PaymentMethods'

export default function CheckoutPage() {
  const { products, preserveBuyButtonProducts } = useCart()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Preserve buy-button products when entering checkout
  useEffect(() => {
    preserveBuyButtonProducts()
  }, [preserveBuyButtonProducts])

  // Clear cart function
  const clearCart = () => {
    // This would typically call a clear cart method from context
    // For now, we'll just set products to empty array
  }

  if (products.length === 0 && !orderComplete) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <h1>Your cart is empty</h1>
          <p>Add some products to your cart to proceed with checkout</p>
          <Link href="/products" className="checkout-empty-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
      clearCart()
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData({
      ...formData,
      cardNumber: formatted
    })
  }

  const calculateSubtotal = () => {
    return products.reduce((sum, item) => sum + (item.price * item.qty), 0)
  }

  const shippingCost = 0 // Free shipping
  const tax = calculateSubtotal() * 0.15 // 15% tax
  const finalTotal = calculateSubtotal() + shippingCost + tax

  if (orderComplete) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-content">
          <div className="success-icon">
            <Check size={48} />
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <div className="order-details">
            <h3>Order Summary</h3>
            <div className="order-items">
              {products.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.imageFileUrl} alt={item.productName} />
                  <div className="order-item-details">
                    <h4>{item.productName}</h4>
                    <p>Quantity: {item.qty}</p>
                    <p>¢{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <p><strong>Total: ¢{finalTotal.toFixed(2)}</strong></p>
            </div>
          </div>
          <div className="success-actions">
            <Link href="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
            <Link href="/profile" className="view-orders-btn">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <Link href="/cart" className="back-link">
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          {/* Main Checkout Form */}
          <div className="checkout-form-section">
            {/* Progress Steps */}
            <div className="checkout-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Shipping</div>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Payment</div>
              </div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Review</div>
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>
                <form onSubmit={(e) => { e.preventDefault(); setStep(2) }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="address">Street Address *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State/Region *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP/Postal Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="checkout-btn">
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Payment Method</h2>
                
                {/* Payment Method Selection */}
                <div className="payment-methods">
                  <PaymentMethods />
                </div>

                {formData.cardNumber && (
                  <form onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label htmlFor="cardholderName">Cardholder Name *</label>
                        <input
                          type="text"
                          id="cardholderName"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group full-width">
                        <label htmlFor="cardNumber">Card Number *</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date *</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                    <div className="checkout-actions">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="checkout-btn secondary"
                      >
                        Back
                      </button>
                      <button type="submit" className="checkout-btn">
                        Review Order
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="checkout-step">
                <h2>Review Your Order</h2>
                
                <div className="order-review">
                  <div className="review-section">
                    <h3>Shipping Information</h3>
                    <div className="review-info">
                      <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.email} | {formData.phone}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="review-info">
                      {formData.cardNumber && (
                        <p>Credit/Debit Card ending in {formData.cardNumber.slice(-4)}</p>
                      )}
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Order Items</h3>
                    <div className="review-items">
                      {products.map((item) => (
                        <div key={item.id} className="review-item">
                          <img src={item.imageFileUrl} alt={item.productName} />
                          <div className="review-item-details">
                            <h4>{item.productName}</h4>
                            <p>Quantity: {item.qty}</p>
                            <p className="review-item-price">¢{(item.price * item.qty).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="checkout-btn secondary"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="checkout-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {products.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.imageFileUrl} alt={item.productName} />
                  <div className="summary-item-details">
                    <h4>{item.productName}</h4>
                    <p>Quantity: {item.qty}</p>
                    <p className="summary-item-price">¢{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>¢{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax (15%)</span>
                <span>¢{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>¢{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-features">
              <div className="feature">
                <Truck size={20} />
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <Shield size={20} />
                <span>Secure Payment</span>
              </div>
              <div className="feature">
                <Lock size={20} />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 