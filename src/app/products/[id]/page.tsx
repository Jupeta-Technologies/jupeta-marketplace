'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GetAllProdAPI } from '@/lib/api/GetAllProdAPI'
import { Product } from '@/types/api'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Eye, Clock, Truck, MapPin, Lock } from 'lucide-react'
import MemberCard from '@/components/MemberCard'
import ListingRow from '@/components/Shared/ListingRow'

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
        if (res.Code === "0" && res.ResponseData) {
          const foundProduct = res.ResponseData.find((p: Product) => p.Id === productId)
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
        id: product.Id,
        productName: product.ProductName,
        price: product.Price,
        imageFileUrl: product.ImageFileUrl,
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
        id: product.Id,
        productName: product.ProductName,
        price: product.Price,
        imageFileUrl: product.ImageFileUrl,
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
    product.ImageFileUrl,
    product.ImageFileUrl,
    product.ImageFileUrl,
    product.ImageFileUrl
  ]

  return (
    <div className="product-detail-page">
      <div className="container" style={{paddingTop:'96px'}}>{/* Add action component to go back to previous page then remove padding-top */}
        <div className="product-detail-container">
          <div className="product-detail-grid">
            {/* Product Images */}
            <div className="product-detail-images">
              <div className="details">
                <div className="big-img">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.ProductName}
                    className="main-image"
                  />
                </div>
              </div>
              <div className="thumbnail-grid">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.ProductName} ${index + 1}`}
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
                    <h2 className="product-title">{product.ProductName}</h2>
                    <span className="product-price">¢{product.Price}</span>
                    
                    {product.SellingType !== "BuyNow" && (
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
                    {quickBuy && product.SellingType === "BuyNow" ? (
                      <div className="checkout-modal">
                        <h3>Checkout</h3>
                        <p>Redirecting to checkout...</p>
                        <button onClick={() => setQuickBuy(false)}>Close</button>
                      </div>
                    ) : (
                      <>
                        {openBid && product.SellingType === "Auction" ? (
                          <div className="bid-modal">
                            <h3>Place Your Bid</h3>
                            <p>Current Price: ¢{product.Price}</p>
                            <div className="bid-input">
                              <input 
                                type="number" 
                                placeholder="Enter your bid amount"
                                min={product.Price + 1}
                              />
                              <button onClick={() => setOpenBid(false)}>Place Bid</button>
                            </div>
                            <button onClick={() => setOpenBid(false)}>Cancel</button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="buy-bid-btn" //replaced buy-bid-btn with card__button will need a general button component
                              onClick={() => handleBidBuy(product.SellingType)}
                            >
                              {product.SellingType !== "BuyNow" ? "BID" : "BUY NOW"}
                            </button>

                            {product.SellingType === "BuyNow" && (
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
            

            <div className="desc-rev-ven-pad">
              <div className="descSpecs-box">
                  <>
                    <div className="itemspecs">
                      <h4>Item Specifications</h4>
                      <div className="specs">
                        <ul>
                          <li>Condition: {product.Condition}</li>
                          <li>Type: {product.SellingType}</li>
                          <li>Category: {product.Category || 'General'}</li>
                          <li>Price: ¢{product.Price}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="itemdesc">
                      <h4>Description</h4>
                      <div className="desc">
                        <p>{product.Description}</p>
                      </div>
                    </div>
                  </>

                
              </div>
            </div>
          </div>
        </div>
        
        <MemberCard />

        <ListingRow 
          heading="Seller's Other Products" 
          tag="" 
          items={[]} // Replace with actual related products
          viewMoreLink="/products"/>
      </div>
    </div>
  )
} 