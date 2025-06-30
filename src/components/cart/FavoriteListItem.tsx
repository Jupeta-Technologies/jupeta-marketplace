import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Product } from '@/types/api';
import { useFavorites } from '@/context/FavoriteContext';

interface FavoriteListItemProps {
  product: Product; // FavoriteListItem still needs the product prop to display
}


const FavoriteListItem: React.FC<FavoriteListItemProps> = ({ product }) => {
  const { removeFavorite } = useFavorites(); // Get the function from context

  const handleRemoveFav = () => {
    // Call removeFromFavorites with the product's ID
    removeFavorite(product.id);
  };

  
    return (
        <li className='cartQVLitem'>
          <span className='cqVLImg' style={{backgroundImage:`url(${product.imageFileUrl})`}}></span>
          <span className='citVNamePrice'>
            <p id='citN'>{product.productName}</p>
            <br/>
            <p id='citP'>¢{product.price}</p>
          </span>
          <span className='citVDelete'>
            <MdDelete onClick={handleRemoveFav} />
          </span>
        </li>
    );
}

export default FavoriteListItem; 