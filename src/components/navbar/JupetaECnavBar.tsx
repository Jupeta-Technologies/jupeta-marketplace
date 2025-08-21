'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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
import { MdOutlineSell, MdOutlineManageAccounts, MdAdminPanelSettings } from 'react-icons/md';
import { CiLocationOff, CiReceipt } from 'react-icons/ci';
import { useFavorites } from '@/context/FavoriteContext';
import dynamic from 'next/dynamic';
import { Product } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import NotificationToast from '../Shared/Notification-Toast';

// Dynamic import for CartListitem and FavoriteListItem
const CartListitem = dynamic(() => import('@/components/cart/CartListitem'), { ssr: false });
const FavoriteListItem = dynamic(() => import('@/components/cart/FavoriteListItem'), { ssr: false });

const JupetaECnavBar = () => {
  // State for search functionality
  const [searchKey, setSearchKey] = useState('');
  const [searchActive, setSearchActive] = useState(false); // Controls overall search UI visibility
  // showSearchSuggestions controls the visibility of category and search results
  // It's true if searchActive is true AND there's a searchKey, or if explicitly focused
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Other states
  const { isAuthenticated, logout, user } = useAuth();
  const [cart, setCart] = useState<Product[]>([]);
  const { products, clearFromcart } = useCart();
  const {favorites} = useFavorites();
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
  closeSearchBar();
  router.push(`/SearchResult?keyword=${encodeURIComponent(searchKey.trim())}`);

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

  // Remove localStorage-based auth effect

  // Effect to update cart based on CartContext
  useEffect(() => {
    setCart(products ?? []);
  }, [products]);

  // Effect to update favorites based on FavoritesContext
  useEffect(() => {
    // setFavorited(favorites ?? []); // This line was removed as per the edit hint
  }, [favorites]);

  //console.log(isAuthenticated, user);

  return (
    <>
      <div className="navbar__container"> {/* Simplified class name */}
        <div className="navbar__left flex">
          <Link href="/" className="navbar__logo">
            <h3>jUPETA</h3>
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
              <span style={{ color: '#000' }}>Search...</span>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
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
            <li style={{ position: 'relative' }}>
              <AiOutlineShoppingCart className="navbar__icon" style={{ cursor: 'pointer' }} onClick={() => router.push('/cart')} />
              {cart.length > 0 && (
                <span
                  className="cart-badge"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '6px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 2,
                  }}
                >
                  {cart.length}
                </span>
              )}
              <ul className="navbarCart navbar__dropdown">
                {cart.length > 0 ? (
                  cart.map((cartData) => (
                    <div key={cartData.id} style={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/products/${cartData.id}`)}>
                      <CartListitem 
                        cart={cartData} 
                        onDelete={(product, e) => {
                          e?.stopPropagation();
                          clearFromcart(product);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p style={{ width: '100%', textAlign: 'center' }}>Cart is empty</p>
                )}
                {cart.length > 0 && (
                  <button className="go-to-cart-btn" onClick={() => router.push('/cart')}>
                    Go to cart
                  </button>
                )}
              </ul>
            </li>

            <li>
              <AiOutlineHeart className="navbar__icon" style={{ cursor: 'pointer' }} onClick={() => router.push('/favorites')} />
              <ul className="navbarFav navbar__dropdown">
                {favorites.length > 0 ? (
                  favorites.map((favoriteData) => (
                    <div key={favoriteData.id} style={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/products/${favoriteData.id}`)}>
                      <FavoriteListItem 
                        product={favoriteData} 
                        onDelete={e => e.stopPropagation()}
                      />
                    </div>
                  ))
                ) : (
                  <p style={{ width: '100%', textAlign: 'center' }}>No favorites yet</p>
                )}
                {favorites.length > 0 && (
                  <button className="go-to-cart-btn" onClick={() => router.push('/favorites')}>
                    View all favorites
                  </button>
                )}
              </ul>
            </li>

            <li>
              {isAuthenticated && user ? (
                <div className="user-avatar" id="userIcon">
                  {user.fullName ? user.fullName.trim().charAt(0).toUpperCase() : user.name ? user.name.trim().charAt(0).toUpperCase() : "U"}
                </div>
              ) : (
                <AiOutlineUser className="navbar__icon" />
              )}
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
                {isAuthenticated && user ? (
                  <li onClick={() => router.push('/profile')}>
                    <MdOutlineManageAccounts id="uMicon" />
                    <span>My account</span>
                  </li>
                ) : (
                  <li onClick={() => router.push('/Login')}>
                    <MdOutlineManageAccounts id="uMicon" />
                    <span>My account</span>
                  </li>
                )}
                {/* Admin Panel Access - show for authenticated users (you can add role-based logic here) */}
                {isAuthenticated && user && (
                  <li onClick={() => router.push('/admin')}>
                    <MdAdminPanelSettings id="uMicon" />
                    <span>Admin Panel</span>
                  </li>
                )}
                {isAuthenticated ? (
                  <li
                    onClick={async () => {
                      await logout();
                      router.push('/Login');
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