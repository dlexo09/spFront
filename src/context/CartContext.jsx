import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializar carrito desde localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Añadir al carrito
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.sku === product.sku);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad
        return {
          ...prevCart,
          items: prevCart.items.map(item => 
            item.sku === product.sku 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        // Si no existe, añadir nuevo item
        return {
          ...prevCart,
          items: [...prevCart.items, { ...product, quantity }]
        };
      }
    });
  };

  // Eliminar del carrito
  const removeFromCart = (sku) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.sku !== sku)
    }));
  };

  // Actualizar cantidad
  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item => 
        item.sku === sku ? { ...item, quantity } : item
      )
    }));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart({ items: [] });
  };

  // Obtener total de items
  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener precio total
  const getTotalPrice = () => {
    return cart.items
      .filter(item => item.price && item.price > 0)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calcular totales para checkout
  const calculateTotal = () => {
    const subtotal = cart.items
      .filter(item => item.price && item.price > 0)
      .reduce((total, item) => total + item.price * item.quantity, 0);
    
    const tax = subtotal * 0.16; // 16% de IVA
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItems: cart.items, // Para compatibilidad con código existente
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para facilitar el uso del contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};