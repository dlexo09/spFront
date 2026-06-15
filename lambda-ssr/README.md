# Lambda SSR (Vike)

Esta Lambda renderiza HTML SSR para las rutas publicas de Vike.

## Flujo recomendado en AWS

1. S3 + CloudFront para estaticos (`dist/client`).
2. API Gateway HTTP API + Lambda SSR para rutas HTML publicas.
3. CloudFront con dos origins:
   - Origin A: S3 (assets y archivos estaticos)
   - Origin B: API Gateway (SSR)

## Build y empaquetado

Desde la raiz del proyecto:

```powershell
npm run build
powershell -ExecutionPolicy Bypass -File scripts/package-ssr-lambda.ps1
```

Esto genera `lambda-ssr/function.zip`.

## Configuracion Lambda

- Runtime: Node.js 22.x (recomendado) o Node.js 24.x
- Handler: `index.handler`
- Arquitectura: x86_64 o arm64
- Timeout sugerido: 15-20 segundos
- Memoria sugerida: 512 MB

## Configuracion API Gateway

- Crear HTTP API
- Integrar con Lambda SSR
- Route key: `ANY /{proxy+}` y `ANY /`

## CloudFront Behaviors sugeridos

- `/assets/*` -> S3
- `/img/*` -> S3
- `/fonts/*` -> S3
- `/video/*` -> S3
- `/*` -> API Gateway (SSR)

Con esto, el HTML sale de Lambda (SEO/AEO) y los assets se sirven desde S3/CDN.
