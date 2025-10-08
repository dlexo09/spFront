import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import { CartContext } from '../context/CartContext';

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const { currentOrder } = useContext(OrderContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  
  // Comprobar que haya una orden activa
  if (!currentOrder) {
    navigate('/checkout');
    return null;
  }
  
  const handleContinue = () => {
    if (selectedMethod) {
      navigate(`/procesar-pago/${selectedMethod}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Selecciona un método de pago</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="space-y-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedMethod === 'mercadopago' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMethod('mercadopago')}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    id="mercadopago" 
                    checked={selectedMethod === 'mercadopago'}
                    onChange={() => setSelectedMethod('mercadopago')}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="mercadopago" className="font-medium text-gray-900 block cursor-pointer">
                    Mercado Pago
                  </label>
                  <p className="text-sm text-gray-500">Paga con tarjeta de crédito/débito, OXXO o SPEI</p>
                </div>
                <div className="ml-auto">
                  <img src="/img/mercadopago-logo.png" alt="Mercado Pago" className="h-8" />
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedMethod === 'transferencia' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMethod('transferencia')}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    id="transferencia" 
                    checked={selectedMethod === 'transferencia'}
                    onChange={() => setSelectedMethod('transferencia')}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="transferencia" className="font-medium text-gray-900 block cursor-pointer">
                    Transferencia bancaria
                  </label>
                  <p className="text-sm text-gray-500">Transfiere el monto a nuestra cuenta BBVA y envía el comprobante</p>
                </div>
                <div className="ml-auto">
                  <img src="/img/bbva-logo.png" alt="BBVA" className="h-8" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className={`w-full py-3 px-4 rounded-md ${
                selectedMethod 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
          
          <div className="border-t border-b py-4 mb-4">
            {cart.items.map(item => (
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
  );
};

export default PaymentMethods;