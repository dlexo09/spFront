/**
 * AWS Lambda - Siscoprint Mercado Pago API
 *
 * Endpoints:
 *   POST /api/create-preference   -> create Mercado Pago checkout preference
 *   GET  /api/health              -> healthcheck
 *   GET  /api/payment-status       -> check order payment status by folio
 *   POST /api/admin/verify-transfer-payment -> manual transfer verification by admin panel
 *   POST /webhook/mercadopago      -> webhook receiver + server-side payment verification
 *
 * Required env vars:
 *   MERCADOPAGO_ACCESS_TOKEN      -> private token (APP_USR-...)
 *   SUPABASE_URL                  -> https://xxxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY     -> service role key
 *
 * Optional env vars:
 *   MP_STATEMENT_DESCRIPTOR       -> default statement descriptor (max 22 chars)
 *   ALLOWED_ORIGINS               -> comma-separated origins for CORS
 *   MAKE_ORDER_WEBHOOK_URL        -> Make.com webhook for payment_verified event
 *   ADMIN_API_TOKEN               -> shared secret for admin endpoints
 */

const DEFAULT_DESCRIPTOR = 'SISCOPRINT';
const MERCADO_PAGO_API = 'https://api.mercadopago.com';
const LAMBDA_BUILD = '2026-04-12-admin-verify-hotfix-2';

function getMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod || 'GET';
}

function getPath(event) {
  return event.rawPath || event.path || '';
}

function getOrigin(event) {
  return event.headers?.origin || event.headers?.Origin || '*';
}

function getHeader(event, headerName) {
  const headers = event.headers || {};
  const lower = headerName.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (String(key).toLowerCase() === lower) {
      return value;
    }
  }
  return undefined;
}

function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowOrigin = allowed.includes('*') || allowed.includes(origin)
    ? origin
    : allowed[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With,X-Admin-Token,x-admin-token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json',
  };
}

function json(statusCode, headers, payload) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(payload),
  };
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
}

function normalizeItem(item, index) {
  const quantity = Number(item.quantity);
  const unitPrice = Number(item.unit_price);

  if (!item.title || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice <= 0) {
    throw new Error(`Invalid item at index ${index}. Required: title, quantity > 0, unit_price > 0`);
  }

  return {
    id: String(item.id || item.sku || `item-${index + 1}`),
    title: String(item.title),
    description: item.description ? String(item.description) : undefined,
    picture_url: item.picture_url ? String(item.picture_url) : undefined,
    category_id: item.category_id ? String(item.category_id) : undefined,
    quantity,
    currency_id: String(item.currency_id || 'MXN'),
    unit_price: Number(unitPrice.toFixed(2)),
  };
}

function buildPreferencePayload(body) {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error('items is required and must be a non-empty array');
  }

  const descriptorRaw = body.statement_descriptor || process.env.MP_STATEMENT_DESCRIPTOR || DEFAULT_DESCRIPTOR;
  const descriptor = String(descriptorRaw).slice(0, 22);
  const appBaseUrl = process.env.APP_BASE_URL;

  const backUrls = body.back_urls || (appBaseUrl
    ? {
        success: `${appBaseUrl}/pago-exitoso`,
        failure: `${appBaseUrl}/pago-fallido`,
        pending: `${appBaseUrl}/pago-pendiente`,
      }
    : undefined);

  const hasSuccessBackUrl = Boolean(backUrls && typeof backUrls.success === 'string' && backUrls.success.trim());

  // Mercado Pago valida que auto_return solo exista cuando back_urls.success está definido.
  const autoReturn = hasSuccessBackUrl ? (body.auto_return || 'approved') : undefined;

  return {
    items: body.items.map(normalizeItem),
    payer: body.payer || undefined,
    back_urls: backUrls,
    auto_return: autoReturn,
    external_reference: body.external_reference || undefined,
    metadata: body.metadata || undefined,
    notification_url: body.notification_url || process.env.MP_WEBHOOK_URL || undefined,
    payment_methods: body.payment_methods || {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 12,
    },
    statement_descriptor: descriptor,
  };
}

async function createPreference(body) {
  const payload = buildPreferencePayload(body);

  const data = await mercadoPagoRequest('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
  };
}

function getQueryParams(event) {
  return event.queryStringParameters || {};
}

function getFolioFromEvent(event, body) {
  const query = getQueryParams(event);
  return body?.folio || query.folio || '';
}

