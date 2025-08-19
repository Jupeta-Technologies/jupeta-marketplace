# Category Management System

## Overview
A comprehensive category management sys3. **Fill in** required fields:
   - Category Name *
   - Description *
   - Image URL *
   - Hero Type * (Static or Component)
   - Meta Title *
   - Meta Description *
   - Display Order *
4. **Configure Hero Content**:
   - **Static Hero**: Enter title, subtitle, and background image URL
   #### **3. Component Hero Support**
- **Component Selection**: Dropdown with available components:
  - HomepageInteractiveHero
  - ElectronicsDynamicHero
  - AutoPromotionHero
  - PersonalizedHomepageHero
  - **CarouselHero** (like your example)
  - **🎯 Custom Component Entry**: Enter any custom component name
- **Custom Components**: If your component isn't listed, select "Enter Custom Component Name" and type it manually
- **Props Configuration**: JSON input for component props
- **Structure**: Creates `{componentName, props}` object
5. **Optional** fields:
   - Parent Category (for subcategories)
6. **Click** "Create Category"Jupeta Marketplace with full CRUD functionality and a professional admin interface.

## Features

### 🎯 **Core Functionality**
- **Create Categories**: Full category creation with hero content and SEO metadata
- **Hierarchical Structure**: Support for parent-child category relationships
- **Visual Management**: Tree view of existing categories with expand/collapse
- **API Integration**: Full integration with `User/CreateCategory` endpoint

### 🛠 **Technical Implementation**

#### **API Integration** 
- **Endpoint**: `/User/CreateCategory`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Authentication**: Includes credentials via `withCredentials: true`

#### **Request Structure**
```json
{
  "Name": "string",
  "Description": "string", 
  "ParentId": "string",        // Optional - for subcategories
  "ImageUrl": "string",
  "Hero": {
    // For Static Hero:
    "title": "string",         // Hero section title
    "subtitle": "string",      // Hero section subtitle
    "image": "string"          // Hero background image URL
    
    // OR for Component Hero:
    "componentName": "string", // Component name (e.g., "CarouselHero")
    "props": "string"         // JSON string of component props
  },
  "MetaTitle": "string",       // SEO title (50-60 chars recommended)
  "MetaDescription": "string", // SEO description (150-160 chars recommended)
  "DisplayOrder": 0            // Sort order number
}
```

#### **Response Handling**
- **Success**: `200-299` status codes with category data
- **Error Handling**: Field-specific validation errors
- **Network Errors**: Graceful handling of connectivity issues

### 🎨 **User Interface**

#### **Admin Layout**
- **Sidebar Navigation**: Easy access to all admin functions
- **Responsive Design**: Works on desktop and mobile
- **Dashboard**: Overview of recent activity

#### **Category Form**
- **Four-Section Layout**: 
  - Basic Information (name, description, parent, display order)
  - Visual Content (images, hero type selection, hero content)
  - SEO Information (meta title, meta description)
- **Hero Type Selection**: Choose between Static Hero or Component Hero
- **Dynamic Form Fields**: Form adapts based on selected hero type
- **Real-time Validation**: Immediate feedback on form errors including JSON validation
- **Loading States**: Visual feedback during API calls

#### **Category Tree**
- **Expandable Hierarchy**: Visual representation of category structure
- **Category Details**: Shows ID, name, and slug for each category
- **Indented Display**: Clear parent-child relationships

### 🚀 **Getting Started**

#### **Access the Admin Panel**
1. **Login** to your account
2. **Navigate** to user menu (profile icon)
3. **Click** "Admin Panel" 
4. **Go to** "Categories" section

#### **Create a New Category**
1. **Click** "Create New Category" button
2. **Choose Category Type**:
   - **Main Category**: Full-featured category with hero section and SEO data
   - **Subcategory**: Simple category under a main category (no hero section)
3. **Fill in** required fields:
   - Category Name *
   - Description *
   - Image * (choose URL, upload file, or select static image)
   - **For Main Categories**: Hero Type *, Meta Title *, Meta Description *
   - **For Subcategories**: Parent Category * (select from main categories)
   - Display Order *
4. **Configure Hero Content** (Main Categories Only):
   - **Static Hero**: Enter title, subtitle, and background image (URL, upload, or static)
   - **Component Hero**: 
     - Select component from dropdown OR choose "Enter Custom Component Name"
     - For custom components: Enter exact component name (e.g., "MySpecialHero")
     - Configure component props in JSON format
