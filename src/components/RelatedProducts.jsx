// src/components/RelatedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductosRelacionados } from '../services/productosService';
import { getImagenUrl } from '../utils/productUrls';
import { FEATURES } from '../config';

const RelatedProducts = ({ currentSku }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const quotationOnly = FEATURES.PRODUCTS_QUOTATION_ONLY;

  useEffect(() => {
    if (!currentSku) { setLoading(false); return; }

    // Primero obtener el producto actual para saber su familia
    import('../services/productosService').then(({ getProductoBySku, getProductosRelacionados }) => {
      getProductoBySku(currentSku)
        .then(producto => {
          if (!producto) { setLoading(false); return; }
          return getProductosRelacionados(producto, 4);
        })
        .then(data => {
          setRelatedProducts(data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [currentSku]);

  if (loading || relatedProducts.length === 0) return null;

  return (
    <div className="container container-mrg mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos relacionados</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Link
            key={product.idProducto}
            to={`/producto/${product.sku}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center gap-3"
          >
            <img
              src={getImagenUrl(product.imagen)}
              alt={product.nombre}
              className="w-24 h-24 object-contain"
              onError={e => { e.target.src = "/img/noDisponible.jpg"; }}
            />
            <p className="text-sm font-medium text-gray-800 leading-tight">{product.nombre}</p>
            {quotationOnly ? (
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                Solo cotizacion
              </p>
            ) : Number(product.precio) > 0 ? (
              <p className="text-base font-bold text-green-600">
                ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;