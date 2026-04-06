import { supabase } from '../lib/supabase';

/**
 * Servicio de órdenes - Interactúa directamente con Supabase
 * Sin necesidad de backend server
 */

// ─── Crear orden completa (orden + items) ───────────────────────
export async function createOrder({ customer, items, totals, notes, userId }) {
  // 1. Insertar la orden (el folio se genera automáticamente via trigger)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      folio: '', // El trigger lo genera automáticamente
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_company: customer.company || null,
      customer_rfc: customer.rfc || null,
      shipping_address: customer.address || null,
      shipping_city: customer.city || null,
      shipping_state: customer.state || null,
      shipping_zip: customer.zip || null,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping_cost: totals.shipping || 0,
      total: totals.total,
      notes: notes || null,
      status: 'pending_payment',
      user_id: userId || null,
    })
    .select()
    .single();

  if (orderError) throw new Error('Error al crear la orden: ' + orderError.message);

  // 2. Insertar los items de la orden
  const orderItems = items.map(item => ({
    order_id: order.id,
    sku: item.sku,
    name: item.name,
    marca: item.marca || null,
    price: item.price || 0,
    quantity: item.quantity || 1,
    image: item.image || null,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error('Error al guardar los productos: ' + itemsError.message);

  // 3. Fire-and-forget: notificar a Make.com (email + Zoho)
  const makeWebhookUrl = import.meta.env.VITE_MAKE_ORDER_WEBHOOK_URL;
  if (makeWebhookUrl) {
    const bankInfo = getBankDetails();

    // Pre-construir HTML de items para que Make.com no necesite iterar
    const itemsHtml = orderItems.map(item => {
      const lineTotal = (item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 });
      const unitPrice = item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 });
      return `<tr>
          <td style="padding:10px;border-bottom:1px solid #eee;">
            <strong>${item.name}</strong><br>
            <small style="color:#888;">SKU: ${item.sku} | Marca: ${item.marca || '-'}</small>
          </td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">$${lineTotal}</td>
        </tr>`;
    }).join('');

    const fmt = (n) => Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });

    fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'order_created',
        folio: order.folio,
        orderId: order.id,
        customer,
        items: orderItems,
        totals,
        totalFormatted: `$${fmt(totals.total)}`,
        subtotalFormatted: `$${fmt(totals.subtotal)}`,
        shippingFormatted: `$${fmt(totals.shipping || 0)}`,
        taxFormatted: `$${fmt(totals.tax)}`,
        itemsHtml,
        bankDetails: bankInfo,
        orderUrl: `${window.location.origin}/orden/${order.folio}`,
        uploadReceiptUrl: `${window.location.origin}/subir-comprobante/${order.id}`,
        createdAt: order.created_at,
      }),
    }).catch(() => {}); // No bloquear si falla
  }

  return order;
}

// ─── Obtener orden por folio ─────────────────────────────────────
export async function getOrderByFolio(folio) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      order_payments (*)
    `)
    .eq('folio', folio)
    .single();

  if (error) throw new Error('Orden no encontrada');
  return data;
}

// ─── Obtener orden por ID ────────────────────────────────────────
export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      order_payments (*)
    `)
    .eq('id', orderId)
    .single();

  if (error) throw new Error('Orden no encontrada');
  return data;
}

// ─── Obtener órdenes por email ───────────────────────────────────
export async function getOrdersByEmail(email) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      order_payments (*)
    `)
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Error al obtener órdenes: ' + error.message);
  return data || [];
}

// ─── Seleccionar método de pago ──────────────────────────────────
export async function setPaymentMethod(orderId, method) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_method: method })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error('Error al actualizar método de pago: ' + error.message);
  return data;
}

const RECEIPTS_API_URL = import.meta.env.VITE_RECEIPTS_API_URL;

// ─── Subir comprobante de pago (Pre-signed URL → S3) ────────────
export async function uploadReceipt(orderId, file, notes) {
  // 1. Pedir pre-signed URL a la Lambda
  const apiUrl = RECEIPTS_API_URL.endsWith('/') ? RECEIPTS_API_URL.slice(0, -1) : RECEIPTS_API_URL;
  const presignRes = await fetch(`${apiUrl}/receipts/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      fileName: file.name,
    }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(err.error || 'Error al generar URL de subida');
  }

  const { uploadUrl, fileUrl: receiptUrl, contentType } = await presignRes.json();

  // 2. Subir archivo directo a S3 usando la pre-signed URL
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Error al subir el comprobante a S3');
  }

  // 2. Obtener el total de la orden
  const { data: order } = await supabase
    .from('orders')
    .select('total')
    .eq('id', orderId)
    .single();

  // 3. Crear registro de pago en Supabase
  const { data: payment, error: paymentError } = await supabase
    .from('order_payments')
    .insert({
      order_id: orderId,
      payment_method: 'transfer',
      status: 'uploaded',
      amount: order?.total || 0,
      receipt_url: receiptUrl,
      receipt_notes: notes || null,
    })
    .select()
    .single();

  if (paymentError) throw new Error('Error al registrar el pago: ' + paymentError.message);

  // 4. Actualizar estado de la orden
  await supabase
    .from('orders')
    .update({
      status: 'payment_uploaded',
      payment_method: 'transfer',
    })
    .eq('id', orderId);

  // 5. Notificar a Make.com → email admin + Zoho
  const makeReceiptWebhookUrl =
    import.meta.env.VITE_MAKE_RECEIPT_WEBHOOK_URL ||
    import.meta.env.VITE_MAKE_ORDER_WEBHOOK_URL;

  if (makeReceiptWebhookUrl) {
    // Traer orden completa para tener folio, cliente e items
    const { data: fullOrder } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    const fmt = (n) => Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });

    const itemsHtml = (fullOrder?.order_items || []).map(item => {
      const lineTotal = (item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 });
      return `<tr>
          <td style="padding:10px;border-bottom:1px solid #eee;">
            <strong>${item.name}</strong><br>
            <small style="color:#888;">SKU: ${item.sku} | Marca: ${item.marca || '-'}</small>
          </td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">$${ lineTotal}</td>
        </tr>`;
    }).join('');

    fetch(makeReceiptWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'payment_uploaded',
        orderId,
        folio: fullOrder?.folio,
        receiptUrl,
        receiptNotes: notes || null,
        amount: `$${fmt(order?.total || 0)}`,
        customer: {
          name: fullOrder?.customer_name,
          email: fullOrder?.customer_email,
          phone: fullOrder?.customer_phone,
          company: fullOrder?.customer_company,
        },
        items: fullOrder?.order_items || [],
        itemsHtml,
        totalFormatted: `$${fmt(fullOrder?.total || 0)}`,
        subtotalFormatted: `$${fmt(fullOrder?.subtotal || 0)}`,
        taxFormatted: `$${fmt(fullOrder?.tax || 0)}`,
        shippingFormatted: `$${fmt(fullOrder?.shipping_cost || 0)}`,
        orderUrl: `${window.location.origin}/orden/${fullOrder?.folio}`,
        uploadedAt: new Date().toISOString(),
      }),
    }).catch(() => {});
  }

  return { payment, receiptUrl };
}

// ─── Obtener datos bancarios (configuración) ─────────────────────
export function getBankDetails() {
  return {
    bank: 'Mercado Pago W',
    accountName: 'SISCOPRINT',
    clabe: '722969013374699537',
    reference: 'Usar tu número de folio como referencia',
  };
}
