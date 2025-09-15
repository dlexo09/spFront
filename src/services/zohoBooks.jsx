const ZOHO_BOOKS_API = {
  validateCustomer: async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/contacts/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error validando cliente:", error);
      return { error: true, message: "No se pudo validar el cliente", details: error.message };
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creando cliente:", error);
      return { error: true, message: "No se pudo crear el cliente", details: error.message };
    }
  },

  createInvoice: async (orderData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creando factura:", error);
      return { error: true, message: "No se pudo crear la factura", details: error.message };
    }
  },

  checkConnection: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/health`);
      
      if (!response.ok) {
        throw new Error(`Error de conexión: ${response.status}`);
      }
      
      return { status: 'connected', message: 'Conexión establecida con Zoho Books' };
    } catch (error) {
      console.error("Error conectando con Zoho Books:", error);
      return { status: 'error', message: 'No se pudo conectar con Zoho Books', details: error.message };
    }
  },
  
  // Nuevo método para sincronizar pedidos pendientes
  syncPendingOrders: async () => {
    try {
      const pendingOrders = JSON.parse(localStorage.getItem('pendingZohoOrders') || '[]');
      
      if (pendingOrders.length === 0) {
        return { status: 'success', message: 'No hay pedidos pendientes' };
      }
      
      const results = [];
      const failedOrders = [];
      
      for (const order of pendingOrders) {
        try {
          // Primero crear/validar cliente
          let customerResult;
          if (order.customerData.contact_id) {
            customerResult = { contact_id: order.customerData.contact_id };
          } else {
            customerResult = await ZOHO_BOOKS_API.createCustomer(order.customerData);
          }
          
          if (customerResult.error) {
            failedOrders.push({ order, error: 'Customer creation failed' });
            continue;
          }
          
          // Luego crear factura
          const invoiceData = {
            ...order.orderData,
            contact_id: customerResult.contact_id
          };
          
          const invoiceResult = await ZOHO_BOOKS_API.createInvoice(invoiceData);
          
          if (invoiceResult.error) {
            failedOrders.push({ order, error: 'Invoice creation failed' });
            continue;
          }
          
          results.push({
            orderId: order.timestamp,
            status: 'synced',
            zohoInvoiceId: invoiceResult.invoice_id
          });
        } catch (error) {
          failedOrders.push({ order, error: error.message });
        }
      }
      
      // Guardar de nuevo solo los pedidos que fallaron
      localStorage.setItem('pendingZohoOrders', JSON.stringify(failedOrders.map(f => f.order)));
      
      return {
        status: 'completed',
        synced: results.length,
        failed: failedOrders.length,
        details: results
      };
    } catch (error) {
      console.error("Error sincronizando pedidos:", error);
      return { status: 'error', message: 'Error al sincronizar pedidos', details: error.message };
    }
  }
};

export default ZOHO_BOOKS_API;