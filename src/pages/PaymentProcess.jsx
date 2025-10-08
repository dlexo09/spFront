import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';

const PaymentProcess = () => {
  const { method } = useParams();
  const { currentOrder, createPayment } = useContext(OrderContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirigir si no hay orden activa
    if (!currentOrder) {
      navigate('/checkout');
    }
  }, [currentOrder, navigate]);
  
  // Procesar pago según el método seleccionado
  const processPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (method === 'mercadopago') {
        // Crear preferencia en Mercado Pago
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/mercadopago/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: currentOrder.id,
            items: currentOrder.items,
            total: currentOrder.total
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al procesar el pago');
        }
        
        // Redirigir a Mercado Pago
        window.location.href = data.init_point;
      } else if (method === 'transferencia') {
        // Procesar transferencia bancaria
        if (!comprobante) {
          setError('Por favor, sube un comprobante de pago');
          setLoading(false);
          return;
        }
        
        // Crear un FormData para enviar el archivo
        const formData = new FormData();
        formData.append('comprobante', comprobante);
        formData.append('order_id', currentOrder.id);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/transferencia`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al procesar el pago');
        }
        
        // Redirigir a página de pago pendiente
        navigate(`/pago-pendiente?order_id=${currentOrder.id}`);
      } else {
        throw new Error('Método de pago no válido');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar carga de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprobante(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!currentOrder) {
    return null; // No renderizar si no hay orden (redirigirá en el useEffect)
  }
  
  // Renderizar interfaz según el método de pago
  if (method === 'transferencia') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Pago por transferencia bancaria</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Realiza tu transferencia</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Datos bancarios:</p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p><span className="font-medium">Banco:</span> BBVA</p>
                    <p><span className="font-medium">Beneficiario:</span> Sisco Productos S.A. de C.V.</p>
                    <p><span className="font-medium">Cuenta:</span> 0123456789</p>
                    <p><span className="font-medium">CLABE:</span> 012 180 001234567890</p>
                    <p><span className="font-medium">Referencia:</span> {currentOrder.id}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Monto a pagar:</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${currentOrder.total?.toLocaleString('es-MX')}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Sube tu comprobante de pago:</p>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  
                  {previewUrl && (
                    <div className="mt-3">
                      {comprobante?.type.includes('image') ? (
                        <img 
                          src={previewUrl} 
                          alt="Vista previa del comprobante" 
                          className="max-h-40 rounded-lg border"
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{comprobante?.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <p>{error}</p>
                  </div>
                )}
                
                <button
                  onClick={processPayment}
                  disabled={loading || !comprobante}
                  className={`w-full py-3 px-4 rounded-md ${
                    !loading && comprobante 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Procesando...' : 'Confirmar pago'}
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Tu pedido será procesado una vez que validemos tu pago.
                  Recibirás un correo electrónico con la confirmación.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Resumen del pedido #{currentOrder.id}</h2>
              
              <div className="border-t border-b py-4 mb-4">
                {currentOrder.items?.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span className="text-gray-700">{item.name} x {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toLocaleString('es-MX')}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${currentOrder.subtotal?.toLocaleString('es-MX')}</span>
                </div>
                {currentOrder.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA</span>
                    <span>${currentOrder.tax?.toLocaleString('es-MX')}</span>
                  </div>
                )}
                {currentOrder.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span>${currentOrder.shipping?.toLocaleString('es-MX')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total</span>
                  <span>${currentOrder.total?.toLocaleString('es-MX')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Para Mercado Pago, mostrar página de carga
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
      <h2 className="text-xl font-medium">Redireccionando a Mercado Pago...</h2>
      <p className="text-gray-600 mt-2">Por favor espere, estamos preparando el pago.</p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4 max-w-md mx-auto">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/metodos-pago')}
            className="text-blue-600 hover:underline mt-2"
          >
            Volver a métodos de pago
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentProcess;