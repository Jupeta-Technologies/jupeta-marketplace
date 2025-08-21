// Example: Migration from static to dynamic category data
// Before and After examples for common components

// === BEFORE (Static) ===
// app/page.tsx
import { categoryData } from "@/types/category";

export default function HomePage() {
  const homeCategory = categoryData.find(cat => cat.slug === 'home-kitchen');
  
  return (
    <div>
      <HeroWithSubmenu categoryData={homeCategory} />
      {/* ... */}
    </div>
  );
}

// === AFTER (Dynamic) ===
// app/page.tsx
import { useCategoryDataImmediate } from "@/hooks/useCategoryData";

export default function HomePage() {
  const categoryData = useCategoryDataImmediate();
  const homeCategory = categoryData.find(cat => cat.slug === 'home-kitchen');
  
  return (
    <div>
      <HeroWithSubmenu categoryData={homeCategory} />
      {/* ... */}
    </div>
  );
}

// === ADVANCED USAGE (With Loading States) ===
// components/CategoryMenu.tsx
import { useCategoryData } from "@/hooks/useCategoryData";

export default function CategoryMenu() {
  const { data, loading, error, refresh, source } = useCategoryData({
    immediate: true, // Show fallback data immediately
    autoRefresh: true, // Auto-refresh every 5 minutes
  });

  if (loading && data.length === 0) {
    return <div>Loading categories...</div>;
  }

  if (error && data.length === 0) {
    return <div>Error loading categories: {error}</div>;
  }

  return (
    <div>
      {source === 'fallback' && (
        <div className="warning">Using offline data</div>
      )}
      
      <ul>
        {data.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
      
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}

// === ADMIN USAGE (With Cache Management) ===
// app/admin/categories/page.tsx
import { useCategoryDataAdmin } from "@/hooks/useCategoryData";

export default function AdminCategories() {
  const { 
    data, 
    loading, 
    error, 
    refresh, 
    invalidateCache, 
    getCacheInfo 
  } = useCategoryDataAdmin();

  const handleCacheRefresh = async () => {
    invalidateCache(); // Clear cache
    await refresh(); // Fetch fresh data
  };

  const cacheInfo = getCacheInfo();

  return (
    <div>
      <div className="cache-info">
        <p>Data source: {cacheInfo.source}</p>
        <p>Cache age: {Math.round(cacheInfo.cacheAge / 1000)}s</p>
        <p>Valid: {cacheInfo.isValid ? 'Yes' : 'No'}</p>
      </div>
      
      <button onClick={handleCacheRefresh}>
        Force Refresh from API
      </button>
      
      {/* Category management UI */}
    </div>
  );
}

// === SERVER COMPONENTS ===
// For Server Components that need category data
import { getCategoryDataDynamic } from "@/types/category";

export default async function ServerCategoryPage() {
  const categories = await getCategoryDataDynamic();
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}

// === INITIALIZATION ===
// app/layout.tsx or app/page.tsx
import { initializeCategoryData } from "@/lib/categoryDataProvider";

export default function RootLayout() {
  useEffect(() => {
    // Initialize category data on app startup
    initializeCategoryData();
  }, []);

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
