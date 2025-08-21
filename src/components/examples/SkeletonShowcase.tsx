import React, { useState } from 'react';
import Skeleton from '../Shared/Skeleton';
import ItemCardSkeleton from '../card/ItemCardSkeleton';
import ListingRowSkeleton from '../Shared/ListingRowSkeleton';
import FeaturedSellerSkeleton from '../Shared/FeaturedSellerSkeleton';
import ProductDetailSkeleton from '../Shared/ProductDetailSkeleton';
import AuthFormSkeleton from '../auth/AuthFormSkeleton';

const SkeletonShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('base');

  const demos = [
    { id: 'base', label: 'Base Skeleton' },
    { id: 'itemcard', label: 'Item Card Skeleton' },
    { id: 'listing', label: 'Listing Row Skeleton' },
    { id: 'seller', label: 'Featured Seller Skeleton' },
    { id: 'detail', label: 'Product Detail Skeleton' },
    { id: 'auth', label: 'Auth Form Skeleton' },
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case 'base':
        return (
          <div className="skeleton space-y-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Base Skeleton Components</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 font-medium">Title Variant</p>
                <Skeleton variant="title" />
              </div>
              <div>
                <p className="mb-2 font-medium">Subtitle Variant</p>
                <Skeleton variant="subtitle" />
              </div>
              <div>
                <p className="mb-2 font-medium">Line Variant</p>
                <Skeleton variant="line" className="w-60" />
              </div>
              <div>
                <p className="mb-2 font-medium">Badge Variant</p>
                <Skeleton variant="badge" />
              </div>
              <div>
                <p className="mb-2 font-medium">Avatar Variant</p>
                <Skeleton variant="avatar" />
              </div>
              <div>
                <p className="mb-2 font-medium">Button Variant</p>
                <Skeleton variant="btn" />
              </div>
              <div>
                <p className="mb-2 font-medium">Custom Size</p>
                <Skeleton width="150px" height="30px" borderRadius="15px" />
              </div>
              <div>
                <p className="mb-2 font-medium">Custom Rectangle</p>
                <Skeleton width="200px" height="100px" borderRadius="8px" />
              </div>
            </div>
          </div>
        );

      case 'itemcard':
        return (
          <div className="space-y-6 p-6">
            <h3 className="text-lg font-semibold">Item Card Skeleton Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="mb-2 font-medium">Default Variant</p>
                <ItemCardSkeleton variant="default" />
              </div>
              <div>
                <p className="mb-2 font-medium">Minimal Variant</p>
                <ItemCardSkeleton variant="minimal" />
              </div>
              <div>
                <p className="mb-2 font-medium">Custom Variant</p>
                <ItemCardSkeleton variant="custom" width={250} height={350} />
              </div>
              <div>
                <p className="mb-2 font-medium">Compact Variant</p>
                <ItemCardSkeleton variant="compact" />
              </div>
            </div>
          </div>
        );

      case 'listing':
        return (
          <div className="space-y-6 p-6">
            <h3 className="text-lg font-semibold">Listing Row Skeleton</h3>
            <ListingRowSkeleton itemCount={4} />
          </div>
        );

      case 'seller':
        return (
          <div className="space-y-6 p-6">
            <h3 className="text-lg font-semibold">Featured Seller Skeleton</h3>
            <FeaturedSellerSkeleton itemCount={3} />
          </div>
        );

      case 'detail':
        return (
          <div className="space-y-6 p-6">
            <h3 className="text-lg font-semibold">Product Detail Skeleton</h3>
            <div className="max-w-6xl">
              <ProductDetailSkeleton />
            </div>
          </div>
        );

      case 'auth':
        return (
          <div className="space-y-6 p-6">
            <h3 className="text-lg font-semibold">Auth Form Skeletons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4 font-medium">Login Form Skeleton</p>
                <AuthFormSkeleton variant="login" />
              </div>
              <div>
                <p className="mb-4 font-medium">Register Form Skeleton</p>
                <AuthFormSkeleton variant="register" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="skeleton-showcase">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Navigation */}
        <div className="border-b">
          <div className="flex flex-wrap">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeDemo === demo.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="min-h-[400px] bg-gray-50">
          {renderDemo()}
        </div>

        {/* Info Panel */}
        <div className="bg-gray-100 p-4 border-t">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Skeleton Loading Showcase</p>
            <p>
              This showcase demonstrates all skeleton loading components available in the application. 
              Each skeleton mimics the structure of its corresponding real component to provide 
              smooth loading transitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonShowcase;
