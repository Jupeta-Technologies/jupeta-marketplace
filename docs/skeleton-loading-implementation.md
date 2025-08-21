# Skeleton Loading Implementation

## Overview

This document outlines the comprehensive skeleton loading system implemented across the Jupeta Marketplace application. Skeleton loading provides users with a better loading experience by showing placeholders that mimic the actual content structure while data is being fetched.

## Architecture

### Core Components

#### 1. **Base Skeleton Component** (`/src/components/Shared/Skeleton.tsx`)
The foundation component that provides different skeleton variants with customizable properties.

**Features:**
- Multiple predefined variants (line, title, subtitle, badge, avatar, btn, custom)
- Customizable width, height, and border radius
- Uses existing CSS animations from `jupeta-ec-v1.global.scss`

**Usage:**
```tsx
import Skeleton from '@/components/Shared/Skeleton';

// Predefined variants
<Skeleton variant="title" />
<Skeleton variant="avatar" />
<Skeleton variant="btn" />

// Custom dimensions
<Skeleton width="200px" height="24px" borderRadius="12px" />
```

#### 2. **ItemCardSkeleton** (`/src/components/card/ItemCardSkeleton.tsx`)
Skeleton version of the ItemCard component with support for all variants.

**Variants:**
- `default`: Full-featured card with image, content, and actions
- `minimal`: Simplified card for grid layouts
- `compact`: Horizontal layout for lists
- `custom`: Configurable dimensions for special layouts

**Usage:**
```tsx
import ItemCardSkeleton from '@/components/card/ItemCardSkeleton';

<ItemCardSkeleton variant="minimal" />
<ItemCardSkeleton variant="custom" width={300} height={448} />
```

#### 3. **ListingRowSkeleton** (`/src/components/Shared/ListingRowSkeleton.tsx`)
Skeleton for product listing rows with configurable item count.

**Features:**
- Configurable number of skeleton cards
- Optional heading skeleton
- Responsive grid layout

**Usage:**
```tsx
import ListingRowSkeleton from '@/components/Shared/ListingRowSkeleton';

<ListingRowSkeleton itemCount={6} showHeading={true} />
```

#### 4. **FeaturedSellerSkeleton** (`/src/components/Shared/FeaturedSellerSkeleton.tsx`)
Skeleton for featured seller sections including seller info and products.

**Features:**
- Seller avatar and info placeholders
- Configurable product count
- Seller stats and description placeholders

#### 5. **ProductDetailSkeleton** (`/src/components/Shared/ProductDetailSkeleton.tsx`)
Comprehensive skeleton for product detail pages.

**Features:**
- Image gallery placeholders
- Product information structure
- Tabs and content sections
- Seller information
- Related products grid

#### 6. **AuthFormSkeleton** (`/src/components/auth/AuthFormSkeleton.tsx`)
Skeleton for authentication forms (login/register).

**Variants:**
- `login`: Login form structure
- `register`: Registration form with additional fields

## Implementation Locations

### 1. **Homepage** (`/src/app/page.tsx`)
```tsx
{productsLoading && (
  <div className="space-y-8">
    {/* Hero product skeletons */}
    <div className="grid-auto-fit-300 mb-8">
      <ItemCardSkeleton variant="minimal" />
      <ItemCardSkeleton variant="minimal" />
      <ItemCardSkeleton variant="minimal" />
      <ItemCardSkeleton variant="minimal" />
    </div>
    
    {/* Featured custom card skeleton */}
    <ItemCardSkeleton variant="custom" width={348} height={448} />
    
    {/* Main products grid skeleton */}
    <div className="grid-auto-fit-300 mb-8">
      <ItemCardSkeleton variant="custom" width={300} height={448} />
      <ItemCardSkeleton variant="custom" width={300} height={448} />
      <ItemCardSkeleton variant="custom" width={300} height={448} />
      <ItemCardSkeleton variant="custom" width={300} height={448} />
    </div>
    
    {/* Listing rows skeletons */}
    <ListingRowSkeleton itemCount={6} />
    
    {/* Featured seller skeleton */}
    <FeaturedSellerSkeleton itemCount={4} />
    
    {/* Additional listing rows */}
    <ListingRowSkeleton itemCount={6} />
    <ListingRowSkeleton itemCount={6} />
  </div>
)}
```

