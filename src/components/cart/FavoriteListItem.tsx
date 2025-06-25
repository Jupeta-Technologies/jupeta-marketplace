import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Product } from '@/types/cart';

type Props = {
  favorite: Product;
  onRemove: (product: Product) => void;
};

function FavoriteListItem({ favorite, onRemove }: Props) {
  
    return (
        <li className='cartQVLitem'>
          <span className='cqVLImg' style={{backgroundImage:`url(${favorite.imageFileUrl})`}}></span>
          <span className='citVNamePrice'>
            <p id='citN'>{favorite.productName}</p>
            <br/>
            <p id='citP'>¢{favorite.price}</p>
          </span>
          <span className='citVDelete'>
            <MdDelete onClick={() => onRemove(favorite)} />
          </span>
        </li>
    );
}

export default FavoriteListItem; 