import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="relative">
      <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors block">
        <svg 
          className="w-6 h-6 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.2A1 1 0 006 19h12a1 1 0 00.9-1.2L17 13"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </span>
        )}
      </Link>
    </div>
  );
};

export default CartIcon;