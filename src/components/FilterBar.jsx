import React from "react";
import './FilterBar.css'; // Importar el archivo CSS

const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="filter-bar flex space-x-4 mb-4">
      <select
        className="p-2 border rounded"
        value={filters.family}
        onChange={(e) => setFilters({ ...filters, family: e.target.value })}
      >
        <option value="">Familia</option>
        <option value="Sublimación">Sublimación</option>
        <option value="DTG">DTG</option>
        <option value="Eco-solvente">Eco-solvente</option>
        <option value="Fotografía">Fotografía</option>
        <option value="Resina">Resina</option>
        <option value="Técnicos">Técnicos</option>
        <option value="UV">UV</option>
        <option value="Prensa Digital">Prensa Digital</option>
        <option value="Impresión laser">Impresión laser</option>
        <option value="Corte">Corte</option>
        <option value="Laminación">Laminación</option>
      </select>

      <select
        className="p-2 border rounded"
        value={filters.brand}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
      >
        <option value="">Marca</option>
        <option value="Epson">Epson</option>
        <option value="Siscoprint">Siscoprint</option>
        <option value="Konica Minolta">Konica Minolta</option>
        <option value="Graphtec">Graphtec</option>
        <option value="GBC">GBC</option>
      </select>

      <select
        className="p-2 border rounded"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">Categoría</option>
        <option value="Impresoras">Impresoras</option>
        <option value="Ploters">Ploters</option>
        <option value="Calandras">Calandras</option>
        <option value="Planchas">Planchas</option>
        <option value="Prensa">Prensa</option>
        <option value="Finalizadora">Finalizadora</option>
        <option value="Ploter de corte">Ploter de corte</option>
        <option value="Cama plana de corte">Cama plana de corte</option>
        <option value="Unidad de alimentacion y corte de alto volumen de hojas">Unidad de alimentacion y corte de alto volumen de hojas</option>
        <option value="Laminadoras">Laminadoras</option>
      </select>
    </div>
  );
};

export default FilterBar;