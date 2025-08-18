# Auction Ending Soon Feature for ItemCard

The ItemCard component now supports showing an "Ending Soon" indicator for auction items that are close to their end time.

## Features

- **Automatic Detection**: Shows indicator only for items with `sellingType: 'Auction'`
- **Time-based Logic**: Displays when auction ends within a configurable threshold (default: 24 hours)
- **Real-time Countdown**: Shows remaining time in hours and minutes
- **Visual Design**: Eye-catching red gradient with pulse animation
- **Responsive**: Adapts to different screen sizes
- **Positioning**: Placed at top-right corner of the card

## Usage

### Basic Usage

```tsx
<ItemCard
  prodData={auctionProduct}
  auctionEndDate="2025-08-18T15:30:00Z"
/>
```

### Custom Threshold

```tsx
<ItemCard
  prodData={auctionProduct}
  auctionEndDate="2025-08-18T15:30:00Z"
  endingSoonThreshold={12} // Show "ending soon" when 12 hours or less remain
/>
```

### With Different Variants

```tsx
{/* Minimal variant */}
<ItemCard
  prodData={auctionProduct}
  variant="minimal"
  auctionEndDate="2025-08-18T15:30:00Z"
/>

{/* Custom size */}
<ItemCard
  prodData={auctionProduct}
  variant="custom"
  width={300}
  height={400}
  auctionEndDate="2025-08-18T15:30:00Z"
/>
```

## Props

### New Props Added

- `auctionEndDate?: string` - ISO date string of when the auction ends
- `endingSoonThreshold?: number` - Hours threshold for showing "ending soon" (default: 24)

### Updated Props

- `customRender` - Now includes `endingSoon` element in the provided elements object

## Logic

### When Does It Show?

1. **Selling Type**: Must be `'Auction'`
2. **End Date**: Must have `auctionEndDate` provided
3. **Time Remaining**: Must be within the threshold hours (default: 24 hours)
4. **Not Ended**: Auction must not have already ended

### Time Display

- **More than 1 hour**: Shows "2h 30m" format
- **Less than 1 hour**: Shows "45m" format
- **Ended**: Shows "Ended"

### Visual States

- **Ending Soon**: Red gradient background with pulse animation
- **Time Remaining**: Smaller text below "ENDING SOON"
- **Responsive**: Scales down on mobile devices

## Styling

### CSS Classes

- `.auctionEndingSoon` - Main container
- `.endingSoonText` - "ENDING SOON" text
- `.timeRemaining` - Time countdown text

### Animation

- `pulse-glow` keyframe animation creates subtle pulsing effect
- Scales slightly and changes box-shadow

### Colors

- Background: Red gradient (`#ff6b6b` to `#ee5a52`)
- Text: White
- Border: Semi-transparent white
- Shadow: Semi-transparent red

## Examples

### Multiple Auction States

```tsx
// Ending very soon (30 minutes)
<ItemCard
  prodData={product1}
  auctionEndDate={new Date(Date.now() + 30 * 60 * 1000).toISOString()}
/>

// Ending soon (2 hours)
<ItemCard
  prodData={product2}
  auctionEndDate={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()}
/>

// Not ending soon (2 days)
<ItemCard
  prodData={product3}
  auctionEndDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
/>

// Buy Now item (no indicator)
<ItemCard
  prodData={product4}
  // No auctionEndDate needed for BuyNow items
/>
```

### Custom Render with Ending Soon

```tsx
<ItemCard
  prodData={auctionProduct}
  auctionEndDate="2025-08-18T15:30:00Z"
  customRender={(product, elements) => (
    <div className="custom-auction-card">
      {elements.endingSoon}
      {elements.image}
      <div className="auction-info">
        {elements.title}
        {elements.price}
        <div className="bid-section">
          <button>Place Bid</button>
        </div>
      </div>
    </div>
  )}
/>
```

## Integration with APIs

When fetching auction data from your backend, ensure the API returns auction end dates:

```typescript
interface AuctionProduct extends Product {
  auctionEndDate?: string; // ISO date string
  currentBid?: number;
  bidCount?: number;
}
```

Then pass it to the component:

```tsx
{auctionProducts.map(product => (
  <ItemCard
    key={product.id}
    prodData={product}
    auctionEndDate={product.auctionEndDate}
  />
))}
```

## Responsive Behavior

- **Desktop**: Full size indicator with clear text
- **Tablet (≤768px)**: Slightly smaller with reduced padding
- **Mobile (≤480px)**: Minimal size while maintaining readability

## Accessibility

- High contrast colors for readability
- Clear text hierarchy
- Animation respects `prefers-reduced-motion` when implemented
- Semantic HTML structure

## Browser Support

- Modern browsers with CSS Grid support
- CSS custom properties (CSS variables)
- CSS animations and transforms
