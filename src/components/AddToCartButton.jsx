import React from 'react';
import { useCart } from '../context/CartContext';

const AddToCartButton = ({ product, className = "" }) => {
  const { addToCart } = useCart();
  
  // Verificar si el producto tiene precio y está disponible para venta
  const tienePrec = product.precio && product.precio > 0 && String(product.disponible).toUpperCase() === "TRUE";

  const handleAddToCart = () => {
    if (tienePrec) {
      addToCart({
        sku: product.sku,
        name: product.name,
        price: product.precio,
        image: product.image,
        description: product.description,
        marca: product.marca,
        categoria: product.categoria
      });
    }
  };

  // Si no tiene precio o no está disponible, NO renderizar nada
  if (!tienePrec) {
    return null;  // ← Esto evita que aparezca el "0"
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 active:scale-95 px-4 py-2 ${className}`}
    >
      🛒 Agregar al carrito
    </button>
  );
};

export default AddToCartButton;