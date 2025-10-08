import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProcessPayment = () => {
  const { orderId, paymentMethod } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  
  useEffect(() => {
    // Redireccionar si no hay usuario
    if (!user) {
      navigate('/login', { state: { from: `/procesar-pago/${orderId}/${paymentMethod}` } });
      return;
    }

    // Procesar el pago según el método seleccionado
    const processPayment = async () => {
      try {
        let endpoint;
        let requestBody = { orderId };
        
        if (paymentMethod === 'mercadopago') {
          endpoint = `${import.meta.env.VITE_API_URL}/api/payments/mercadopago/create`;
        } else if (paymentMethod === 'spei') {
          endpoint = `${import.meta.env.VITE_API_URL}/api/payments/spei/create`;
        } else {
          throw new Error('Método de pago no soportado');
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al procesar el pago');
        }
        
        const data = await response.json();
        setPaymentData(data);
        
        // Si es MercadoPago, redirigir al usuario al punto de inicio
        if (paymentMethod === 'mercadopago' && data.init_point) {
          window.location.href = data.init_point;
          return;
        }
      } catch (error) {
        console.error('Error al procesar pago:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [orderId, paymentMethod, user, navigate]);

  // Componente para mostrar información de pago SPEI
  const SPEIPaymentInfo = () => {
    if (!paymentData || !paymentData.bankData) return null;
    
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información para pago SPEI</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 mb-2">
            Realiza una transferencia SPEI con los siguientes datos:
          </p>
          <p className="text-blue-700 text-sm">
            El pago puede tomar hasta 24 horas en procesarse.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Banco:</p>
              <p className="font-medium">{paymentData.bankData.bank}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Beneficiario:</p>
              <p className="font-medium">{paymentData.bankData.account_holder}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Número de cuenta:</p>
                <p className="font-medium">{paymentData.bankData.account_number}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">CLABE:</p>
                <p className="font-medium">{paymentData.bankData.clabe}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Monto a pagar:</p>
                <p className="font-medium text-lg text-blue-600">
                  ${parseFloat(paymentData.bankData.amount).toLocaleString('es-MX')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Referencia:</p>
                <p className="font-medium text-blue-600">{paymentData.reference}</p>
                <p className="text-xs text-gray-500">
                  Es muy importante incluir esta referencia exactamente como se muestra.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div>
              <p className="text-gray-600 text-sm">Concepto de pago:</p>
              <p className="font-medium">{paymentData.bankData.concept}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-yellow-800 mb-2">Importante:</h3>
            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
              <li>Tu pedido se procesará una vez que recibamos tu pago.</li>
              <li>Esta referencia vence el {new Date(paymentData.expirationDate).toLocaleDateString()} a las {new Date(paymentData.expirationDate).toLocaleTimeString()}.</li>
              <li>Conserva tu comprobante de pago.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (loading && paymentMethod === 'spei') {
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
          onClick={() => navigate(`/pagar-pedido/${orderId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
        >
          Intentar otro método de pago
        </button>
        <button
          onClick={() => navigate('/cuenta')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
        >
          Volver a mi cuenta
        </button>
      </div>
    );
  }

  if (paymentMethod === 'mercadopago' && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-4">
          <p>Redirigiendo a MercadoPago... Si no eres redirigido automáticamente, haz clic en el botón de abajo.</p>
        </div>
        
        {paymentData && paymentData.init_point && (
          <div className="text-center">
            <a 
              href={paymentData.init_point}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
            >
              Ir a MercadoPago
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Información de pago</h1>
      
      {paymentMethod === 'spei' && <SPEIPaymentInfo />}
      
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/cuenta')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ver mis pedidos
        </button>
      </div>
    </div>
  );
};

export default ProcessPayment;