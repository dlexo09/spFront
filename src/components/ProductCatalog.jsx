import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ familia: "", marca: "", categoria: "" });
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    setLoading(true); // Iniciar el estado de carga
    fetch("/products.json")
    // fetch("http://localhost/alexis/siscoprint/api.php/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false); // Finalizar el estado de carga
      })
      .catch((error) => {
        console.error("Error fetching the products:", error);
        setError("Error al cargar los productos");
        setLoading(false); // Finalizar el estado de carga
      });
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (filters.familia ? product.familia === filters.familia : true) &&
      (filters.marca ? product.marca === filters.marca : true) &&
      (filters.categoria ? product.categoria === filters.categoria : true)
  );

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.idProducto} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;