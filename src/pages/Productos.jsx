import React from "react";
import ProductCatalog from "../components/ProductCatalog";
import './Productos.css'; // Importar el archivo CSS

const ProductPage = () => {
  return (
    <div className="container container-mrg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue">Catálogo de Productos</h1>
      <ProductCatalog />
    </div>
  );
};

export default ProductPage;