# Lambda Mercado Pago - Siscoprint

Lambda minimal para crear preferencias de pago de Mercado Pago y responder al frontend en:

- POST /api/create-preference
- GET /api/health
- GET /api/payment-status?folio=SP-2026-0001
- POST /api/admin/verify-transfer-payment
- POST /webhook/mercadopago

El webhook ahora valida el pago contra la API de Mercado Pago y actualiza la orden en Supabase usando service role (server-side), evitando confirmar pagos desde frontend.

Esta ruta es compatible con Checkout en frontend:

- src/config.js -> API_CONFIG.BASE_URL + /api/create-preference

## 1) Crear Lambda

- Runtime: Node.js 20.x
- Handler: index.handler
- Architecture: arm64 o x86_64

## 2) Variables de entorno

Obligatoria:

- MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
- SUPABASE_URL=https://xxxxx.supabase.co
- SUPABASE_SERVICE_ROLE_KEY=eyJ...

Opcionales:

- MP_STATEMENT_DESCRIPTOR=SISCOPRINT
- ALLOWED_ORIGINS=http://localhost:5173,https://tudominio.com
- APP_BASE_URL=https://www.siscoprint.com
- MAKE_ORDER_WEBHOOK_URL=https://hook.us2.make.com/xxxx
- MP_WEBHOOK_URL=https://tu-api-gateway.execute-api.us-east-1.amazonaws.com/webhook/mercadopago
- ADMIN_API_TOKEN=define_un_token_secreto_largo

## 3) Empaquetar y subir

```bash
cd lambda-mercadopago
npm run zip
```

Sube function.zip a la Lambda (AWS Console o CLI).

## 4) API Gateway

Crea rutas hacia esta Lambda:

- POST /api/create-preference
- GET /api/health
- GET /api/payment-status
- POST /api/admin/verify-transfer-payment
- POST /webhook/mercadopago
- OPTIONS /{proxy+} (si aplica)

## 5) Frontend

En .env del frontend:

```env
VITE_API_URL=https://tu-api-gateway.execute-api.us-east-1.amazonaws.com
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx
```

Luego reinicia Vite.

## 6) Prueba rapida

Health:

```bash
curl -X GET "https://tu-api-gateway.execute-api.us-east-1.amazonaws.com/api/health"
```

Create preference:

```bash
curl -X POST "https://tu-api-gateway.execute-api.us-east-1.amazonaws.com/api/create-preference" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "id": "SKU-1", "title": "Producto de prueba", "quantity": 1, "unit_price": 100, "currency_id": "MXN" }
    ],
    "payer": { "name": "Alexis", "email": "alexis@email.com" },
    "back_urls": {
      "success": "http://localhost:5173/pago-exitoso?folio=TEST-001",
      "failure": "http://localhost:5173/pago-fallido?folio=TEST-001",
      "pending": "http://localhost:5173/pago-pendiente?folio=TEST-001"
    },
    "external_reference": "TEST-001"
  }'
```

Si responde con init_point/sandbox_init_point, ya quedo operativo.
