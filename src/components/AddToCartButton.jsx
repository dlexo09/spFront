import React from 'react';
import { useCart } from '../context/CartContext';

const AddToCartButton = ({ product, className = "" }) => {
  const { addToCart } = useCart();
  
  // Verificar si el producto tiene precio y está disponible para venta
  const tienePrec = product.precio && product.precio > 0 && product.disponibleParaVenta === "TRUE";

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
      className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${className}`}
    >
      Agregar al carrito - ${product.precio.toLocaleString('es-MX')}
    </button>
  );
};

export default AddToCartButton;