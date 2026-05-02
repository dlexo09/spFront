import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import { getBankDetails } from '../services/orderService';
import API_CONFIG from '../config';
import { calculateShippingQuote } from '../utils/shippingRules';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { createOrder, setPaymentMethod: setOrderPaymentMethod, isLoading: orderLoading, error: orderError } = useOrder();
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
  const shippingQuote = calculateShippingQuote({
    subtotal,
    state: formData.state,
    zipCode: formData.zipCode,
  });
  const shipping = shippingQuote.cost;
  const baseTotal = subtotal + tax + shipping;
  const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
  // El markup del gateway ya está embebido en los precios de los productos.
  // paymentSurcharge = 0 para no cobrar doble.
  const paymentSurchargeRate = 0;
  const transferDiscountRate = Number(import.meta.env.VITE_TRANSFER_DISCOUNT_RATE || import.meta.env.VITE_MP_COMMISSION_RATE || 0.04);
  const paymentSurcharge = 0;
  const transferDiscount = paymentMethod === 'transfer'
    ? roundCurrency(baseTotal * transferDiscountRate)
    : 0;
  const total = Math.max(0, roundCurrency(baseTotal - transferDiscount));

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

  const createMercadoPagoPreference = async (order) => {
    const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
    const isLocalSite = /localhost|127\.0\.0\.1/.test(publicSiteUrl);

    const items = buyableItems.map((item) => ({
      id: item.sku || String(item.id || item.name),
      title: item.name,
      description: item.description || 'Producto Siscoprint',
      picture_url: item.image ? `${window.location.origin}${item.image}` : undefined,
      quantity: item.quantity,
      unit_price: Number(item.price),
      currency_id: 'MXN',
    }));

    const extraItems = [];

    if (tax > 0) {
      extraItems.push({
        id: 'tax',
        title: 'IVA (16%)',
        quantity: 1,
        unit_price: Number(roundCurrency(tax)),
        currency_id: 'MXN',
      });
    }

    if (shipping > 0) {
      extraItems.push({
        id: 'shipping',
        title: 'Costo de envio',
        quantity: 1,
        unit_price: Number(roundCurrency(shipping)),
        currency_id: 'MXN',
      });
    }

    if (paymentSurcharge > 0) {
      extraItems.push({
        id: 'payment-surcharge',
        title: `Cargo por pago digital (${(paymentSurchargeRate * 100).toFixed(0)}%)`,
        quantity: 1,
        unit_price: Number(paymentSurcharge),
        currency_id: 'MXN',
      });
    }

    const payload = {
      items: [...items, ...extraItems],
      payer: {
        name: formData.name,
        email: formData.email,
      },
      notification_url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEBHOOK}`,
      ...(isLocalSite
        ? {}
        : {
            back_urls: {
              success: `${publicSiteUrl}/pago-exitoso?folio=${order.folio}`,
              failure: `${publicSiteUrl}/pago-fallido?folio=${order.folio}`,
              pending: `${publicSiteUrl}/pago-pendiente?folio=${order.folio}`,
            },
          }),
      external_reference: order.folio,
      metadata: {
        order_id: order.id,
        folio: order.folio,
      },
      statement_descriptor: 'SISCOPRINT',
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_PREFERENCE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo crear la preferencia de pago');
    }

    const pref = await response.json();
    const redirectUrl = pref.init_point || pref.sandbox_init_point;

    if (!redirectUrl) {
      throw new Error('Mercado Pago no devolvio una URL de pago valida');
    }

    return redirectUrl;
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
        notes: [
          formData.notes,
          `Envio estimado desde ${shippingQuote.branchName} | Zona: ${shippingQuote.zoneLabel} | ETA: ${shippingQuote.etaLabel}`,
        ].filter(Boolean).join(' | '),
        userId: user?.id || null,
      });

      if (!order) throw new Error(orderError || 'No se pudo crear el pedido');

      const updatedOrder = await setOrderPaymentMethod(order.id, paymentMethod);
      if (!updatedOrder) throw new Error('No se pudo guardar el metodo de pago en la orden');

      if (paymentMethod === 'transfer') {
        orderSubmitted.current = true;
        clearCart();
        navigate(`/subir-comprobante/${order.id}`);
        return;
      }

      if (paymentMethod === 'mercadopago') {
        if (!API_CONFIG.BASE_URL) {
          throw new Error('Falta configurar VITE_API_URL para Mercado Pago');
        }

        const paymentUrl = await createMercadoPagoPreference(order);
        window.location.href = paymentUrl;
        return;
      }

      throw new Error('Metodo de pago no soportado');
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar tu pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (buyableItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f6ef_0%,#ffffff_30%,#ffffff_100%)] pt-[128px] pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/70 px-6 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm md:px-10">
          <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" aria-hidden="true" />
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-amber-200/35 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
              Checkout
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-slate-900 md:text-5xl">
              Completa tus datos y finaliza tu compra.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              Revisa tu pedido, selecciona el metodo de pago y confirma en dos pasos. Tu resumen se mantiene visible.
            </p>
          </div>
        </section>

        <div className="mt-7 flex items-center justify-center rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
          <div className={`flex items-center ${step >= 1 ? 'text-strong-blue' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-strong-blue text-white' : 'bg-gray-200'}`}>1</span>
            <span className="ml-2 font-medium hidden sm:inline">Datos de envio</span>
          </div>
          <div className={`w-12 h-0.5 mx-2 ${step >= 2 ? 'bg-strong-blue' : 'bg-gray-200'}`} />
          <div className={`flex items-center ${step >= 2 ? 'text-strong-blue' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-strong-blue text-white' : 'bg-gray-200'}`}>2</span>
            <span className="ml-2 font-medium hidden sm:inline">Metodo de pago</span>
          </div>
        </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Formulario / Selección de pago */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Informacion de envio</h2>
              <p className="mt-2 mb-5 text-sm leading-6 text-slate-500">Estos datos se usaran para el envio y la confirmacion de tu pedido.</p>
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
                  <button type="submit" className="w-full py-3 px-4 rounded-2xl bg-strong-blue hover:bg-blue-800 text-white font-medium transition-colors shadow-[0_16px_32px_rgba(30,58,138,0.2)]">
                    Continuar al metodo de pago
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
              <div className="flex items-center mb-2">
                <button onClick={() => setStep(1)} className="text-strong-blue hover:underline text-sm mr-3">← Volver a datos de envio</button>
                <h2 className="text-xl font-semibold">Elige tu metodo de pago</h2>
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
                      <p className="font-medium text-strong-blue mb-1">Precio preferente por transferencia</p>
                      <p className="text-gray-600">Sin limite de monto · Acreditacion manual en hasta 24 hrs habiles</p>
                      <p className="text-green-700 font-medium mt-1">Te bonificamos ${(baseTotal * transferDiscountRate).toLocaleString('es-MX', { minimumFractionDigits: 2 })} al pagar por transferencia</p>
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
                      <p className="text-gray-600">Hasta 12 MSI · Confirmacion inmediata</p>
                      <p className="text-sky-700 font-medium mt-1">Precio publicado incluye todos los cargos · Sin sorpresas</p>
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
                className={`w-full py-3 px-4 rounded-2xl text-white font-medium transition-colors ${
                  !paymentMethod || isSubmitting || orderLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-strong-blue hover:bg-blue-800'
                }`}
              >
                {isSubmitting || orderLoading
                  ? paymentMethod === 'mercadopago'
                    ? 'Conectando con Mercado Pago...'
                    : 'Creando tu pedido...'
                  : paymentMethod === 'transfer'
                    ? 'Confirmar y subir comprobante'
                    : paymentMethod === 'mercadopago'
                      ? 'Pagar con tarjeta en Mercado Pago'
                      : 'Confirmar pedido'}
              </button>
            </div>
          )}
        </div>

        {/* Resumen de compra (sidebar) */}
        <div className="lg:col-span-1">
          <div className="sticky top-[118px] overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
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
                <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <p>Enviamos desde: {shippingQuote.branchName}</p>
                  <p>Zona: {shippingQuote.zoneLabel} · Entrega estimada: {shippingQuote.etaLabel}</p>
                </div>
                {paymentMethod === 'transfer' && (
                  <div className="flex justify-between text-green-700">
                    <span>Bonificacion por transferencia ({(transferDiscountRate * 100).toFixed(0)}%)</span>
                    <span>-${transferDiscount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold text-base">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">* Envio gratis en compras mayores a ${shippingQuote.freeShippingThreshold.toLocaleString('es-MX')}. El precio publicado incluye cargo por pago digital; con transferencia aplicamos bonificacion por pronto pago.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Checkout;