5. **Optional** fields:
   - Parent Category (for subcategories)
5. **Click** "Create Category"

#### **Example Category Data**
```javascript
// Static Hero Category Example
{
  name: "Electronics",
  description: "Latest electronic devices and gadgets",
  imageUrl: "https://example.com/electronics.jpg",
  heroType: "static",
  heroTitle: "Cutting-Edge Electronics", 
  heroSubtitle: "Discover the future of technology",
  heroImage: "https://example.com/electronics-hero.jpg",
  metaTitle: "Electronics - Latest Tech & Gadgets | Jupeta",
  metaDescription: "Shop the latest electronics, smartphones, laptops, and tech gadgets with fast delivery and great prices.",
  displayOrder: 1
}

// Component Hero Category Example
{
  name: "Home",
  description: "Homepage category with dynamic carousel",
  imageUrl: "https://example.com/home.jpg",
  heroType: "component",
  heroComponentName: "CarouselHero",
  heroComponentProps: '{}', // No props needed
  metaTitle: "Jupeta Marketplace - Your Shopping Destination",
  metaDescription: "Discover amazing products across all categories with our dynamic homepage experience.",
  displayOrder: 0
}
```

## 🖼️ **Flexible Image System**

### **Image Input Types**
The system supports three ways to add images for both category thumbnails and hero backgrounds:

#### **1. URL Input**
- Enter any valid image URL
- Format: `https://example.com/image.jpg`
- Best for: External images, CDN resources

#### **2. File Upload**
- Upload images directly from your computer
- **Supported formats**: JPEG, JPG, PNG, WebP, SVG
- **File size limit**: 5MB maximum
- **Auto-naming**: Files are automatically renamed with timestamp prefix
- **Upload folders**: 
  - Category images → `/assets/images/categories/`
  - Hero images → `/assets/images/heroes/`

#### **3. Static Image Selection**
- Choose from existing images in `/assets/images/`
- **Available images**:
  - `home_2.png`, `home.jpg`, `home_1.png`, `home_20.jpg`
  - `electronics.png`, `electroic_hero.jpg`
  - `auto_hero.jpg`, `auto_1.png`, `auto_2.png`
  - `fashion_hero.png`, `fashion_1.png`
  - `hp_hero.jpeg`, `hp_hero2.jpeg`, `hp_hero3.png`
  - `laptop.jpg`, `lenovo.jpg`, `beats.jpg`, `led-speaker.jpg`
- **Format**: `/assets/images/filename.ext`

### **Image Preview & Validation**
- **Real-time preview**: See image immediately after selection/upload
- **Path display**: Shows the final path that will be used
- **Error handling**: Invalid files are rejected with helpful messages
- **Loading states**: Upload progress indicators during file uploads

### **Usage Examples**

#### **Using URL:**
```javascript
imageType: 'url'
imageUrl: 'https://example.com/category-electronics.jpg'
```

#### **Using File Upload:**
```javascript
imageType: 'upload'
imageFile: File object
imageUrl: '/assets/images/categories/1692307200000_electronics.jpg' // Auto-generated
```

#### **Using Static Image:**
```javascript
imageType: 'static'
staticImagePath: '/assets/images/electronics.png'
imageUrl: '/assets/images/electronics.png'
```

## ✅ **API Integration Complete**

### **✨ Live API Integration**
Your category management system now **fetches live data** from:
- **Endpoint**: `User/GetAllCategories` 
- **Response Format**: Matches your exact API structure
- **Live Categories**: Electronics, Home & Kitchen (as shown in your API response)

### **🎯 Real API Response Handling**
```javascript
// Your actual API response structure
{
  "Code": "0",
  "Message": "Success", 
  "ResponseData": [
    {
      "Id": "68a3cf0d8144ef1bfca09727",
      "Name": "Electronics",
      "Hero": { "additionalProp1": "string" },
      "MetaTitle": "string",
      "ParentId": "",
      "Children": [],
      "IsRootCategory": true
      // ... all other fields
    }
  ]
}
```

### **🔄 Complete Workflow**
1. **Fetch**: Automatically loads from `User/GetAllCategories`
2. **Display**: Shows hierarchical category tree with your actual data
3. **Create**: Supports both main categories and subcategories
4. **Refresh**: Auto-updates after successful creation

