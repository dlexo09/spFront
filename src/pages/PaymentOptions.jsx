import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PaymentOptions = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redireccionar si no hay usuario
    if (!user) {
      navigate('/login', { state: { from: `/pagar-pedido/${orderId}` } });
      return;
    }

    // Cargar datos del pedido
    const loadOrderAndPaymentOptions = async () => {
      try {
        const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!orderResponse.ok) {
          if (orderResponse.status === 404) {
            throw new Error('Pedido no encontrado');
          }
          throw new Error('Error al cargar el pedido');
        }
        
        const orderData = await orderResponse.json();
        
        // Verificar que el pedido está pendiente de pago
        if (orderData.status !== 'pending_payment') {
          setError('Este pedido no está pendiente de pago');
          setLoading(false);
          return;
        }
        
        setOrder(orderData);
        
        // Cargar opciones de pago
        const optionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/payment-options`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!optionsResponse.ok) {
          throw new Error('Error al cargar opciones de pago');
        }
        
        const optionsData = await optionsResponse.json();
        setPaymentOptions(optionsData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrderAndPaymentOptions();
  }, [orderId, user, navigate]);

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPayment(methodId);
  };

  const handleProceedToPayment = () => {
    if (!selectedPayment) {
      alert('Por favor selecciona un método de pago');
      return;
    }
    
    navigate(`/procesar-pago/${orderId}/${selectedPayment}`);
  };

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
        <button
          onClick={() => navigate('/cuenta')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver a mi cuenta
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Seleccionar método de pago</h1>
      
      {order && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Resumen del pedido #{order.id.slice(-8)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Fecha:</p>
              <p className="text-gray-800">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total:</p>
              <p className="text-gray-800 font-semibold">${parseFloat(order.total).toLocaleString('es-MX')}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Métodos de pago disponibles</h2>
          
          <div className="space-y-4">
            {paymentOptions.map((option) => (
              <div 
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedPayment === option.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleSelectPaymentMethod(option.id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    {option.icon ? (
                      <img src={option.icon} alt={option.name} className="h-8 w-auto" />
                    ) : (
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500">{option.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-gray-500 text-sm">{option.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div 
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === option.id 
                          ? 'border-blue-500' 
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPayment === option.id && (
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => navigate('/cuenta')}
              className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedPayment}
              className={`px-6 py-2 rounded font-medium ${
                selectedPayment
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;