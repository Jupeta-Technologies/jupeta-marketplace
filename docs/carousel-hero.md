# Carousel Hero Component

The Carousel Hero component provides an auto-rotating hero section with multiple slides, navigation controls, and customizable content.

## Features

- **Auto-play**: Automatically transitions between slides
- **Navigation**: Arrow buttons and dot indicators for manual navigation
- **Responsive**: Mobile-friendly design with touch controls
- **Customizable**: Configurable slides, timing, and display options
- **Pause on Hover**: Auto-play pauses when user hovers over the carousel
- **Smooth Transitions**: Uses the existing hero content context for seamless updates

## Usage

### Basic Implementation

To use the carousel hero in your category configuration:

```typescript
// In your category configuration
const heroConfig = {
  componentName: 'CarouselHero',
  props: {
    autoPlay: true,
    autoPlayInterval: 5000,
    showDots: true,
    showArrows: true,
  }
};
```

### Custom Slides

You can provide custom slides with the `slides` prop:

```typescript
const customSlides = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 70% off on all items',
    image: summerSaleImage,
    customComponent: {
      componentName: 'SellButton',
      props: { variant: 'primary' }
    }
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Check out the latest products',
    image: newArrivalsImage,
  },
  // Add more slides...
];

const heroConfig = {
  componentName: 'CarouselHero',
  props: {
    slides: customSlides,
    autoPlay: true,
    autoPlayInterval: 4000,
  }
};
```

### Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | `CarouselSlide[]` | Default slides | Array of slide objects |
| `autoPlay` | `boolean` | `true` | Enable/disable auto-play |
| `autoPlayInterval` | `number` | `5000` | Time between slides (ms) |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `showArrows` | `boolean` | `true` | Show navigation arrows |

### Slide Object Structure

```typescript
interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: StaticImageData;
  customComponent?: {
    componentName: string;
    props?: any;
  };
}
```

## Default Slides

The carousel comes with 5 default slides showcasing different product categories:

1. **Welcome Slide** - General marketplace introduction
2. **Electronics** - Latest gadgets and tech
3. **Fashion** - Trendy clothes and accessories
4. **Automotive** - Vehicle parts and accessories  
5. **Home & Garden** - Living space transformation

## Controls

- **Navigation Arrows**: Click left/right arrows to manually navigate
- **Dot Indicators**: Click dots to jump to specific slides
- **Auto-play**: Automatically advances every 5 seconds (configurable)
- **Hover Pause**: Auto-play pauses when hovering over the carousel
- **Slide Counter**: Shows current slide position (e.g., "3 / 5")

## Responsive Design

The carousel is fully responsive:

- **Desktop**: Full-size controls and indicators
- **Mobile**: Smaller controls, optimized for touch interaction
- **Touch Support**: Swipe gestures supported on mobile devices

## Integration with Hero System

The carousel integrates seamlessly with the existing hero content system:

1. **Updates Context**: Each slide updates the `HeroContent` context
2. **Custom Components**: Supports custom components within slides
3. **Consistent Rendering**: Uses the same hero display system as other components
4. **Lazy Loading**: Component is lazy-loaded for optimal performance

## Example: Homepage Carousel

```typescript
// In your homepage category data
export const homepageHero = {
  componentName: 'CarouselHero',
  props: {
    autoPlay: true,
    autoPlayInterval: 6000,
    showDots: true,
    showArrows: true,
    slides: [
      {
        id: 1,
        title: 'Welcome to Jupeta',
        subtitle: 'Your premier marketplace destination',
        image: heroMainImage,
        customComponent: {
          componentName: 'SellButton',
          props: { text: 'Start Shopping' }
        }
      },
      // Additional slides...
    ]
  }
};
```

This carousel hero component provides a dynamic and engaging way to showcase multiple promotions, categories, or featured content in your marketplace hero section.
