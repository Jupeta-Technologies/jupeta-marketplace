'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GetAllProdAPI } from '@/lib/api/GetAllProdAPI'
import { Product } from '@/types/api'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Eye, Clock, Truck, MapPin, Lock } from 'lucide-react'
import MemberCard from '@/components/MemberCard'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [quickBuy, setQuickBuy] = useState(false)
  const [openBid, setOpenBid] = useState(false)
  const [itemAdded, setItemAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await GetAllProdAPI()
        if (res.code === "0" && res.responseData) {
          const foundProduct = res.responseData.find((p: Product) => p.id === productId)
          if (foundProduct) {
            setProduct(foundProduct)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        qty: 1
      })
      setItemAdded(true)
      // Reset the added state after 2 seconds
      setTimeout(() => setItemAdded(false), 2000)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        ...product,
        qty: 1
      })
      router.push('/cart')
    }
  }

  const handleBidBuy = (sellingType: string) => {
    if (sellingType === "Auction") {
      setOpenBid(true)
    } else if (sellingType === "BuyNow") {
      handleBuyNow()
    }
  }

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-loading">
        <p>Product not found</p>
      </div>
    )
  }

  // Mock images for demonstration
  const productImages = [
    product.imageFileUrl,
    product.imageFileUrl,
    product.imageFileUrl,
    product.imageFileUrl
  ]

  return (
    <div className="product-detail-page">
      <div className="mainContainer" style={{ marginTop: '86px' }}>
        <div className="product-detail-container">
          <div className="product-detail-grid">
            {/* Product Images */}
            <div className="product-detail-images">
              <div className="details">
                <div className="big-img">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.productName}
                    className="main-image"
                  />
                </div>
              </div>
              <div className="thumbnail-grid">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.productName} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
        </div>

            {/* Product Details */}
            <div className="product-details">
              <div className="box">
        <div>
                  <div className="row">
                    <h2 className="product-title">{product.productName}</h2>
                    <span className="product-price">¢{product.price}</span>
                    
                    {product.sellingType !== "BuyNow" && (
                      <span className="auction-info">
                        10000 bids <Clock size={20} style={{ margin: '0 2px' }} /> 1 day 3 Hours 5 Min
                      </span>
                    )}
                    
                    <div className="product-features">
                      <p><Truck size={20} style={{ float: 'left', paddingRight: '4px' }} /> Free Shipping</p>
                      <p><MapPin size={20} style={{ float: 'left', paddingRight: '4px' }} /> Accra</p>
                      <p><Lock size={20} style={{ float: 'left', paddingRight: '4px' }} /> Secure pick-up</p>
                    </div>
          </div>

                  <div className="product-actions">
                    {quickBuy && product.sellingType === "BuyNow" ? (
                      <div className="checkout-modal">
                        <h3>Checkout</h3>
                        <p>Redirecting to checkout...</p>
                        <button onClick={() => setQuickBuy(false)}>Close</button>
                      </div>
                    ) : (
                      <>
                        {openBid && product.sellingType === "Auction" ? (
                          <div className="bid-modal">
                            <h3>Place Your Bid</h3>
                            <p>Current Price: ¢{product.price}</p>
                            <div className="bid-input">
                              <input 
                                type="number" 
                                placeholder="Enter your bid amount"
                                min={product.price + 1}
                              />
                              <button onClick={() => setOpenBid(false)}>Place Bid</button>
                            </div>
                            <button onClick={() => setOpenBid(false)}>Cancel</button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="buy-bid-btn"
                              onClick={() => handleBidBuy(product.sellingType)}
                            >
                              {product.sellingType !== "BuyNow" ? "BID" : "BUY NOW"}
                            </button>

                            {product.sellingType === "BuyNow" && (
                              <button 
                                className={`cart-btn ${itemAdded ? 'added' : ''}`} 
                                onClick={handleAddToCart}
                                title={itemAdded ? "Added to cart!" : "Add to cart"}
                              >
                                <ShoppingCart size={24} />
                              </button>
                            )}
                            
                            <button className="view-btn">
                              <Eye size={20} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="container-details">
            <div className="deschead-label">
              <div className="toggle-space">
                <span
                  className={activeTab === 'description' ? 'active' : ''}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </span>
                <span
                  className={activeTab === 'specifications' ? 'active' : ''}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </span>
                <span
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </span>
              </div>
            </div>

            <div className="desc-rev-ven-pad">
              <div className="descSpecs-box">
                {activeTab === 'description' && (
                  <>
                    <div className="itemspecs">
                      <h4>Item Specifications</h4>
                      <div className="specs">
                        <ul>
                          <li>Condition: {product.condition}</li>
                          <li>Type: {product.sellingType}</li>
                          <li>Category: {product.category || 'General'}</li>
                          <li>Price: ¢{product.price}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="itemdesc">
                      <h4>Description</h4>
                      <div className="desc">
                        <p>{product.description}</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'specifications' && (
                  <>
                    <div className="itemspecs">
                      <h4>Technical Specifications</h4>
                      <div className="specs">
                        <ul>
                          <li>Dimensions: 10&Prime; x 8&Prime; x 2&Prime;</li>
                          <li>Weight: 2.5 lbs</li>
                          <li>Material: Premium Quality</li>
                          <li>Warranty: 1 Year</li>
                        </ul>
                      </div>
                    </div>
                    <div className="itemdesc">
                      <h4>Detailed Specifications</h4>
                      <div className="desc">
                        <p>Comprehensive technical details and specifications for this product. Includes all measurements, materials, and technical requirements.</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'reviews' && (
                  <>
                    <div className="itemspecs">
                      <h4>Customer Ratings</h4>
                      <div className="specs">
                        <div>★★★★☆ (4.0/5)</div>
                        <p>Based on 15 reviews</p>
                      </div>
                    </div>
                    <div className="itemdesc">
                      <h4>Customer Reviews</h4>
                      <div className="desc">
                        <div>
                          <p><strong>John D.</strong> - &ldquo;Great product, exactly as described!&rdquo;</p>
                          <p><strong>Sarah M.</strong> - &ldquo;Fast shipping and excellent quality.&rdquo;</p>
                          <p><strong>Mike R.</strong> - &ldquo;Highly recommend this product.&rdquo;</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <MemberCard />
      </div>
    </div>
  )
} 