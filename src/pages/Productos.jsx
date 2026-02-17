import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";
import './Productos.css'; // Importar el archivo CSS

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  
  // Leer filtros iniciales desde la URL (?familia=X&marca=Y, etc.)
  const initialFilters = {
    familia: searchParams.get('familia') || '',
    marca: searchParams.get('marca') || '',
    categoria: searchParams.get('categoria') || '',
    subcategoria: searchParams.get('subcategoria') || '',
    search: searchParams.get('search') || '',
  };

  return (
    <div className="container container-mrg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue">Catálogo de Productos</h1>
      <ProductCatalog initialFilters={initialFilters} />
    </div>
  );
};

export default ProductPage;