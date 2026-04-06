/**
 * AWS Lambda – Siscoprint Receipts Upload (S3 Pre-signed URLs)
 *
 * Genera URLs pre-firmadas para que el navegador suba archivos
 * directamente a S3, sin pasar el archivo por Lambda/API Gateway.
 *
 * Endpoints:
 *   POST /receipts/presign   → genera pre-signed URL para upload
 *
 * Variables de entorno requeridas:
 *   S3_BUCKET_NAME    – nombre del bucket S3 (ej. siscoprint-receipts)
 *   S3_REGION         – región del bucket (ej. us-east-1)
 */

import express from 'express';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const app = express();
app.use(cors());
app.use(express.json());

const s3 = new S3Client({ region: process.env.S3_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET_NAME || 'siscoprint-receipts';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
const MIME_MAP = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
};

/* ─── POST /receipts/presign ──────────────────────── */
app.post('/receipts/presign', async (req, res) => {
  try {
    const { orderId, fileName } = req.body;

    if (!orderId || !fileName) {
      return res.status(400).json({ error: 'Faltan campos requeridos: orderId, fileName' });
    }

    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({ error: `Extensión no permitida. Usa: ${ALLOWED_EXTENSIONS.join(', ')}` });
    }

    const timestamp = Date.now();
    const safeOrderId = String(orderId).replace(/[^a-zA-Z0-9\-_]/g, '');
    const s3Key = `receipts/${safeOrderId}/${timestamp}.${ext}`;
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

    const region = process.env.S3_REGION || 'us-east-1';
    const fileUrl = `https://${BUCKET}.s3.${region}.amazonaws.com/${s3Key}`;

    res.json({ uploadUrl, fileUrl, key: s3Key, contentType });
  } catch (err) {
    console.error('Error generando URL prefirmada:', err);
    res.status(500).json({ error: 'Error generando URL prefirmada', message: err.message });
  }
});

/* ─── Lambda handler ──────────────────────────────── */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const serverlessExpress = (await import('@vendia/serverless-express')).default;
  return serverlessExpress({ app })(event, context);
};
