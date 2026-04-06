import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { getImagenUrl } from "../utils/productUrls";

const ProductCard = ({ product, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const defaultImage = "/img/noDisponible.jpg";
  // Construir URL completa desde el nombre de archivo
  const productImage = product.imagen ? getImagenUrl(product.imagen) : defaultImage;

  // Verificar si el producto tiene precio y está disponible para venta
  const tienePrec = product.precio && product.precio > 0 && String(product.disponible).toUpperCase() === "TRUE";

  // Precio a mostrar (oferta o normal)
  const precioMostrar = product.precio_oferta && product.precio_oferta > 0 ? product.precio_oferta : product.precio;
  const tieneOferta = product.precio_oferta && product.precio_oferta > 0 && product.precio > product.precio_oferta;

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2"
      style={{ 
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efecto de borde gradiente animado */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
      <div className="absolute inset-[1px] rounded-2xl bg-white" />
      
      {/* Badges superiores */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
        {tienePrec ? (
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg shadow-emerald-500/30">
            Disponible
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg shadow-amber-500/30 animate-pulse">
            Cotización
          </span>
        )}
        {product.nuevo && (
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg">
            Nuevo
          </span>
        )}
        {product.destacado && (
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full shadow-lg">
            Destacado
          </span>
        )}
        {tieneOferta && (
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg">
            -{Math.round(((product.precio - product.precio_oferta) / product.precio) * 100)}%
          </span>
        )}
      </div>

      {/* Botón de vista rápida */}
      <div className={`absolute top-3 right-3 z-10 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Link
          to={`/producto/${product.idProducto}`}
          className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
      </div>

      {/* Contenedor de imagen */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={productImage}
          alt={product.nombre}
          onError={(e) => (e.target.src = defaultImage)}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Overlay con efecto */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido */}
      <div className="relative p-5 space-y-3">
        {/* Categoría con diseño pill */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-md">
            {product.categoria}
          </span>
          {product.marca && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
              {product.marca}
            </span>
          )}
        </div>

        {/* Nombre del producto */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
          {product.nombre}
        </h3>

        {/* SKU */}
        <p className="text-xs font-mono text-gray-400 tracking-wide">
          SKU: {product.sku}
        </p>

        {/* Precio con diseño destacado */}
        <div className="pt-2 border-t border-gray-100">
          {tienePrec ? (
            <div>
              {tieneOferta ? (
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${precioMostrar.toLocaleString('es-MX')}
                    </span>
                    <span className="text-xs text-gray-400">MXN</span>
                  </div>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.precio.toLocaleString('es-MX')}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ${product.precio.toLocaleString('es-MX')}
                  </span>
                  <span className="text-xs text-gray-400">MXN</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-base font-semibold text-amber-600">
                Solicitar precio
              </span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="pt-3 flex flex-col gap-2">
          <Link
            to={`/producto/${product.idProducto}`}
            className="relative overflow-hidden w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Ver detalles
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          {!tienePrec ? (
            <Link
              to={`/cotizacion?sku=${product.sku}&nombre=${encodeURIComponent(product.nombre)}`}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/40 hover:from-amber-600 hover:to-orange-600 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Solicitar cotización
              </span>
            </Link>
          ) : (
            <AddToCartButton
              product={{
                sku: product.sku,
                name: product.nombre,
                precio: precioMostrar,
                image: productImage,
                description: product.descripcionCorta,
                marca: product.marca,
                categoria: product.categoria,
                disponible: product.disponible
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 active:scale-95"
            />
          )}
        </div>
      </div>

      {/* Estilos para animación */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;