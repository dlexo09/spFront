import { getSupabase } from './supabaseClient.mjs';

/**
 * Búsqueda interna reutilizable (usada por chat.mjs vía function calling)
 * @param {string} [keyword]   – texto libre (nombre, descripción)
 * @param {string} [brand]     – marca exacta ej. "Epson", "Konica Minolta"
 * @param {string} [categoria] – categoría ej. "Gran Formato"
 */
export async function searchProducts({ keyword, brand, categoria, familia } = {}) {
  if (!keyword && !brand && !categoria && !familia) return { products: [] };

  const supabase = getSupabase();

  let query = supabase
    .from('productos')
    .select('idProducto, sku, nombre, precio, imagen, marca, familia, categoria, descripcionCorta')
    .eq('status', 1);

  // Filtro por marca (case-insensitive)
  if (brand) {
    query = query.ilike('marca', `%${brand}%`);
  }

  // Filtro por familia tecnológica
  if (familia) {
    query = query.ilike('familia', `%${familia}%`);
  }

  // Filtro por categoría
  if (categoria) {
    query = query.ilike('categoria', `%${categoria}%`);
  }

  // Búsqueda de texto libre en nombre + descripción + sku + marca + familia
  if (keyword) {
    query = query.or(`nombre.ilike.%${keyword}%,descripcionCorta.ilike.%${keyword}%,sku.ilike.%${keyword}%,marca.ilike.%${keyword}%,familia.ilike.%${keyword}%`);
  }

  const { data, error } = await query.limit(6);

  if (error) {
    console.error('Error searching products:', error);
    return { products: [] };
  }

const SITE_BASE = 'https://www.siscoprint.com';

  const products = (data || []).map(p => ({
    id: p.idProducto,
    sku: p.sku,
    name: p.nombre,
    brand: p.marca,
    categoria: p.categoria,
    familia: p.familia,
    description: p.descripcionCorta,
    price: p.precio,
    image: p.imagen
      ? `${SITE_BASE}/img/productos/${p.imagen}`
      : `${SITE_BASE}/img/noDisponible.jpg`,
    url: `${SITE_BASE}/producto/${p.sku}`,
  }));

  return { products };
}

/**
 * POST /products  (endpoint REST directo del widget)
 */
export async function handleProducts({ query, brand, categoria }) {
  return searchProducts({ keyword: query, brand, categoria });
}
