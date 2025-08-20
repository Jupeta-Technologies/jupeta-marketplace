'use client'

import React, { useState, useEffect } from 'react'
import { GetAllProdAPI } from '@/lib/api/GetAllProdAPI'
import { Product } from '@/types/api'
import ItemCardglobal from '@/components/card/ItemCard'
import ProductFilterSidebar from '@/components/ProductFilterSidebar';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await GetAllProdAPI();
        if (res.Code !== "0") {
          throw new Error('Failed to fetch products');
        }
        setProducts(res.ResponseData);
        // Set initial price range
        if (res.ResponseData.length > 0) {
          const prices = res.ResponseData.map((p: Product) => p.Price || 0);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setSelectedPriceRange([min, max]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get all unique categories from products
  const categories = Array.from(new Set(products.map(p => p.Category || ''))).filter(Boolean);
  // Get min/max price for all products
  const allPrices = products.map(p => p.Price || 0);
  const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length ? Math.max(...allPrices) : 10000;

  const filteredProducts = products.filter(product =>
    (product.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || product.Category === selectedCategory) &&
    (product.Price !== undefined && product.Price >= selectedPriceRange[0] && product.Price <= selectedPriceRange[1]) &&
    (selectedCondition === '' || (product.Condition && product.Condition.toLowerCase() === selectedCondition)) &&
    (selectedType === '' || (product.SellingType && product.SellingType.toLowerCase() === selectedType.replace(' ', '')))
  );

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page" style={{ display: 'flex', gap: 24, marginTop: '50px' }}>
      <ProductFilterSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={[minPrice, maxPrice]}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
        onReset={() => {
          setSelectedCategory('');
          setSelectedPriceRange([minPrice, maxPrice]);
          setSelectedCondition('');
          setSelectedType('');
        }}
        selectedCondition={selectedCondition}
        onConditionChange={setSelectedCondition}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />
      <div className="products-container" style={{ flex: 1 }}>
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
            <ItemCardglobal key={product.Id} prodData={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
} 