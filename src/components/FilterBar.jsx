import React from "react";
import './FilterBar.css'; // Importar el archivo CSS

const FilterBar = ({ filters, setFilters }) => {
  // Función para reiniciar los filtros
  const resetFilters = () => {
    setFilters({
      familia: "",
      marca: "",
      categoria: "",
      subcategoria: "",
    });
  };

  return (
    <div className="filter-bar flex space-x-4 mb-4">
      <select
        className="p-2 border rounded"
        value={filters.familia}
        onChange={(e) => setFilters({ ...filters, familia: e.target.value })}
      >
        <option value="">Familia</option>
        <option value="Corte">Corte</option>
        <option value="DTG">DTG</option>
        <option value="Eco-solvente">Eco-solvente</option>
        <option value="Fotografía">Fotografía</option>
        <option value="Impresión laser">Impresión laser</option>
        <option value="Laminación">Laminación</option>
        <option value="Prensa Digital">Prensa Digital</option>
        <option value="Resina">Resina</option>
        <option value="Sublimación">Sublimación</option>
        <option value="Técnicos">Técnicos</option>
        <option value="UV">UV</option>
        <option value="UVgel">UVgel</option>
      </select>

      <select
        className="p-2 border rounded"
        value={filters.marca}
        onChange={(e) => setFilters({ ...filters, marca: e.target.value })}
      >
        <option value="">Marca</option>
        <option value="Canon">Canon</option>
        <option value="Epson">Epson</option>
        <option value="GBC">GBC</option>
        <option value="Graphtec">Graphtec</option>
        <option value="Konica Minolta">Konica Minolta</option>
        <option value="Siscoprint">Siscoprint</option>
        <option value="Stratojet">Stratojet</option>
      </select>

      <select
        className="p-2 border rounded"
        value={filters.categoria}
        onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
      >
        <option value="">Categoría</option>
        <option value="Calandras">Calandras</option>
        <option value="Cama plana de corte">Cama plana de corte</option>
        <option value="Finalizadora">Finalizadora</option>
        <option value="Impresoras">Impresoras</option>
        <option value="Laminadoras">Laminadoras</option>
        <option value="Planchas">Planchas</option>
        <option value="Ploter de corte">Ploter de corte</option>
        <option value="Ploters">Ploters</option>
        <option value="Prensa">Prensa</option>
        <option value="Alimentador automático de hojas">Unidad de alimentacion y corte de alto volumen de hojas</option>
      </select>

      <select
        className="p-2 border rounded"
        value={filters.subcategoria}
        onChange={(e) => setFilters({ ...filters, subcategoria: e.target.value })}
      >
        <option value="">Subcategoría</option>
        <option value="Industrial">Industrial</option>
        <option value="Profesiónal">Profesiónal</option>
        <option value="Semi-Profesiónal">Semi-Profesiónal</option>
      </select>

      {/* Botón para reiniciar los filtros */}
      <button
        className="p-2 border rounded bg-red-500 text-white"
        onClick={resetFilters}
      >
        Reiniciar Filtros
      </button>
    </div>
  );
};

export default FilterBar;