import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ family: "", brand: "", category: "" });

  useEffect(() => {
    fetch("/src/data/products.json") // Asegúrate de que esta ruta sea correcta
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching the products:", error));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (filters.family ? product.family === filters.family : true) &&
      (filters.brand ? product.brand === filters.brand : true) &&
      (filters.category ? product.category === filters.category : true)
  );

  return (
    <div>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;