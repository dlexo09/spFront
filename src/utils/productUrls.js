/**
 * Utilidades para construir URLs de archivos de productos
 * Los archivos se guardan solo con el nombre, no la URL completa.
 */

const BASE_URL = "https://www.siscoprint.com";

/**
 * URL de imagen principal del producto
 * Ruta: /img/productos/{nombreArchivo}
 */
export function getImagenUrl(nombreArchivo) {
  if (!nombreArchivo) return "/img/noDisponible.jpg";
  // Si ya es una URL completa, devolverla tal cual
  if (nombreArchivo.startsWith('http')) return nombreArchivo;
  return `${BASE_URL}/img/productos/${nombreArchivo}`;
}

/**
 * URL de imagen de galería
 * Ruta: /img/productos/{idProducto}/gallery/{nombreArchivo}
 */
export function getGalleryImageUrl(idProducto, nombreArchivo) {
  if (!nombreArchivo || !idProducto) return "/img/noDisponible.jpg";
  if (nombreArchivo.startsWith('http')) return nombreArchivo;
  return `${BASE_URL}/img/productos/${idProducto}/gallery/${nombreArchivo}`;
}

/**
 * URL del datasheet principal
 * Ruta: /files/datasheets/{nombreArchivo}
 */
export function getDatasheetUrl(nombreArchivo) {
  if (!nombreArchivo) return null;
  if (nombreArchivo.startsWith('http')) return nombreArchivo;
  return `${BASE_URL}/files/datasheets/${nombreArchivo}`;
}

/**
 * URL de datasheets múltiples
 * Ruta: /files/productos/{idProducto}/datasheets/{nombreArchivo}
 */
export function getDatasheetMultipleUrl(idProducto, nombreArchivo) {
  if (!nombreArchivo || !idProducto) return null;
  if (nombreArchivo.startsWith('http')) return nombreArchivo;
  return `${BASE_URL}/files/productos/${idProducto}/datasheets/${nombreArchivo}`;
}

export { BASE_URL };
