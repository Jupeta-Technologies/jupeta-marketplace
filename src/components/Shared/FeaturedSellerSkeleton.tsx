import React from 'react';
import Skeleton from './Skeleton';
import ItemCardSkeleton from '../card/ItemCardSkeleton';

interface FeaturedSellerSkeletonProps {
  itemCount?: number;
  className?: string;
}

const FeaturedSellerSkeleton: React.FC<FeaturedSellerSkeletonProps> = ({
  itemCount = 4,
  className = ''
}) => {
  return (
    <div className={`featured-seller-skeleton ${className}`}>
      <div className="skeleton">
        {/* Featured seller header */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Seller avatar */}
            <Skeleton variant="avatar" width="80px" height="80px" borderRadius="50%" />
            
            <div className="flex-1">
              {/* Seller name */}
              <Skeleton variant="title" width="150px" className="mb-2" />
              
              {/* Seller stats */}
              <div className="flex gap-4">
                <Skeleton width="80px" height="14px" />
                <Skeleton width="100px" height="14px" />
                <Skeleton width="90px" height="14px" />
              </div>
            </div>
            
            {/* Follow button */}
            <Skeleton variant="btn" width="100px" />
          </div>
          
          {/* Seller description */}
          <div className="space-y-2">
            <Skeleton variant="line" className="w-60" />
            <Skeleton variant="line" className="w-40" />
          </div>
        </div>
        
        {/* Featured seller products */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton variant="subtitle" width="180px" />
            <Skeleton variant="btn" width="80px" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: itemCount }).map((_, index) => (
              <ItemCardSkeleton 
                key={index}
                variant="minimal"
                className="w-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSellerSkeleton;
