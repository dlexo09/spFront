import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import MercadoPagoCheckout from '../components/MercadoPagoCheckout';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">Agrega algunos productos para continuar</p>
        <Link
          to="/productos"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  // Separar productos con precio de los que no tienen
  const itemsWithPrice = cartItems.filter(item => item.price && item.price > 0);
  const itemsWithoutPrice = cartItems.filter(item => !item.price || item.price <= 0);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tu carrito ({getTotalItems()} productos)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.sku} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => (e.target.src = '/img/noDisponible.jpg')}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">{item.marca}</p>
                    
                    {item.price > 0 ? (
                      <p className="text-green-600 font-bold">
                        ${item.price.toLocaleString('es-MX')}
                      </p>
                    ) : (
                      <p className="text-orange-600 font-semibold text-sm">Solo cotización</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border rounded">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.sku)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen del carrito */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen del carrito</h2>
          
          {/* Resumen de productos con precio */}
          {itemsWithPrice.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-700 mb-2">Para compra:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{itemsWithPrice.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${getTotalPrice().toLocaleString('es-MX')}</span>
                </div>
              </div>
              
              {!showCheckout ? (
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors mt-3"
                >
                  Proceder al pago
                </button>
              ) : (
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors mt-3"
                >
                  Volver al carrito
                </button>
              )}
            </div>
          )}

          {/* Resumen de productos sin precio */}
          {itemsWithoutPrice.length > 0 && (
            <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-bold text-orange-700 mb-2">Para cotización:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{itemsWithoutPrice.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
              </div>
              
              <Link
                to="/cotizacion"
                className="block w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition-colors mt-3 text-center"
              >
                Solicitar cotización
              </Link>
            </div>
          )}

          {/* Botón para vaciar el carrito */}
          <button 
            onClick={() => clearCart()}
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>
      </div>

      {/* Mostrar checkout de MercadoPago */}
      {showCheckout && itemsWithPrice.length > 0 && (
        <div className="mt-8">
          <MercadoPagoCheckout 
            setShowCheckout={setShowCheckout} 
            skipZohoValidation={true}  
          />
        </div>
      )}
    </div>
  );
};

export default Cart;