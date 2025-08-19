# CategoryData Converter

This utility converts API response data from the `GetAllCategories` endpoint to the legacy `categoryData` format used throughout the application.

## Features

- ✅ **API to Legacy Conversion**: Converts `CategoryResponse[]` to `CategoryData[]`
- ✅ **Hero Type Detection**: Automatically detects static vs component heroes
- ✅ **JSON File Generation**: Download categories as JSON file
- ✅ **TypeScript File Generation**: Generate TypeScript file with categoryData
- ✅ **Browser Integration**: Built-in download functionality
- ✅ **Root Categories Filter**: Extract only top-level categories

## Usage

### 1. Basic Conversion

```typescript
import { GetAllCategories } from '@/lib/api/GetAllCategoriesAPI';
import { convertApiCategoriesToLegacy } from '@/utils/categoryDataConverter';

const apiCategories = await GetAllCategories();
const legacyCategories = convertApiCategoriesToLegacy(apiCategories);
```

### 2. Download JSON File

```typescript
import { downloadCategoryDataJson } from '@/utils/categoryDataConverter';

const apiCategories = await GetAllCategories();
await downloadCategoryDataJson(apiCategories, 'my-categories.json');
```

### 3. Generate TypeScript File

```typescript
import { createCategoryDataTypeScriptFile } from '@/utils/categoryDataConverter';

const apiCategories = await GetAllCategories();
const tsContent = createCategoryDataTypeScriptFile(apiCategories);
```

### 4. Admin Interface

The category management page (`/admin/categories`) includes:
- **📥 Download JSON** button - Downloads categories as JSON file
- **📄 Download TS** button - Downloads categories as TypeScript file

## Data Structure Conversion

### API Response (CategoryResponse)
```typescript
{
  Id: "1",
  Name: "Electronics",
  Slug: "electronics", 
  ImageUrl: "/images/electronics.jpg",
  Hero: {
    componentName: "CarouselHero",
    props: "{\"autoPlay\": true}"
  },
  Children: [...],
  // ... other API fields
}
```

### Legacy Format (CategoryData)
```typescript
{
  id: "1",
  name: "Electronics",
  slug: "electronics",
  image: {
    src: "/images/electronics.jpg",
    height: 300,
    width: 400
  },
  hero: {
    componentName: "CarouselHero",
    props: { autoPlay: true }
  },
  children: [...]
}
```

## Hero Type Detection

The converter automatically detects hero types:

**Component Hero** (has `componentName`):
```typescript
// API format
Hero: {
  componentName: "CarouselHero",
  props: "{\"autoPlay\": true}"
}

// Converts to
hero: {
  componentName: "CarouselHero",
  props: { autoPlay: true }
}
```

**Static Hero** (has `title`, `subtitle`, `image`):
```typescript
// API format  
Hero: {
  title: "Electronics",
  subtitle: "Latest tech",
  image: "/hero.jpg"
}

// Converts to
hero: {
  title: "Electronics",
  subtitle: "Latest tech", 
  image: {
    src: "/hero.jpg",
    height: 400,
    width: 600
  }
}
```

## File Locations

- **Utility**: `src/utils/categoryDataConverter.ts`
- **Examples**: `src/examples/categoryConverterExamples.ts`
- **Integration**: `src/app/admin/categories/page.tsx`

## Functions Reference

### `convertApiCategoriesToLegacy(apiCategories: CategoryResponse[]): CategoryData[]`
Converts array of API categories to legacy format.

### `downloadCategoryDataJson(apiCategories: CategoryResponse[], filename?: string): Promise<void>`
Downloads categories as JSON file to user's device.

### `createCategoryDataTypeScriptFile(apiCategories: CategoryResponse[]): string`
Generates TypeScript file content with categoryData export.

### `getRootCategoriesInLegacyFormat(apiCategories: CategoryResponse[]): CategoryData[]`
Returns only root categories (no ParentId) in legacy format.

### `createCategoryDataJson(apiCategories: CategoryResponse[], filename?: string)`
Creates JSON data with download URL (for advanced usage).

## Integration Examples

See `src/examples/categoryConverterExamples.ts` for complete usage examples including:
- Component integration
- File downloads
- Root categories extraction
- React component usage

This converter ensures seamless compatibility between your API data and existing frontend components! 🎉
