import React from 'react';
import { Link } from 'react-router-dom';

const PagoPendiente = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-yellow-50 p-8 rounded-lg text-center max-w-md">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-3xl font-bold text-yellow-700 mb-4">Pago pendiente</h1>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
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

export default PagoPendiente;