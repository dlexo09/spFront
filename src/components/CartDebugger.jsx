import React from 'react';
import { useCart } from '../context/CartContext';

const CartDebugger = () => {
  const { cart, cartItems } = useCart();
  
  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-80 text-white p-2 text-xs max-w-xs z-50">
      <details>
        <summary className="cursor-pointer">Debug Cart ({cartItems?.length || 0} items)</summary>
        <pre className="overflow-auto max-h-60 mt-2">
          {JSON.stringify({ cart, localStorage: localStorage.getItem('cart') }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default CartDebugger;