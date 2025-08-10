import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '../context/CartContext';
import API_CONFIG from '../config';
import ZOHO_BOOKS_API from '../services/zohoBooks';

const MercadoPagoCheckout = ({ setShowCheckout }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [zohoCustomerId, setZohoCustomerId] = useState(null);
  const { cartItems, getTotalPrice } = useCart();

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

    // Verificar conexión con Zoho Books
    const checkZohoConnection = async () => {
      try {
        await ZOHO_BOOKS_API.checkConnection();
        console.log('✅ Conexión con Zoho Books establecida');
      } catch (error) {
        console.error('❌ Error conectando con Zoho Books:', error);
      }
    };

    checkZohoConnection();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Validar cliente en Zoho Books
      const customerValidation = await ZOHO_BOOKS_API.validateCustomer(customerData.email);
      
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
        customerId = newCustomer.contact.contact_id;
      } else {
        customerId = customerValidation.contact.contact_id;
      }

      setZohoCustomerId(customerId);
      setShowForm(false);
      createPreference();
    } catch (error) {
      console.error('Error validando/creando cliente en Zoho:', error);
      alert('Error procesando datos del cliente. Por favor intenta nuevamente.');
      setLoading(false);
    }
  };

  const createPreference = async () => {
    setLoading(true);

    try {
      const itemsWithPrice = cartItems.filter(item => item.price && item.price > 0);
      
      if (itemsWithPrice.length === 0) {
        alert('No hay productos válidos para el pago');
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
        // Crear factura en Zoho Books
        try {
          await ZOHO_BOOKS_API.createInvoice({
            customerId: zohoCustomerId,
            items: cartItems.map(item => ({
              'sku-zoho': item['sku-zoho'],
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            preferenceId: data.id
          });
          console.log('✅ Factura creada en Zoho Books');
        } catch (zohoError) {
          console.error('Error creando factura en Zoho:', zohoError);
        }

        setPreferenceId(data.id);
        console.log('✅ Preferencia creada con ID:', data.id);
      } else {
        throw new Error('Error creando preferencia de pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component (return statement) remains the same
  // ...existing return statement code...
};

export default MercadoPagoCheckout;