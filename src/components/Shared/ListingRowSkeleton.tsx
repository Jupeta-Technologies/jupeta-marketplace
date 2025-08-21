import React from 'react';
import Skeleton from '../Shared/Skeleton';
import ItemCardSkeleton from '../card/ItemCardSkeleton';

interface ListingRowSkeletonProps {
  itemCount?: number;
  showHeading?: boolean;
  className?: string;
}

const ListingRowSkeleton: React.FC<ListingRowSkeletonProps> = ({
  itemCount = 6,
  showHeading = true,
  className = ''
}) => {
  return (
    <div className={`listing-row-skeleton ${className}`}>
      <div className="skeleton">
        {/* Header */}
        {showHeading && (
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton variant="title" width="200px" className="mb-2" />
              <Skeleton variant="subtitle" width="120px" />
            </div>
            <Skeleton variant="btn" width="100px" />
          </div>
        )}
        
        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
  );
};

export default ListingRowSkeleton;
