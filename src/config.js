const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  MERCADOPAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
  ENDPOINTS: {
    CREATE_PREFERENCE: '/api/create-preference',
    WEBHOOK: '/webhook/mercadopago',
    HEALTH: '/api/health'
  },
  TIMEOUT: 30000, // 30 segundos
  RETRIES: 3
};

export default API_CONFIG;