### **Category Types**

#### **Main Categories (with Hero)**
- **Purpose**: Top-level categories with full hero sections
- **Features**: Hero content (static OR component), SEO metadata, can have subcategories
- **API Structure**: Includes Hero object with flexible content
- **Parent**: `ParentId: null`

**Static Hero Example:**
```javascript
// Main Category with Static Hero
{
  "name": "Electronics",
  "description": "Latest electronic devices and gadgets",
  "parentId": null,
  "imageUrl": "https://example.com/electronics.jpg",
  "Hero": {
    "title": "Cutting-Edge Electronics",
    "subtitle": "Explore the latest in tech innovations", 
    "image": "https://example.com/electronics-hero.jpg"
  },
  "metaTitle": "Electronics - Latest Tech & Gadgets",
  "metaDescription": "Shop the latest electronics...",
  "displayOrder": 1
}
```

**Component Hero Example:**
```javascript
// Main Category with Component Hero
{
  "name": "Home",
  "description": "Homepage category",
  "parentId": null,
  "imageUrl": "https://example.com/home.jpg",
  "Hero": {
    "componentName": "CarouselHero",
    "props": "{\"autoRotate\": true, \"interval\": 5000}"
  },
  "metaTitle": "Home - Jupeta Marketplace",
  "metaDescription": "Welcome to Jupeta Marketplace...",
  "displayOrder": 0
}
```

**Available Hero Components:**
- `CarouselHero` - Multi-slide hero carousel
- `HomepageInteractiveHero` - Interactive homepage hero
- `ElectronicsDynamicHero` - Electronics category hero
- `AutoPromotionHero` - Automotive promotion hero  
- `PersonalizedHomepageHero` - Personalized content hero

#### **Subcategories (no Hero)**
- **Purpose**: Categories under main categories
- **Features**: Basic category info only, no hero or SEO data
- **API Structure**: Simple structure without hero fields
- **Parent**: `parentId: "main_category_id"`

```javascript
// Subcategory Example
{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "parentId": "electronics_category_id",
  "imageUrl": "https://example.com/smartphones.jpg",
  "displayOrder": 1
}
```

### **🎯 Complete Hero Type Workflow**

**Creating Static Hero Category:**
1. Select "Main Category (with Hero Section)"
2. Choose "Static Content (Title, Subtitle, Image)"
3. Fill in hero title, subtitle, and image URL
4. Add SEO metadata
5. Submit to API

**Creating Component Hero Category:**
1. Select "Main Category (with Hero Section)" 
2. Choose "Dynamic Component"
3. Select component from dropdown (e.g., "CarouselHero")
4. Add JSON props (optional): `{"autoRotate": true, "interval": 5000}`
5. Add SEO metadata
6. Submit to API

**Component Props Examples:**
```javascript
// CarouselHero
{"autoRotate": true, "interval": 5000, "showDots": true}

// AutoPromotionHero  
{"promoCode": "DRIVEFAST", "campaignId": "summer-2025"}

// PersonalizedHomepageHero
{"userId": "{{userId}}", "recommendations": true}

// No props needed
{}
```

### **Auto-Refresh**
- Categories list automatically refreshes after successful creation
- Real-time updates when new categories are added
- Loading states during API calls
- Error handling with retry functionality

// Component Hero with Props Example
{
  name: "Automotive",
  description: "Cars, parts, and automotive accessories",
  imageUrl: "https://example.com/automotive.jpg",
  heroType: "component", 
  heroComponentName: "AutoPromotionHero",
  heroComponentProps: '{"promoCode": "DRIVEFAST", "campaignId": "summer-2025"}',
  metaTitle: "Automotive - Cars & Parts | Jupeta",
  metaDescription: "Find the best deals on cars, automotive parts, and accessories with special promotions.",
  displayOrder: 3
}

// Component Hero with Custom Component Example
{
  name: "Special Promotions",
  description: "Special promotional categories with custom hero",
  imageUrl: "https://example.com/promo.jpg",
  heroType: "component", 
  heroComponentName: "MyCustomPromoHero", // Custom component not in dropdown
  heroComponentProps: '{"discount": 50, "endDate": "2025-12-31", "theme": "winter"}',
  metaTitle: "Special Promotions - Limited Time Offers | Jupeta",
  metaDescription: "Don't miss our special promotional offers with custom dynamic content.",
  displayOrder: 0
}

