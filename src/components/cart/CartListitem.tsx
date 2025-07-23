import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Product } from '@/types/cart';

type Props = {
  cart: Product;
  onDelete: (product: Product, e?: React.MouseEvent) => void;
};

function CartListitem({ cart, onDelete }: Props) {
  
    return (
        <li className='cartQVLitem'>
          <span className='cqVLImg' style={{backgroundImage:`url(${cart.imageFileUrl})`}}></span>
          <span className='citVNamePrice'>
            <p id='citN'>{cart.productName}</p>
            <br/>
            <p id='citP'>¢{cart.price}</p>
          </span>
          <span className='citVDelete'>
            <MdDelete onClick={e => onDelete(cart, e)} />
          </span>
        </li>
    );
}

export default CartListitem;
