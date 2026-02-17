import React, { useState } from "react";

const FilterBar = ({ filters, setFilters, filterOptions = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    familias = [],
    marcas = [],
    categorias = [],
    subcategorias = []
  } = filterOptions;

  // Función simple sin useCallback para evitar re-renders
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
  const activeFilterCount = Object.values(filters).filter(filter => filter !== '').length;

  return (
    <div className="relative">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 space-y-5">
        {/* Header con título */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Filtrar productos</h3>
              <p className="text-xs text-gray-500">Encuentra exactamente lo que buscas</p>
            </div>
          </div>
          
          {/* Botón para expandir/colapsar en móvil */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            {isExpanded ? 'Ocultar' : 'Mostrar filtros'}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos por nombre, SKU, descripción..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
            />
            {/* Icono de búsqueda animado */}
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {/* Botón de limpiar búsqueda */}
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <span className="w-8 h-8 bg-gray-200 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors group/clear">
                  <svg className="w-4 h-4 text-gray-500 group-hover/clear:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filtros por categorías */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 lg:max-h-[500px] opacity-0 lg:opacity-100 overflow-hidden'}`}>
          {/* Familia */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Familia
            </label>
            <div className="relative">
              <select
                value={filters.familia}
                onChange={(e) => handleFilterChange('familia', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-700"
              >
                <option value="">Todas las familias</option>
                {familias.map(familia => (
                  <option key={familia} value={familia}>{familia}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Marca */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Marca
            </label>
            <div className="relative">
              <select
                value={filters.marca}
                onChange={(e) => handleFilterChange('marca', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-700"
              >
                <option value="">Todas las marcas</option>
                {marcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categoría */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Categoría
            </label>
            <div className="relative">
              <select
                value={filters.categoria}
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-700"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Subcategoría */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
              Subcategoría
            </label>
            <div className="relative">
              <select
                value={filters.subcategoria}
                onChange={(e) => handleFilterChange('subcategoria', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-700"
              >
                <option value="">Todas las subcategorías</option>
                {subcategorias.map(subcategoria => (
                  <option key={subcategoria} value={subcategoria}>{subcategoria}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros activos y botón para limpiar */}
        {hasActiveFilters && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
            {/* Mostrar filtros activos */}
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.familia && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  {filters.familia}
                  <button
                    onClick={() => handleFilterChange('familia', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.marca && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-500/25">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  {filters.marca}
                  <button
                    onClick={() => handleFilterChange('marca', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.categoria && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  {filters.categoria}
                  <button
                    onClick={() => handleFilterChange('categoria', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.subcategoria && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  {filters.subcategoria}
                  <button
                    onClick={() => handleFilterChange('subcategoria', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>

            {/* Botón para limpiar todos los filtros */}
            <button
              onClick={clearAllFilters}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl transition-all duration-300 font-medium text-sm"
              type="button"
            >
              <svg className="h-4 w-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;