import React from 'react';
import Skeleton from '../Shared/Skeleton';

interface ItemCardSkeletonProps {
  variant?: 'default' | 'compact' | 'minimal' | 'custom';
  width?: number;
  height?: number;
  className?: string;
}

const ItemCardSkeleton: React.FC<ItemCardSkeletonProps> = ({
  variant = 'default',
  width,
  height,
  className = ''
}) => {
  const getCardStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;
    return style;
  };

  const renderSkeletonContent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="skeleton" style={getCardStyle()}>
            <div className="item-card minimal">
              {/* Image placeholder */}
              <div className="item-image">
                <Skeleton width="100%" height="200px" borderRadius="12px" />
              </div>
              
              {/* Content */}
              <div className="item-content" style={{ padding: '12px' }}>
                {/* Title */}
                <Skeleton variant="title" className="mb-2" />
                
                {/* Price */}
                <div className="item-price mb-2">
                  <Skeleton width="80px" height="18px" />
                </div>
                
                {/* Condition badge */}
                <Skeleton variant="badge" />
              </div>
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="skeleton" style={getCardStyle()}>
            <div className="item-card compact">
              <div className="flex gap-3">
                {/* Small image */}
                <Skeleton width="80px" height="80px" borderRadius="8px" />
                
                {/* Content */}
                <div className="flex-1">
                  <Skeleton variant="title" className="mb-1" />
                  <Skeleton variant="subtitle" className="mb-2" />
                  <Skeleton width="60px" height="16px" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div className="skeleton" style={getCardStyle()}>
            <div className="item-card custom">
              {/* Large image */}
              <div className="item-image">
                <Skeleton 
                  width="100%" 
                  height={height ? `${height * 0.6}px` : "250px"} 
                  borderRadius="12px" 
                />
              </div>
              
              {/* Content */}
              <div className="item-content" style={{ padding: '16px' }}>
                {/* Title */}
                <Skeleton variant="title" className="mb-2" />
                
                {/* Description lines */}
                <div className="mb-3">
                  <Skeleton variant="line" className="w-60 mb-1" />
                  <Skeleton variant="line" className="w-40" />
                </div>
                
                {/* Price and condition */}
                <div className="flex justify-between items-center mb-3">
                  <Skeleton width="100px" height="20px" />
                  <Skeleton variant="badge" />
                </div>
                
                {/* Action button */}
                <Skeleton variant="btn" width="100%" />
              </div>
            </div>
          </div>
        );

      default: // 'default'
        return (
          <div className="skeleton" style={getCardStyle()}>
            <div className="item-card">
              {/* Image placeholder */}
              <div className="item-image">
                <Skeleton width="100%" height="200px" borderRadius="12px" />
                
                {/* Favorite icon placeholder */}
                <div className="absolute top-3 right-3">
                  <Skeleton width="24px" height="24px" borderRadius="50%" />
                </div>
              </div>
              
              {/* Content */}
              <div className="item-content" style={{ padding: '16px' }}>
                {/* Title */}
                <Skeleton variant="title" className="mb-2" />
                
                {/* Subtitle/description */}
                <Skeleton variant="subtitle" className="mb-3" />
                
                {/* Price and condition row */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <Skeleton width="80px" height="18px" className="mb-1" />
                    <Skeleton variant="badge" />
                  </div>
                  <Skeleton width="60px" height="14px" />
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  <Skeleton variant="btn" className="flex-1" />
                  <Skeleton width="40px" height="32px" borderRadius="8px" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`item-card-skeleton ${className}`}>
      {renderSkeletonContent()}
    </div>
  );
};

export default ItemCardSkeleton;
