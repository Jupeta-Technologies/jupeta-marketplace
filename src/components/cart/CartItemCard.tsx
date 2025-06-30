import React from 'react';
import { Product } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface CartItemCardProps {
  item: Product;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { addToCart, removeFromcart, clearFromcart } = useCart();

  const handleRemove = () => {
    removeFromcart(item);
  }

  const handleAdd = () => {
    addToCart(item);
  }

  const handleClear = () => {
    clearFromcart(item);
  }

  return (
    <div className='cartCard'>
      {item.source === 'buy-button' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          zIndex: 1
        }}>
          Quick Add
        </div>
      )}
      <div className='cartproductimage'>
        <img 
          src={item.imageFileUrl || '/placeholder-product.jpg'} 
          alt={item.productName}
        />
      </div>
      
      <div className='cartproductname'>
        <p>Item number: 31450</p>
        <h5>{item.productName}</h5>
        <p>Color: Red</p>
        <p style={{ marginTop: '15px' }}>
          <strong>GHS {item.price.toFixed(2)}</strong>
        </p>
      </div>
      
      <div className='cartproductprice'>
        <div className='addsubtract'>
          <button onClick={handleRemove}>-</button>
          <h5>{item.qty}</h5>
          <button onClick={handleAdd}>+</button>
        </div>
        <button className="bag">Save to wishlist</button>
        <button className="delivery">Save for later</button>
      </div>
      
      <FontAwesomeIcon 
        icon={faTrashCan} 
        color='red' 
        className='cartDelitem' 
        style={{
          fontSize: '1.3rem', 
          position: 'absolute', 
          top: '-7px',
          right: '-7px', 
          backgroundColor: '#F1DCDC',
          borderRadius: '50px', 
          padding: '25px 25px 20px 20px', 
          cursor: 'pointer'
        }} 
        onClick={handleClear}
      />
    </div>
  );
};

export default CartItemCard; 