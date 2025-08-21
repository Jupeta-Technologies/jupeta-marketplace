# Dynamic Category Data System

## Overview
The category management system has been upgraded from static JSON imports to a dynamic, API-first approach with intelligent fallback to static data. This makes the system more scalable, responsive to changes, and production-ready.

## 🚀 Key Features

### 1. **API-First Architecture**
- Primary data source: Live API (`GetAllCategories`)
- Data transformation: API response → Legacy format conversion
- Real-time updates: Categories reflect current API state

### 2. **Intelligent Fallback**
- Fallback source: Static JSON file (`src/data/categoryData.json`)
- Automatic failover: API failure → Static data
- Seamless UX: Users always get data, even offline

### 3. **Smart Caching**
- 5-minute cache duration for API responses
- Shorter cache for fallback data (encourages API retry)
- Memory-efficient: No redundant API calls
- Force refresh capability for admin operations

### 4. **React Hooks Integration**
- `useCategoryData()` - Full featured hook with loading states
- `useCategoryDataImmediate()` - Immediate data, no loading
- `useCategoryDataAdmin()` - Admin controls + cache management

## 📁 File Structure

```
src/
├── lib/
│   └── categoryDataProvider.ts      # Core provider logic
├── hooks/
│   └── useCategoryData.ts          # React hooks
├── components/
│   └── CategoryDataInitializer.tsx # App initialization
├── types/
│   └── category.ts                 # Updated with dynamic exports
└── data/
    └── categoryData.json           # Static fallback data
```

## 🔧 Usage Examples

### Simple Component Usage
```typescript
import { useCategoryDataImmediate } from '@/hooks/useCategoryData';

function CategoryMenu() {
  const categories = useCategoryDataImmediate();
  
  return (
    <ul>
      {categories.map(cat => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
}
```

### Advanced Component with Loading States
```typescript
import { useCategoryData } from '@/hooks/useCategoryData';

function CategoryMenuAdvanced() {
  const { data, loading, error, refresh, source } = useCategoryData({
    immediate: true,     // Show fallback immediately
    autoRefresh: true,   // Auto-refresh every 5 minutes
  });

  return (
    <div>
      {loading && <span>Updating...</span>}
      {source === 'fallback' && <span>Offline mode</span>}
      
      <ul>
        {data.map(cat => <li key={cat.id}>{cat.name}</li>)}
      </ul>
      
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### Admin Component with Cache Control
```typescript
import { useCategoryDataAdmin } from '@/hooks/useCategoryData';

function AdminCategories() {
  const { 
    data, 
    loading, 
    refresh, 
    invalidateCache, 
    getCacheInfo 
  } = useCategoryDataAdmin();

  const handleForceRefresh = () => {
    invalidateCache(); // Clear cache
    refresh();         // Fetch fresh data
  };

  const cacheStatus = getCacheInfo();

  return (
    <div>
      <div>Source: {cacheStatus.source}</div>
      <div>Cache age: {Math.round(cacheStatus.cacheAge / 1000)}s</div>
      
      <button onClick={handleForceRefresh}>
        Force Refresh from API
      </button>
      
      {/* Category management UI */}
    </div>
  );
}
```

### Server Components
```typescript
import { getCategoryDataDynamic } from '@/types/category';

export default async function ServerPage() {
  const categories = await getCategoryDataDynamic();
  
  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

## 🔄 Data Flow

```
1. App Initialization
   ├── CategoryDataInitializer runs
   ├── initializeCategoryData() called
   └── First API call attempts

2. Component Request
   ├── useCategoryData() hook called
   ├── Check cache validity
   ├── Return cached data OR
   └── Fetch from API → Transform → Cache

3. API Failure Handling
   ├── API call fails
   ├── Log warning
   ├── Load static fallback
   └── Cache with shorter duration

4. Background Updates
   ├── Auto-refresh (if enabled)
   ├── Admin force refresh
   └── Cache invalidation
```

## ⚙️ Configuration

### Cache Settings
```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### Hook Options
```typescript
useCategoryData({
  autoRefresh: true,           // Enable auto-refresh
  refreshInterval: 300000,     // 5 minutes
  immediate: true              // Return fallback immediately
})
```

## 🎯 Benefits

1. **Performance**: Cached responses, minimal API calls
2. **Reliability**: Always has data (API + fallback)
3. **Scalability**: API-driven, real-time updates
4. **Developer Experience**: Simple hooks, TypeScript support
5. **Production Ready**: Error handling, offline support

## 🔧 Migration from Static

### Before (Static)
```typescript
import { categoryData } from '@/types/category';

const categories = categoryData; // Static array
```

### After (Dynamic)
```typescript
import { useCategoryDataImmediate } from '@/hooks/useCategoryData';

const categories = useCategoryDataImmediate(); // Dynamic data
```

## 🚨 Backward Compatibility

The static `categoryData` export is still available for gradual migration:

```typescript
// Still works (deprecated)
import { categoryData } from '@/types/category';

// Recommended
import { useCategoryDataImmediate } from '@/hooks/useCategoryData';
```

## 📈 Monitoring

The system provides cache status information:

```typescript
const status = getCacheStatus();
// {
//   hasCachedData: true,
//   cacheAge: 150000,
//   isValid: true,
//   source: 'api'
// }
```

This enables monitoring of:
- API health
- Cache performance  
- Fallback usage
- Data freshness

## 🎉 Result

Your category system is now:
- ✅ **Dynamic** - Uses live API data
- ✅ **Reliable** - Static fallback ensures uptime
- ✅ **Scalable** - API-driven architecture
- ✅ **Cached** - Optimal performance
- ✅ **TypeScript** - Full type safety
- ✅ **React-friendly** - Custom hooks
- ✅ **Admin-ready** - Cache control features
