# Category Management System Documentation

## Overview
The category management system provides a comprehensive interface for creating, editing, and managing categories with flexible image handling and hero configuration options.

## 🚀 Features

### 1. **Flexible Image System**
- **URL Input**: Direct image URL entry
- **File Upload**: Upload images to server with automatic path generation
- **Static Selection**: Choose from existing assets in `/assets/images/`

### 2. **Hero Types**
Support for two distinct hero types:

#### **Static Heroes**
Traditional hero sections with:
- Title text
- Subtitle text  
- Background image (using same flexible image system)

#### **Component Heroes**
Dynamic hero components with:
- **Free Text Component Name**: Enter any component name (e.g., CarouselHero, AutoPromotionHero)
- **JSON Props**: Flexible JSON configuration for component properties
- **Common Components**: CarouselHero, HomepageInteractiveHero, ElectronicsDynamicHero, AutoPromotionHero, PersonalizedHomepageHero

### 3. **Category Management**
- **Create Categories**: Add new main categories or subcategories
- **Edit Categories**: Click-to-edit functionality with pre-filled forms
- **Hierarchical Display**: Visual tree structure showing parent-child relationships
- **Real-time Validation**: Form validation with helpful error messages

### 4. **Enhanced UI**
- **Visual Tree Structure**: Expandable/collapsible category hierarchy
- **Action Buttons**: Edit and view options for each category
- **Hero Type Indicators**: Visual indication of static vs component heroes
- **Responsive Design**: Works across different screen sizes

## 🔧 API Integration

### Endpoints Used
- `User/GetAllCategories` - Fetch existing categories
- `User/CreateCategory` - Create new categories  
- `User/UpdateCategory` - Update existing categories
- `User/UploadImage` - Upload category images

### Response Format
All APIs follow the standard format:
```json
{
  "Code": "0",
  "Message": "Success", 
  "ResponseData": {...}
}
```

## 📝 Usage Examples

### Creating a Static Hero Category
```json
{
  "Name": "Electronics",
  "Description": "Latest electronic devices",
  "Slug": "electronics",
  "Hero": {
    "title": "Cutting-Edge Electronics",
    "subtitle": "Explore the latest in tech innovations", 
    "image": "/assets/images/electronics_hero.jpg"
  }
}
```

### Creating a Component Hero Category  
```json
{
  "Name": "Automotive",
  "Description": "Car parts and accessories",
  "Slug": "automotive",
  "Hero": {
    "componentName": "AutoPromotionHero",
    "props": "{\"promoCode\": \"DRIVE25\", \"campaignId\": \"summer-2025\"}"
  }
}
```

### Creating a Custom Component Hero
```json
{
  "Name": "Special Deals",
  "Description": "Limited time offers",
  "Slug": "special-deals", 
  "Hero": {
    "componentName": "CustomPromotionBanner",
    "props": "{\"theme\": \"dark\", \"countdown\": true, \"endDate\": \"2025-12-31\"}"
  }
}
```

## 🎯 Component Hero Workflow

### 1. **Create/Edit Category**
- Select "Component Hero" radio button
- Enter component name in free text field (e.g., "CarouselHero", "CustomHero")
- Add component props in JSON format
- Validate and submit

### 2. **Component Props Examples**
```json
// Simple component (no props needed)
{}

// Carousel hero with settings
{
  "autoPlay": true,
  "interval": 5000,
  "showDots": true
}

// Promotion hero with campaign data
{
  "promoCode": "SAVE20",
  "campaignId": "black-friday-2025",
  "backgroundColor": "#ff6b35"
}

// Interactive hero with custom content
{
  "title": "Custom Title",
  "features": ["Free Shipping", "24/7 Support", "Easy Returns"],
  "ctaText": "Shop Now",
  "ctaLink": "/products"
}
```

### 3. **Component Hero Benefits**
- **Flexibility**: Create any custom component name
- **Dynamic Content**: Props allow runtime configuration
- **Reusability**: Same component with different props for different categories
- **Extensibility**: Easy to add new hero components without code changes

## 🎨 Form Features

### Dynamic Form Switching
- Form fields change based on hero type selection
- Real-time validation for both static and component heroes
- Context-aware error messages

### Edit Mode
- Click "Edit" button on any category in the tree
- Form pre-fills with existing category data
- Supports editing from main categories to subcategories
- Hero type automatically detected and form adjusted

### Image Handling
- Multiple input methods for maximum flexibility
- Automatic validation for URLs and file uploads
- Preview functionality for uploaded images
- Support for both category images and hero images

## ✅ Validation Rules

### Required Fields
- Category Name (max 100 characters)
- Image URL or file upload
- For main categories: Hero configuration
- For subcategories: Parent category selection

### Hero Validation
- **Static Heroes**: Title, subtitle, and image required
- **Component Heroes**: Component name required, valid JSON for props
- **JSON Props**: Must be valid JSON format or empty object

## 🔄 Step-by-Step Usage

### Creating a New Category
1. **Click** "Add New Category" button
2. **Select** category type (Main or Subcategory)
3. **Fill** basic information:
   - Name, slug, description
   - Image (URL, upload, or static)
4. **Choose** hero type (Static or Component)
5. **Configure** hero content:
   - Static: Title, subtitle, background image
   - Component: Component name and JSON props
6. **Submit** form

### Editing an Existing Category
1. **Browse** the category tree
2. **Click** "Edit" button on desired category
3. **Modify** fields as needed
4. **Update** hero configuration if required
5. **Save** changes

## 🚀 Future Enhancements

### Planned Features
- **Drag & Drop Reordering**: Change category display order
- **Bulk Operations**: Edit multiple categories at once
- **Advanced Filters**: Filter categories by type, status, etc.
- **Hero Preview**: Live preview of hero components
- **Image Cropping**: Built-in image editor for uploaded files
- **Category Templates**: Pre-defined category configurations

### Integration Possibilities
- **CMS Integration**: Connect with content management systems
- **Analytics**: Track category performance metrics
- **A/B Testing**: Test different hero configurations
- **Multi-language**: Support for international categories

## 🛠 Technical Details

### File Structure
```
src/
├── app/admin/categories/page.tsx      # Main management interface
├── lib/api/
│   ├── CreateCategoryAPI.tsx          # Category creation
│   ├── UpdateCategoryAPI.tsx          # Category updates
│   ├── GetAllCategoriesAPI.tsx        # Fetch categories
│   └── UploadImageAPI.tsx             # Image uploads
├── types/category.ts                  # Type definitions
└── styles/jupeta-ec-v1.global.scss    # Styling
```

### Key Components
- **CategoryManagement**: Main management interface
- **CategoryTreeItem**: Individual category display with actions
- **Form Handling**: Dynamic form with validation
- **API Integration**: RESTful API communication

This system provides a robust foundation for category management with flexibility for future enhancements and customizations.
