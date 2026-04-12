import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_CONFIG from '../config';

const PagoExitoso = () => {
  const { clearCart } = useCart();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [syncMessage, setSyncMessage] = useState('');
  const folio = searchParams.get('folio');

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const status = searchParams.get('status');

    if (!folio) {
      return;
    }

    // Si Mercado Pago no regresó approved, esperamos la confirmación asíncrona del webhook.
    if (status && status !== 'approved') {
      setSyncMessage('Pago recibido en estado pendiente. Te notificaremos cuando se confirme.');
      return;
    }

    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 9;

    const checkPaymentStatus = async () => {
      if (!isMounted) return;

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT_STATUS}?folio=${encodeURIComponent(folio)}`
        );

        if (!response.ok) {
          throw new Error('No se pudo consultar estado de pago');
        }

        const data = await response.json();

        if (data.status === 'payment_verified') {
          setSyncMessage(`Pedido ${folio} confirmado y marcado como pago verificado.`);
          return;
        }

        attempts += 1;
        if (attempts >= maxAttempts) {
          setSyncMessage('Pago exitoso recibido. Estamos validando con el banco y te notificaremos en breve.');
          return;
        }

        setSyncMessage('Pago exitoso recibido. Estamos validando la transaccion...');
        setTimeout(checkPaymentStatus, 5000);
      } catch (error) {
        setSyncMessage('Pago exitoso recibido. Estamos validando la transaccion...');
      }
    };

    checkPaymentStatus();

    return () => {
      isMounted = false;
    };
  }, [folio, searchParams]);

  const goHome = () => {
    navigate('/');
    window.location.assign('/');
  };

  const goToOrder = () => {
    if (!folio) {
      navigate('/cuenta');
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      const redirectPath = `/orden/${folio}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    navigate(`/orden/${folio}`);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-green-50 p-8 rounded-lg text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">¡Pago exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu compra ha sido procesada correctamente. Recibirás un email con los detalles.
        </p>
        {syncMessage && (
          <p className="text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg px-3 py-2 mb-4">
            {syncMessage}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={goHome}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>

          <button
            type="button"
            onClick={goToOrder}
            disabled={authLoading}
            className="bg-white border border-blue-200 text-blue-700 px-6 py-3 rounded hover:bg-blue-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {folio ? 'Ver este pedido' : 'Ir a mis pedidos'}
          </button>

          {!user && folio && (
            <p className="text-xs text-gray-500 sm:ml-2 sm:self-center">Si no has iniciado sesion, te llevaremos a login para continuar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;