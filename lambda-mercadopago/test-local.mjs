import { handler } from './index.mjs';

const event = {
  httpMethod: 'POST',
  path: '/api/create-preference',
  headers: { origin: 'http://localhost:5173' },
  body: JSON.stringify({
    items: [
      { id: 'SKU-TEST', title: 'Producto test', quantity: 1, unit_price: 100, currency_id: 'MXN' },
    ],
    payer: { name: 'Test', email: 'test@example.com' },
    back_urls: {
      success: 'http://localhost:5173/pago-exitoso?folio=TEST-LOCAL',
      failure: 'http://localhost:5173/pago-fallido?folio=TEST-LOCAL',
      pending: 'http://localhost:5173/pago-pendiente?folio=TEST-LOCAL',
    },
    external_reference: 'TEST-LOCAL',
  }),
};

const run = async () => {
  const response = await handler(event);
  console.log('status:', response.statusCode);
  console.log('body:', response.body);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
