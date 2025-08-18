# Polymorphic ItemCard Component

The `ItemCard` component has been enhanced to be polymorphic, allowing it to adapt to different display modes and use cases while maintaining a consistent API.

## Features

- **Multiple Variants**: Default, compact, minimal, and custom variants
- **Flexible Dimensions**: Custom width and height support
- **Conditional Elements**: Show/hide specific card elements
- **Custom Rendering**: Complete control over card content layout
- **Responsive Design**: Built-in responsive breakpoints

## Usage Examples

### Basic Usage (Default Card)

```tsx
import ItemCard from '@/components/card/ItemCard';

<ItemCard prodData={product} />
```

### Minimal Card (300x448px)

Perfect for grid layouts where you want a clean, focused display:

```tsx
<ItemCard 
  prodData={product}
  variant="minimal"
  showCondition={false}
  showFavorite={false}
  showActions={false}
/>
```

### Compact Card

Great for sidebar recommendations or smaller spaces:

```tsx
<ItemCard 
  prodData={product}
  variant="compact"
  showActions={false}
/>
```

### Custom Dimensions

```tsx
<ItemCard 
  prodData={product}
  variant="custom"
  width={300}
  height={448}
  showCondition={false}
/>
```

### Custom Render Function

For complete control over the card layout:

```tsx
<ItemCard 
  prodData={product}
  variant="custom"
  width={400}
  height={200}
  customRender={(product, elements) => (
    <div className="flex items-center p-4">
      <div className="w-32 h-32">
        {elements.image}
      </div>
      <div className="ml-4">
        {elements.title}
        {elements.price}
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Custom Action
        </button>
      </div>
    </div>
  )}
/>
```

## Props Reference

### Required Props

- `prodData: Product` - The product data to display

### Optional Props

- `variant?: 'default' | 'compact' | 'minimal' | 'custom'` - Card layout variant (default: 'default')
- `width?: number` - Custom width in pixels
- `height?: number` - Custom height in pixels
- `showCondition?: boolean` - Show/hide condition tag (default: true)
- `showFavorite?: boolean` - Show/hide favorite icon (default: true)
- `showPrice?: boolean` - Show/hide price (default: true)
- `showActions?: boolean` - Show/hide action buttons (default: true)
- `showDescription?: boolean` - Show/hide product description (default: false)
- `className?: string` - Additional CSS classes
- `onClick?: (product: Product) => void` - Custom click handler
- `customRender?: (product, elements) => ReactNode` - Custom render function

## Card Variants

### Default Variant
- Full-featured card with all elements
- Responsive design
- Hover effects and animations
- Product actions included

### Compact Variant
- Smaller form factor
- Reduced spacing
- Simplified layout
- Good for sidebars and recommendations

### Minimal Variant (300x448px)
- Clean, focused design
- Large image display
- Centered text
- Perfect for product grids
- No clutter - only essential information

### Custom Variant
- Use with custom dimensions
- Flexible styling
- Can be combined with customRender for complete control

## CSS Classes

The component uses these CSS classes that you can style:

- `.card` - Default variant
- `.card-compact` - Compact variant
- `.card-minimal` - Minimal variant (300x448px)
- `.card-custom` - Custom variant
- `.card__imagebox` - Image container
- `.card__img` - Product image
- `.card__title` - Product name
- `.card__price` - Price display
- `.card__description` - Product description
- `.itemConditionTag` - Condition badge
- `.favoriteIcon` - Favorite heart icon

## Responsive Behavior

All variants include responsive breakpoints:

- **Mobile (≤480px)**: Reduced dimensions and font sizes
- **Tablet (≤768px)**: Medium adjustments
- **Desktop (>768px)**: Full sizing

## Custom Render Elements

When using the `customRender` prop, you have access to these pre-built elements:

- `elements.image` - Product image with proper styling
- `elements.title` - Product name
- `elements.price` - Formatted price (if showPrice is true)
- `elements.condition` - Condition tag (if showCondition is true)
- `elements.favorite` - Favorite heart icon (if showFavorite is true)
- `elements.actions` - Product action buttons (if showActions is true)

## Migration from Old ItemCard

The new ItemCard is backward compatible. Existing usage will continue to work:

```tsx
// Old usage (still works)
<ItemCardglobal prodData={product} />

// New equivalent
<ItemCard prodData={product} variant="default" />
```

## Best Practices

1. **Use minimal variant for product grids** - Clean and consistent
2. **Use compact variant for recommendations** - Space-efficient
3. **Use custom variant with customRender for unique layouts** - Full control
4. **Set appropriate showX props** - Only display what's needed
5. **Consider responsive design** - Test on different screen sizes
