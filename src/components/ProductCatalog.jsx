import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ familia: "", marca: "", categoria: "", subcategoria: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/products.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Productos cargados:", data.length); // Debug
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the products:", error);
        setError("Error al cargar los productos");
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.status === 1 && // ✅ Cambiado de "1" a 1 (número)
      (filters.familia ? product.familia === filters.familia : true) &&
      (filters.marca ? product.marca === filters.marca : true) &&
      (filters.categoria ? product.categoria === filters.categoria : true) &&
      (filters.subcategoria ? product.subcategoria === filters.subcategoria : true)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>
      
      {/* Debug info - puedes quitarlo después */}
      <div className="mt-4 p-2 bg-gray-100 text-sm">
        <p>Total productos: {products.length}</p>
        <p>Productos activos: {products.filter(p => p.status === 1).length}</p>
        <p>Productos filtrados: {filteredProducts.length}</p>
      </div>
    </div>
  );
};

export default ProductCatalog;