// Subcategory Example  
{
  name: "Smartphones",
  description: "Latest smartphone models from top brands",
  parentId: "electronics-category-id",
  imageUrl: "https://example.com/smartphones.jpg",
  heroType: "static",
  heroTitle: "Latest Smartphones",
  heroSubtitle: "Stay connected with the newest models", 
  metaTitle: "Smartphones - Latest Models | Jupeta Electronics",
  metaDescription: "Browse the newest smartphones from Apple, Samsung, Google and more with competitive prices.",
  displayOrder: 1
}
```

### 🔧 **Error Handling**

#### **Common Validation Errors**
- **Required Fields**: Name, Description, Image URL, Hero Type, Meta Title, Meta Description
- **Component Hero**: Component name required when hero type is "component"
- **JSON Format**: Component props must be valid JSON format
- **Display Order**: Must be 0 or greater
- **URL Validation**: Image URLs must be valid format

#### **API Error Responses**
- **Field Errors**: Displayed inline with specific field
- **Server Errors**: General error notification with details
- **Network Errors**: Connection-specific error messages

#### **User Feedback**
- **Success**: Green notification with checkmark
- **Error**: Red notification with close button
- **Loading**: Spinner with "Creating..." text
- **Auto-dismiss**: Success messages hide after 3 seconds

### 📁 **File Structure**

```
src/
├── lib/api/
│   └── CreateCategoryAPI.tsx        # API integration
├── app/admin/
│   ├── layout.tsx                   # Admin layout with sidebar
│   ├── page.tsx                     # Admin dashboard
│   └── categories/
│       └── page.tsx                 # Category management page
├── components/navbar/
│   └── JupetaECnavBar.tsx          # Added admin panel link
├── types/
│   └── category.ts                  # Category data structure
└── styles/
    └── jupeta-ec-v1.global.scss     # Admin & category styles
```

### 🎯 **Integration with Existing System**

#### **Category Data Structure**
- **Compatible** with existing `CategoryData` interface
- **Uses** existing category hierarchy from `types/category.ts`
- **Extends** functionality with API integration

#### **Hero Content**
- **Static Hero**: Traditional title/subtitle/image structure
- **Component Hero**: References to React components (future enhancement)
- **Flexible**: Supports both existing and new hero formats

#### **Navigation**
- **Admin Access**: Added to user menu for authenticated users
- **Role-Based**: Easy to extend with role checking
- **Seamless**: Integrates with existing navigation patterns

### 🔮 **Future Enhancements**

#### **Planned Features**
- **Edit Categories**: Update existing category data
- **Delete Categories**: Remove categories with confirmation
- **Bulk Operations**: Multi-select for batch actions
- **Image Upload**: Direct file upload instead of URLs
- **Role Management**: Admin-only access controls
- **Category Analytics**: Usage statistics and insights

#### **Technical Improvements**
- **Real-time Updates**: WebSocket for live category changes
- **Drag & Drop**: Reorder categories visually
- **Advanced Search**: Filter and search categories
- **Validation**: Enhanced client-side validation
- **Caching**: Optimize category data loading

### 📋 **Testing**

#### **Manual Testing Steps**
1. **Access Admin Panel**: Verify navigation works
2. **Create Root Category**: Test basic category creation
3. **Create Subcategory**: Test parent-child relationships
4. **Form Validation**: Test required field validation
5. **Error Handling**: Test with invalid data
6. **Success Flow**: Verify complete creation process

#### **Test Data Examples**
```javascript
// Valid Test Category
{
  name: "Test Electronics",
  description: "Test category for electronics",
  imageUrl: "https://picsum.photos/400/300",
  metaTitle: "Test Electronics Category",
  metaDescription: "This is a test category for electronics products",
  displayOrder: 999
}

// Invalid Test Category (missing required fields)
{
  name: "",           // Should show validation error
  description: "",    // Should show validation error
  imageUrl: "invalid-url", // Should show validation error
  metaTitle: "",      // Should show validation error
  metaDescription: "", // Should show validation error
  displayOrder: -1    // Should show validation error
}
```

---

## 🚀 Ready to Use!

The category management system is fully implemented and ready for production use. Navigate to `/admin/categories` to start managing your marketplace categories with a professional, user-friendly interface.
