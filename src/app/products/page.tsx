'use client'

import React, { useState, useEffect } from 'react'
import { GetAllProdAPI } from '@/lib/api/GetAllProdAPI'
import { Product } from '@/types/api'
import ItemCardglobal from '@/components/card/ItemCard'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await GetAllProdAPI()
        if (res.code !== "0") {
          throw new Error('Failed to fetch products')
        }
        setProducts(res.responseData)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>All Products</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ItemCardglobal key={product.id} prodData={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
} 