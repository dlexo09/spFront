import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";
import { getProductos, getFilterOptions } from "../services/productosService";

const ProductCatalog = ({ initialFilters = {} }) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ 
    familia: initialFilters.familia || "", 
    marca: initialFilters.marca || "", 
    categoria: initialFilters.categoria || "", 
    subcategoria: initialFilters.subcategoria || "",
    search: initialFilters.search || ""
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 12
  });
  const [filterOptions, setFilterOptions] = useState({
    familias: [],
    marcas: [],
    categorias: [],
    subcategorias: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Función para obtener productos desde Supabase
  const fetchProducts = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProductos({
        page,
        limit: pagination.productsPerPage,
        search: currentFilters.search,
        familia: currentFilters.familia,
        categoria: currentFilters.categoria,
        subcategoria: currentFilters.subcategoria,
        marca: currentFilters.marca
      });
      
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
      
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }, [pagination.productsPerPage]); // Solo esta dependencia

  // ✅ Cargar opciones de filtros desde Supabase
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  }, []);

  // ✅ DEBOUNCE con useEffect - espera 1 segundo para búsquedas
  useEffect(() => {
    // Si es solo cambio de búsqueda, aplicar debounce
    const isSearchChange = filters.search !== '';
    
    const timer = setTimeout(() => {
      fetchProducts(1, filters);
    }, isSearchChange ? 1000 : 0); // 1 segundo para búsqueda, inmediato para otros filtros

    return () => clearTimeout(timer);
  }, [filters, fetchProducts]);

  // ✅ Cargar datos iniciales
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handlePageChange = (page) => {
    fetchProducts(page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Función estable para manejar cambios de filtros
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // ✅ Memoizar FilterBar para evitar re-renders innecesarios
  const memoizedFilterBar = useMemo(() => (
    <FilterBar 
      filters={filters} 
      setFilters={handleFiltersChange}
      filterOptions={filterOptions}
    />
  ), [filters, handleFiltersChange, filterOptions]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-lg font-medium text-gray-600 animate-pulse">Cargando productos...</div>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg max-w-md text-center space-y-4 border border-red-100">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">¡Ups! Algo salió mal</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => fetchProducts(pagination.currentPage, filters)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barra de filtros memoizada */}
      {memoizedFilterBar}
      
      {/* Indicador de búsqueda activa */}
      {filters.search && loading && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-6 h-6 border-2 border-blue-300 rounded-full"></div>
              <div className="absolute top-0 left-0 w-6 h-6 border-2 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <span className="text-blue-700 font-medium">Buscando "<span className="font-bold">{filters.search}</span>"...</span>
          </div>
        </div>
      )}
      
      {/* Información de resultados con diseño mejorado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl px-6 py-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">
              {pagination.totalProducts} productos encontrados
            </p>
            <p className="text-sm text-gray-500">
              Mostrando {((pagination.currentPage - 1) * pagination.productsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.productsPerPage, pagination.totalProducts)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-500">Página</span>
          <span className="font-bold text-blue-600">{pagination.currentPage}</span>
          <span className="text-sm text-gray-400">de</span>
          <span className="font-bold text-gray-700">{pagination.totalPages}</span>
        </div>
      </div>

      {/* Grid de productos con diseño mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product, index) => (
          <ProductCard key={product.sku || product.idProducto} product={product} index={index} />
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta ajustar los filtros para encontrar lo que buscas</p>
            </div>
            <button 
              onClick={() => handleFiltersChange({ familia: "", marca: "", categoria: "", subcategoria: "", search: "" })}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="pt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;