import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '../context/CartContext';
import API_CONFIG from '../config';


const MercadoPagoCheckout = ({ setShowCheckout }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    requiresInvoice: false,
    rfc: '',
    businessName: ''
  });
  const [showForm, setShowForm] = useState(true);
  const { cartItems, getTotalPrice } = useCart();

  useEffect(() => {
    // Inicializar MercadoPago con tu Public Key de PRODUCCIÓN
    initMercadoPago('APP_USR-0e33640c-743f-454e-bff0-102abe8f7ed5', {
      locale: 'es-MX'
    });
  }, []);

  // Función para llenar datos de prueba rápidamente
  const fillTestData = () => {
    setCustomerData({
      name: "Test User",
      email: "test_user_123@testuser.com",
      phone: "5551234567"
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(customerData.phone)) {
      alert('El teléfono debe tener 10 dígitos numéricos');
      return;
    }

    // Validar datos de facturación si se requiere
    if (customerData.requiresInvoice) {
      const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z0-9]{3}$/;
      if (!rfcRegex.test(customerData.rfc)) {
        alert('Por favor ingresa un RFC válido');
        return;
      }

      if (!customerData.businessName.trim()) {
        alert('La razón social es requerida para la facturación');
        return;
      }
    }

    setShowForm(false);
    createPreference();
  };

  const createPreference = async () => {
    setLoading(true);

    try {
      // Filtrar solo productos con precio
      const itemsWithPrice = cartItems.filter(item => item.price && item.price > 0);

      if (itemsWithPrice.length === 0) {
        alert('No hay productos válidos para el pago');
        return;
      }

      // Preparar items para MercadoPago
      const items = itemsWithPrice.map(item => ({
        id: item.sku || `item-${Date.now()}`,
        title: item.name,
        description: item.description || 'Producto Siscoprint',
        picture_url: `${window.location.origin}${item.image}`,
        category_id: 'electronics',
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
        currency_id: 'MXN'
      }));

      const preference = {
        items: items,
        payer: {
          name: customerData.name,
          email: customerData.email,
          phone: {
            number: customerData.phone
          },
          identification: customerData.requiresInvoice ? {
            type: 'RFC',
            number: customerData.rfc
          } : undefined,
          // Agregar datos de facturación como metadata
          metadata: customerData.requiresInvoice ? {
            requires_invoice: true,
            business_name: customerData.businessName,
            rfc: customerData.rfc
          } : undefined
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12
        },
        back_urls: {
          success: `${window.location.origin}/pago-exitoso`,
          failure: `${window.location.origin}/pago-fallido`,
          pending: `${window.location.origin}/pago-pendiente`
        },
        external_reference: `siscoprint-${Date.now()}`,
        statement_descriptor: 'SISCOPRINT'
      };

      console.log('Enviando preferencia al backend Lambda...');
      console.log('Preference data:', preference);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_PREFERENCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('Error del backend:', errorData);
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (data.id) {
        setPreferenceId(data.id);
        console.log('✅ Preferencia creada con ID:', data.id);
      } else {
        console.error('Error al crear la preferencia:', data);
        alert(`Error al preparar el pago: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);

      if (error.name === 'AbortError') {
        alert('La solicitud tardó demasiado. Por favor intenta nuevamente.');
      } else {
        // Mejorar mensajes de error para el usuario
        let userMessage = 'Error de conexión con el servidor';
        if (error.message.includes('Failed to fetch')) {
          userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.message.includes('CORS')) {
          userMessage = 'Error de configuración del servidor. Contacta al soporte.';
        } else if (error.message.includes('auto_return invalid')) {
          userMessage = 'Configurando pago... Por favor intenta nuevamente.';
        } else if (error.message.includes('back_url')) {
          userMessage = 'Error en la configuración de URLs de retorno del pago.';
        } else {
          userMessage = error.message;
        }

        alert(userMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">💳 Pago Seguro</h2>

      {showForm && (
        <div className="mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border mb-4">
            <h3 className="font-bold text-blue-700 mb-3 flex items-center">
              📋 Datos para el pago
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Necesitamos algunos datos para procesar tu pago de forma segura
            </p>

            {/* Remover botón de datos de prueba */}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez García"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="correo@ejemplo.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  📧 Recibirás el comprobante de pago en este correo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 5551234567"
                  required
                  pattern="[0-9]{10}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  📱 10 dígitos, sin espacios ni guiones
                </p>
              </div>

              {/* Agregar campo de facturación */}
              <div className="pt-4 border-t">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={customerData.requiresInvoice}
                    onChange={(e) => setCustomerData({
                      ...customerData,
                      requiresInvoice: e.target.checked
                    })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Necesito factura
                  </span>
                </label>
              </div>

              {customerData.requiresInvoice && (
                <div className="space-y-4 pt-4 pl-4 border-l-2 border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RFC *
                    </label>
                    <input
                      type="text"
                      value={customerData.rfc}
                      onChange={(e) => setCustomerData({
                        ...customerData,
                        rfc: e.target.value.toUpperCase()
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: XAXX010101000"
                      required={customerData.requiresInvoice}
                      pattern="^[A-ZÑ&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z0-9]{3}$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón Social *
                    </label>
                    <input
                      type="text"
                      value={customerData.businessName}
                      onChange={(e) => setCustomerData({
                        ...customerData,
                        businessName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre o razón social"
                      required={customerData.requiresInvoice}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Continuar al pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Resto del contenido */}
      {!showForm && (
        <>
          {/* Customer Data Summary */}
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              👤 Datos del cliente
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Nombre:</strong> {customerData.name}</p>
              <p><strong>Email:</strong> {customerData.email}</p>
              {customerData.phone && (
                <p><strong>Teléfono:</strong> {customerData.phone}</p>
              )}
              {customerData.requiresInvoice && (
                <>
                  <p><strong>RFC:</strong> {customerData.rfc}</p>
                  <p><strong>Razón Social:</strong> {customerData.businessName}</p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium"
            >
              ✏️ Editar datos
            </button>
          </div>

          {/* MercadoPago Benefits Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
            <h3 className="font-bold text-blue-700 mb-3">🎯 Ventajas de pagar con MercadoPago:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✅</span>
                <span>Hasta 12 meses sin intereses</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✅</span>
                <span>Pago 100% seguro</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✅</span>
                <span>Todas las tarjetas</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✅</span>
                <span>Efectivo en OXXO</span>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Productos:</span>
              <span className="font-semibold">
                {cartItems.filter(item => item.price > 0).reduce((total, item) => total + item.quantity, 0)} items
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-lg font-semibold">Total a pagar:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${getTotalPrice().toLocaleString('es-MX')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              *Meses sin intereses disponibles con tarjetas participantes
            </p>
          </div>

          {/* MercadoPago Wallet Button */}
          {!preferenceId ? (
            <button
              onClick={createPreference}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Preparando pago...
                </div>
              ) : (
                'Pagar con MercadoPago'
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 font-semibold">
                  ✅ Pago preparado. Elige tu método preferido:
                </p>
              </div>

              <Wallet
                initialization={{
                  preferenceId: preferenceId,
                  redirectMode: 'self'
                }}
                customization={{
                  texts: {
                    valueProp: 'smart_option',
                  },
                }}
              />

              <button
                onClick={() => setShowCheckout(false)}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Cancelar y volver al carrito
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MercadoPagoCheckout;