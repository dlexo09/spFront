import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';

const PaymentPending = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center py-6 bg-yellow-50">
          <ClockIcon className="h-16 w-16 text-yellow-500 mx-auto" />
          <h1 className="text-2xl font-bold text-yellow-700 mt-2">Pago en proceso</h1>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Tu pago está siendo procesado. Esto puede tomar algunos minutos u horas dependiendo del método de pago seleccionado.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <h2 className="font-medium text-yellow-800 mb-1">Importante:</h2>
            <p className="text-yellow-700 text-sm">
              No es necesario realizar un nuevo pago. Puedes verificar el estado de tu pedido en cualquier momento desde tu cuenta.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link
              to="/cuenta"
              className="px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700"
            >
              Ver mis pedidos
            </Link>
            
            <Link
              to="/productos"
              className="px-4 py-2 border border-gray-300 text-gray-700 text-center rounded hover:bg-gray-50"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;