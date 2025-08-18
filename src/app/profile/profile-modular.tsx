'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic';
const OrderManagement = dynamic(() => import('@/components/ordermanagement/OrderManagement'), { ssr: false });
import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, Mail, Phone, MapPin, Save } from 'lucide-react'
import styles from '@/styles/ProfilePage.module.scss'

export default function ProfilePageModular() {
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
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <h1 className={styles.profileTitle}>My Account</h1>
        <p className={styles.profileSubtitle}>Manage your account settings and preferences</p>
      </div>

      <div className={styles.profileLayout}>
        {/* Sidebar */}
        <div className={styles.profileSidebar}>
          <div className={styles.sidebarCard}>
            {/* User Avatar Section */}
            <div className={styles.userAvatarSection}>
              <div className={styles.avatarPlaceholder}>
                <User size={40} />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{profileData.firstName} {profileData.lastName}</h3>
                <p className={styles.userEmail}>{profileData.email}</p>
              </div>
            </div>

            <nav className={styles.sidebarNav}>
              <ul className={styles.navList}>
                <li
                  onClick={() => setActiveTab('profile')}
                  className={`${styles.navItem} ${activeTab === 'profile' ? 'active' : ''}`}
                >
                  <User size={20} />
                  <span>Profile Information</span>
                </li>
                <li
                  onClick={() => setActiveTab('orders')}
                  className={`${styles.navItem} ${activeTab === 'orders' ? 'active' : ''}`}
                >
                  <ShoppingBag size={20} />
                  <span>Order History</span>
                </li>
                <li
                  onClick={() => setActiveTab('wishlist')}
                  className={`${styles.navItem} ${activeTab === 'wishlist' ? 'active' : ''}`}
                >
                  <Heart size={20} />
                  <span>My Wishlist</span>
                </li>
                <li
                  onClick={() => setActiveTab('settings')}
                  className={`${styles.navItem} ${activeTab === 'settings' ? 'active' : ''}`}
                >
                  <Settings size={20} />
                  <span>Account Settings</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.profileContent}>
          <div className={styles.contentCard}>
            {activeTab === 'profile' && (
              <div className={styles.profileTab}>
                <div className={styles.tabHeader}>
                  <div>
                    <h2 className={styles.tabTitle}>Profile Information</h2>
                    <p className={styles.tabSubtitle}>Manage your personal information</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`${styles.editToggleBtn} ${isEditing ? 'editing' : ''}`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {!isEditing ? (
                  // Display Mode
                  <div className={styles.profileDisplay}>
                    <div className={styles.infoSection}>
                      <div className={styles.infoGroup}>
                        <div className={styles.infoItem}>
                          <User size={16} />
                          <div className={styles.infoContent}>
                            <label>Full Name</label>
                            <span>{profileData.firstName} {profileData.lastName}</span>
                          </div>
                        </div>
                        <div className={styles.infoItem}>
                          <Mail size={16} />
                          <div className={styles.infoContent}>
                            <label>Email Address</label>
                            <span>{profileData.email}</span>
                          </div>
                        </div>
                        <div className={styles.infoItem}>
                          <Phone size={16} />
                          <div className={styles.infoContent}>
                            <label>Phone Number</label>
                            <span>{profileData.phone}</span>
                          </div>
                        </div>
                        <div className={styles.infoItem}>
                          <MapPin size={16} />
                          <div className={styles.infoContent}>
                            <label>Address</label>
                            <span>{profileData.address}, {profileData.city}, {profileData.state} {profileData.zipCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${formErrors.firstName ? 'error' : ''}`}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && <span className={styles.errorMessage}>{formErrors.firstName}</span>}
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${formErrors.lastName ? 'error' : ''}`}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && <span className={styles.errorMessage}>{formErrors.lastName}</span>}
                      </div>
                      
                      <div className={`${styles.formGroup} full-width`}>
                        <label className={styles.formLabel}>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${formErrors.email ? 'error' : ''}`}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && <span className={styles.errorMessage}>{formErrors.email}</span>}
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${formErrors.phone ? 'error' : ''}`}
                          placeholder="Enter your phone number"
                        />
                        {formErrors.phone && <span className={styles.errorMessage}>{formErrors.phone}</span>}
                      </div>
                      
                      <div className={`${styles.formGroup} full-width`}>
                        <label className={styles.formLabel}>Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Enter your street address"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>City</label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Enter your city"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>State</label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Enter your state"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.saveBtn}>
                        <Save size={16} />
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className={styles.ordersTab}>
                <div className={styles.tabHeader}>
                  <div>
                    <h2 className={styles.tabTitle}>Order History</h2>
                    <p className={styles.tabSubtitle}>Track and manage your recent orders</p>
                  </div>
                </div>
                <div className={styles.ordersContent}>
                  <OrderManagement />
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className={styles.wishlistTab}>
                <div className={styles.tabHeader}>
                  <div>
                    <h2 className={styles.tabTitle}>My Wishlist</h2>
                    <p className={styles.tabSubtitle}>Items you've saved for later</p>
                  </div>
                </div>
                <div className={styles.wishlistContent}>
                  <div className={styles.emptyState}>
                    <Heart size={48} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>Your wishlist is empty</h3>
                    <p className={styles.emptyDescription}>
                      Start adding items to your wishlist by clicking the heart icon on products you love.
                    </p>
                    <Link href="/products" className={styles.browseBtn}>
                      Browse Products
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={styles.settingsTab}>
                <div className={styles.tabHeader}>
                  <div>
                    <h2 className={styles.tabTitle}>Account Settings</h2>
                    <p className={styles.tabSubtitle}>Manage your account preferences and security</p>
                  </div>
                </div>
                
                <div className={styles.settingsContent}>
                  {/* Settings content would go here */}
                  <div className={styles.emptyState}>
                    <Settings size={48} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>Settings Panel</h3>
                    <p className={styles.emptyDescription}>
                      Account settings and preferences will be available here.
                    </p>
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
