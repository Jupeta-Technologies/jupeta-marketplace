'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineLogout,
  AiOutlineLogin,
  AiOutlineClose,
} from 'react-icons/ai';
import { MdOutlineSell, MdOutlineManageAccounts } from 'react-icons/md';
import { CiLocationOff, CiReceipt } from 'react-icons/ci';
import { Typography, Avatar, Button } from '@mui/joy';
import { useCart } from '@/context/CartContext';
import dynamic from 'next/dynamic';
import { Product } from '@/types/cart';
import { jupetaSearchEngine } from '@/lib/api/SearchEngine';

// Dynamic import for CartListitem, assuming it might use browser-specific APIs
const CartListitem = dynamic(() => import('@/components/cart/CartListitem'), { ssr: false });

// Helper to safely get data from localStorage
function getFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const item = localStorage.getItem(key);
  try {
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return fallback;
  }
}

const JupetaECnavBar = () => {
  // State for search functionality
  const [searchKey, setSearchKey] = useState('');
  const [searchActive, setSearchActive] = useState(false); // Controls overall search UI visibility
  // showSearchSuggestions controls the visibility of category and search results
  // It's true if searchActive is true AND there's a searchKey, or if explicitly focused
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Other states
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [cart, setCart] = useState<Product[]>([]);

  const { products } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement as it's on a div
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for autoFocus control

  // Static list for search suggestions (consider fetching this from an API if dynamic)
  const SearchKeyIndexes = ['Apple', 'Samsung', 'Macbook', 'Laptop'];

  // Handlers
  const handleSearchIconClick = () => {
    setSearchActive(true);
    // Automatically focus the input when the search bar is activated
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    // Show suggestions as soon as user types
    setShowSearchSuggestions(true);
  };

  const handleSearchSubmit = async () => {
    if (searchKey.trim() === '') {
      // Optionally hide suggestions if search key is empty on submit attempt
      setShowSearchSuggestions(false);
      return;
    }
    setIsLoading(true); // Set loading true
  // setShowSearchSuggestions(true); // If you want suggestions *and* loading indicator

  router.push(`/SearchResult?keyword=${encodeURIComponent(searchKey.trim())}`);

    //not needed since the search will be fetched directly on the search result page.
    /* try {
      // Show suggestions while waiting for API response
      setShowSearchSuggestions(true);
      const searchParams ={
        keyword: searchKey,
      }
      const response = await jupetaSearchEngine(searchParams)

      if (response.code == '0') {
        localStorage.setItem('SearchResult', JSON.stringify(response.responseData));
        router.push('/srchResult');
        // After navigating, you might want to reset the search state
        //setSearchKey('');
        setSearchActive(false);
        setShowSearchSuggestions(false);
      } else {
        // Handle non-OK responses (e.g., show an error message)
        console.error('Search API returned an error:', response);
      }
    } catch (error) {
      console.error('Search failed:', error);
      /// Display user-friendly error message here
    } finally {
    setIsLoading(false); // Always set loading false
    setShowSearchSuggestions(false); // Hide suggestions after attempt
    } */
  };

  const closeSearchBar = () => {
    setSearchActive(false);
    //setSearchKey(''); // Clear search input when closing
    setShowSearchSuggestions(false); // Hide suggestions
  };

  // Effect for clicking outside the search area to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearchBar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchRef]); // Dependency on searchRef is implicit; can remove if not changing

  // Effect for initial authentication status
  useEffect(() => {
    const auth = getFromLocalStorage<boolean>('AuthStatus', false);
    setIsAuth(auth);
  }, []);

  // Effect to update cart based on CartContext
  useEffect(() => {
    setCart(products ?? []);
  }, [products]);

  return (
    <>
      <div className="navbar__container"> {/* Simplified class name */}
        <div className="navbar__left flex">
          <Link href="/" className="navbar__logo">
            <Typography fontSize={'xl'}>jUPETA</Typography>
          </Link>
          <CiLocationOff />
        </div>

        <div ref={searchRef} className={`navbar__center ${searchActive ? 'showSearchResult' : ''}`}>
          {!searchActive && (
            <div className="navbar__search-button" onClick={handleSearchIconClick}>
              <AiOutlineSearch
                id="navSicon"
                className="nav-icon-button" // Use a class for styling
                aria-label="Search" // Accessibility improvement
              />
              <span style={{ color: '#FFF' }}>Search...</span>
            </div>
          )}

          {searchActive && (
            <div className="navbar__search showOpacity">
              <div className="search_Barcenter">
                <input
                  ref={searchInputRef} // Attach ref for autoFocus
                  type="text"
                  value={searchKey}
                  placeholder="Search for product..."
                  onChange={handleSearchInputChange}
                  // autoFocus // Managed by ref in handleSearchIconClick for better control
                />
              </div>
              <div className="search_Barright">
                {searchKey === '' ? (
                  <AiOutlineClose
                    className="navSicon"
                    onClick={closeSearchBar}
                    aria-label="Close search bar"
                  />
                ) : (
                  <AiOutlineSearch
                    className="navSicon"
                    onClick={handleSearchSubmit}
                    aria-label="Submit search"
                  />
                )}
              </div>
            </div>
          )}

          {/* Search categories and results now depend on searchActive and showSearchSuggestions */}
          {searchActive && showSearchSuggestions && (
            <div className="search_category">
              <ul>
                <li data-category="All">All</li>
                <li data-category="Electronic">Electronic</li>
                <li data-category="Home">Home</li>
              </ul>
            </div>
          )}

          {/* Optional: commented out section - remove if not needed */}
          {/* <div className="search_Barleft">
              <select value={searchCatg} onChange={handleSearchCat}>
                <option value="0">Category</option>
                <option value="1">All Categories</option>
                <option value="2">Consumer Electronic</option>
              </select>
            </div> */}

          {searchActive && showSearchSuggestions && searchKey.trim() !== '' && (
            <div className="searchResult">
              <ul>
                {SearchKeyIndexes.map(
                  (keyword) =>
                    keyword.toLowerCase().includes(searchKey.toLowerCase()) && (
                      <li key={keyword}>{keyword}</li> // Use keyword as key, as it's unique
                    )
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="navbar__right">
          <ul className="navbar__menu">
            <li>
              <AiOutlineShoppingCart className="navbar__icon" />
              <ul className="navbarCart navbar__dropdown">
                {cart.length > 0 ? (
                  cart.map((cartData) => <CartListitem cart={cartData} key={cartData.id} />) // Use unique product ID as key
                ) : (
                  <p style={{ width: '100%', textAlign: 'center' }}>Cart is empty</p>
                )}
                {cart.length > 0 && <Button onClick={() => router.push('/cart')}>Go to cart</Button>}
              </ul>
            </li>

            <li>
              <AiOutlineHeart className="navbar__icon" />
              <ul className="navbarFav navbar__dropdown">
                <li></li> {/* Placeholder, consider adding content here */}
              </ul>
            </li>

            <li>
              {isAuth ? <Avatar id="userIcon">E</Avatar> : <AiOutlineUser className="navbar__icon" />}
              <ul className="navbar__dropdown userMenu">
                <li onClick={() => router.push('/sell')}>
                  <MdOutlineSell id="uMicon" />
                  <span>Sell</span>
                </li>
                <li>
                  <AiOutlineEye id="uMicon" />
                  <span>Watch List</span>
                </li>
                <li>
                  <CiReceipt id="uMicon" />
                  <span>Orders</span>
                </li>
                <li>
                  <MdOutlineManageAccounts id="uMicon" />
                  <span>My account</span>
                </li>
                {isAuth ? (
                  <li
                    onClick={() => {
                      localStorage.setItem('AuthStatus', 'false');
                      router.push('/login');
                    }}
                  >
                    <AiOutlineLogout id="uMicon" />
                    <span>Sign out</span>
                  </li>
                ) : (
                  <li onClick={() => router.push('/Login')}>
                    <AiOutlineLogin id="uMicon" />
                    <span>Sign in</span>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default JupetaECnavBar;