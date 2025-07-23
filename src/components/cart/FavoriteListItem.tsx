import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Product } from '@/types/api';
import { useFavorites } from '@/context/FavoriteContext';

interface FavoriteListItemProps {
  product: Product;
  onDelete?: (e: React.MouseEvent) => void;
}


const FavoriteListItem: React.FC<FavoriteListItemProps> = ({ product, onDelete }) => {
  const { removeFavorite } = useFavorites(); // Get the function from context

  const handleRemoveFav = (e: React.MouseEvent) => {
    if (onDelete) onDelete(e);
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