import { supabase } from '../lib/supabase';

/**
 * Obtener productos con paginación y filtros
 */
export async function getProductos({ 
  page = 1, 
  limit = 12, 
  search = "", 
  familia = "",
  categoria = "",
  subcategoria = "",
  marca = ""
} = {}) {
  let query = supabase
    .from('productos')
    .select('*', { count: 'exact' })
    .eq('status', 1); // Solo productos activos

  // Búsqueda
  if (search) {
    query = query.or(`nombre.ilike.%${search}%,sku.ilike.%${search}%,marca.ilike.%${search}%,descripcionCorta.ilike.%${search}%`);
  }

  // Filtros
  if (familia) query = query.eq('familia', familia);
  if (categoria) query = query.eq('categoria', categoria);
  if (subcategoria) query = query.eq('subcategoria', subcategoria);
  if (marca) query = query.eq('marca', marca);

  // Paginación
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query
    .order('idProducto', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("Error al cargar productos");
  }

  return {
    success: true,
    products: data || [],
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      totalProducts: count || 0,
      limit
    }
  };
}

/**
 * Obtener un producto por ID
 */
export async function getProductoById(id) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('idProducto', id)
    .eq('status', 1)
    .single();

  if (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }

  return data;
}

/**
 * Obtener un producto por SKU
 */
export async function getProductoBySku(sku) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('sku', sku)
    .eq('status', 1)
    .single();

  if (error) {
    console.error("Error al obtener producto por SKU:", error);
    return null;
  }

  return data;
}

/**
 * Obtener opciones de filtros (valores únicos)
 */
export async function getFilterOptions() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('familia, marca, categoria, subcategoria')
    .eq('status', 1);

  if (error) {
    console.error("Error al obtener filtros:", error);
    return {
      familias: [],
      marcas: [],
      categorias: [],
      subcategorias: []
    };
  }

  // Extraer valores únicos
  const familias = [...new Set(productos.map(p => p.familia).filter(Boolean))].sort();
  const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))].sort();
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
  const subcategorias = [...new Set(productos.map(p => p.subcategoria).filter(Boolean))].sort();

  return { familias, marcas, categorias, subcategorias };
}

/**
 * Obtener productos relacionados por familia o categoría
 */
export async function getProductosRelacionados(productoActual, limite = 4) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('status', 1)
    .eq('familia', productoActual.familia)
    .neq('idProducto', productoActual.idProducto)
    .limit(limite);

  if (error) {
    console.error("Error al obtener productos relacionados:", error);
    return [];
  }

  return data || [];
}

/**
 * Buscar productos (para barra de búsqueda)
 */
export async function buscarProductos(termino, limite = 10) {
  if (!termino || termino.length < 2) return [];

  const { data, error } = await supabase
    .from('productos')
    .select('idProducto, nombre, sku, imagen, marca, precio')
    .eq('status', 1)
    .or(`nombre.ilike.%${termino}%,sku.ilike.%${termino}%,marca.ilike.%${termino}%`)
    .limit(limite);

  if (error) {
    console.error("Error en búsqueda:", error);
    return [];
  }

  return data || [];
}
