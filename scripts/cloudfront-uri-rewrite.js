/**
 * CloudFront Function (runtime: cloudfront-js-2.0)
 *
 * Objetivo:
 * - Servir rutas estaticas prerenderizadas como /about/index.html
 * - Mantener compatibilidad SPA para rutas no prerenderizadas -> /index.html
 * - No tocar archivos estaticos (assets, imagenes, fuentes, etc.)
 *
 * Como usar:
 * 1) Crea una CloudFront Function nueva.
 * 2) Pega solo la funcion handler.
 * 3) Publish.
 * 4) Associate al behavior por defecto (*) en Viewer Request.
 */
function handler(event) {
  var request = event.request;
  var uri = request.uri || '/';

  // No reescribir recursos estaticos con extension
  if (/\.[a-zA-Z0-9]+$/i.test(uri)) {
    return request;
  }

  // Normalizar doble slash final por seguridad
  if (uri.length > 1 && uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }

  // Home
  if (uri === '' || uri === '/') {
    request.uri = '/index.html';
    return request;
  }

  // Intentar primero ruta prerenderizada: /ruta/index.html
  // Si no existe en S3, CloudFront devolvera 403/404 y aplica custom error response a /index.html
  request.uri = uri + '/index.html';
  return request;
}