### 2. **Products Page** (`/src/app/products/page.tsx`)
```tsx
if (loading) {
  return (
    <div className="products-page" style={{ display: 'flex', gap: 24, marginTop: '50px' }}>
      {/* Sidebar skeleton */}
      <div style={{ width: '280px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div className="skeleton">
          {/* Filter sections */}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="products-container" style={{ flex: 1 }}>
        <div className="products-header mb-6">
          <div className="skeleton">
            <div className="sk-title mb-4"></div>
            <div className="sk-line w-40 h-10"></div>
          </div>
        </div>
        <div className="products-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <ItemCardSkeleton key={index} variant="default" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 3. **Search Results** (`/src/app/SearchResult/page.tsx`)
```tsx
{loading && (
  <div>
    <div className="skeleton mb-4">
      <div className="sk-title w-40 mb-2"></div>
      <div className="sk-line w-60"></div>
    </div>
    <div className="grid grid-cols-4" style={{gap:'14px', padding:'8px'}}>
      {Array.from({ length: 8 }).map((_, index) => (
        <ItemCardSkeleton key={index} variant="default" />
      ))}
    </div>
  </div>
)}
```

### 4. **Product Detail** (`/src/app/products/[id]/page.tsx`)
```tsx
if (loading) {
  return <ProductDetailSkeleton />
}
```

## CSS Foundation

The skeleton system uses existing CSS classes and animations defined in `/src/styles/jupeta-ec-v1.global.scss`:

### Key Classes:
- `.skeleton`: Main container class that enables skeleton mode
- `.sk`: Base skeleton element with gradient animation
- `.sk-title`, `.sk-subtitle`, `.sk-badge`, `.sk-line`, `.sk-avatar`, `.sk-btn`: Predefined element types
- `.w-60`, `.w-40`, `.w-30`, `.w-20`: Width utilities

### Animation:
```scss
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

.sk {
  background: linear-gradient(90deg, #f0f2f4 25%, #e5e7eb 37%, #f0f2f4 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
  border-radius: 6px;
}
```

## Best Practices

### 1. **Match Content Structure**
Skeleton layouts should closely mirror the actual content structure to avoid layout shifts when real content loads.

### 2. **Use Appropriate Variants**
Choose the right skeleton variant based on the layout context:
- Use `minimal` for grid layouts
- Use `compact` for list views
- Use `custom` for specific dimensions
- Use `default` for full-featured cards

### 3. **Consistent Loading States**
Maintain consistent loading times and patterns across similar components.

### 4. **Responsive Design**
Ensure skeleton components work across different screen sizes and breakpoints.

### 5. **Performance**
Skeleton components are lightweight and should not impact performance. Use CSS animations over JavaScript where possible.

## Future Enhancements

### 1. **Dynamic Skeleton Generation**
Implement a system that automatically generates skeletons based on component props or data structures.

### 2. **Skeleton Configuration**
Create a centralized configuration system for skeleton timing, colors, and animations.

### 3. **A/B Testing**
Implement different skeleton styles to test user experience and loading perception.

### 4. **Progressive Loading**
Implement progressive skeleton loading that shows different levels of detail as data becomes available.

## Testing

### Manual Testing
1. Navigate to each page with network throttling enabled
2. Verify skeleton components appear immediately
3. Confirm smooth transition to real content
4. Test on different screen sizes

### Automated Testing
```tsx
// Example test for skeleton component
import { render } from '@testing-library/react';
import ItemCardSkeleton from '@/components/card/ItemCardSkeleton';

test('renders skeleton with correct variant', () => {
  const { container } = render(<ItemCardSkeleton variant="minimal" />);
  expect(container.querySelector('.skeleton')).toBeInTheDocument();
});
```

## Conclusion

The skeleton loading system provides a comprehensive solution for improving perceived performance and user experience across the Jupeta Marketplace. The modular design allows for easy maintenance and extension while providing consistent behavior across the application.

**Key Benefits:**
- ✅ Improved perceived performance
- ✅ Better user experience during loading
- ✅ Reduced layout shift
- ✅ Consistent loading patterns
- ✅ Reusable and maintainable components
- ✅ Minimal performance impact
