'use client'; // This directive indicates client-side rendering in Next.js

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct Next.js hook for URL query params
import ItemCardglobal from '@/components/card/ItemCard';
import { jupetaSearchEngine } from '@/lib/api/SearchEngine'; // Adjust path as needed
import { APIResponse, Product } from '@/types/api'; // Your API response types
import { AxiosError } from 'axios'; // For specific error handling
import Pagination from '@/components/Pagination';

// Assuming you have these components/styles defined elsewhere
//import '@/components/Allcategories.css';
// import FilterBar from '../components/FilterBar'; // Uncomment if you use it
// import SearchFilter from '../components/Search/searchFilterH'; // Uncomment if you use it
// You'll need to define styled or use a different CSS-in-JS solution if not styled-components
//import styled from 'styled-components'; // Re-included as you used it




// Define props for SearchResult, expecting `onAdd`
interface SearchResultProps {
  onAdd: (product: Product) => void; // Assuming onAdd takes a Product
}

const SearchResult: React.FC<SearchResultProps> = ({ onAdd }) => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || ''; // Get keyword from URL query param

  const [apiData, setApiData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start loading immediately
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Number of items to show per page

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
  const paginatedItems = useMemo(() => {
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    return apiData.slice(firstItemIndex, lastItemIndex);
  }, [apiData, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(apiData.length / itemsPerPage);
  }, [apiData, itemsPerPage]);

  const pagesArray = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // --- Filter State (if you uncomment FilterBar) ---
  const [filters, setFilters] = useState({
    condition: 'All', // Example filter
  });

  const handleFilterChange = (newCondition: string) => {
    setFilters({ condition: newCondition });
    // You might want to re-filter apiData here or refetch based on filters
    // For now, it only updates the filter state.
  };

  return (
    <>
      {/* <SearchFilter /> */} {/* Uncomment if you're using this component */}
      
        <div className="container">
          {/* <div>
            <FilterBar selectedCondition={filters.condition} onFilterChange={handleFilterChange} />
          </div> */}

          <section className="product-view--sort" style={{ marginTop: '48px',width:'100%' }}>
            {loading && <p>Loading search results...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && apiData.length === 0 && keyword.trim() && (
              <p>No results found for "{keyword}".</p>
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

          {!loading && !error && totalPages > 1 && ( // Only show pagination if there are items and more than 1 page
            <Pagination
              pages={pagesArray}
              setPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
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