function getPaymentIdFromEvent(event, body) {
  const query = getQueryParams(event);
  const candidates = [
    body?.data?.id,
    body?.id,
    query['data.id'],
    query.id,
    body?.resource,
  ].filter(Boolean);

  for (const value of candidates) {
    const match = String(value).match(/(\d{6,})$/);
    if (match) return match[1];
  }

  return null;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
  };
}

async function mercadoPagoRequest(path, options = {}) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Missing MERCADOPAGO_ACCESS_TOKEN env var');
  }

  const response = await fetch(`${MERCADO_PAGO_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const apiMessage = data?.message || data?.error || 'Mercado Pago API error';
    const cause = data?.cause ? JSON.stringify(data.cause) : '';
    throw new Error(`${apiMessage}${cause ? ` | cause: ${cause}` : ''}`);
  }

  return data;
}

async function supabaseRequest(path, { method = 'GET', body, prefer } = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetchWithTimeout(`${url}/rest/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }, 8000);

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`Supabase error ${response.status}: ${text || 'empty body'}`);
  }

  return data;
}

async function getOrderByFolioServer(folio, includeItems = false) {
  const select = includeItems ? '*,order_items(*)' : 'id,folio,status,payment_method,total';
  const query = `/orders?folio=eq.${encodeURIComponent(folio)}&select=${encodeURIComponent(select)}&limit=1`;
  const rows = await supabaseRequest(query);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function getOrderByIdServer(orderId, includeItems = false) {
  const select = includeItems ? '*,order_items(*),order_payments(*)' : 'id,folio,status,payment_method,total';
  const query = `/orders?id=eq.${encodeURIComponent(orderId)}&select=${encodeURIComponent(select)}&limit=1`;
  const rows = await supabaseRequest(query);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function updateOrderAsVerified(orderId) {
  const query = `/orders?id=eq.${encodeURIComponent(orderId)}&select=id,folio,status,payment_method,total`;
  const rows = await supabaseRequest(query, {
    method: 'PATCH',
    body: {
      status: 'payment_verified',
      payment_method: 'mercadopago',
    },
    prefer: 'return=representation',
  });
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function upsertMercadoPagoPayment(orderId, payment) {
  const existing = await supabaseRequest(
    `/order_payments?order_id=eq.${encodeURIComponent(orderId)}&payment_method=eq.mercadopago&select=id&limit=1`
  );

  const payload = {
    order_id: orderId,
    payment_method: 'mercadopago',
    status: 'verified',
    amount: Number(payment.transaction_amount || 0),
    mp_payment_id: String(payment.id || ''),
    mp_status: String(payment.status || ''),
    verified_at: new Date().toISOString(),
    receipt_notes: 'Pago confirmado por webhook de Mercado Pago',
  };

  if (Array.isArray(existing) && existing.length > 0) {
    await supabaseRequest(`/order_payments?id=eq.${encodeURIComponent(existing[0].id)}`, {
      method: 'PATCH',
      body: payload,
      prefer: 'return=minimal',
    });
    return;
  }

  await supabaseRequest('/order_payments', {
    method: 'POST',
    body: payload,
    prefer: 'return=minimal',
  });
}

function buildItemsHtml(items = []) {
  return items
    .map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      return `<tr>
          <td style="padding:10px;border-bottom:1px solid #eee;">
            <strong>${item.name || ''}</strong><br>
            <small style="color:#888;">SKU: ${item.sku || '-'} | Marca: ${item.marca || '-'}</small>
          </td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">${item.quantity || 0}</td>
          <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">$${lineTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        </tr>`;
    })
    .join('');
}

function fmtCurrency(value) {
  return `$${Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function notifyMakePaymentVerified(order, payment) {
  const makeWebhookUrl = process.env.MAKE_ORDER_WEBHOOK_URL || process.env.VITE_MAKE_ORDER_WEBHOOK_URL;
  if (!makeWebhookUrl) {
    console.warn('MAKE_ORDER_WEBHOOK_URL is not configured in Lambda env');
    return false;
  }

  const items = order.order_items || [];

  const response = await fetchWithTimeout(makeWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment_verified',
      orderId: order.id,
      folio: order.folio,
      paymentMethod: 'mercadopago',
      mpPaymentId: String(payment.id || ''),
      mpStatus: String(payment.status || ''),
      amount: fmtCurrency(order.total || payment.transaction_amount || 0),
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        company: order.customer_company,
      },
      items,
      itemsHtml: buildItemsHtml(items),
      totalFormatted: fmtCurrency(order.total || 0),
      subtotalFormatted: fmtCurrency(order.subtotal || 0),
      taxFormatted: fmtCurrency(order.tax || 0),
      shippingFormatted: fmtCurrency(order.shipping_cost || 0),
      orderUrl: `${process.env.APP_BASE_URL || ''}/orden/${order.folio}`,
      verifiedAt: new Date().toISOString(),
    }),
  }, 5000).catch((error) => {
    console.error('Error calling Make webhook:', error?.message || error);
    return null;
  });

  if (!response) {
    return false;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('Make webhook rejected request:', response.status, body);
    return false;
  }

  return true;
}

async function processMercadoPagoWebhookPayment(paymentId) {
  const payment = await mercadoPagoRequest(`/v1/payments/${paymentId}`);
  const folio = payment.external_reference || payment.metadata?.folio || null;

  if (!folio) {
    return { processed: false, reason: 'missing_folio_in_external_reference' };
  }

  const order = await getOrderByFolioServer(folio, true);
  if (!order) {
    return { processed: false, reason: 'order_not_found', folio };
  }

  const mpStatus = String(payment.status || '').toLowerCase();
  if (mpStatus !== 'approved') {
    return { processed: false, reason: 'payment_not_approved', folio, mpStatus };
  }

  const orderTotal = Number(order.total || 0);
  const paymentAmount = Number(payment.transaction_amount || 0);
  const amountDelta = Math.abs(orderTotal - paymentAmount);

  if (amountDelta > 1) {
    return {
      processed: false,
      reason: 'amount_mismatch',
      folio,
      orderTotal,
      paymentAmount,
    };
  }

  await updateOrderAsVerified(order.id);
  await upsertMercadoPagoPayment(order.id, payment);
  const makeNotified = await notifyMakePaymentVerified(order, payment);

  return {
    processed: true,
    folio,
    paymentId: String(payment.id || paymentId),
    status: mpStatus,
    makeNotified,
  };
}

async function notifyMakeManualTransferVerified(order, payload) {
  const makeWebhookUrl = process.env.MAKE_ORDER_WEBHOOK_URL || process.env.VITE_MAKE_ORDER_WEBHOOK_URL;
  if (!makeWebhookUrl) {
    console.warn('MAKE_ORDER_WEBHOOK_URL is not configured in Lambda env');
    return false;
  }

  const items = order.order_items || [];

  const response = await fetchWithTimeout(makeWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment_manually_verified',
      orderId: order.id,
      folio: order.folio,
      paymentMethod: 'transfer',
      verifiedBy: payload.verifiedBy || 'panelSisco',
      verificationSource: 'manual_admin_validation',
      notes: payload.notes || null,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        company: order.customer_company,
      },
      items,
      itemsHtml: buildItemsHtml(items),
      totalFormatted: fmtCurrency(order.total || 0),
      subtotalFormatted: fmtCurrency(order.subtotal || 0),
      taxFormatted: fmtCurrency(order.tax || 0),
      shippingFormatted: fmtCurrency(order.shipping_cost || 0),
      orderUrl: `${process.env.APP_BASE_URL || ''}/orden/${order.folio}`,
      verifiedAt: new Date().toISOString(),
    }),
  }, 5000).catch((error) => {
    console.error('Error calling Make webhook:', error?.message || error);
    return null;
  });

  if (!response) return false;
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('Make webhook rejected request:', response.status, body);
    return false;
  }

  return true;
}

async function processManualTransferVerification(body) {
  const { orderId, folio } = body || {};
  if (!orderId && !folio) {
    throw new Error('orderId or folio is required');
  }

  const order = orderId
    ? await getOrderByIdServer(orderId, true)
    : await getOrderByFolioServer(folio, true);

  if (!order) {
    throw new Error('Order not found');
  }

  const transferPayment = (order.order_payments || []).find((payment) => payment.payment_method === 'transfer');

  const nextNotes = body?.notes
    ? `${transferPayment?.receipt_notes || ''}${transferPayment?.receipt_notes ? ' | ' : ''}${body.notes}`
    : (transferPayment?.receipt_notes || 'Pago validado manualmente desde panel administrativo');

  await supabaseRequest(`/orders?id=eq.${encodeURIComponent(order.id)}&select=id`, {
    method: 'PATCH',
    body: {
      status: 'payment_verified',
      payment_method: 'transfer',
    },
    prefer: 'return=minimal',
  });

  let paymentUpdateError = null;
  try {
    if (transferPayment?.id) {
      await supabaseRequest(`/order_payments?id=eq.${encodeURIComponent(transferPayment.id)}`, {
        method: 'PATCH',
        body: {
          status: 'verified',
          amount: Number(transferPayment.amount || order.total || 0),
          verified_at: new Date().toISOString(),
          receipt_notes: nextNotes,
        },
        prefer: 'return=minimal',
      });
    } else {
      await supabaseRequest('/order_payments', {
        method: 'POST',
        body: {
          order_id: order.id,
          payment_method: 'transfer',
          status: 'verified',
          amount: Number(order.total || 0),
          verified_at: new Date().toISOString(),
          receipt_notes: nextNotes,
        },
        prefer: 'return=minimal',
      });
    }
  } catch (err) {
    paymentUpdateError = err.message || 'order_payments update failed';
    console.error('Warning: order_payments update failed (order status was already updated):', paymentUpdateError);
  }

  let fullOrder = null;
  try {
    fullOrder = await getOrderByIdServer(order.id, true);
  } catch (err) {
    console.error('Warning: could not re-fetch full order for Make notification:', err.message);
  }
  const makeNotified = await notifyMakeManualTransferVerified(fullOrder || order, body || {});

  return {
    ok: true,
    orderId: order.id,
    folio: order.folio,
    status: 'payment_verified',
    makeNotified,
    ...(paymentUpdateError ? { paymentUpdateWarning: paymentUpdateError } : {}),
  };
}

export async function handler(event) {
  const method = getMethod(event);
  const path = getPath(event);
  const origin = getOrigin(event);
  const headers = corsHeaders(origin);

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    if ((path.endsWith('/api/health') || path.endsWith('/health')) && (method === 'GET' || method === 'POST')) {
      return json(200, headers, {
        ok: true,
        service: 'mercadopago-lambda',
        build: LAMBDA_BUILD,
        hasAccessToken: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
        hasSupabaseConfig: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        hasMakeWebhook: Boolean(process.env.MAKE_ORDER_WEBHOOK_URL || process.env.VITE_MAKE_ORDER_WEBHOOK_URL),
      });
    }

    if (path.endsWith('/api/create-preference') && method === 'POST') {
      const body = parseBody(event);
      if (!body) {
        return json(400, headers, { error: 'Invalid JSON body' });
      }

      const preference = await createPreference(body);
      return json(200, headers, preference);
    }

    if (path.endsWith('/api/payment-status') && method === 'GET') {
      const folio = getFolioFromEvent(event, {});
      if (!folio) {
        return json(400, headers, { error: 'folio query param is required' });
      }

      const order = await getOrderByFolioServer(folio, false);
      if (!order) {
        return json(404, headers, { error: 'Order not found' });
      }

      return json(200, headers, {
        folio: order.folio,
        status: order.status,
        payment_method: order.payment_method,
        total: Number(order.total || 0),
      });
    }

    if (path.endsWith('/api/admin/verify-transfer-payment') && method === 'POST') {
      const adminToken = process.env.ADMIN_API_TOKEN;
      if (!adminToken) {
        return json(500, headers, { error: 'ADMIN_API_TOKEN is not configured' });
      }

      const tokenFromHeader = getHeader(event, 'x-admin-token') || getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '');
      if (!tokenFromHeader || tokenFromHeader !== adminToken) {
        return json(401, headers, { error: 'Unauthorized' });
      }

      const body = parseBody(event);
      if (!body) {
        return json(400, headers, { error: 'Invalid JSON body' });
      }

      const result = await processManualTransferVerification(body);
      return json(200, headers, result);
    }

    if (path.endsWith('/webhook/mercadopago') && method === 'POST') {
      const body = parseBody(event) || {};
      const paymentId = getPaymentIdFromEvent(event, body);

      if (!paymentId) {
        return json(200, headers, {
          received: true,
          processed: false,
          reason: 'payment_id_not_present',
        });
      }

      const result = await processMercadoPagoWebhookPayment(paymentId);
      return json(200, headers, {
        received: true,
        ...result,
      });
    }

    return json(404, headers, { error: 'Not found' });
  } catch (error) {
    console.error('MercadoPago Lambda error:', error);
    return json(500, headers, {
      error: error.message || 'Internal server error',
    });
  }
}
