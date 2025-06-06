'use client'

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
  AiOutlineClose
} from 'react-icons/ai';
import { MdOutlineSell, MdOutlineManageAccounts } from 'react-icons/md';
import { CiLocationOff, CiReceipt } from 'react-icons/ci';
import { Typography, Avatar, Button } from '@mui/joy';
import { useCart } from '@/context/CartContext';
import dynamic from 'next/dynamic';
import { Product } from '@/types/cart';

const CartListitem = dynamic(() => import('@/components/cart/CartListitem'), { ssr: false });

type AuthStatus = {
  isLoggedIn: boolean;
  token?: string;
  user?: { name: string; email: string }; // adjust to your actual data
};

function getFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) as T : fallback;
  } catch {
    return fallback;
  }
}

const JupetaECnavBar = () => {
  const [loggedin, setLoggedin] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState('');
  const [searchCatg, setSearchCatg] = useState('0');
  const [searchActive, setSearchActive] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [srching, setsrching] = useState(false);

  const { products } = useCart();
  const router = useRouter();
  const srchRef = useRef<HTMLInputElement>(null);

  const handleSearchicon = () => setSearchActive(true);

  const handleSearchInput = (e: { target: { value: React.SetStateAction<string>; }; }) => setSearchKey(e.target.value);

  const handleSearchCat = (e: { target: { value: React.SetStateAction<string>; }; }) => setSearchCatg(e.target.value);

  const SearchKeyIndexes = ['Apple', 'Samsung', 'Macbook', 'Laptop'];

  const handelSEO = async () => {
    if (searchKey === '') return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: searchKey })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('SearchResult', JSON.stringify(data.responseData));
        router.push('/srchResult');
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  useEffect(() => {
    const handler = (e: { target: any; }) => {
      if (srchRef.current && srchRef.current.contains(e.target)) {
        setsrching(true);
      } else {
        setsrching(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const auth = getFromLocalStorage<boolean>('AuthStatus', false);
    setIsAuth(auth);
  }, []);

  useEffect(() => {
    setCart(products ?? []);
  }, [products]);

  return (
    <div className={searchActive ? 'navbar__container sBarColor' : 'navbar__container'}>
      <div className="navbar__left flex">
        <Link href="/"  className='navbar__logo'>
            <Typography fontSize={'xl'} >jUPETA</Typography>
        </Link>
        <CiLocationOff />
      </div>

      <div className="navbar__center">
        {!searchActive && (
          <div className="navbar__search-button" onClick={handleSearchicon}>
            <AiOutlineSearch id="navSicon" style={{ borderRadius: '100%', padding: '8px', fontSize: '2rem', background: '#44423f', color: '#FFF' }} />
            <span style={{ color: '#44423f' }}>Search...</span>
          </div>
        )}

        <div className={searchActive ? 'navbar__search showOpacity' : 'navbar__search'}>
          <div className="search_Barleft">
            <select value={searchCatg} onChange={handleSearchCat}>
              <option value="0">Category</option>
              <option value="1">All Categories</option>
              <option value="2">Consumer Electronic</option>
            </select>
          </div>
          <div className="search_Barcenter">
            <input type="text" ref={srchRef} placeholder="Search for product..." onChange={handleSearchInput} />
          </div>
          <div className="search_Barright">
            {searchKey === '' ? <AiOutlineClose style={{verticalAlign:"middle"}} onClick={() => setSearchActive(false)} /> : <AiOutlineSearch onClick={handelSEO} />}
          </div>
        </div>
        <div className={srching ? 'searchResult showDiv' : 'searchResult'}>
          <ul>
            {SearchKeyIndexes.map((keyword, index) =>
              keyword.toLowerCase().includes(searchKey.toLowerCase()) && <li key={index}>{keyword}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="navbar__right">
        <ul className="navbar__menu">
          <li>
            <AiOutlineShoppingCart className="navbar__icon" />
            <ul className="navbarCart navbar__dropdown">
              {cart.length > 0 ? (
                cart.map((cartData, id) => <CartListitem cart={cartData} key={id} />)
              ) : (
                <p style={{ width: '100%', textAlign: 'center' }}>Cart is empty</p>
              )}
              {cart.length > 0 && <Button onClick={() => router.push('/cart')}>Go to cart</Button>}
            </ul>
          </li>

          <li>
            <AiOutlineHeart className="navbar__icon" />
            <ul className="navbarFav navbar__dropdown">
              <li></li>
            </ul>
          </li>

          <li>
            {isAuth ? <Avatar id='userIcon'>E</Avatar> : <AiOutlineUser className="navbar__icon" />}
            <ul className="navbar__dropdown userMenu">
              <li onClick={() => router.push('/sell')}><MdOutlineSell id='uMicon' /><span>Sell</span></li>
              <li><AiOutlineEye id='uMicon' /><span>Watch List</span></li>
              <li><CiReceipt id='uMicon' /><span>Orders</span></li>
              <li><MdOutlineManageAccounts id='uMicon' /><span>My account</span></li>
              {isAuth ? (
                <li onClick={() => {
                  localStorage.setItem('AuthStatus', 'false');
                  router.push('/login');
                }}>
                  <AiOutlineLogout id="uMicon" /><span>Sign out</span>
                </li>
              ) : (
                <li onClick={() => router.push('/login')}>
                  <AiOutlineLogin id="uMicon" /><span>Sign in</span>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JupetaECnavBar;
