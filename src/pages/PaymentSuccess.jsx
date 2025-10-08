import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/${orderId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al verificar el estado del pago');
        }
        
        const data = await response.json();
        setPaymentInfo(data);
      } catch (error) {
        console.error('Error al verificar pago:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
        <Link
          to="/cuenta"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver a mi cuenta
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center py-6 bg-green-50">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-green-700 mt-2">¡Pago exitoso!</h1>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Tu pago ha sido procesado correctamente. Hemos recibido tu pedido y lo estamos preparando.
          </p>
          
          {paymentInfo && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="font-semibold text-gray-800 mb-2">Detalles del pago:</h2>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Pedido:</div>
                <div className="font-medium">#{orderId.slice(-8)}</div>
                
                <div className="text-gray-600">Método:</div>
                <div className="font-medium">
                  {paymentInfo.paymentMethod === 'mercadopago' ? 'MercadoPago' : 
                   paymentInfo.paymentMethod === 'spei' ? 'Transferencia SPEI' : 
                   paymentInfo.paymentMethod}
                </div>
                
                <div className="text-gray-600">Total:</div>
                <div className="font-medium">${parseFloat(paymentInfo.amount).toLocaleString('es-MX')}</div>
                
                <div className="text-gray-600">Fecha:</div>
                <div className="font-medium">{new Date(paymentInfo.paymentDate).toLocaleString()}</div>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 text-sm mb-6">
            Recibirás un correo electrónico con los detalles de tu compra.
          </p>
          
          <div className="flex flex-col space-y-2">
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

export default PaymentSuccess;