import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import { getBankDetails } from '../services/orderService';

const Checkout = () => {
  const { cartItems, clearCart, getTotalPrice, calculateTotal } = useCart();
  const { createOrder, isLoading: orderLoading, error: orderError } = useOrder();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const orderSubmitted = useRef(false);

  const [step, setStep] = useState(1); // 1: datos, 2: método de pago
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: '',
    rfc: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  // Solo productos con precio
  const buyableItems = cartItems.filter(item => item.price && item.price > 0);

  // Calcular totales
  const subtotal = buyableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16;
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  const bankDetails = getBankDetails();

  useEffect(() => {
    if (buyableItems.length === 0 && !orderSubmitted.current) {
      navigate('/cart');
    }
  }, [buyableItems.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitOrder = async () => {
    if (!paymentMethod) return;
    setIsSubmitting(true);
    setError('');

    try {
      const order = await createOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          rfc: formData.rfc,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
        },
        items: buyableItems,
        totals: { subtotal, tax, shipping, total },
        notes: formData.notes,
        userId: user?.id || null,
      });

      if (!order) throw new Error(orderError || 'No se pudo crear el pedido');

      orderSubmitted.current = true;
      clearCart();
      navigate(`/orden/${order.folio}`);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar tu pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (buyableItems.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-strong-blue' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-strong-blue text-white' : 'bg-gray-200'}`}>1</span>
          <span className="ml-2 font-medium hidden sm:inline">Datos de envío</span>
        </div>
        <div className={`w-12 h-0.5 mx-2 ${step >= 2 ? 'bg-strong-blue' : 'bg-gray-200'}`} />
        <div className={`flex items-center ${step >= 2 ? 'text-strong-blue' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-strong-blue text-white' : 'bg-gray-200'}`}>2</span>
          <span className="ml-2 font-medium hidden sm:inline">Método de pago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario / Selección de pago */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Información de envío</h2>
              <form onSubmit={handleContinueToPayment}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Empresa (opcional)</label>
                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-1">RFC (opcional)</label>
                    <input type="text" name="rfc" id="rfc" value={formData.rfc} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                    <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Código postal *</label>
                    <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales (opcional)</label>
                  <textarea name="notes" id="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="mt-6">
                  <button type="submit" className="w-full py-3 px-4 rounded-md bg-strong-blue hover:bg-blue-800 text-white font-medium transition-colors">
                    Continuar al método de pago
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <button onClick={() => setStep(1)} className="text-strong-blue hover:underline text-sm mr-3">← Volver a datos de envío</button>
                <h2 className="text-xl font-semibold">Elige tu método de pago</h2>
              </div>

              {/* Opción: Transferencia bancaria */}
              <div
                onClick={() => setPaymentMethod('transfer')}
                className={`bg-white border-2 rounded-lg p-5 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-strong-blue shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'transfer' ? 'border-strong-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-strong-blue" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Transferencia / Depósito Bancario</h3>
                    <p className="text-gray-600 text-sm mt-1">Realiza una transferencia SPEI o depósito en ventanilla. Recibirás los datos bancarios y un folio para identificar tu pago.</p>
                    <div className="mt-3 bg-blue-50 rounded-md p-3 text-sm">
                      <p className="font-medium text-strong-blue mb-1">Ideal para compras mayores</p>
                      <p className="text-gray-600">Sin límite de monto · Sin comisiones · Confirmación en 24 hrs hábiles</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opción: MercadoPago */}
              <div
                onClick={() => setPaymentMethod('mercadopago')}
                className={`bg-white border-2 rounded-lg p-5 cursor-pointer transition-all ${paymentMethod === 'mercadopago' ? 'border-light-blue shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'mercadopago' ? 'border-light-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'mercadopago' && <div className="w-2.5 h-2.5 rounded-full bg-light-blue" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Tarjeta de crédito / débito</h3>
                    <p className="text-gray-600 text-sm mt-1">Pago seguro con MercadoPago. Acepta Visa, Mastercard, American Express y más.</p>
                    <div className="mt-3 bg-sky-50 rounded-md p-3 text-sm">
                      <p className="font-medium text-light-blue mb-1">Pago instantáneo</p>
                      <p className="text-gray-600">Hasta 12 MSI · Confirmación inmediata</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos bancarios preview (solo si eligió transfer) */}
              {paymentMethod === 'transfer' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Datos bancarios para tu transferencia</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Institución:</span>
                    <span className="font-medium">{bankDetails.bank}</span>
                    <span className="text-gray-600">Beneficiario:</span>
                    <span className="font-medium">{bankDetails.accountName}</span>
                    <span className="text-gray-600">CLABE:</span>
                    <span className="font-mono font-medium">{bankDetails.clabe}</span>
                  </div>
                  <p className="text-xs text-green-700 mt-2">Usa tu número de folio como referencia al hacer la transferencia</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={!paymentMethod || isSubmitting || orderLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  !paymentMethod || isSubmitting || orderLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-strong-blue hover:bg-blue-800'
                }`}
              >
                {isSubmitting || orderLoading ? 'Creando tu pedido...' : 'Confirmar pedido'}
              </button>
            </div>
          )}
        </div>

        {/* Resumen de compra (sidebar) */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden sticky top-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Resumen de compra</h2>

              <div className="border-t border-b py-4 mb-4 space-y-3 max-h-64 overflow-y-auto">
                {buyableItems.map((item) => (
                  <div key={item.sku} className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-sm ml-2 flex-shrink-0">${(item.price * item.quantity).toLocaleString('es-MX')}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
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
                  <span>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-MX')}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-base">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-MX')}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">* Envío gratis en compras mayores a $1,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;