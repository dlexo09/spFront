import React from "react";

const FilterBar = ({ filters, setFilters, filterOptions = {} }) => {
  const {
    familias = [],
    marcas = [],
    categorias = [],
    subcategorias = []
  } = filterOptions;

  // ✅ Función simple sin useCallback para evitar re-renders
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    
    // Si se cambia familia, limpiar categoría y subcategoría
    if (filterType === 'familia') {
      newFilters.categoria = '';
      newFilters.subcategoria = '';
    }
    // Si se cambia categoría, limpiar subcategoría
    else if (filterType === 'categoria') {
      newFilters.subcategoria = '';
    }
    
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      familia: '',
      marca: '',
      categoria: '',
      subcategoria: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
      {/* ✅ Barra de búsqueda SIMPLE sin debounce */}
      <div className="w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos por nombre, SKU, descripción..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {/* Icono de búsqueda */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filtros por categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Familia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Familia
          </label>
          <select
            value={filters.familia}
            onChange={(e) => handleFilterChange('familia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las familias</option>
            {familias.map(familia => (
              <option key={familia} value={familia}>{familia}</option>
            ))}
          </select>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            value={filters.marca}
            onChange={(e) => handleFilterChange('marca', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las marcas</option>
            {marcas.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={filters.categoria}
            onChange={(e) => handleFilterChange('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>

        {/* Subcategoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategoría
          </label>
          <select
            value={filters.subcategoria}
            onChange={(e) => handleFilterChange('subcategoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las subcategorías</option>
            {subcategorias.map(subcategoria => (
              <option key={subcategoria} value={subcategoria}>{subcategoria}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Filtros activos y botón para limpiar */}
      {hasActiveFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-gray-200">
          {/* Mostrar filtros activos */}
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Búsqueda: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
            {filters.familia && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Familia: {filters.familia}
                <button
                  onClick={() => handleFilterChange('familia', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
            {filters.marca && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Marca: {filters.marca}
                <button
                  onClick={() => handleFilterChange('marca', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
            {filters.categoria && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Categoría: {filters.categoria}
                <button
                  onClick={() => handleFilterChange('categoria', '')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
            {filters.subcategoria && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Subcategoría: {filters.subcategoria}
                <button
                  onClick={() => handleFilterChange('subcategoria', '')}
                  className="ml-1 text-red-600 hover:text-red-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* Botón para limpiar todos los filtros */}
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;