const ZOHO_BOOKS_API = {
  validateCustomer: async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/contacts/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Error validando cliente');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en validateCustomer:', error);
      throw error;
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
        throw new Error('Error creando cliente');
      }

      return response.json();
    } catch (error) {
      console.error('Error en createCustomer:', error);
      throw error;
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
        throw new Error('Error creando factura');
      }

      return response.json();
    } catch (error) {
      console.error('Error en createInvoice:', error);
      throw error;
    }
  },

  checkConnection: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/health`);
      return response.json();
    } catch (error) {
      console.error('Error checking Zoho Books connection:', error);
      throw error;
    }
  }
};

export default ZOHO_BOOKS_API;