import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const PagoExitoso = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-green-50 p-8 rounded-lg text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">¡Pago exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu compra ha sido procesada correctamente. Recibirás un email con los detalles.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PagoExitoso;