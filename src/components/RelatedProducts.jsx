// src/components/RelatedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from "./AddToCartButton";

const RelatedProducts = ({ currentSku }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar productos relacionados
    fetch('/consumibles.json')
      .then(res => res.json())
      .then(data => {
        // Buscar por SKU padre o por nombre del producto relacionado
        const related = data.filter(item => 
          item['SKU-PADRE'] === currentSku || 
          item['PROD RELACIONADO'] === currentSku
        );
        setRelatedProducts(related);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error cargando consumibles:', error);
        setLoading(false);
      });
  }, [currentSku]);

  if (loading) return null;
  if (relatedProducts.length === 0) return null;

  return (
    <div className="container mx-auto p-4 mt-12">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Consumibles y accesorios compatibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product, index) => {
          // Verificar si el producto tiene precio y está disponible para venta
          const tienePrec = 
            product["precio sugerido"] && 
            parseFloat(product["precio sugerido"]) > 0 && 
            product["disponible"] !== "FALSE";
          
          return (
            <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
              <img 
                src={`/img/productos/${product.Imagen}`} 
                alt={product["item name"]}
                className="w-28 h-28 object-contain mb-3"
                onError={(e) => e.target.src = "/img/noDisponible.jpg"}
              />
              <h3 className="text-sm font-medium text-center mb-1 min-h-[40px]">{product["item name"]}</h3>
              <p className="text-xs text-gray-600">SKU: {product.SKU}</p>
              
              {tienePrec && (
                <p className="text-base font-bold text-green-600 mt-2">
                  ${parseFloat(product["precio sugerido"]).toLocaleString('es-MX')}
                </p>
              )}
              
              <div className="mt-3 w-full flex flex-col gap-2">
                {/* Link para ver detalles */}
                <Link 
                  to={`/producto/${product.SKU}`} 
                  className="text-sky-600 hover:text-sky-800 text-sm font-medium text-center"
                >
                  Ver detalles
                </Link>
                
                {/* Botón para agregar al carrito si tiene precio */}
                {tienePrec ? (
                  <AddToCartButton
                    product={{
                      sku: product.SKU,
                      name: product["item name"],
                      precio: parseFloat(product["precio sugerido"]),
                      image: `/img/productos/${product.Imagen}`,
                      description: product.Descripcion,
                      marca: product.PRODUCTO,
                      categoria: "Consumible",
                      disponible: "TRUE"
                    }}
                    className="w-full text-sm py-1"
                  />
                ) : (
                  <Link
                    to={`/cotizacion?sku=${product.SKU}&nombre=${encodeURIComponent(product["item name"])}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1 px-3 rounded text-center"
                  >
                    Solicitar Cotización
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;