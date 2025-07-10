import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="mb-6 text-gray-600">¡Explora nuestros productos y encuentra algo que te guste!</p>
        <Link
          to="/productos"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  // Separar productos con precio de los que son solo para cotización
  const itemsWithPrice = cartItems.filter(item => item.price && item.price > 0);
  const itemsWithoutPrice = cartItems.filter(item => !item.price || item.price === 0);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tu carrito ({getTotalItems()} productos)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          
          {/* Productos con precio (para compra) */}
          {itemsWithPrice.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center">
                <span className="mr-2">🛒</span>
                Productos para compra ({itemsWithPrice.length})
              </h2>
              {itemsWithPrice.map((item) => (
                <div key={item.sku} className="bg-white border-l-4 border-green-500 rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">SKU: {item.sku}</p>
                      <p className="text-green-600 font-bold text-lg">${item.price}</p>
                      <p className="text-sm text-gray-500">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Productos sin precio (solo cotización) */}
          {itemsWithoutPrice.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center">
                <span className="mr-2">📋</span>
                Productos para cotización ({itemsWithoutPrice.length})
              </h2>
              {itemsWithoutPrice.map((item) => (
                <div key={item.sku} className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">SKU: {item.sku}</p>
                      <p className="text-orange-600 font-bold">Solo cotización</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  <span>${getTotalPrice()}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors mt-3">
                Proceder al pago
              </button>
            </div>
          )}

          {/* Resumen de productos para cotización */}
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
                to={`/cotizacion?productos=${encodeURIComponent(JSON.stringify(itemsWithoutPrice))}`}
                className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition-colors mt-3 block text-center"
              >
                Solicitar cotización
              </Link>
            </div>
          )}

          {/* Botón para cotizar todo si hay productos mixtos */}
          {itemsWithPrice.length > 0 && itemsWithoutPrice.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-700 mb-2">¿Prefieres cotizar todo?</h3>
              <Link
                to={`/cotizacion?productos=${encodeURIComponent(JSON.stringify(cartItems))}`}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors block text-center"
              >
                Cotizar todos los productos
              </Link>
            </div>
          )}

          {/* Botón para vaciar carrito */}
          <button
            onClick={clearCart}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;