import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

const PaymentFailed = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center py-6 bg-red-50">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-red-700 mt-2">Pago no completado</h1>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Lo sentimos, tu pago no pudo ser procesado. Esto puede deberse a:
          </p>
          
          <ul className="list-disc pl-5 text-gray-600 mb-6 space-y-1">
            <li>Fondos insuficientes</li>
            <li>Datos de la tarjeta incorrectos</li>
            <li>Problemas temporales con tu banco</li>
            <li>La transacción fue rechazada por motivos de seguridad</li>
          </ul>
          
          <div className="flex flex-col space-y-3">
            <Link
              to={`/pagar-pedido/${orderId}`}
              className="px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700"
            >
              Intentar nuevamente
            </Link>
            
            <Link
              to="/cuenta"
              className="px-4 py-2 border border-gray-300 text-gray-700 text-center rounded hover:bg-gray-50"
            >
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;