import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { getBankDetails } from '../services/orderService';

const statusLabels = {
  pending_payment: { label: 'Pendiente de pago', color: 'bg-yellow-100 text-yellow-800' },
  payment_uploaded: { label: 'Comprobante enviado', color: 'bg-blue-100 text-blue-800' },
  payment_confirmed: { label: 'Pago confirmado', color: 'bg-green-100 text-green-800' },
  processing: { label: 'En proceso', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

const OrderConfirmation = () => {
  const { folio } = useParams();
  const { getOrderByFolio, isLoading } = useOrder();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const bankDetails = getBankDetails();

  useEffect(() => {
    const loadOrder = async () => {
      if (!folio) return;
      const data = await getOrderByFolio(folio);
      if (data) {
        setOrder(data);
      } else {
        setError('No se encontró la orden con ese folio.');
      }
    };
    loadOrder();
  }, [folio]);

  const copyFolio = () => {
    navigator.clipboard.writeText(order?.folio || folio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-strong-blue border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Cargando tu pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="text-strong-blue hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  if (!order) return null;

  const status = statusLabels[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
  const isPendingPayment = order.status === 'pending_payment';
  const isTransfer = order.payment_method === 'transfer' || !order.payment_method;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header de confirmación */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">¡Pedido creado con éxito!</h1>
        <p className="text-gray-600">Tu pedido ha sido registrado. Guarda tu número de folio.</p>
      </div>

      {/* Folio card */}
      <div className="bg-strong-blue text-white rounded-lg p-6 mb-6 text-center">
        <p className="text-sm opacity-80 mb-1">Tu número de folio</p>
        <p className="text-3xl font-bold font-mono tracking-wider mb-3">{order.folio}</p>
        <button
          onClick={copyFolio}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          {copied ? '¡Copiado!' : 'Copiar folio'}
        </button>
      </div>

      {/* Estado actual */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Estado del pedido</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>

        {/* Datos bancarios si es transferencia y pendiente de pago */}
        {isPendingPayment && isTransfer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
            <h3 className="font-semibold text-strong-blue mb-3">Realiza tu transferencia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="text-gray-500">Institución</span>
                <p className="font-medium">{bankDetails.bank}</p>
              </div>
              <div>
                <span className="text-gray-500">Beneficiario</span>
                <p className="font-medium">{bankDetails.accountName}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">CLABE</span>
                <p className="font-mono font-medium text-lg">{bankDetails.clabe}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Referencia</span>
                <p className="font-medium">{order.folio}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Monto a depositar</span>
                <p className="font-bold text-lg text-strong-blue">${order.total?.toLocaleString('es-MX')} MXN</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/subir-comprobante/${order.id}`)}
              className="w-full bg-strong-blue hover:bg-blue-800 text-white py-3 rounded-md font-medium transition-colors"
            >
              Subir comprobante de pago
            </button>
          </div>
        )}

        {order.status === 'payment_uploaded' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">Tu comprobante ha sido recibido. Estamos verificando tu pago.</p>
            <p className="text-green-600 text-sm mt-1">Te notificaremos cuando sea confirmado.</p>
          </div>
        )}
      </div>

      {/* Resumen del pedido */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Productos del pedido</h2>
        <div className="space-y-3">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded" />
                )}
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku} · Cant: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toLocaleString('es-MX')}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          {(() => {
            const subtotal = Number(order.subtotal || 0);
            const tax = Number(order.tax || 0);
            const shipping = Number(order.shipping_cost || 0);
            const total = Number(order.total || 0);
            const paymentAdjustment = Number((total - (subtotal + tax + shipping)).toFixed(2));

            return (
              <>
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${order.subtotal?.toLocaleString('es-MX')}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">IVA (16%)</span><span>${order.tax?.toLocaleString('es-MX')}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Envío</span><span>{order.shipping_cost === 0 ? 'Gratis' : `$${order.shipping_cost?.toLocaleString('es-MX')}`}</span></div>
          {paymentAdjustment > 0 && (
            <div className="flex justify-between"><span className="text-gray-600">Cargo por pago digital</span><span>+${paymentAdjustment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
          )}
          {paymentAdjustment < 0 && (
            <div className="flex justify-between text-green-700"><span>Bonificación por transferencia</span><span>${paymentAdjustment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>${order.total?.toLocaleString('es-MX')}</span></div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Datos de envío</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Nombre:</span> <span className="font-medium">{order.customer_name}</span></div>
          <div><span className="text-gray-500">Email:</span> <span className="font-medium">{order.customer_email}</span></div>
          <div><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{order.customer_phone}</span></div>
          {order.customer_company && <div><span className="text-gray-500">Empresa:</span> <span className="font-medium">{order.customer_company}</span></div>}
          <div className="sm:col-span-2"><span className="text-gray-500">Dirección:</span> <span className="font-medium">{[order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')}</span></div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/productos" className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-md font-medium transition-colors">
          Seguir comprando
        </Link>
        {isPendingPayment && isTransfer && (
          <button
            onClick={() => navigate(`/subir-comprobante/${order.id}`)}
            className="flex-1 bg-strong-blue hover:bg-blue-800 text-white py-3 rounded-md font-medium transition-colors"
          >
            Subir comprobante
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
