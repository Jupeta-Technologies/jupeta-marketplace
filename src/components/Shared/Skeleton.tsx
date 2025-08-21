import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'line' | 'title' | 'subtitle' | 'badge' | 'avatar' | 'btn' | 'custom';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'custom'
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'line':
        return 'sk-line';
      case 'title':
        return 'sk-title';
      case 'subtitle':
        return 'sk-subtitle';
      case 'badge':
        return 'sk-badge';
      case 'avatar':
        return 'sk-avatar';
      case 'btn':
        return 'sk-btn';
      default:
        return 'sk';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  if (borderRadius) style.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <div 
      className={`${getVariantClass()} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
