'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ArrowLeft, Check, Truck, CreditCard, Smartphone, Wallet, Package } from 'lucide-react';
import { BiCheckCircle } from 'react-icons/bi';
import '../../styles/jptaCheckout.css';
import '../../styles/jupeta-ec-v1.global.scss';

export default function CheckoutPage() {
  const { products, preserveBuyButtonProducts, clearCartAll } = useCart()
  const [step, setStep] = useState(1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [deliveryCompleted, setDeliveryCompleted] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
  const [isValidating, setIsValidating] = useState(false)
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

  // Refs for smooth scrolling
  const deliverySectionRef = useRef<HTMLDivElement>(null)
  const paymentSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    preserveBuyButtonProducts()
    localStorage.setItem('onCheckoutPage', 'true')
    
    return () => {
      localStorage.removeItem('onCheckoutPage')
    }
  }, [preserveBuyButtonProducts])

  // Scroll to section when step changes
  useEffect(() => {
    if (step === 1 && deliverySectionRef.current) {
      deliverySectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    } else if (step === 2 && paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }, [step])

  // Monitor payment completion
  useEffect(() => {
    if (selectedPaymentMethod && deliveryCompleted) {
      const paymentComplete = isPaymentCompleted()
      setPaymentCompleted(paymentComplete)
      
      if (paymentComplete && deliveryCompleted) {
        setShowReview(true)
      }
    }
  }, [selectedPaymentMethod, formData, deliveryCompleted])

  // Helper functions
  const digitsOnly = (v: string) => v.replace(/\D+/g, '')
  
  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    return phone.length >= 10
  }

  const validateField = (fieldName: string, value: string) => {
    let error = ''
    
    switch (fieldName) {
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Please enter a valid email address'
        }
        break
      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'Phone number must be at least 10 digits'
        }
        break
      case 'firstName':
      case 'lastName':
        if (value && value.length < 2) {
          error = 'Name must be at least 2 characters'
        }
        break
      case 'cardNumber':
        if (value && value.replace(/\s/g, '').length < 13) {
          error = 'Please enter a valid card number'
        }
        break
      case 'cvv':
        if (value && (value.length < 3 || value.length > 4)) {
          error = 'CVV must be 3 or 4 digits'
        }
        break
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
    
    return !error
  }
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(e.target.value).slice(0, 15)
    setFormData(prev => ({ ...prev, phone: raw }))
    
    // Check if delivery is completed after phone update
    const updatedFormData = { ...formData, phone: raw }
    const deliveryComplete = deliveryMethod === 'delivery' 
      ? [updatedFormData.firstName, updatedFormData.lastName, updatedFormData.email, raw, 
         updatedFormData.address, updatedFormData.city, updatedFormData.state, updatedFormData.zipCode].every(Boolean)
      : [updatedFormData.firstName, updatedFormData.lastName, updatedFormData.email, raw].every(Boolean)
    
    setDeliveryCompleted(deliveryComplete)
    
    // Auto-advance to payment when phone number is entered and form is complete
    if (raw.length >= 10 && step === 1 && deliveryComplete) {
      setTimeout(() => setStep(2), 300); // Small delay for better UX
    }
  }
  
  // General handler for pickup form fields
  const handlePickupFieldChange = (field: string, value: string) => {
    const updatedFormData = { ...formData, [field]: value }
    setFormData(updatedFormData)
    
    // Check if pickup form is completed
    if (deliveryMethod === 'pickup') {
      const pickupComplete = [
        updatedFormData.firstName,
        updatedFormData.lastName,
        updatedFormData.email,
        updatedFormData.phone
      ].every(Boolean)
      
      setDeliveryCompleted(pickupComplete)
      
      // Auto-advance to payment if all fields are filled and phone is valid
      if (pickupComplete && updatedFormData.phone.length >= 10 && step === 1) {
        setTimeout(() => setStep(2), 300)
      }
    }
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

  // Helper functions to check completion status
  const isDeliveryCompleted = () => {
    return deliveryMethod === 'delivery' 
      ? deliveryRequired.every(Boolean)
      : pickupRequired.every(Boolean)
  }

  const isPaymentCompleted = () => {
    if (!selectedPaymentMethod) return false
    
    switch (selectedPaymentMethod) {
      case 'credit-card':
        return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName)
      case 'mobile-money':
        return !!formData.mobileMoneyNumber
      case 'jupeta-money':
        return !!formData.jupetaMoneyPin
      case 'Apple-pay':
        return true // Apple Pay doesn't need additional fields
      default:
        return false
    }
  }

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
      <div className="jpta-success">
        <div className="jpta-success-content">
          <div className="jpta-success-icon">
            <Check size={48} />
          </div>
          <h1>Your order is complete</h1>
          <p>Order confirmation has been sent to {formData.email}</p>
          <div className="jpta-success-summary">
            <p>Order total: <strong>GH₵ {orderedTotal.toFixed(2)}</strong></p>
            <p>{orderedItems.length} item{orderedItems.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="jpta-success-actions">
            <Link href="/" className="jpta-button jpta-button-primary">
              Continue Shopping
            </Link>
            <Link href="/profile" className="jpta-button jpta-button-secondary">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="jpta-checkout">
      <div className="jpta-container">
        {/* jpta Header */}
        <header className="jpta-header">
          <nav className="jpta-breadcrumb">
            <Link href="/cart" className="jpta-back-link">
              <ArrowLeft size={16} />
              <span>Cart</span>
            </Link>
          </nav>
          <div className="jpta-title-section">
            <h1 className="jpta-title">Checkout</h1>
          </div>
        </header>

        {/* jpta Layout */}
        <div className="jpta-checkout-layout">
          {/* Left Column - Order Summary */}
          <aside className="jpta-summary-section" aria-labelledby="order-summary-heading">
            <div className="jpta-order-summary">
              <h3 id="order-summary-heading" className="jpta-summary-title">Your Order</h3>
              
              <div className="jpta-items-list" role="list" aria-label="Items in your order">
                {products.map((item) => (
                  <div key={item.id} className="jpta-item" role="listitem">
                    <div className="jpta-item-image">
                      <img src={item.imageFileUrl} alt={item.productName} />
                    </div>
                    <div className="jpta-item-details">
                      <h4>{item.productName}</h4>
                      <p className="jpta-item-quantity">Qty: {item.qty}</p>
                    </div>
                    <div className="jpta-item-price">
                      <span>GH₵ {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="jpta-summary-totals" aria-labelledby="order-totals-heading">
                <h4 id="order-totals-heading" className="sr-only">Order totals</h4>
                <div className="jpta-summary-row">
                  <span>Subtotal</span>
                  <span>GH₵ {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="jpta-summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="jpta-summary-row jpta-total">
                  <span>Total</span>
                  <span>GH₵ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column - Checkout Process */}
          <section className="jpta-form-section" aria-labelledby="checkout-heading">
            <header className="jpta-checkout-header">
              <h2 id="checkout-heading" className="jpta-checkout-title">Complete Your Purchase</h2>
              <p className="jpta-checkout-subtitle">Review your order and provide shipping details</p>
            </header>

            {/* Progress Indicator */}
            <div className="jpta-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2} aria-label={`Checkout step ${step} of 2`}>
              <div className="jpta-progress-track">
                <div 
                  className="jpta-progress-fill" 
                  style={{width: step >= 2 ? '100%' : '50%'}}
                />
              </div>
              <ol className="jpta-steps" aria-label="Checkout steps">
                <li className={`jpta-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="jpta-step-circle" aria-hidden="true">
                    {step > 1 ? <Check size={14} /> : '1'}
                  </div>
                  <span className="jpta-step-label">Delivery</span>
                </li>
                <li className={`jpta-step ${step >= 2 ? 'active' : ''}`}>
                  <div className="jpta-step-circle" aria-hidden="true">2</div>
                  <span className="jpta-step-label">Payment</span>
                </li>
              </ol>
            </div>

            {/* Checkout Steps */}
            <div className="jpta-checkout-steps" role="main" aria-labelledby="checkout-heading">
            {/* Step 1: Delivery */}
            <section ref={deliverySectionRef} className={`jpta-delivery-section ${
              showReview ? 'collapsed' : (step > 1 ? 'completed' : '')
            }`} aria-labelledby="delivery-heading">
                <header className="jpta-section-header">
                  <h3 id="delivery-heading" className="jpta-section-title">
                    {step > 1 && <Check size={20} className="completed-icon" />}
                    Where should we send your order?
                  </h3>
                </header>
                
                {/* Delivery Method Selection */}
                <fieldset className="jpta-delivery-methods" aria-labelledby="delivery-method-legend">
                  <legend id="delivery-method-legend" className="sr-only">Choose delivery method</legend>
                  <label className={`jpta-delivery-option ${deliveryMethod === 'delivery' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="jpta-radio"
                    />
                    <div className="jpta-option-content">
                      <div className="jpta-option-icon">
                        <Truck size={20} />
                      </div>
                      <div className="jpta-option-info">
                        <h3>Ship to you</h3>
                        <p>Free delivery</p>
                      </div>
                    </div>
                  </label>

                  <label className={`jpta-delivery-option ${deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="jpta-radio"
                    />
                    <div className="jpta-option-content">
                      <div className="jpta-option-icon">
                        <Package size={20} />
                      </div>
                      <div className="jpta-option-info">
                        <h3>Pick up</h3>
                        <p>Available at store</p>
                      </div>
                    </div>
                  </label>
                </fieldset>

                {/* Form Fields */}
                {deliveryMethod === 'delivery' && (
                  <div className="jpta-form-section">
                    <h3 className="jpta-form-title">Delivery address</h3>
                    <div className="jpta-form-grid">
                      <div className="jpta-form-row">
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="jpta-input-group">
                        <input
                          type="text"
                          className="jpta-input"
                          placeholder="Street address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="jpta-form-row">
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            required
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="ZIP"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="jpta-form-row">
                        <div className="jpta-input-group">
                          <input
                            type="email"
                            className="jpta-input"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="tel"
                            className="jpta-input"
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
                  <div className="jpta-pickup-section">
                    <h3 className="jpta-form-title">Contact information</h3>
                    <div className="jpta-form-grid">
                      <div className="jpta-form-row">
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(e) => handlePickupFieldChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => handlePickupFieldChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="jpta-form-row">
                        <div className="jpta-input-group">
                          <input
                            type="email"
                            className="jpta-input"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => handlePickupFieldChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="tel"
                            className="jpta-input"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="jpta-pickup-info">
                      <h4>Pickup details</h4>
                      <p>We'll notify you when your order is ready for pickup. Please bring a valid ID and your order confirmation.</p>
                    </div>
                  </div>
                )}
              </section>

            {/* Step 2: Payment */}
            <section ref={paymentSectionRef} className={`jpta-payment-section ${
              showReview ? 'collapsed' : (!deliveryCompleted ? 'disabled' : '')
            }`} aria-labelledby="payment-heading">
                <header className="jpta-section-header">
                  <h3 id="payment-heading" className="jpta-section-title">How would you like to pay?</h3>
                  {deliveryCompleted && (
                    <button 
                      type="button" 
                      className="jpta-back-to-delivery"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft size={16} />
                      Back to Delivery
                    </button>
                  )}
                </header>
                
                {deliveryCompleted ? (
                  <>
                {/* Payment Methods */}
                <fieldset className="jpta-payment-methods" aria-labelledby="payment-method-legend">
                  <legend id="payment-method-legend" className="sr-only">Choose payment method</legend>
                  <label className={`jpta-payment-option ${selectedPaymentMethod === 'jpta-pay' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Apple-pay"
                      checked={selectedPaymentMethod === 'Apple-pay'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="jpta-radio"
                    />
                    <div className="jpta-payment-content">
                      <div className="jpta-payment-icon">
                        <Smartphone size={20} />
                      </div>
                      <div className="jpta-payment-info">
                        <h3>Apple Pay</h3>
                        <p>Touch ID or Face ID</p>
                      </div>
                    </div>
                  </label>

                  <label className={`jpta-payment-option ${selectedPaymentMethod === 'credit-card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={selectedPaymentMethod === 'credit-card'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="jpta-radio"
                    />
                    <div className="jpta-payment-content">
                      <div className="jpta-payment-icon">
                        <CreditCard size={20} />
                      </div>
                      <div className="jpta-payment-info">
                        <h3>Credit or Debit Card</h3>
                        <p>Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                  </label>

                  <label className={`jpta-payment-option ${selectedPaymentMethod === 'jupeta-money' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jupeta-money"
                      checked={selectedPaymentMethod === 'jupeta-money'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="jpta-radio"
                    />
                    <div className="jpta-payment-content">
                      <div className="jpta-payment-icon">
                        <Wallet size={20} />
                      </div>
                      <div className="jpta-payment-info">
                        <h3>Jupeta Money</h3>
                        <p>Pay with your balance</p>
                      </div>
                    </div>
                  </label>
                </fieldset>

                {/* Payment Form */}
                {selectedPaymentMethod === 'credit-card' && (
                  <div className="jpta-card-form">
                    <div className="jpta-form-grid">
                      <div className="jpta-input-group">
                        <input
                          type="text"
                          className="jpta-input"
                          placeholder="Card number"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="jpta-form-row">
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleExpiryChange}
                            maxLength={5}
                          />
                        </div>
                        <div className="jpta-input-group">
                          <input
                            type="text"
                            className="jpta-input"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={(e) => setFormData({...formData, cvv: digitsOnly(e.target.value).slice(0, 4)})}
                            maxLength={4}
                          />
                        </div>
                      </div>
                      
                      <div className="jpta-input-group">
                        <input
                          type="text"
                          className="jpta-input"
                          placeholder="Cardholder name"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'jupeta-money' && (
                  <div className="jpta-jupeta-form">
                    <div className="jpta-input-group">
                      <input
                        type="password"
                        className="jpta-input"
                        placeholder="Jupeta Money PIN"
                        value={formData.jupetaMoneyPin}
                        onChange={(e) => setFormData({...formData, jupetaMoneyPin: e.target.value})}
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="jpta-button-container">
                  <button
                    type="button"
                    className="jpta-button jpta-button-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back to Delivery
                  </button>
                </div>
                  </>
                ) : (
                  <div className="jpta-payment-placeholder">
                    <p>Complete the delivery information above to continue with payment.</p>
                  </div>
                )}
              </section>

            {/* Step 3: Review (when both sections are completed) */}
            {showReview && deliveryCompleted && paymentCompleted && (
              <section className="jpta-review-section" aria-labelledby="review-heading">
                <header className="jpta-section-header">
                  <h3 id="review-heading" className="jpta-section-title">
                    <Check size={20} className="completed-icon" />
                    Review Your Order
                  </h3>
                </header>

                <div className="jpta-review-content">
                  <div className="jpta-review-item">
                    <h4>Delivery Information</h4>
                    <p><strong>Method:</strong> {deliveryMethod === 'delivery' ? 'Ship to you' : 'Pick up'}</p>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    {deliveryMethod === 'delivery' ? (
                      <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                    ) : (
                      <p><strong>Pickup Location:</strong> Jupeta Store - Main Branch</p>
                    )}
                  </div>

                  <div className="jpta-review-item">
                    <h4>Payment Method</h4>
                    <p><strong>Method:</strong> {
                      selectedPaymentMethod === 'Apple-pay' ? 'Apple Pay' :
                      selectedPaymentMethod === 'credit-card' ? 'Credit Card' :
                      selectedPaymentMethod === 'mobile-money' ? 'Mobile Money' :
                      selectedPaymentMethod === 'jupeta-money' ? 'Jupeta Money' : 
                      selectedPaymentMethod
                    }</p>
                  </div>

                  <div className="jpta-review-success">
                    <BiCheckCircle className="jpta-success-icon" />
                    <p>Ready to place your order!</p>
                  </div>

                  {/* Place Order Button */}
                  <div className="jpta-review-actions">
                    <button
                      type="button"
                      className="jpta-button jpta-button-primary jpta-place-order-btn"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </section>
            )}
            </div>
        </section>
      </div>
    </div>
    </main>
  )
}
