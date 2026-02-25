/**
 * setup-vectorstore.mjs
 * Script ONE-TIME para subir PDFs desde S3 a un OpenAI Vector Store.
 *
 * Estructura S3 soportada:
 *   files/productos/{idProducto}/ficha.pdf  → nuevo formato (vinculado a producto)
 *   files/productos/{MARCA}/ficha.pdf       → formato legado (solo marca)
 *   files/productos/archivo.pdf             → raíz (general)
 *
 * Uso:
 *   node scripts/setup-vectorstore.mjs
 *
 * Variables de entorno requeridas (tomar de .env.local):
 *   OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION (default: us-east-1)
 *
 * Al finalizar imprime el VECTOR_STORE_ID que debes agregar al .env de Lambda.
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

import { readFileSync } from 'fs';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

/* ─── Config ────────────────────────────────────────────────────────────────── */
const BUCKET   = 'siscoprint-front-vite';
const PREFIX   = 'files/productos/';
const REGION   = process.env.AWS_REGION || 'us-east-1';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

/** Convierte un ReadableStream de S3 en Buffer */
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

/** Detecta si un segmento de ruta es un idProducto numérico */
function isProductId(segment) {
  return /^\d+$/.test(segment);
}

/** Obtiene nombre del producto desde Supabase por idProducto */
const productCache = new Map();
async function getProductName(idProducto) {
  if (productCache.has(idProducto)) return productCache.get(idProducto);
  const { data } = await supabase
    .from('productos')
    .select('nombre, marca, sku')
    .eq('idProducto', parseInt(idProducto))
    .maybeSingle();
  const label = data
    ? `${data.nombre} (${data.marca ?? ''}, SKU: ${data.sku ?? ''})`
    : `Producto #${idProducto}`;
  productCache.set(idProducto, { label, data });
  return { label, data };
}

/** Lista TODOS los objetos PDF bajo el prefix */
async function listAllPdfs() {
  const pdfs = [];
  let continuationToken;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX,
      ContinuationToken: continuationToken,
    });
    const res = await s3.send(cmd);
    for (const obj of res.Contents ?? []) {
      if (obj.Key.toLowerCase().endsWith('.pdf')) pdfs.push(obj.Key);
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);
  return pdfs;
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */
console.log('🚀 Siscoprint — OpenAI Vector Store Setup');
console.log('─'.repeat(50));

// 1. Listar PDFs en S3
console.log(`\n📦 Listando PDFs en s3://${BUCKET}/${PREFIX}...`);
const pdfKeys = await listAllPdfs();
console.log(`   Encontrados: ${pdfKeys.length} PDFs`);

// 2. Crear Vector Store en OpenAI
console.log('\n🔧 Creando Vector Store en OpenAI...');
const vectorStore = await openai.vectorStores.create({
  name: 'Siscoprint — Fichas Técnicas',
  expires_after: { anchor: 'last_active_at', days: 365 },
});
console.log(`   ✅ Vector Store creado: ${vectorStore.id}`);

// 3. Subir PDFs uno a uno
console.log('\n📤 Subiendo PDFs a OpenAI...');
const fileIds = [];
let success = 0;
let failed  = 0;

for (const key of pdfKeys) {
  // Determinar contexto (idProducto o marca)
  const segments  = key.replace(PREFIX, '').split('/');
  const folder    = segments.length > 1 ? segments[0] : null;   // carpeta padre
  const filename  = segments[segments.length - 1];              // nombre del archivo

  let context = '';
  let idProducto = null;

  if (!folder) {
    // PDF en raíz de productos (general)
    context = 'General Siscoprint';
  } else if (isProductId(folder)) {
    // Nuevo formato: carpeta = idProducto
    idProducto = folder;
    const { label, data } = await getProductName(folder);
    context = label;
    console.log(`   📄 [idProducto=${folder}] ${filename} → ${label}`);
  } else {
    // Legado: carpeta = nombre de marca
    context = `Marca ${folder}`;
    console.log(`   📄 [marca=${folder}] ${filename}`);
  }

  try {
    // Descargar de S3
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const buffer   = await streamToBuffer(Body);

    // Nombre descriptivo para OpenAI (incluye contexto)
    const uploadName = folder
      ? `[${context}] ${filename}`
      : filename;

    // Subir a OpenAI Files
    const file = await openai.files.create({
      file: new File([buffer], uploadName, { type: 'application/pdf' }),
      purpose: 'assistants',
    });

    // Agregar al Vector Store
    await openai.vectorStores.files.create(vectorStore.id, {
      file_id: file.id,
      ...(idProducto ? { attributes: { idProducto: parseInt(idProducto) } } : {}),
    });

    fileIds.push(file.id);
    success++;
    process.stdout.write(`   ✅ (${success}/${pdfKeys.length}) ${uploadName}\n`);
  } catch (err) {
    failed++;
    console.error(`   ❌ Error en ${key}: ${err.message}`);
  }
}

// 4. Esperar a que el vector store procese los archivos
console.log('\n⏳ Esperando procesamiento del Vector Store...');
let status = vectorStore;
let attempts = 0;
while (
  (status.file_counts?.in_progress ?? 1) > 0 &&
  attempts < 30
) {
  await new Promise(r => setTimeout(r, 5000));
  status = await openai.vectorStores.retrieve(vectorStore.id);
  console.log(
    `   Procesados: ${status.file_counts?.completed ?? 0}/${fileIds.length} ` +
    `(en progreso: ${status.file_counts?.in_progress ?? '?'})`,
  );
  attempts++;
}

// 5. Resultado final
console.log('\n' + '='.repeat(50));
console.log('✅ SETUP COMPLETO');
console.log(`   PDFs subidos:  ${success}`);
console.log(`   Errores:       ${failed}`);
console.log(`   Vector Store:  ${vectorStore.id}`);
console.log('='.repeat(50));
console.log('\n📋 Agrega esta variable a las Variables de entorno de Lambda:');
console.log(`\n   OPENAI_VECTOR_STORE_ID=${vectorStore.id}\n`);
console.log('Y también al archivo .env.local para pruebas locales.\n');
