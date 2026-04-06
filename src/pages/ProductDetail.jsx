import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import QuotationForm from "../components/QuotationForm";
import AddToCartButton from "../components/AddToCartButton";
import { Link } from "react-router-dom";
import { getProductoById, getProductoBySku } from "../services/productosService";
import { getImagenUrl, getGalleryImageUrl, getDatasheetUrl } from "../utils/productUrls";

import './ProductDetail.css';

const ProductDetail = () => {
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleQuotationClick = () => {
    setShowQuotationForm(true);
  };

  const handleCloseForm = () => {
    setShowQuotationForm(false);
  };

  const handleViewPdf = (url) => {
    if (!url) return;
    // Abrir PDF en nueva pestaña (evita problemas de X-Frame-Options)
    window.open(url, '_blank');
  };

  const handleClosePdf = () => {
    setShowPdfViewer(false);
    setActivePdfUrl("");
  };

  // Abrir lightbox en una imagen específica
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    const allImages = [product.imagen, ...gallery];
    const newIndex = (lightboxIndex + direction + allImages.length) % allImages.length;
    setLightboxIndex(newIndex);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Si el parámetro es numérico, buscar por idProducto; si no, buscar por SKU
        const isNumeric = /^\d+$/.test(id);
        const foundProduct = isNumeric 
          ? await getProductoById(id) 
          : await getProductoBySku(id);

        if (foundProduct) {
          setProduct(foundProduct);
          // Construir URL completa de imagen principal
          setSelectedImage(getImagenUrl(foundProduct.imagen));

          // Cargar galería desde imagenesAdicionales (JSON array de nombres de archivo)
          if (foundProduct.imagenesAdicionales) {
            let imgs = foundProduct.imagenesAdicionales;
            if (typeof imgs === 'string') {
              try { imgs = JSON.parse(imgs); } catch { imgs = []; }
            }
            if (Array.isArray(imgs)) {
              // Construir URLs completas para cada imagen de galería
              setGallery(imgs.map(img => getGalleryImageUrl(foundProduct.idProducto, img)));
            }
          }
        } else {
          console.error("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error al cargar los datos del producto:", error);
      }
    };

    loadProduct();
  }, [id]);

  // Script dinámico de 1WorldSync
  useEffect(() => {
    if (product) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        var ccs_cc_args = ccs_cc_args || [];
        ccs_cc_args.push(['cpn', '${product.sku}']);
        ccs_cc_args.push(['mf', '${product.marca || ""}']);
        ccs_cc_args.push(['pn', '${product.pn || "N/A"}']);
        ccs_cc_args.push(['upcean', 'UPC_EAN_CODE']);
        ccs_cc_args.push(['ccid', 'CATALOG_CODE']);
        ccs_cc_args.push(['lang', 'ES']);
        ccs_cc_args.push(['market', 'MX']);
        (function () {
          var o = ccs_cc_args; o.push(['_SKey', '5157b54c']); o.push(['_ZoneId', '223e25779a']);
          var sc = document.createElement('script'); sc.type = 'text/javascript'; sc.async = true;
          sc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.cs.1worldsync.com/jsc/h1ws.js';
          var n = document.getElementsByTagName('script')[0]; n.parentNode.insertBefore(sc, n);
        })();
      `;
      document.body.appendChild(script);

      const hideElement = () => {
        const elementToHide = document.querySelector('a.ccs-cc-ficons-item.ccs-cc-active[title="Haga clic para ver Documentos"]');
        if (elementToHide) {
          elementToHide.style.display = "none";
        } else {
          setTimeout(hideElement, 500);
        }
      };

      hideElement();
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container container-mrg mx-auto p-4 product-detail">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const tienePrec = product.precio && product.precio > 0 && String(product.disponible).toUpperCase() === "TRUE";

  // Parsear videos: linkYoutube (string, puede estar vacío) + videos (jsonb array)
  let videosList = [];
  // Primero el link principal de YouTube si existe
  if (product.linkYoutube && product.linkYoutube.trim()) {
    videosList.push(product.linkYoutube.trim());
  }
  // Luego los videos adicionales del array JSONB
  if (product.videos) {
    let vids = product.videos;
    if (typeof vids === 'string') {
      try { vids = JSON.parse(vids); } catch { vids = []; }
    }
    if (Array.isArray(vids)) {
      vids.forEach((v) => {
        const url = typeof v === 'string' ? v : v?.url || v?.link || '';
        if (url.trim() && !videosList.includes(url.trim())) {
          videosList.push(url.trim());
        }
      });
    }
  }

  // Parsear datasheets: datasheet (archivo principal) + datasheets (jsonb array)
  let datasheetsList = [];
  // Primero el datasheet principal si existe
  if (product.datasheet && product.datasheet.trim()) {
    datasheetsList.push({
      nombre: 'Ficha técnica principal',
      url: product.datasheet.trim()
    });
  }
  // Luego los datasheets adicionales del array JSONB
  if (product.datasheets) {
    let ds = product.datasheets;
    if (typeof ds === 'string') {
      try { ds = JSON.parse(ds); } catch { ds = []; }
    }
    if (Array.isArray(ds)) {
      ds.forEach((item) => {
        if (typeof item === 'string' && item.trim()) {
          // Si es solo un string (nombre de archivo)
          const yaExiste = datasheetsList.some(d => d.url === item.trim());
          if (!yaExiste) datasheetsList.push({ nombre: item.trim(), url: item.trim() });
        } else if (item && (item.url || item.nombre)) {
          // Si es un objeto con url/nombre
          const url = (item.url || item.nombre || '').trim();
          const nombre = (item.nombre || item.url || '').trim();
          const yaExiste = datasheetsList.some(d => d.url === url);
          if (url && !yaExiste) datasheetsList.push({ nombre, url });
        }
      });
    }
  }

  // Extraer YouTube video ID - soporta múltiples formatos
  const getYouTubeId = (url) => {
    if (!url) return null;
    // Si ya es solo un ID (11 caracteres alfanuméricos)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
    try {
      const urlObj = new URL(url);
      // youtube.com/watch?v=ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
        return urlObj.searchParams.get('v');
      }
      // youtube.com/embed/ID
      if (urlObj.pathname.includes('/embed/')) {
        return urlObj.pathname.split('/embed/')[1]?.split(/[?&]/)[0];
      }
      // youtu.be/ID
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1).split(/[?&]/)[0];
      }
      // youtube.com/shorts/ID
      if (urlObj.pathname.includes('/shorts/')) {
        return urlObj.pathname.split('/shorts/')[1]?.split(/[?&]/)[0];
      }
    } catch {
      // Intentar extraer con regex como último recurso
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
    return null;
  };

  // Construir URLs de imagen
  const imagenPrincipalUrl = getImagenUrl(product.imagen);

  // Todas las imágenes para lightbox (URLs completas)
  const allImages = [imagenPrincipalUrl, ...gallery];

  return (
    <>
      <div className="container container-mrg mx-auto p-4 product-detail">
        <div className="product-detail-content grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen principal del producto */}
          <div className="product-detail-image">
            <img
              src={selectedImage}
              alt={product.nombre}
              className="w-full h-auto object-contain cursor-pointer"
              onError={(e) => (e.target.src = "/img/noDisponible.jpg")}
              onClick={() => openLightbox(allImages.indexOf(selectedImage) >= 0 ? allImages.indexOf(selectedImage) : 0)}
            />

            {/* Galería de miniaturas */}
            {gallery.length > 0 && (
              <div className="product-gallery mt-4 grid grid-cols-4 gap-2">
                {/* Miniatura de imagen principal */}
                <img
                  src={imagenPrincipalUrl}
                  alt="Principal"
                  className={`w-full h-24 object-cover cursor-pointer rounded border-2 transition-all ${
                    selectedImage === imagenPrincipalUrl ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(imagenPrincipalUrl)}
                  onError={(e) => (e.target.src = "/img/noDisponible.jpg")}
                />
                {/* Miniaturas adicionales */}
                {gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className={`w-full h-24 object-cover cursor-pointer rounded border-2 transition-all ${
                      selectedImage === img ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(img)}
                    onError={(e) => (e.target.src = "/img/noDisponible.jpg")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-detail-info">
            {/* Videos */}
            {videosList.length > 0 && (
              <div className="product-video mb-6">
                {getYouTubeId(videosList[activeVideoIndex]) && (
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYouTubeId(videosList[activeVideoIndex])}`}
                    title="Video del Producto"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                )}

                {/* Tabs de videos si hay más de 1 */}
                {videosList.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {videosList.map((videoUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveVideoIndex(index)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeVideoIndex === index
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Video {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{product.nombre}</h1>

            {/* Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.nuevo && (
                <span className="px-3 py-1 text-xs font-bold bg-green-500 text-white rounded-full">
                  Nuevo
                </span>
              )}
              {product.destacado && (
                <span className="px-3 py-1 text-xs font-bold bg-yellow-500 text-white rounded-full">
                  Destacado
                </span>
              )}
              {product.precio_oferta && product.precio_oferta > 0 && (
                <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                  Oferta
                </span>
              )}
            </div>

            {/* Precio */}
            {tienePrec && (
              <div className="mb-6">
                {product.precio_oferta && product.precio_oferta > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      ${product.precio_oferta.toLocaleString('es-MX')}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.precio.toLocaleString('es-MX')}
                    </span>
                    <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                      -{Math.round(((product.precio - product.precio_oferta) / product.precio) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-green-600">
                    ${product.precio.toLocaleString('es-MX')}
                  </span>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-wrap gap-3">
                {datasheetsList.length === 1 && (
                  <button onClick={() => handleViewPdf(getDatasheetUrl(datasheetsList[0].url))} className="btn-download">
                    Ver Ficha Técnica
                  </button>
                )}

                {!tienePrec && (
                  <button className="btn-quote">
                    <Link
                      to={`/cotizacion?sku=${product.sku}&nombre=${product.nombre}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Solicitar Cotización
                    </Link>
                  </button>
                )}
              </div>

              {/* Lista de datasheets (cuando hay más de uno) */}
              {datasheetsList.length > 1 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    Fichas técnicas disponibles ({datasheetsList.length})
                  </h3>
                  <div className="space-y-2">
                    {datasheetsList.map((ds, index) => (
                      <button
                        key={index}
                        onClick={() => handleViewPdf(getDatasheetUrl(ds.url))}
                        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                      >
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        <span className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          {ds.nombre || `Ficha técnica ${index + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón Agregar al carrito */}
              {tienePrec && (
                <AddToCartButton
                  product={{
                    sku: product.sku,
                    name: product.nombre,
                    precio: product.precio_oferta && product.precio_oferta > 0 ? product.precio_oferta : product.precio,
                    image: imagenPrincipalUrl,
                    description: product.descripcionCorta,
                    marca: product.marca,
                    categoria: product.categoria,
                    disponible: product.disponible
                  }}
                  className="w-full md:w-auto"
                />
              )}

              {/* Mensaje si no tiene precio */}
              {!tienePrec && (
                <div className="bg-orange-100 border border-orange-300 text-orange-700 px-4 py-3 rounded">
                  <p className="font-semibold">Solo disponible por cotización</p>
                  <p className="text-sm">Este producto requiere cotización personalizada.</p>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-lg mb-4">Categoría: {product.categoria}</p>
            {product.subcategoria && (
              <p className="text-gray-600 text-lg mb-4">Subcategoría: {product.subcategoria}</p>
            )}
            <p className="text-gray-600 text-lg mb-4">Marca: {product.marca}</p>
            <p className="text-gray-600 text-lg mb-4">SKU: {product.sku}</p>

            {/* Descripción corta - renderizada como HTML */}
            {product.descripcionCorta && (
              <div
                className="prose prose-lg mb-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descripcionCorta }}
              />
            )}

            {/* Descripción larga - texto plano */}
            {product.descripcion && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-lg text-gray-700 whitespace-pre-line">{product.descripcion}</p>
              </div>
            )}

            {/* Stock */}
            {product.stock !== null && product.stock !== undefined && (
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    En stock ({product.stock} disponibles)
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">Requiere cotización</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Componente para productos relacionados */}
      <RelatedProducts currentSku={product.sku} />

      {/* Visor de PDF */}
      {showPdfViewer && (
        <div className="pdf-viewer-overlay" onClick={handleClosePdf}>
          <div className="pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={activePdfUrl}
              title="Ficha Técnica"
              width="100%"
              height="600px"
            ></iframe>
            <button onClick={handleClosePdf} className="btn-close">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Lightbox para imágenes */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10"
            >
              &times;
            </button>
            <img
              src={allImages[lightboxIndex]}
              alt={`Imagen ${lightboxIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => (e.target.src = "/img/noDisponible.jpg")}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div className="text-center text-white mt-4 text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Bloque HTML adicional (1WorldSync) */}
      <div id="ccs-feature-icons"></div>
      <div id="ccs-logos"></div>
      <div id="ccs-inline-content"></div>
      <div id="ccs-explore-product"></div>

      {/* Formulario de cotización */}
      {showQuotationForm && (
        <QuotationForm product={product} onClose={handleCloseForm} />
      )}
    </>
  );
};

export default ProductDetail;