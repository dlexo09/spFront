import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { getImagenUrl } from "../utils/productUrls";

const ProductCard = ({ product, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultImage = "/img/noDisponible.jpg";
  const productImage = product.imagen ? getImagenUrl(product.imagen) : defaultImage;
  const tienePrec = product.precio && product.precio > 0 && String(product.disponible).toUpperCase() === "TRUE";
  const precioMostrar = product.precio_oferta && product.precio_oferta > 0 ? product.precio_oferta : product.precio;
  const tieneOferta = product.precio_oferta && product.precio_oferta > 0 && product.precio > product.precio_oferta;
  const categoryLabel = product.categoria || "Sin categoria";
  const rawDescription = product.descripcionCorta || "Equipo disponible con acompanamiento comercial y soporte especializado.";
  // Quitar etiquetas HTML para mostrar solo texto plano en la tarjeta
  const shortDescription = rawDescription.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  return (
    <div 
      className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(30,58,138,0.12)]"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-amber-400" />

      <div className="absolute top-4 left-4 z-10 flex max-w-[75%] flex-wrap gap-2">
        {tienePrec ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 border border-emerald-100">
            Disponible
          </span>
        ) : (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700 border border-amber-100">
            Cotización
          </span>
        )}
        {product.nuevo && (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 border border-sky-100">
            Nuevo
          </span>
        )}
        {product.destacado && (
          <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rose-700 border border-rose-100">
            Destacado
          </span>
        )}
        {tieneOferta && (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)]">
            -{Math.round(((product.precio - product.precio_oferta) / product.precio) * 100)}%
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 opacity-100 transition-all duration-300 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0">
        <Link
          to={`/producto/${product.idProducto}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/92 text-slate-600 shadow-[0_12px_24px_rgba(15,23,42,0.10)] backdrop-blur-sm transition-colors hover:bg-blue-600 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
      </div>

      <div className="relative h-56 overflow-hidden border-b border-slate-100 bg-[linear-gradient(180deg,#f8fbff_0%,#eef3f8_100%)] px-5 pb-4 pt-7">
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
          className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.04] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 via-white/18 to-transparent" />
      </div>

      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
            {categoryLabel}
          </span>
          {product.marca && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              {product.marca}
            </span>
          )}
        </div>

        <h3 className="mt-4 min-h-[3.5rem] text-lg font-bold leading-7 text-slate-800 transition-colors group-hover:text-blue-700">
          {product.nombre}
        </h3>

        <p className="mt-3 min-h-[3rem] text-sm leading-6 text-slate-500 line-clamp-2">
          {shortDescription}
        </p>

        <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
          SKU: {product.sku || 'N/D'}
        </p>

        <div className="mt-4 border-t border-slate-100 pt-4">
          {tienePrec ? (
            <div className="space-y-1">
              {tieneOferta ? (
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[1.9rem] font-extrabold text-emerald-600">
                      ${precioMostrar.toLocaleString('es-MX')}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">MXN</span>
                  </div>
                  <span className="text-sm text-slate-400 line-through">
                    ${product.precio.toLocaleString('es-MX')}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-[1.9rem] font-extrabold text-emerald-600">
                    ${product.precio.toLocaleString('es-MX')}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">MXN</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-3 text-amber-700 border border-amber-100">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold">
                Solicitar precio
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            to={`/producto/${product.idProducto}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_18px_32px_rgba(29,78,216,0.24)] active:scale-[0.99]"
          >
            Ver detalles
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {!tienePrec ? (
            <Link
              to={`/cotizacion?sku=${product.sku}&nombre=${encodeURIComponent(product.nombre)}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700 transition-all duration-300 hover:bg-amber-100 hover:shadow-[0_14px_26px_rgba(245,158,11,0.16)] active:scale-[0.99]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
              </svg>
              Solicitar cotizacion
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
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-[0_16px_28px_rgba(5,150,105,0.24)] active:scale-[0.99]"
            />
          )}
        </div>
      </div>

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