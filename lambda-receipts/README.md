# Lambda Receipts – Siscoprint

Lambda para generar **S3 Pre-signed URLs** para subir comprobantes de pago directo a AWS S3 desde el navegador.

## Arquitectura

```
Frontend (React)
   │  1. POST /receipts/presign  { orderId, fileName }
   ▼
API Gateway (HTTP API) → Lambda
   │  Devuelve { uploadUrl, fileUrl, contentType }
   ▼
Frontend (React)
   │  2. PUT uploadUrl  (archivo binario directo a S3)
   ▼
S3 Bucket (siscoprint-receipts)
```

**Ventajas vs upload vía Lambda:**
- Archivo va directo del navegador a S3 (no pasa por Lambda)
- Sin límite de 6 MB de API Gateway
- Sin overhead de base64 (+33%)
- Lambda solo genera la URL → ejecución en milisegundos

## Setup en AWS

### 1. Crear bucket S3

```bash
aws s3 mb s3://siscoprint-receipts --region us-east-1
```

Política de bucket para acceso público de lectura (para que la URL sea accesible):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadReceipts",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::siscoprint-receipts/receipts/*"
    }
  ]
}
```

> **Nota:** Desactiva "Block all public access" solo para `GetObject`. Los uploads son privados (solo la Lambda puede escribir).

### 2. Crear la Lambda

1. AWS Console → Lambda → Create function
2. Runtime: **Node.js 20.x**
3. Architecture: **arm64** (más barato)
4. Memory: **256 MB**
5. Timeout: **30 seconds**
6. Subir `function.zip`

### 3. Variables de entorno

| Variable | Valor |
|---|---|
| `S3_BUCKET_NAME` | `siscoprint-receipts` |
| `S3_REGION` | `us-east-1` |
| `ALLOWED_ORIGINS` | `https://siscoprint.com,http://localhost:5173` |

### 4. Permisos IAM

La Lambda necesita permisos para escribir en S3. Agrega esta política al rol de ejecución:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::siscoprint-receipts/receipts/*"
    }
  ]
}
```

### 5. API Gateway

1. Crear HTTP API (no REST API — es más barato)
2. Ruta: `POST /receipts/presign`
3. Integración: Lambda function
4. **CORS: configurar a nivel de API Gateway** (no confiar solo en la Lambda)

> ⚠️ Importante: El navegador envía un preflight OPTIONS que API Gateway intercepta **antes** de llegar a Lambda.
> Por eso Postman funciona (no envía preflight) pero el navegador falla si CORS no está configurado en el Gateway.

En AWS Console → API Gateway → tu HTTP API → **CORS**, configura:

| Campo | Valor |
|-------|-------|
| Access-Control-Allow-Origin | `https://siscoprint.com,http://localhost:5173` |
| Access-Control-Allow-Headers | `Content-Type` |
| Access-Control-Allow-Methods | `POST, OPTIONS` |
| Access-Control-Max-Age | `300` |

### 6. Deploy

```bash
cd lambda-receipts
npm install
npm run zip
# Subir function.zip a Lambda
```

### 7. Frontend

Agregar en `.env`:

```
VITE_RECEIPTS_API_URL=https://TU-API-GATEWAY.execute-api.us-east-1.amazonaws.com
```

## Notas

- Se necesita `npm install` porque `@aws-sdk/s3-request-presigner` no viene incluido en el runtime de Lambda
- La Lambda solo genera una URL firmada — el archivo va directo del navegador a S3
- Pre-signed URL válida por 10 minutos
- Sin límite de tamaño de archivo (lo controla S3, no API Gateway)
