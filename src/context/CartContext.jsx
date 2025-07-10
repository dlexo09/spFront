import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar del localStorage al inicio
  useEffect(() => {
    const savedCart = localStorage.getItem('siscoprint-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('siscoprint-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item =>
          item.sku === product.sku
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (sku) => {
    setCartItems(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.sku === sku ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // ESTA ES LA FUNCIÓN QUE FALTA - AGRÉGALA AQUÍ
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (item.price && item.price > 0) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0).toFixed(2);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice,  // AGRÉGALA AQUÍ TAMBIÉN
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};