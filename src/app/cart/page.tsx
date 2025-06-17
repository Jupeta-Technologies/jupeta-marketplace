'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { products, total, removeFromcart, clearFromcart } = useCart()

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty.</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {products.map((item) => (
              <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.imageFileUrl || '/placeholder-product.jpg'}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                  <p className="text-blue-600 font-semibold">${item.price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFromcart(item)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => removeFromcart(item)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  <button
                    onClick={() => clearFromcart(item)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium text-center block mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 