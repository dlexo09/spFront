import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }) => {
  const defaultImage = "/img/noDisponible.jpg";
  const productImage = product.imagen ? product.imagen : defaultImage;

  // Verificar si el producto tiene precio y está disponible para venta
  // const tienePrec = product.precio && product.precio > 0 && product.disponibleParaVenta === "TRUE";
  const tienePrec = false;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img
        src={`/img/productos/${productImage}`}
        alt={product.nombre}
        onError={(e) => (e.target.src = defaultImage)}
        className="h-40 object-contain"
      />
      <h3 className="text-lg font-semibold mt-2 text-center">{product.nombre}</h3>
      <p className="text-gray-600 text-center">{product.categoria}</p>
      <p className="text-gray-500 text-sm text-center">SKU: {product.sku}</p>

      {/* Contenedor con altura fija para precio/mensaje */}
      <div className="h-12 flex items-center justify-center mt-2">
        {tienePrec ? (
          <p className="text-green-600 font-bold text-lg">
            ${product.precio.toLocaleString('es-MX')}
          </p>
        ) : (
          <p className="text-orange-600 font-semibold text-sm">Solo cotización</p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 w-full">
        <Link
          to={`/product/${product.sku}`}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center transition-colors"
        >
          Ver más
        </Link>

        {/* Mostrar botón de cotización SOLO si NO tiene precio */}
        {!tienePrec && (
          <Link
            to={`/cotizacion?sku=${product.sku}&nombre=${product.nombre}`}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 text-center transition-colors"
          >
            Solicitar cotización
          </Link>
        )}

        {/* Mostrar botón de carrito SOLO si tiene precio */}
        {tienePrec ? (
          <AddToCartButton
            product={{
              sku: product.sku,
              name: product.nombre,
              precio: product.precio,
              image: `/img/productos/${productImage}`,
              description: product.descripcionCorta,
              marca: product.marca,
              categoria: product.categoria,
              disponibleParaVenta: product.disponibleParaVenta
            }}
            className="w-full"
          />
        ) : null}

      </div>
    </div>
  );
};

export default ProductCard;