import React from 'react';
import Skeleton from './Skeleton';

interface ProductDetailSkeletonProps {
  className?: string;
}

const ProductDetailSkeleton: React.FC<ProductDetailSkeletonProps> = ({
  className = ''
}) => {
  return (
    <div className={`product-detail-skeleton ${className}`}>
      <div className="skeleton">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Skeleton width="60px" height="16px" />
            <span className="text-gray-400">/</span>
            <Skeleton width="80px" height="16px" />
            <span className="text-gray-400">/</span>
            <Skeleton width="120px" height="16px" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery Skeleton */}
          <div>
            {/* Main image */}
            <div className="mb-4">
              <Skeleton width="100%" height="400px" borderRadius="12px" />
            </div>
            
            {/* Thumbnail images */}
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton 
                  key={index}
                  width="80px" 
                  height="80px" 
                  borderRadius="8px"
                  className="flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div>
            {/* Title */}
            <Skeleton variant="title" width="300px" className="mb-2" />
            
            {/* Rating and reviews */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} width="16px" height="16px" />
                ))}
              </div>
              <Skeleton width="80px" height="16px" />
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <Skeleton width="120px" height="32px" className="mb-2" />
              <Skeleton width="80px" height="16px" />
            </div>
            
            {/* Condition and category */}
            <div className="flex gap-4 mb-6">
              <div>
                <Skeleton variant="subtitle" width="60px" className="mb-1" />
                <Skeleton variant="badge" />
              </div>
              <div>
                <Skeleton variant="subtitle" width="80px" className="mb-1" />
                <Skeleton variant="badge" />
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <Skeleton variant="subtitle" width="60px" className="mb-2" />
              <Skeleton width="120px" height="40px" borderRadius="8px" />
            </div>
            
            {/* Action buttons */}
            <div className="space-y-3 mb-6">
              <Skeleton variant="btn" width="100%" height="48px" />
              <Skeleton variant="btn" width="100%" height="48px" />
            </div>
            
            {/* Quick info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton width="20px" height="20px" />
                <Skeleton width="150px" height="16px" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton width="20px" height="20px" />
                <Skeleton width="180px" height="16px" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton width="20px" height="20px" />
                <Skeleton width="120px" height="16px" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mb-8">
          <div className="flex border-b mb-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton 
                key={index}
                width="100px" 
                height="40px" 
                className="mr-4"
              />
            ))}
          </div>
          
          {/* Tab content */}
          <div className="space-y-3">
            <Skeleton variant="line" className="w-60" />
            <Skeleton variant="line" className="w-40" />
            <Skeleton variant="line" className="w-30" />
            <Skeleton variant="line" className="w-60" />
          </div>
        </div>

        {/* Seller info skeleton */}
        <div className="border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton variant="avatar" width="60px" height="60px" borderRadius="50%" />
            <div className="flex-1">
              <Skeleton variant="title" width="150px" className="mb-2" />
              <div className="flex gap-4">
                <Skeleton width="80px" height="14px" />
                <Skeleton width="100px" height="14px" />
              </div>
            </div>
            <Skeleton variant="btn" width="100px" />
          </div>
          
          <div className="space-y-2">
            <Skeleton variant="line" className="w-60" />
            <Skeleton variant="line" className="w-40" />
          </div>
        </div>

        {/* Related products section skeleton */}
        <div>
          <Skeleton variant="title" width="200px" className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton width="100%" height="200px" borderRadius="8px" className="mb-4" />
                <Skeleton variant="title" className="mb-2" />
                <Skeleton width="80px" height="18px" className="mb-2" />
                <Skeleton variant="badge" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
