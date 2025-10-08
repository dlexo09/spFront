import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { createOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    notes: ''
  });

  // Calcular totales
  const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.16; // IVA 16%
  const shipping = subtotal > 1000 ? 0 : 150; // Envío gratis en compras mayores a $1000
  const total = subtotal + tax + shipping;

  useEffect(() => {
    // Verificar si hay productos en el carrito
    if (cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Crear objeto de orden
      const orderData = {
        customerData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        items: cart.items,
        subtotal,
        tax,
        shipping,
        total,
        notes: formData.notes,
        status: 'pending_payment'
      };

      // Guardar orden en la base de datos
      const order = await createOrder(orderData);
      
      // Si se guarda correctamente, redirigir a métodos de pago
      if (order && order.id) {
        clearCart(); // Limpiar el carrito
        navigate('/metodos-pago');
      } else {
        throw new Error('No se pudo crear el pedido');
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
      setError(error.message || 'Ocurrió un error al procesar tu pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return null; // No renderizar si el carrito está vacío (redirigirá en el useEffect)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Finalizar compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Información de envío</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código postal
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md ${
                      isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white font-medium`}
                  >
                    {isLoading ? 'Procesando...' : 'Continuar al pago'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden sticky top-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Resumen de compra</h2>
              
              <div className="border-t border-b py-4 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded mr-2"
                        />
                      )}
                      <div>
                        <p className="text-sm text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toLocaleString('es-MX')}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (16%)</span>
                  <span>${tax.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>
                    {shipping === 0
                      ? 'Gratis'
                      : `$${shipping.toLocaleString('es-MX')}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-MX')}</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>* Envío gratis en compras mayores a $1,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;