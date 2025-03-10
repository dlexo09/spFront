import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={product.image} alt={product.name} className="h-40 object-contain" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.category}</p>
      <p className="text-green-500 font-bold">${product.price || "Cotización"}</p>
      <a href={`/product/${product.sku}`} className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Ver más
      </a>
    </div>
  );
};

export default ProductCard;