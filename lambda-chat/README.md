# Siscoprint Chat Lambda – Despliegue

Chatbot basado en **AWS Lambda + API Gateway + OpenAI + Supabase**.

## Arquitectura

```
┌─────────────┐     ┌───────────────┐     ┌──────────┐     ┌──────────┐
│  chat-widget │────▶│ API Gateway   │────▶│  Lambda  │────▶│ OpenAI   │
│  (frontend)  │     │ (REST / HTTP) │     │ (Node 20)│     │ GPT-4o   │
└─────────────┘     └───────────────┘     └────┬─────┘     └──────────┘
                                               │
                                          ┌────▼─────┐
                                          │ Supabase │
                                          │ (Postgres)│
                                          └──────────┘
```

## Paso 1 – Crear tablas en Supabase

1. Ve a tu proyecto en [app.supabase.com](https://app.supabase.com)
2. Abre **SQL Editor → New Query**
3. Pega el contenido de `supabase-migration.sql` y ejecútalo

## Paso 2 – Instalar dependencias

```bash
cd lambda-chat
npm install
```

## Paso 3 – Crear la función Lambda en AWS

### Opción A: Consola de AWS (más fácil)

1. Ve a **AWS Lambda → Create function**
2. Nombre: `siscoprint-chat`
3. Runtime: **Node.js 20.x**
4. Architecture: **arm64** (más barato) o x86_64
5. Haz clic en **Create function**

### Opción B: AWS CLI

```bash
# Crear el ZIP
npm run zip

# Crear la función
aws lambda create-function \
  --function-name siscoprint-chat \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 256
```

## Paso 4 – Variables de entorno en Lambda

En la consola de Lambda → **Configuration → Environment variables**, agrega:

| Variable              | Valor                                       |
|-----------------------|---------------------------------------------|
| `OPENAI_API_KEY`      | `sk-...` tu API key de OpenAI               |
| `SUPABASE_URL`        | `https://xpjzcitdcnreisjgscov.supabase.co`  |
| `SUPABASE_SERVICE_KEY` | Tu **Service Role Key** de Supabase (Settings → API) |
| `ALLOWED_ORIGINS`     | `https://siscoprint.com,http://localhost:5173` |

> ⚠️ Usa la **Service Role Key**, NO la anon key. La Lambda necesita acceso completo.

## Paso 5 – Crear API Gateway

### REST API (recomendado)

1. Ve a **API Gateway → Create API → REST API**
2. Nombre: `siscoprint-chat-api`
3. Crea los recursos:
   - `/chat` → Method POST → Integration: Lambda `siscoprint-chat`
   - `/chat/session` → Method POST → Integration: Lambda `siscoprint-chat`
   - `/lead` → Method POST → Integration: Lambda `siscoprint-chat`
   - `/products` → Method POST → Integration: Lambda `siscoprint-chat`
4. En cada recurso, agrega también un método **OPTIONS** para CORS
5. **Deploy API** → Crea un stage llamado `prod`

### HTTP API (más simple)

1. Ve a **API Gateway → Create API → HTTP API**
2. Integración: Lambda `siscoprint-chat`
3. Route: `POST /{proxy+}` → Lambda
4. Stage: `$default` con auto-deploy

Tu URL será algo como:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

## Paso 6 – Configurar el frontend

En tu archivo `.env` del proyecto Siscoprint:

```env
VITE_CHAT_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

El widget automáticamente enviará las peticiones a esa URL.

## Paso 7 – Subir actualizaciones

```bash
cd lambda-chat
npm run zip

aws lambda update-function-code \
  --function-name siscoprint-chat \
  --zip-file fileb://function.zip
```

## Estructura de archivos

```
lambda-chat/
├── index.mjs                 ← Handler principal (router)
├── package.json
├── supabase-migration.sql    ← SQL para crear tablas
├── README.md                 ← Este archivo
└── lib/
    ├── chat.mjs              ← POST /chat (OpenAI + historial)
    ├── chatSession.mjs       ← POST /chat/session
    ├── lead.mjs              ← POST /lead
    ├── products.mjs          ← POST /products
    ├── openaiClient.mjs      ← Singleton de OpenAI
    └── supabaseClient.mjs    ← Singleton de Supabase
```

## Personalización

### Cambiar el modelo de OpenAI

En `lib/chat.mjs`, línea del `model`:
- `gpt-4o-mini` → económico (~$0.15/1M tokens), rápido
- `gpt-4o` → más inteligente (~$2.50/1M tokens)
- `gpt-3.5-turbo` → el más barato

### Modificar el prompt del bot

Edita la constante `SYSTEM_PROMPT` en `lib/chat.mjs` con la información de tu negocio.

### Ajustar los quick replies

Modifica la función `generateQuickReplies()` en `lib/chat.mjs`.

## Costos estimados

| Servicio     | Costo estimado                          |
|-------------|-----------------------------------------|
| Lambda      | ~$0.20/mes (100K invocaciones)          |
| API Gateway | ~$3.50/mes (1M requests)                |
| OpenAI      | ~$1-10/mes (depende del uso)            |
| Supabase    | Gratis (plan Free hasta 500MB)          |
| **Total**   | **~$5-15/mes**                          |
