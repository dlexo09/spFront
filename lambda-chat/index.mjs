/**
 * AWS Lambda – Siscoprint Chat (OpenAI + Supabase)
 *
 * Endpoints manejados (via API Gateway proxy):
 *   POST /chat/session   → inicia sesión, devuelve greeting
 *   POST /chat           → envía mensaje, devuelve respuesta de ChatGPT
 *   POST /lead           → captura datos de contacto
 *   POST /products       → busca productos
 *
 * Variables de entorno requeridas (configurar en Lambda → Configuration → Environment variables):
 *   OPENAI_API_KEY        – tu API key de OpenAI
 *   SUPABASE_URL          – URL de tu proyecto Supabase  (ej. https://xxx.supabase.co)
 *   SUPABASE_SERVICE_KEY  – Service Role Key de Supabase (NO la anon key)
 *   ALLOWED_ORIGINS       – orígenes permitidos separados por coma (ej. https://siscoprint.com,http://localhost:5173)
 */

import { handleChatSession } from './lib/chatSession.mjs';
import { handleChat } from './lib/chat.mjs';
import { handleLead } from './lib/lead.mjs';
import { handleProducts } from './lib/products.mjs';

/* ─── CORS helper ─────────────────────────────────── */
function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
  const isAllowed = allowed.includes('*') || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowed[0],
    'Access-Control-Allow-Headers': 'Content-Type,X-Tenant-Id',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
  };
}

/* ─── Lambda handler ──────────────────────────────── */
export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin || '*';
  const headers = corsHeaders(origin);

  // Preflight
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    // Soporta API Gateway REST (/chat) y HTTP API ($default)
    const path = event.path || event.rawPath || '';

    let result;

    if (path.endsWith('/chat/session')) {
      result = await handleChatSession(body);
    } else if (path.endsWith('/chat')) {
      result = await handleChat(body);
    } else if (path.endsWith('/lead')) {
      result = await handleLead(body);
    } else if (path.endsWith('/products')) {
      result = await handleProducts(body);
    } else {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    console.error('Lambda error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
