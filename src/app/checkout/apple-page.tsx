'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, CreditCard, Smartphone, Wallet, Package } from 'lucide-react'

export default function AppleCheckoutPage() {
  const { products, preserveBuyButtonProducts, clearCartAll } = useCart()
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
  const [orderedItems, setOrderedItems] = useState(products)
  const [orderedTotal, setOrderedTotal] = useState(0)

  useEffect(() => {
    preserveBuyButtonProducts()
    localStorage.setItem('onCheckoutPage', 'true')
    
    return () => {
      localStorage.removeItem('onCheckoutPage')
    }
  }, [preserveBuyButtonProducts])

  // Helper functions
  const digitsOnly = (v: string) => v.replace(/\D+/g, '')
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(e.target.value).slice(0, 15)
    setFormData(prev => ({ ...prev, phone: raw }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = digitsOnly(e.target.value).slice(0, 4)
    if (raw.length >= 3) raw = `${raw.slice(0,2)}/${raw.slice(2)}`
    setFormData(prev => ({ ...prev, expiryDate: raw }))
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
    setFormData({ ...formData, cardNumber: formatted })
  }

  const calculateSubtotal = () => {
    return products.reduce((sum, item) => sum + (item.price * item.qty), 0)
  }

  const shippingCost = 0
  const finalTotal = calculateSubtotal() + shippingCost

  // Form validation
  const deliveryRequired = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    formData.address,
    formData.city,
    formData.state,
    formData.zipCode,
  ]
  
  const pickupRequired = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
  ]

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    setOrderedItems([...products])
    setOrderedTotal(finalTotal)
    
    setTimeout(() => {
      setIsProcessing(false)
      clearCartAll()
      setOrderComplete(true)
    }, 2000)
  }

  if (orderComplete) {
    return (
      <div className="apple-success">
        <div className="apple-success-content">
          <div className="apple-success-icon">
            <Check size={48} />
          </div>
          <h1>Your order is complete</h1>
          <p>Order confirmation has been sent to {formData.email}</p>
          <div className="apple-success-summary">
            <p>Order total: <strong>GH₵ {orderedTotal.toFixed(2)}</strong></p>
            <p>{orderedItems.length} item{orderedItems.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="apple-success-actions">
            <Link href="/" className="apple-button apple-button-primary">
              Continue Shopping
            </Link>
            <Link href="/profile" className="apple-button apple-button-secondary">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="apple-checkout">
      <div className="apple-container">
        {/* Apple Header */}
        <header className="apple-header">
          <nav className="apple-breadcrumb">
            <Link href="/cart" className="apple-back-link">
              <ArrowLeft size={16} />
              <span>Cart</span>
            </Link>
          </nav>
          <div className="apple-title-section">
            <h1 className="apple-title">Checkout</h1>
          </div>
        </header>

        {/* Apple Layout */}
        <div className="apple-checkout-layout">
          {/* Left Column - Form */}
          <section className="apple-form-section">
            {/* Progress Steps */}
            <div className="apple-progress">
              <div className="apple-progress-track">
                <div 
                  className="apple-progress-fill" 
                  style={{width: step >= 2 ? '100%' : '50%'}}
                />
              </div>
              <div className="apple-steps">
                <div className={`apple-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="apple-step-circle">
                    {step > 1 ? <Check size={14} /> : '1'}
                  </div>
                  <span className="apple-step-label">Delivery</span>
                </div>
                <div className={`apple-step ${step >= 2 ? 'active' : ''}`}>
                  <div className="apple-step-circle">2</div>
                  <span className="apple-step-label">Payment</span>
                </div>
              </div>
            </div>

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className="apple-delivery-section">
                <div className="apple-section-header">
                  <h2 className="apple-section-title">Where should we send your order?</h2>
                </div>
                
                {/* Delivery Method Selection */}
                <div className="apple-delivery-methods">
                  <label className={`apple-delivery-option ${deliveryMethod === 'delivery' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="apple-radio"
                    />
                    <div className="apple-option-content">
                      <div className="apple-option-icon">
                        <Truck size={20} />
                      </div>
                      <div className="apple-option-info">
                        <h3>Ship to you</h3>
                        <p>Free delivery</p>
                      </div>
                    </div>
                  </label>

                  <label className={`apple-delivery-option ${deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="apple-radio"
                    />
                    <div className="apple-option-content">
                      <div className="apple-option-icon">
                        <Package size={20} />
                      </div>
                      <div className="apple-option-info">
                        <h3>Pick up</h3>
                        <p>Available at store</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Form Fields */}
                {deliveryMethod === 'delivery' && (
                  <div className="apple-form-section">
                    <h3 className="apple-form-title">Delivery address</h3>
                    <div className="apple-form-grid">
                      <div className="apple-form-row">
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="apple-input-group">
                        <input
                          type="text"
                          className="apple-input"
                          placeholder="Street address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="apple-form-row">
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            required
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="ZIP"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="apple-form-row">
                        <div className="apple-input-group">
                          <input
                            type="email"
                            className="apple-input"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="tel"
                            className="apple-input"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {deliveryMethod === 'pickup' && (
                  <div className="apple-pickup-section">
                    <h3 className="apple-form-title">Contact information</h3>
                    <div className="apple-form-grid">
                      <div className="apple-form-row">
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="apple-form-row">
                        <div className="apple-input-group">
                          <input
                            type="email"
                            className="apple-input"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="tel"
                            className="apple-input"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="apple-pickup-info">
                      <h4>Pickup details</h4>
                      <p>We'll notify you when your order is ready for pickup. Please bring a valid ID and your order confirmation.</p>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <div className="apple-button-container">
                  <button
                    type="button"
                    className={`apple-button apple-button-primary ${
                      (deliveryMethod === 'delivery' && !deliveryRequired.every(Boolean)) ||
                      (deliveryMethod === 'pickup' && !pickupRequired.every(Boolean))
                        ? 'disabled' : ''
                    }`}
                    onClick={() => {
                      if (deliveryMethod === 'delivery' && deliveryRequired.every(Boolean)) {
                        setStep(2)
                      } else if (deliveryMethod === 'pickup' && pickupRequired.every(Boolean)) {
                        setStep(2)
                      }
                    }}
                    disabled={
                      (deliveryMethod === 'delivery' && !deliveryRequired.every(Boolean)) ||
                      (deliveryMethod === 'pickup' && !pickupRequired.every(Boolean))
                    }
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="apple-payment-section">
                <div className="apple-section-header">
                  <h2 className="apple-section-title">How would you like to pay?</h2>
                </div>
                
                {/* Payment Methods */}
                <div className="apple-payment-methods">
                  <label className={`apple-payment-option ${selectedPaymentMethod === 'apple-pay' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="apple-pay"
                      checked={selectedPaymentMethod === 'apple-pay'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="apple-radio"
                    />
                    <div className="apple-payment-content">
                      <div className="apple-payment-icon">
                        <Smartphone size={20} />
                      </div>
                      <div className="apple-payment-info">
                        <h3>Apple Pay</h3>
                        <p>Touch ID or Face ID</p>
                      </div>
                    </div>
                  </label>

                  <label className={`apple-payment-option ${selectedPaymentMethod === 'credit-card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={selectedPaymentMethod === 'credit-card'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="apple-radio"
                    />
                    <div className="apple-payment-content">
                      <div className="apple-payment-icon">
                        <CreditCard size={20} />
                      </div>
                      <div className="apple-payment-info">
                        <h3>Credit or Debit Card</h3>
                        <p>Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                  </label>

                  <label className={`apple-payment-option ${selectedPaymentMethod === 'jupeta-money' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jupeta-money"
                      checked={selectedPaymentMethod === 'jupeta-money'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="apple-radio"
                    />
                    <div className="apple-payment-content">
                      <div className="apple-payment-icon">
                        <Wallet size={20} />
                      </div>
                      <div className="apple-payment-info">
                        <h3>Jupeta Money</h3>
                        <p>Pay with your balance</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Payment Form */}
                {selectedPaymentMethod === 'credit-card' && (
                  <div className="apple-card-form">
                    <div className="apple-form-grid">
                      <div className="apple-input-group">
                        <input
                          type="text"
                          className="apple-input"
                          placeholder="Card number"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="apple-form-row">
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleExpiryChange}
                            maxLength={5}
                          />
                        </div>
                        <div className="apple-input-group">
                          <input
                            type="text"
                            className="apple-input"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={(e) => setFormData({...formData, cvv: digitsOnly(e.target.value).slice(0, 4)})}
                            maxLength={4}
                          />
                        </div>
                      </div>
                      
                      <div className="apple-input-group">
                        <input
                          type="text"
                          className="apple-input"
                          placeholder="Cardholder name"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'jupeta-money' && (
                  <div className="apple-jupeta-form">
                    <div className="apple-input-group">
                      <input
                        type="password"
                        className="apple-input"
                        placeholder="Jupeta Money PIN"
                        value={formData.jupetaMoneyPin}
                        onChange={(e) => setFormData({...formData, jupetaMoneyPin: e.target.value})}
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="apple-button-container">
                  <button
                    type="button"
                    className="apple-button apple-button-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back to Delivery
                  </button>
                  <button
                    type="button"
                    className={`apple-button apple-button-primary ${!selectedPaymentMethod ? 'disabled' : ''}`}
                    onClick={handlePlaceOrder}
                    disabled={!selectedPaymentMethod || isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Right Column - Order Summary */}
          <aside className="apple-summary-section">
            <div className="apple-order-summary">
              <h3 className="apple-summary-title">Order Summary</h3>
              
              <div className="apple-items-list">
                {products.map((item) => (
                  <div key={item.id} className="apple-item">
                    <div className="apple-item-image">
                      <img src={item.imageFileUrl} alt={item.productName} />
                    </div>
                    <div className="apple-item-details">
                      <h4>{item.productName}</h4>
                      <p>Qty: {item.qty}</p>
                    </div>
                    <div className="apple-item-price">
                      <span>GH₵ {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="apple-summary-totals">
                <div className="apple-summary-row">
                  <span>Subtotal</span>
                  <span>GH₵ {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="apple-summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="apple-summary-row apple-total">
                  <span>Total</span>
                  <span>GH₵ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
