import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PagoPendiente = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Si hay un order_id, intentar obtener detalles de la orden
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`);
          const data = await response.json();
          
          if (response.ok) {
            setOrder(data.order);
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);
  
  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mt-6">Pago en proceso de validación</h1>
        
        <div className="mt-4 text-gray-600">
          <p className="mb-2">
            Hemos recibido tu comprobante de pago y lo estamos validando.
          </p>
          <p>
            En cuanto confirmemos la transferencia, procesaremos tu pedido y recibirás un correo electrónico con la confirmación.
          </p>
        </div>
        
        {loading ? (
          <div className="mt-6">
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
          </div>
        ) : order ? (
          <div className="mt-6 bg-gray-50 p-4 rounded-md text-left">
            <p className="font-medium">Detalles del pedido:</p>
            <p className="mt-2">
              <span className="text-gray-600">Número de pedido:</span> #{order.id}
            </p>
            <p>
              <span className="text-gray-600">Total:</span> ${order.total.toLocaleString('es-MX')}
            </p>
          </div>
        ) : null}
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Volver al inicio
          </Link>
          <Link to="/cuenta" className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagoPendiente;