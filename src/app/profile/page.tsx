'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic';
const OrderManagement = dynamic(() => import('@/components/ordermanagement/OrderManagement'), { ssr: false });
import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, Mail, Phone, MapPin, Save } from 'lucide-react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    avatar: null as string | null
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!profileData.email.trim() || !/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Valid email is required'
    }
    if (!profileData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
    // Clear specific field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // TODO: Implement profile update
      setIsEditing(false)
      console.log('Profile updated:', profileData)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">My Account</h1>
        <p className="profile-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-card">
            {/* User Avatar Section */}
            <div className="user-avatar-section">
              <div className="avatar-placeholder">
                <User size={40} />
              </div>
              <div className="user-info">
                <h3 className="user-name">{profileData.firstName} {profileData.lastName}</h3>
                <p className="user-email">{profileData.email}</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <ul className="nav-list">
                <li
                  onClick={() => setActiveTab('profile')}
                  className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                >
                  <User size={20} />
                  <span>Profile Information</span>
                </li>
                <li
                  onClick={() => setActiveTab('orders')}
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                >
                  <ShoppingBag size={20} />
                  <span>Order History</span>
                </li>
                <li
                  onClick={() => setActiveTab('wishlist')}
                  className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                >
                  <Heart size={20} />
                  <span>My Wishlist</span>
                </li>
                <li
                  onClick={() => setActiveTab('settings')}
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                >
                  <Settings size={20} />
                  <span>Account Settings</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          <div className="content-card">
            {activeTab === 'profile' && (
              <div className="profile-tab">
                <div className="tab-header">
                  <h2 className="tab-title">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`edit-toggle-btn ${isEditing ? 'editing' : ''}`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {!isEditing ? (
                  // Display Mode
                  <div className="profile-display">
                    <div className="info-section">
                      <div className="info-group">
                        <div className="info-item">
                          <User size={16} />
                          <div className="info-content">
                            <label>Full Name</label>
                            <span>{profileData.firstName} {profileData.lastName}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <Mail size={16} />
                          <div className="info-content">
                            <label>Email Address</label>
                            <span>{profileData.email}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <Phone size={16} />
                          <div className="info-content">
                            <label>Phone Number</label>
                            <span>{profileData.phone}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <MapPin size={16} />
                          <div className="info-content">
                            <label>Address</label>
                            <span>{profileData.address}, {profileData.city}, {profileData.state} {profileData.zipCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                      </div>
                      
                      <div className="form-group full-width">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className={`form-input ${formErrors.email ? 'error' : ''}`}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className={`form-input ${formErrors.phone ? 'error' : ''}`}
                          placeholder="Enter your phone number"
                        />
                        {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                      </div>
                      
                      <div className="form-group full-width">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your street address"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your city"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your state"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="save-btn">
                        <Save size={16} />
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-tab">
                <div className="tab-header">
                  <h2 className="tab-title">Order History</h2>
                  <p className="tab-subtitle">Track and manage your recent orders</p>
                </div>
                <div className="orders-content">
                  <OrderManagement />
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="wishlist-tab">
                <div className="tab-header">
                  <h2 className="tab-title">My Wishlist</h2>
                  <p className="tab-subtitle">Items you've saved for later</p>
                </div>
                <div className="wishlist-content">
                  <div className="empty-state">
                    <Heart size={48} className="empty-icon" />
                    <h3 className="empty-title">Your wishlist is empty</h3>
                    <p className="empty-description">
                      Start adding items to your wishlist by clicking the heart icon on products you love.
                    </p>
                    <Link href="/products" className="browse-btn">
                      Browse Products
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <div className="tab-header">
                  <h2 className="tab-title">Account Settings</h2>
                  <p className="tab-subtitle">Manage your account preferences and security</p>
                </div>
                
                <div className="settings-content">
                  <div className="settings-section">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3 className="setting-title">Change Password</h3>
                        <p className="setting-description">Update your password to keep your account secure</p>
                      </div>
                      <button className="setting-action-btn">
                        Update Password
                      </button>
                    </div>
                    
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3 className="setting-title">Two-Factor Authentication</h3>
                        <p className="setting-description">Add an extra layer of security to your account</p>
                      </div>
                      <button className="setting-action-btn secondary">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3 className="section-title">Notification Preferences</h3>
                    <div className="notification-options">
                      <div className="notification-item">
                        <label className="notification-label">
                          <input type="checkbox" className="notification-checkbox" defaultChecked />
                          <span className="checkbox-custom"></span>
                          <div className="notification-text">
                            <span className="notification-title">Email notifications</span>
                            <span className="notification-description">Receive order updates and promotions via email</span>
                          </div>
                        </label>
                      </div>
                      
                      <div className="notification-item">
                        <label className="notification-label">
                          <input type="checkbox" className="notification-checkbox" defaultChecked />
                          <span className="checkbox-custom"></span>
                          <div className="notification-text">
                            <span className="notification-title">SMS notifications</span>
                            <span className="notification-description">Get delivery updates via text message</span>
                          </div>
                        </label>
                      </div>

                      <div className="notification-item">
                        <label className="notification-label">
                          <input type="checkbox" className="notification-checkbox" />
                          <span className="checkbox-custom"></span>
                          <div className="notification-text">
                            <span className="notification-title">Marketing communications</span>
                            <span className="notification-description">Receive promotional offers and new product announcements</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="settings-section danger-zone">
                    <h3 className="section-title danger">Danger Zone</h3>
                    <div className="setting-item danger">
                      <div className="setting-info">
                        <h3 className="setting-title">Delete Account</h3>
                        <p className="setting-description">Permanently delete your account and all associated data</p>
                      </div>
                      <button className="setting-action-btn danger">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 