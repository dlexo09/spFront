import React from 'react';
import { Link } from 'react-router-dom';

const PagoFallido = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-red-50 p-8 rounded-lg text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-700 mb-4">Pago fallido</h1>
        <p className="text-gray-600 mb-6">
          Hubo un problema con tu pago. Puedes intentarlo nuevamente o contactarnos.
        </p>
        <div className="space-y-3">
          <Link
            to="/carrito"
            className="block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al carrito
          </Link>
          <Link
            to="/contacto"
            className="block bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagoFallido;