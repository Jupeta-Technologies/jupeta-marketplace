'use client'; // This directive indicates client-side rendering in Next.js

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct Next.js hook for URL query params
import ItemCardglobal from '@/components/card/ItemCard';
import { jupetaSearchEngine } from '@/lib/api/SearchEngine'; // Adjust path as needed
import { Product } from '@/types/api'; // Your API response types
import { AxiosError } from 'axios'; // For specific error handling
import Pagination from '@/components/Pagination';
import ProductFilterSidebar from '@/components/ProductFilterSidebar';

// Assuming you have these components/styles defined elsewhere
//import '@/components/Allcategories.css';
// import FilterBar from '../components/FilterBar'; // Uncomment if you use it
// import SearchFilter from '../components/Search/searchFilterH'; // Uncomment if you use it
// You'll need to define styled or use a different CSS-in-JS solution if not styled-components
//import styled from 'styled-components'; // Re-included as you used it




// Define props for SearchResult, expecting `onAdd`
/* interface SearchResultProps {
  onAdd: (product: Product) => void; // Assuming onAdd takes a Product
} */

const SearchResult = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || ''; // Get keyword from URL query param

  const [apiData, setApiData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start loading immediately
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Number of items to show per page

  // Filter state for sidebar
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Get all unique categories from apiData
  const categories = Array.from(new Set(apiData.map(p => p.category || ''))).filter(Boolean);
  // Get min/max price for all products
  const allPrices = apiData.map(p => p.price || 0);
  const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length ? Math.max(...allPrices) : 10000;

  // Filtered search results
  const filteredResults = apiData.filter(product =>
    (selectedCategory === '' || product.category === selectedCategory) &&
    (product.price !== undefined && product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1]) &&
    (selectedCondition === '' || (product.condition && product.condition.toLowerCase() === selectedCondition)) &&
    (selectedType === '' || (product.sellingType && product.sellingType.toLowerCase() === selectedType.replace(' ', '')))
  );

  // Paginate filtered results
  const paginatedItems = useMemo(() => {
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    return filteredResults.slice(firstItemIndex, lastItemIndex);
  }, [filteredResults, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredResults.length / itemsPerPage);
  }, [filteredResults, itemsPerPage]);

  const pagesArray = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null); // Clear previous errors

      // If there's no keyword, don't fetch. This also prevents fetching if the page is just '/srchResult'
      if (!keyword.trim()) {
        setApiData([]);
        setLoading(false);
        return;
      }

      try {
        const response = await jupetaSearchEngine({ keyword });

        if (response.code == '0' && response.responseData) {
          setApiData(response.responseData);
          // Reset pagination to first page when new search results arrive
          setCurrentPage(1);
        } else {
          // If API call succeeded but 'success' is false
          setError(response.message || 'Failed to load search results.');
          setApiData([]); // Clear data on error
        }
      } catch (err: unknown) {
        // Handle network errors or other unexpected issues from jupetaSearchEngine
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || err.message || 'A network error occurred.');
        } else if (err instanceof Error) {
          setError(err.message || 'An unexpected error occurred.');
        } else {
          setError('An unknown error occurred.');
        }
        setApiData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]); // Re-run effect whenever the keyword in the URL changes

  // --- Pagination Calculation ---
  // Memoize pagination calculations to prevent unnecessary re-renders
  // const paginatedItems = useMemo(() => {
  //   const lastItemIndex = currentPage * itemsPerPage;
  //   const firstItemIndex = lastItemIndex - itemsPerPage;
  //   return apiData.slice(firstItemIndex, lastItemIndex);
  // }, [apiData, currentPage, itemsPerPage]);

  // const totalPages = useMemo(() => {
  //   return Math.ceil(apiData.length / itemsPerPage);
  // }, [apiData, itemsPerPage]);

  // const pagesArray = useMemo(() => {
  //   return Array.from({ length: totalPages }, (_, i) => i + 1);
  // }, [totalPages]);

  return (
    <>
      {/* <SearchFilter /> */} {/* Uncomment if you're using this component */}
      <div className="products-page" style={{ display: 'flex', gap: 24, marginTop: '50px' }}>
        <ProductFilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={[minPrice, maxPrice]}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          onReset={() => {
            setSelectedCategory('');
            setSelectedPriceRange([minPrice, maxPrice]);
            setSelectedCondition('');
            setSelectedType('');
          }}
          selectedCondition={selectedCondition}
          onConditionChange={setSelectedCondition}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
        <div className="products-container" style={{ flex: 1 }}>
          <section className="product-view--sort" style={{ width:'100%' }}>
            {loading && <p>Loading search results...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && apiData.length === 0 && keyword.trim() && (
              <p>No results found for &quot;{keyword}&quot;.</p>
            )}
            {!loading && !error && apiData.length === 0 && !keyword.trim() && (
              <p>Please enter a search term.</p>
            )}
            <div className="grid grid-cols-4" style={{gap:'14px', padding:'8px'}}>
              {paginatedItems.map((prodData) => (
                <ItemCardglobal prodData={prodData} key={prodData.id} />
              ))}
            </div>
          </section>
          {!loading && !error && totalPages > 1 && (
            <Pagination
              pages={pagesArray}
              setPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

// --- Styled Components Definition ---
/* const Wrapper = styled.section`
  .grid-filter-column {
    display: grid; /* Use display: grid for grid-template-columns 
    grid-template-columns: 250px 1fr; /* Example: filter column (250px) and main content 
    gap: 20px; /* Add some space between columns 
    margin-top: 48px;
    position: relative;
  }

  /* Basic pagination styling (adjust as needed for your Allcategories.css) 
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
  }

  .pagination button {
    padding: 8px 15px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    cursor: pointer;
    border-radius: 4px;
  }

  .pagination button.active {
    background-color: #0070f3;
    color: white;
    border-color: #0070f3;
  }
`; */

export default SearchResult;
