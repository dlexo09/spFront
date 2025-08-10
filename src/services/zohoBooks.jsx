const ZOHO_BOOKS_API = {
  validateCustomer: async (email) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/contacts/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  createCustomer: async (customerData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    return response.json();
  },

  createInvoice: async (orderData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  checkConnection: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zoho/books/health`);
    return response.json();
  }
};

export default ZOHO_BOOKS_API;