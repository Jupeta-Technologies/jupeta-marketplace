import React from 'react';
import ItemCard from '@/components/card/ItemCard';
import { Product } from '@/types/api';

// Example product data for demonstration
const sampleProduct: Product = {
  id: '1',
  productName: 'Sample Product',
  price: 299.99,
  condition: 'New',
  sellingType: 'BuyNow',
  imageFileUrl: '/assets/images/electronics.png',
  productImages: [],
  description: 'This is a sample product description for demonstration purposes.',
  summary: 'Sample product summary',
  isAvailable: true,
  quantity: 1,
  category: 'Electronics',
  productImage: 'sample-product.jpg',
  imageFile: null,
  addedAt: new Date().toISOString(),
  modifiedOn: new Date().toISOString(),
  qty: 1,
  itemNumber: 5,
  selleId: "Seller-001"
  onAdd: () => {} // Mock function
};

const ItemCardExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">ItemCard Variants Demo</h2>
      
      {/* Default Card */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Default Card</h3>
        <div className="w-64">
          <ItemCard 
            prodData={sampleProduct}
            variant="default"
          />
        </div>
      </div>

      {/* Compact Card */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Compact Card</h3>
        <div className="w-48">
          <ItemCard 
            prodData={sampleProduct}
            variant="compact"
            showActions={false}
          />
        </div>
      </div>

      {/* Minimal Card - 300x448 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Minimal Card (300x448px)</h3>
        <ItemCard 
          prodData={sampleProduct}
          variant="minimal"
          showCondition={false}
          showFavorite={false}
          showActions={false}
        />
      </div>

      {/* Custom Dimensions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Custom Dimensions (200x300px)</h3>
        <ItemCard 
          prodData={sampleProduct}
          variant="custom"
          width={200}
          height={300}
          showCondition={false}
          showActions={false}
        />
      </div>

      {/* Custom Render Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Custom Render Function</h3>
        <ItemCard 
          prodData={sampleProduct}
          variant="custom"
          width={350}
          height={200}
          customRender={(product, elements) => (
            <div className="flex items-center p-4 h-full">
              <div className="w-32 h-32 flex-shrink-0">
                {elements.image}
              </div>
              <div className="ml-4 flex-grow">
                {elements.title}
                {elements.price}
                <div className="mt-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Quick Buy
                  </button>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {/* Grid of minimal cards */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Grid of Minimal Cards</h3>
        <div className="grid-auto-fit-300">
          {[1, 2, 3, 4].map(i => (
            <ItemCard 
              key={i}
              prodData={{
                ...sampleProduct,
                id: i.toString(),
                productName: `Product ${i}`,
                price: 99.99 * i
              }}
              variant="minimal"
              showCondition={false}
              showFavorite={false}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCardExamples;
