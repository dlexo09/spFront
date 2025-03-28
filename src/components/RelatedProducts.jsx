import React, { useEffect, useState } from "react";
import "./RelatedProducts.css"; // Archivo CSS para estilos personalizados

const RelatedProducts = ({ currentSku }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Simular la obtención de productos relacionados desde un archivo JSON o API
    fetch("/products.json") // Asegúrate de que esta ruta sea correcta
      .then((res) => res.json())
      .then((data) => {
        // Filtrar productos relacionados (por ejemplo, basados en la categoría o SKU)
        const related = data.filter(
          (product) =>
            product.sku !== currentSku && // Excluir el producto actual
            (product.category === "Consumibles" || product.category === "Accesorios") // Ejemplo de categorías relacionadas
        );
        setRelatedProducts(related);
      })
      .catch((error) => console.error("Error fetching related products:", error));
  }, [currentSku]);

  if (relatedProducts.length === 0) {
    return <div>No hay productos relacionados disponibles.</div>;
  }

  return (
    <div className="related-products">
      <h2 className="text-2xl font-bold mb-4">Productos que podrian interesarte</h2>
      <div className="related-products-carousel">
        {relatedProducts.map((product) => (
          <div key={product.sku} className="related-product-card">
            <img
              src={product.image}
              alt={product.name}
              className="related-product-image"
            />
            <h3 className="related-product-name">{product.name}</h3>
            <p className="related-product-price text-green-500 font-bold">
              ${product.price || "Cotización"}
            </p>
            <a
              href={`/product/${product.sku}`}
              className="related-product-link text-blue-500 underline"
            >
              Ver producto
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;