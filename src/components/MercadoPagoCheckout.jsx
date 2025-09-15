import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '../context/CartContext';
import API_CONFIG from '../config';
import ZOHO_BOOKS_API from '../services/zohoBooks';

const MercadoPagoCheckout = ({ setShowCheckout, skipZohoValidation = true }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [zohoCustomerId, setZohoCustomerId] = useState(null);
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [zohoStatus, setZohoStatus] = useState(skipZohoValidation ? 'skipped' : 'checking');
  const [errorMessage, setErrorMessage] = useState('');

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    requiresInvoice: false,
    rfc: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
      locale: 'es-MX'
    });

    // Si skipZohoValidation es true, no intentamos conectar con Zoho
    if (!skipZohoValidation) {
      // Verificar conexión con Zoho Books con mejor manejo de errores
      const checkZohoConnection = async () => {
        try {
          const connectionStatus = await ZOHO_BOOKS_API.checkConnection();
          setZohoStatus(connectionStatus.status);
          
          if (connectionStatus.status === 'connected') {
            console.log('✅ Conexión con Zoho Books establecida');
          } else {
            console.warn('⚠️ Zoho Books no disponible:', connectionStatus.message);
          }
        } catch (error) {
          console.error('❌ Error conectando con Zoho Books:', error);
          setZohoStatus('error');
        }
      };
      checkZohoConnection();
    } else {
      console.log('⚠️ Verificación de Zoho omitida por configuración');
      setZohoStatus('skipped');
    }
  }, [skipZohoValidation]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Validar campos requeridos
      if (!customerData.name || !customerData.email || !customerData.phone) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerData.email)) {
        throw new Error('Por favor ingresa un correo electrónico válido');
      }

      // Validar teléfono (solo números y mínimo 10 dígitos)
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(customerData.phone.replace(/\D/g, ''))) {
        throw new Error('El teléfono debe tener al menos 10 dígitos');
      }

      // Si requiere factura, validar RFC
      if (customerData.requiresInvoice) {
        if (!customerData.rfc || !customerData.businessName) {
          throw new Error('Para facturación, completa RFC y Razón Social');
        }
      }

      // Si skipZohoValidation es true o Zoho no está disponible, solo guardamos localmente
      if (skipZohoValidation || zohoStatus !== 'connected') {
        // Guardar datos del cliente localmente
        localStorage.setItem('lastCustomer', JSON.stringify({
          ...customerData,
          timestamp: new Date().toISOString()
        }));
        
        // Guardar pedido en localStorage
        const orders = JSON.parse(localStorage.getItem('localOrders') || '[]');
        orders.push({
          id: `ORD-${Date.now()}`,
          customerData,
          items: cartItems,
          total: getTotalPrice(),
          status: 'pending_payment',
          date: new Date().toISOString()
        });
        localStorage.setItem('localOrders', JSON.stringify(orders));
        console.log('💾 Pedido guardado localmente');
      } else {
        // Modo con Zoho operativo
        // 1. Validar cliente en Zoho Books
        const customerValidation = await ZOHO_BOOKS_API.validateCustomer(customerData.email);
        
        if (customerValidation.error) {
          throw new Error(customerValidation.message || 'Error validando cliente');
        }
        
        let customerId;
        if (!customerValidation.exists) {
          // 2. Crear cliente si no existe
          const newCustomer = await ZOHO_BOOKS_API.createCustomer({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            businessName: customerData.requiresInvoice ? customerData.businessName : undefined,
            rfc: customerData.requiresInvoice ? customerData.rfc : undefined,
            address: customerData.address,
            city: customerData.city,
            state: customerData.state,
            zipCode: customerData.zipCode
          });
          
          if (newCustomer.error) {
            throw new Error(newCustomer.message || 'Error creando cliente');
          }
          
          customerId = newCustomer.contact.contact_id;
        } else {
          customerId = customerValidation.contact.contact_id;
        }

        setZohoCustomerId(customerId);
      }

      // Continuar con el proceso normal
      setShowForm(false);
      createPreference();
    } catch (error) {
      console.error('Error procesando datos del cliente:', error);
      setErrorMessage(error.message || 'Error procesando datos. Por favor intenta nuevamente.');
      setLoading(false);
    }
  };

  const createPreference = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const itemsWithPrice = cartItems.filter(item => item.price && item.price > 0);
      
      if (itemsWithPrice.length === 0) {
        setErrorMessage('No hay productos válidos para el pago');
        setLoading(false);
        return;
      }

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
          metadata: customerData.requiresInvoice ? {
            requires_invoice: true,
            business_name: customerData.businessName,
            rfc: customerData.rfc
          } : undefined,
          address: {
            street_name: customerData.address,
            city_name: customerData.city,
            state_name: customerData.state,
            zip_code: customerData.zipCode
          }
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

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_PREFERENCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creando preferencia');
      }

      const data = await response.json();

      if (data.id) {
        // Solo crear factura en Zoho si está disponible y no estamos saltando la validación
        if (!skipZohoValidation && zohoStatus === 'connected' && zohoCustomerId) {
          try {
            const invoiceResult = await ZOHO_BOOKS_API.createInvoice({
              customerId: zohoCustomerId,
              items: cartItems.map(item => ({
                'sku-zoho': item['sku-zoho'],
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              preferenceId: data.id
            });
            
            if (invoiceResult.error) {
              console.error('Error creando factura:', invoiceResult.message);
              // Guardar para intentar después
              savePendingInvoice(data.id);
            } else {
              console.log('✅ Factura creada en Zoho Books');
            }
          } catch (zohoError) {
            console.error('Error creando factura en Zoho:', zohoError);
            // Guardar para intentar después
            savePendingInvoice(data.id);
          }
        } else {
          // Guardar para sincronizar después
          savePendingInvoice(data.id);
        }

        setPreferenceId(data.id);
        console.log('✅ Preferencia creada con ID:', data.id);
      } else {
        throw new Error('Error creando preferencia de pago');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Error procesando el pago');
    } finally {
      setLoading(false);
    }
  };
  
  // Función auxiliar para guardar facturas pendientes
  const savePendingInvoice = (preferenceId) => {
    const pendingInvoices = JSON.parse(localStorage.getItem('pendingZohoInvoices') || '[]');
    pendingInvoices.push({
      customerId: zohoCustomerId,
      customerData: customerData,
      items: cartItems.map(item => ({
        'sku-zoho': item['sku-zoho'],
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      preferenceId: preferenceId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingZohoInvoices', JSON.stringify(pendingInvoices));
    console.log('💾 Factura guardada localmente para sincronización posterior');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setCustomerData({
      ...customerData,
      [name]: newValue
    });
  };

  return (
    <div className="checkout-container bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <button 
        onClick={() => setShowCheckout(false)} 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        &times; Cerrar
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Finalizar compra</h2>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {(zohoStatus !== 'connected' || skipZohoValidation) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Procesamiento local de pedido</p>
          <p className="text-sm">Estamos procesando tu pedido con Mercado Pago. Recibirás tu confirmación por email.</p>
        </div>
      )}
      
      {showForm ? (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Información personal */}
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nombre completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Correo electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Dirección de envío</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="address" className="block text-gray-700 font-medium mb-1">Dirección *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-1">Ciudad *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-medium mb-1">Estado *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={customerData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-gray-700 font-medium mb-1">Código postal *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={customerData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Facturación */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="requiresInvoice"
                name="requiresInvoice"
                checked={customerData.requiresInvoice}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-500"
              />
              <label htmlFor="requiresInvoice" className="ml-2 text-gray-700 font-medium">
                Requiero factura
              </label>
            </div>

            {customerData.requiresInvoice && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessName" className="block text-gray-700 font-medium mb-1">Razón social *</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={customerData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={customerData.requiresInvoice}
                  />
                </div>
                <div>
                  <label htmlFor="rfc" className="block text-gray-700 font-medium mb-1">RFC *</label>
                  <input
                    type="text"
                    id="rfc"
                    name="rfc"
                    value={customerData.rfc}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={customerData.requiresInvoice}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Continuar con el pago'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          {preferenceId ? (
            <div className="flex flex-col items-center">
              <p className="text-green-600 font-semibold text-center mb-6">
                ¡Tu orden ha sido registrada! A continuación puedes realizar el pago.
              </p>
              <div className="w-full max-w-md mx-auto">
                <Wallet initialization={{ preferenceId: preferenceId }} />
              </div>
              <button
                onClick={() => {
                  setShowCheckout(false);
                  clearCart(); // Limpiar carrito después de pagar
                }}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Completar y volver a la tienda
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MercadoPagoCheckout;