/**
 * Servidor local de desarrollo – simula API Gateway → Lambda
 * 
 * Uso:
 *   node dev-server.mjs
 * 
 * Escucha en http://localhost:3001
 * Configura VITE_CHAT_API_URL=http://localhost:3001 en .env
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

// ── Cargar .env.local ──────────────────────────────────────────────────────────
try {
  const lines = readFileSync(join(__dirname, '.env.local'), 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    process.env[key.trim()] = rest.join('=').trim();
  }
  console.log('✅ Variables de entorno cargadas desde .env.local');
} catch {
  console.warn('⚠️  No se encontró .env.local');
}

// ── Importar handler DESPUÉS de setear env vars ────────────────────────────────
const { handler } = await import('./index.mjs');

// ── Servidor HTTP ──────────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  // Leer body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString();

  // Construir evento simulado de API Gateway HTTP API
  const event = {
    rawPath: req.url.split('?')[0],
    requestContext: {
      http: { method: req.method },
    },
    headers: {
      origin: req.headers['origin'] || 'http://localhost:5173',
      'x-tenant-id': req.headers['x-tenant-id'] || 'siscoprint',
      'content-type': req.headers['content-type'] || 'application/json',
    },
    body: rawBody || '{}',
  };

  console.log(`→ ${req.method} ${req.url}`);

  try {
    const result = await handler(event);
    const resHeaders = result.headers || {};

    // Siempre permitir CORS desde cualquier origen en dev
    resHeaders['Access-Control-Allow-Origin'] = req.headers['origin'] || '*';
    resHeaders['Access-Control-Allow-Headers'] = 'Content-Type,X-Tenant-Id';
    resHeaders['Access-Control-Allow-Methods'] = 'POST,OPTIONS';

    res.writeHead(result.statusCode || 200, resHeaders);
    res.end(result.body || '');

    console.log(`← ${result.statusCode} ${req.url}`);
  } catch (err) {
    console.error('Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server corriendo en http://localhost:${PORT}`);
  console.log(`   Endpoints disponibles:`);
  console.log(`   POST http://localhost:${PORT}/chat/session`);
  console.log(`   POST http://localhost:${PORT}/chat`);
  console.log(`   POST http://localhost:${PORT}/products`);
  console.log(`   POST http://localhost:${PORT}/lead`);
  console.log(`\n   Presiona Ctrl+C para detener\n`);
});
