import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ 
    familia: "", 
    marca: "", 
    categoria: "", 
    subcategoria: "",
    search: ""
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

  // ✅ Función para hacer peticiones (estable con useCallback)
  const fetchProducts = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.productsPerPage.toString(),
        status: '1'
      });
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          params.append(key, value);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos?${params}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }
      
      const data = await response.json();
      
      // Si el backend devuelve paginación estructurada
      if (data.success && data.data) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        // Fallback: usar respuesta directa
        setProducts(data);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(data.length / pagination.productsPerPage),
          totalProducts: data.length
        }));
      }
      
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }, [pagination.productsPerPage]); // Solo esta dependencia

  // ✅ Cargar opciones de filtros
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/filters`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setFilterOptions(result.data);
        }
      }
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
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg">Cargando productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="text-lg text-red-600">{error}</div>
        <button 
          onClick={() => fetchProducts(pagination.currentPage, filters)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Barra de filtros memoizada */}
      {memoizedFilterBar}
      
      {/* ✅ Indicador de búsqueda activa */}
      {filters.search && loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Buscando "{filters.search}"...</span>
          </div>
        </div>
      )}
      
      {/* Información de resultados */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Mostrando {((pagination.currentPage - 1) * pagination.productsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.productsPerPage, pagination.totalProducts)} de {pagination.totalProducts} productos
        </p>
        <div className="text-sm text-gray-500">
          Página {pagination.currentPage} de {pagination.totalPages}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.sku || product.idProducto} product={product} />
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados.</p>
          <button 
            onClick={() => handleFiltersChange({ familia: "", marca: "", categoria: "", subcategoria: "", search: "" })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductCatalog;