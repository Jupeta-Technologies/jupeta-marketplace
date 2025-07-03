'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, Lock, Shield } from 'lucide-react'

export default function CheckoutPage() {
  const { products, preserveBuyButtonProducts } = useCart()
  const [step, setStep] = useState(1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    pickupLocation: '',
    jupetaMoneyPin: '',
    mobileMoneyNumber: '',
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
    localStorage.setItem('onCheckoutPage', 'true')
    
    return () => {
      localStorage.removeItem('onCheckoutPage')
    }
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
          <Link href="/" className="checkout-empty-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const finalTotal = calculateSubtotal() + shippingCost

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
            <Link href="/" className="continue-shopping-btn">
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
          {/* Order Summary - Now First */}
          <div className="checkout-summary-section">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {products.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.imageFileUrl} alt={item.productName} />
                  <div className="summary-item-details">
                    <h4>{item.productName}</h4>
                    <p>Quantity: {item.qty}</p>
                    <p>Price: ¢{item.price}</p>
                  </div>
                  <div className="summary-item-price">
                    ¢{(item.price * item.qty).toFixed(2)}
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
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>
                
                {/* Delivery Method Selection */}
                <div className="delivery-method-selection">
                  <h3>Delivery Method</h3>
                  <div className="delivery-options">
                    <label className={`delivery-option ${deliveryMethod === 'delivery' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="delivery"
                        checked={deliveryMethod === 'delivery'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div className="delivery-option-content">
                        <div className="delivery-icon">
                          <span className="icon-text">🚚</span>
                        </div>
                        <div className="delivery-details">
                          <h4>Home Delivery</h4>
                          <p>Free delivery to your address</p>
                        </div>
                        <div className="delivery-check">
                          <div className="check-circle"></div>
                        </div>
                      </div>
                    </label>

                    <label className={`delivery-option ${deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div className="delivery-option-content">
                        <div className="delivery-icon">
                          <span className="icon-text">🏪</span>
                        </div>
                        <div className="delivery-details">
                          <h4>Store Pickup</h4>
                          <p>Pick up from our store locations</p>
                          <span className="delivery-badge pickup">Save time</span>
                        </div>
                        <div className="delivery-check">
                          <div className="check-circle"></div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pickup Information */}
                {deliveryMethod === 'pickup' && (
                  <div className="pickup-info">
                    <h4>Pickup Information</h4>
                    <ul>
                      <li>Available at all Jupeta store locations</li>
                      <li>Pickup available within 2-4 hours of order confirmation</li>
                      <li>Bring your order confirmation and ID for pickup</li>
                      <li>Free pickup - no additional charges</li>
                    </ul>
                    <div className="form-group">
                      <label htmlFor="pickupLocation">Select Pickup Location *</label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose a location</option>
                        <option value="accra-main">Accra Main Store - Ring Road</option>
                        <option value="accra-east">Accra East - Tema</option>
                        <option value="kumasi">Kumasi Central</option>
                        <option value="tamale">Tamale Store</option>
                        <option value="takoradi">Takoradi Branch</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Shipping Form */}
                {deliveryMethod === 'delivery' && (
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
                )}

                {/* Pickup Form */}
                {deliveryMethod === 'pickup' && (
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
                    </div>
                    <button type="submit" className="checkout-btn">
                      Continue to Payment
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Payment Method</h2>
                
                {/* Payment Method Selection */}
                <div className="payment-section-title">Choose Payment Method</div>
                <div className="payment-options-grid">
                  <label className={`payment-option ${selectedPaymentMethod === 'jupeta-money' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jupeta-money"
                      checked={selectedPaymentMethod === 'jupeta-money'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <div className="payment-icon jupeta-money-icon">
                        <span className="icon-text">💰</span>
                      </div>
                      <div className="payment-details">
                        <h4>Jupeta Money</h4>
                        <p>Pay with your Jupeta Money balance</p>
                        <span className="payment-badge popular">Most Popular</span>
                      </div>
                      <div className="payment-check">
                        <div className="check-circle"></div>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option ${selectedPaymentMethod === 'mobile-money' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile-money"
                      checked={selectedPaymentMethod === 'mobile-money'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <div className="payment-icon mobile-money-icon">
                        <span className="icon-text">📱</span>
                      </div>
                      <div className="payment-details">
                        <h4>Mobile Money</h4>
                        <p>MTN, Vodafone, or AirtelTigo</p>
                        <span className="payment-badge secure">Secure</span>
                      </div>
                      <div className="payment-check">
                        <div className="check-circle"></div>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <div className="payment-icon card-icon">
                        <span className="icon-text">💳</span>
                      </div>
                      <div className="payment-details">
                        <h4>Credit/Debit Card</h4>
                        <p>Visa, Mastercard, or other cards</p>
                        <span className="payment-badge secure">Secure</span>
                      </div>
                      <div className="payment-check">
                        <div className="check-circle"></div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Payment Forms */}
                {selectedPaymentMethod && (
                  <div className="payment-forms">
                    {/* Jupeta Money Form */}
                    {selectedPaymentMethod === 'jupeta-money' && (
                      <div className="payment-form-container">
                        <div className="payment-form-header">
                          <div className="payment-method-indicator">
                            <div className="payment-icon jupeta-money-icon">
                              <span className="icon-text">💰</span>
                            </div>
                            <h3>Jupeta Money Payment</h3>
                          </div>
                          <div className="balance-display">
                            <span className="balance-amount">¢1,250.00</span>
                            <span className="balance-label">Available Balance</span>
                          </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label htmlFor="jupetaMoneyPin">PIN *</label>
                            <input
                              type="password"
                              id="jupetaMoneyPin"
                              name="jupetaMoneyPin"
                              value={formData.jupetaMoneyPin}
                              onChange={handleInputChange}
                              placeholder="Enter your 4-digit PIN"
                              maxLength={4}
                              required
                            />
                          </div>
                          <div className="payment-summary">
                            <div className="summary-item">
                              <span>Amount to Pay:</span>
                              <span>¢{finalTotal.toFixed(2)}</span>
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
                            <button 
                              type="submit" 
                              className="checkout-btn primary"
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Pay with Jupeta Money'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Mobile Money Form */}
                    {selectedPaymentMethod === 'mobile-money' && (
                      <div className="payment-form-container">
                        <div className="payment-form-header">
                          <div className="payment-method-indicator">
                            <div className="payment-icon mobile-money-icon">
                              <span className="icon-text">📱</span>
                            </div>
                            <h3>Mobile Money Payment</h3>
                          </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label htmlFor="mobileMoneyNumber">Mobile Money Number *</label>
                            <input
                              type="tel"
                              id="mobileMoneyNumber"
                              name="mobileMoneyNumber"
                              value={formData.mobileMoneyNumber}
                              onChange={handleInputChange}
                              placeholder="e.g., 0244 123 456"
                              required
                            />
                            <p className="form-help">Enter your MTN, Vodafone, or AirtelTigo number</p>
                          </div>
                          <div className="payment-summary">
                            <div className="summary-item">
                              <span>Amount to Pay:</span>
                              <span>¢{finalTotal.toFixed(2)}</span>
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
                            <button 
                              type="submit" 
                              className="checkout-btn primary"
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Pay with Mobile Money'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Card Payment Form */}
                    {selectedPaymentMethod === 'card' && (
                      <div className="payment-form-container">
                        <div className="payment-form-header">
                          <div className="payment-method-indicator">
                            <div className="payment-icon card-icon">
                              <span className="icon-text">💳</span>
                            </div>
                            <h3>Card Payment</h3>
                          </div>
                          <div className="security-badges">
                            <span className="security-badge">🔒 SSL Encrypted</span>
                            <span className="security-badge">🛡️ Secure Payment</span>
                          </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                          <div className="form-grid">
                            <div className="form-group full-width">
                              <label htmlFor="cardholderName">Cardholder Name *</label>
                              <input
                                type="text"
                                id="cardholderName"
                                name="cardholderName"
                                value={formData.cardholderName}
                                onChange={handleInputChange}
                                placeholder="Name on card"
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
                          <div className="payment-summary">
                            <div className="summary-item">
                              <span>Amount to Pay:</span>
                              <span>¢{finalTotal.toFixed(2)}</span>
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
                            <button 
                              type="submit" 
                              className="checkout-btn primary"
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Pay with Card'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 