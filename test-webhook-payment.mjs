/**
 * Script de prueba — dispara el webhook payment_uploaded a Make.com
 * para que detecte la estructura de campos.
 *
 * Uso: node test-webhook-payment.mjs
 */

const WEBHOOK_URL = 'https://hook.us2.make.com/cchxvye6jo23yit4fj0k1xn6lbb1xkkv';

const payload = {
  event: 'payment_uploaded',
  orderId: 'test-order-id-12345',
  folio: 'SC-2026-TEST',
  receiptUrl: 'https://siscoprint-receipts.s3.us-east-1.amazonaws.com/receipts/test/comprobante.jpg',
  receiptNotes: 'Transferencia realizada el viernes por la tarde',
  amount: '$1,250.00',
  customer: {
    name: 'Juan García Prueba',
    email: 'juan@empresa.com',
    phone: '555-123-4567',
    company: 'Empresa de Prueba SA',
  },
  items: [
    {
      name: 'Tóner HP LaserJet Pro',
      sku: 'TON-HP-001',
      marca: 'HP',
      quantity: 2,
      price: 450.00,
    },
    {
      name: 'Papel Bond A4 500 hojas',
      sku: 'PAP-A4-500',
      marca: 'Chamex',
      quantity: 3,
      price: 116.67,
    },
  ],
  itemsHtml: `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee;">
        <strong>Tóner HP LaserJet Pro</strong><br>
        <small style="color:#888;">SKU: TON-HP-001 | Marca: HP</small>
      </td>
      <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">2</td>
      <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">$900.00</td>
    </tr>
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee;">
        <strong>Papel Bond A4 500 hojas</strong><br>
        <small style="color:#888;">SKU: PAP-A4-500 | Marca: Chamex</small>
      </td>
      <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">3</td>
      <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">$350.00</td>
    </tr>
  `,
  totalFormatted: '$1,250.00',
  subtotalFormatted: '$1,077.59',
  taxFormatted: '$172.41',
  shippingFormatted: '$0.00',
  orderUrl: 'http://localhost:5173/orden/SC-2026-TEST',
  uploadedAt: new Date().toISOString(),
};

console.log('Enviando payload payment_uploaded al webhook de Make.com...');
console.log('URL:', WEBHOOK_URL);
console.log('Payload:', JSON.stringify(payload, null, 2));

try {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log('\n✅ Respuesta Make.com:', res.status, text);
} catch (err) {
  console.error('\n❌ Error:', err.message);
}
