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
  
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [justOpened, setJustOpened] = useState(false); // Flag to prevent immediate close

  // Other states
  const { isAuthenticated, logout, user, loading } = useAuth();
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
    setShowSearchSuggestions(true); // Show suggestions when search opens
    setJustOpened(true);
    
    // Clear the justOpened flag after a longer delay for mobile
    setTimeout(() => {
      setJustOpened(false);
    }, 500);
    
    // Mobile focus must happen immediately in the user gesture event
    // Use a more aggressive focusing strategy
    const attemptFocus = () => {
      if (searchInputRef.current) {
        try {
          // Force focus immediately - this must happen during user gesture
          searchInputRef.current.focus();
          
          // Additional mobile-specific tricks
          if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            // iOS specific
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              // Create a temporary click event to trigger iOS focus
              const clickEvent = new MouseEvent('click', { bubbles: true });
              searchInputRef.current.dispatchEvent(clickEvent);
              
              // Set cursor position
              searchInputRef.current.setSelectionRange(0, 0);
            }
            
            // Android specific
            if (/Android/i.test(navigator.userAgent)) {
              // Android sometimes needs a slight delay
              searchInputRef.current.click();
            }
          }
        } catch (error) {
          // Focus failed silently
        }
      } else {
        return false;
      }
      return true;
    };
    
    // Try focusing immediately (during user gesture)
    if (!attemptFocus()) {
      // If immediate focus failed, try with minimal delays
      setTimeout(attemptFocus, 10);
      setTimeout(attemptFocus, 50);
      setTimeout(attemptFocus, 100);
    }
  };

  const handleMobileSearchTouch = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    
    // Different handling for actual touch vs mouse events
    if (e.type === 'touchstart') {
      e.preventDefault(); // Only prevent default on actual touch events
    }
    
    // For mobile devices, try to focus immediately within the user gesture
    setSearchActive(true);
    setShowSearchSuggestions(true); // Show suggestions immediately
    setJustOpened(true);
    
    // Clear the justOpened flag
    setTimeout(() => {
      setJustOpened(false);
    }, 500);
    
    // Immediate focus attempt within user gesture (critical for mobile)
    requestAnimationFrame(() => {
      if (searchInputRef.current) {
        try {
          searchInputRef.current.focus();
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            searchInputRef.current.click();
          }
        } catch (error) {
          // Focus failed silently
        }
      }
    });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchKey(newValue);
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
    setJustOpened(false);
    //setSearchKey(''); // Clear search input when closing
    setShowSearchSuggestions(false); // Hide suggestions
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Effect for auto-focusing when search becomes active
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      // Multiple focus strategies for different mobile browsers
      const focusStrategies = [
        // Strategy 1: Immediate focus
        () => {
          searchInputRef.current?.focus();
        },
        
        // Strategy 2: Focus with click (iOS)
        () => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.click();
          }
        },
        
        // Strategy 3: Touch simulation (Android)
        () => {
          if (searchInputRef.current) {
            const touchEvent = new TouchEvent('touchstart', { bubbles: true });
            searchInputRef.current.dispatchEvent(touchEvent);
            searchInputRef.current.focus();
          }
        }
      ];
      
      // Try each strategy with small delays
      focusStrategies.forEach((strategy, index) => {
        setTimeout(strategy, index * 50);
      });
    }
  }, [searchActive]);

  // Effect for clicking outside the search area to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Don't close if we just opened the search
      if (justOpened) {
        return;
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearchBar();
      }
    };
    
    // Add a longer delay for mobile devices
    const delay = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 300 : 100;
    
    const timeoutId = setTimeout(() => {
      // Listen for both mouse and touch events
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [searchRef, justOpened]); // Dependency on searchRef is implicit; can remove if not changing

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
      <div className="navbar__container">
        {/* Mobile Navbar */}
        <div className="navbar__mobile">
          <div className="navbar__mobile-left">
            <Link href="/" className="navbar__logo">
              <h3>jUPETA</h3>
            </Link>
          </div>

          <div className={`navbar__mobile-center ${searchActive ? 'showSearchResult' : ''}`} ref={searchRef}>
            
            {/* Mobile Search - Same logic as Desktop */}
            {!searchActive && (
              <button 
                className="navbar__search-button" 
                onClick={handleMobileSearchTouch}
                onTouchEnd={(e) => {
                  // Secondary handler for stubborn mobile devices
                  if (!searchActive) {
                    e.preventDefault();
                    handleSearchIconClick();
                  }
                }}
                type="button"
                style={{ 
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  zIndex: 10,
                  minHeight: '44px',
                  background: 'linear-gradient(to right, #FFF, var(--transparent-2))',
                  borderRadius: '25px 0 0 25px'
                }}
              >
                <AiOutlineSearch
                  id="navSicon"
                  className="nav-icon-button"
                  aria-label="Search"
                />
                <span style={{ color: '#000' }}>Search...</span>
              </button>
            )}

             {searchActive && (
            <div className="navbar__search showOpacity">
              <div className="search_Barcenter">
                <input
                  ref={searchInputRef}
                  type="search" // Use search type for better mobile keyboard
                  inputMode="search" // Hint for mobile keyboard
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  autoFocus // Add autoFocus as fallback
                  value={searchKey}
                  placeholder="Search for product..."
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  style={{
                    // Additional mobile-specific styles
                    fontSize: '16px', // Prevents zoom on iOS
                    outline: 'none',
                    border: 'none',
                    width: '100%'
                  }}
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
          {searchActive && showSearchSuggestions && (
              <div className="search_category">
                <ul>
                  <li data-category="All">All</li>
                  <li data-category="Electronic">Electronic</li>
                  <li data-category="Home">Home</li>
                </ul>
              </div>
            )}

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
          
          <div className="navbar__mobile-right">
            {/* Mobile Cart */}
            <div style={{ position: 'relative' }}>
              <AiOutlineShoppingCart 
                className="navbar__icon" 
                style={{ cursor: 'pointer' }} 
                onClick={() => router.push('/cart')} 
              />
              {cart.length > 0 && (
                <span className="cart-badge mobile-cart-badge">
                  {cart.length}
                </span>
              )}
            </div>
            
            {/* Mobile User Icon */}
            <div className="mobile-user-icon" onClick={toggleMobileMenu}>
              {isAuthenticated && user ? (
                <div className="user-avatar">
                  {user.fullName ? user.fullName.trim().charAt(0).toUpperCase() : user.name ? user.name.trim().charAt(0).toUpperCase() : "U"}
                </div>
              ) : (
                <AiOutlineUser className="navbar__icon" />
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navbar - Original Layout */}
        <div className="navbar__desktop">
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
                {loading ? (
                  <div className="user-avatar skeleton-avatar" id="userIcon" style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : isAuthenticated && user ? (
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
                    <li onClick={() => router.push('/login')}>
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
                    <li onClick={() => router.push('/login')}>
                      <AiOutlineLogin id="uMicon" />
                      <span>Sign in</span>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <h4>Menu</h4>
                <AiOutlineClose 
                  className="close-mobile-menu" 
                  onClick={toggleMobileMenu}
                />
              </div>
              
              <div className="mobile-menu-content">
                {/* Mobile Menu Items */}
                <ul className="mobile-menu-items">
                  <li onClick={() => { router.push('/sell'); setIsMobileMenuOpen(false); }}>
                    <MdOutlineSell />
                    <span>Sell</span>
                  </li>
                  <li onClick={() => { router.push('/favorites'); setIsMobileMenuOpen(false); }}>
                    <AiOutlineHeart />
                    <span>Favorites</span>
                  </li>
                  <li>
                    <AiOutlineEye />
                    <span>Watch List</span>
                  </li>
                  <li>
                    <CiReceipt />
                    <span>Orders</span>
                  </li>
                  {isAuthenticated && user ? (
                    <li onClick={() => { router.push('/profile'); setIsMobileMenuOpen(false); }}>
                      <MdOutlineManageAccounts />
                      <span>My account</span>
                    </li>
                  ) : (
                    <li onClick={() => { router.push('/login'); setIsMobileMenuOpen(false); }}>
                      <MdOutlineManageAccounts />
                      <span>My account</span>
                    </li>
                  )}
                  {isAuthenticated && user && (
                    <li onClick={() => { router.push('/admin'); setIsMobileMenuOpen(false); }}>
                      <MdAdminPanelSettings />
                      <span>Admin Panel</span>
                    </li>
                  )}
                  {isAuthenticated ? (
                    <li
                      onClick={async () => {
                        await logout();
                        router.push('/Login');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <AiOutlineLogout />
                      <span>Sign out</span>
                    </li>
                  ) : (
                    <li onClick={() => { router.push('/login'); setIsMobileMenuOpen(false); }}>
                      <AiOutlineLogin />
                      <span>Sign in</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JupetaECnavBar;