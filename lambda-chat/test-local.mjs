/**
 * Script de prueba local para siscoprint-chat Lambda
 * 
 * Uso:
 *   1. Crea lambda-chat/.env.local con tus credenciales
 *   2. node test-local.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Cargar variables de entorno desde .env.local ──────────────────────────────
try {
  const envPath = join(__dirname, '.env.local');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    process.env[key.trim()] = rest.join('=').trim();
  }
  console.log('✅ Variables de entorno cargadas desde .env.local\n');
} catch {
  console.warn('⚠️  No se encontró .env.local – asegúrate de tener las variables en el entorno\n');
}

// ── Importar el handler DESPUÉS de cargar env vars ───────────────────────────
const { handler } = await import('./index.mjs');

// ── Helper para simular eventos de API Gateway HTTP API ───────────────────────
function mockEvent(path, body) {
  return {
    rawPath: path,
    requestContext: { http: { method: 'POST' } },
    headers: { origin: 'http://localhost:5173', 'x-tenant-id': 'siscoprint' },
    body: JSON.stringify(body),
  };
}

function printResult(name, result) {
  const body = JSON.parse(result.body);
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`📍 ${name}  →  status ${result.statusCode}`);
  console.log(JSON.stringify(body, null, 2));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

console.log('🚀 Iniciando tests locales...\n');

// 1) Crear sesión
console.log('1️⃣  POST /chat/session');
const sessionRes = await handler(mockEvent('/chat/session', {}));
printResult('POST /chat/session', sessionRes);

const sessionId = JSON.parse(sessionRes.body).sessionId;

if (!sessionId) {
  console.error('\n❌ No se obtuvo sessionId – revisa SUPABASE_URL y SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// 2) Enviar mensaje al chatbot — pregunta específica que dispara search_products
console.log('\n2️⃣  POST /chat (búsqueda de producto específico)');
const chatRes = await handler(mockEvent('/chat', {
  sessionId,
  message: '¿Tienen impresoras Epson? ¿cuáles manejan?',
}));
printResult('POST /chat', chatRes);

// 3) Buscar productos
console.log('\n3️⃣  POST /products');
const productsRes = await handler(mockEvent('/products', {
  query: 'impresora epson',
}));
printResult('POST /products', productsRes);

// 4) Capturar lead — simula que el cliente quiere cotización
console.log('\n4️⃣  POST /lead (directo)');
const leadRes = await handler(mockEvent('/lead', {
  sessionId,
  name: 'Carlos Mendoza',
  email: 'carlos@empresaprueba.com',
  phone: '+52 55 1234 5678',
  company: 'Empresa Prueba SA',
  message: 'Quiero cotizar una Epson SureColor para sublimación',
}));
printResult('POST /lead', leadRes);

console.log(`\n${'═'.repeat(50)}`);
console.log('✅ Tests completados');
