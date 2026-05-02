// Tasa de cargo por uso de pasarela de pago digital.
// Este markup se embebe en el precio publicado al cliente.
export const GATEWAY_RATE = 0.04;

// Colchón de stock: si la existencia es igual o menor a este valor,
// el producto se muestra como agotado para evitar ventas sin inventario físico.
export const STOCK_BUFFER = 2;

/**
 * Devuelve true si el producto tiene stock suficiente para venta online.
 * Si no se registra stock (null/undefined), se asume disponible.
 * @param {number|null|undefined} stock
 * @returns {boolean}
 */
export const hasOnlineStock = (stock) =>
  stock === null || stock === undefined || stock > STOCK_BUFFER;

/**
 * Aplica el markup de pasarela al precio base.
 * Redondea al centavo más cercano.
 * @param {number} price - Precio sin markup
 * @returns {number} Precio con markup incluido
 */
export const withMarkup = (price) =>
  Math.round(price * (1 + GATEWAY_RATE) * 100) / 100;
