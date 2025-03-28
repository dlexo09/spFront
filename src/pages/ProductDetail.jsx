import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts"; // Importar el componente
import './ProductDetail.css'; // Importar el archivo CSS personalizado

const ProductDetail = () => {
  const { sku } = useParams(); // Obtener el SKU desde la URL
  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]); // Estado para la galería de imágenes
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // Cargar datos del producto
    fetch("/products.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el archivo products.json");
        }
        return res.json();
      })
      .then((data) => {
        const foundProduct = data.find((item) => item.sku === sku);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.imagen); // Establecer la imagen principal
        } else {
          console.error("Producto no encontrado");
        }
      })
      .catch((error) => console.error("Error al cargar los datos del producto:", error));

    // Cargar datos de la galería
    fetch("/galeriaproductos.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el archivo galeriaproductos.json");
        }
        return res.json();
      })
      .then((data) => {
        const productGallery = data.filter((item) => item.sku === sku);
        setGallery(productGallery.map((item) => item.image_url)); // Guardar las URLs de las imágenes
      })
      .catch((error) => console.error("Error al cargar los datos de la galería:", error));
  }, [sku]);

  // Agregar el script dinámico cuando el producto esté disponible
  useEffect(() => {
    if (product) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        var ccs_cc_args = ccs_cc_args || [];
        ccs_cc_args.push(['cpn', '${product.sku}']);
        ccs_cc_args.push(['mf', '${product.marca}']);
        ccs_cc_args.push(['pn', '${product.pn || "N/A"}']);
        ccs_cc_args.push(['upcean', 'UPC_EAN_CODE']);
        ccs_cc_args.push(['ccid', 'CATALOG_CODE']);
        ccs_cc_args.push(['lang', 'ES']);
        ccs_cc_args.push(['market', 'MX']);
        (function () {
          var o = ccs_cc_args; o.push(['_SKey', '5157b54c']); o.push(['_ZoneId', '0c97a52814']);
          var sc = document.createElement('script'); sc.type = 'text/javascript'; sc.async = true;
          sc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.cs.1worldsync.com/jsc/h1ws.js';
          var n = document.getElementsByTagName('script')[0]; n.parentNode.insertBefore(sc, n);
        })();
      `;
      document.body.appendChild(script);
    }
  }, [product]);

  if (!product) {
    return <div>Cargando producto...</div>; // Mostrar un mensaje de carga mientras se obtienen los datos
  }

  return (
    <>
      <div className="container mx-auto p-4 product-detail">
        <div className="product-detail-content grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen principal del producto */}
          <div className="product-detail-image">
            <img
              src={`/img/productos/${selectedImage}`}
              alt={product.nombre}
              className="w-full h-auto object-contain"
            />
            {/* Galería de imágenes */}
            <div className="product-gallery mt-4 grid grid-cols-4 gap-2">
              {gallery.map((img, index) => (
                <img
                  key={index}
                  src={`/img/productos/${img}`}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-24 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(img)} // Cambiar la imagen principal al hacer clic
                />
              ))}
            </div>
          </div>
          {/* Información del producto */}
          <div className="product-detail-info">
            <h1 className="text-4xl font-bold mb-4">{product.nombre}</h1>
            <p className="text-gray-600 text-lg mb-4">Categoría: {product.categoria}</p>
            <p className="text-gray-600 text-lg mb-4">Marca: {product.marca}</p>
            <br />
            <p className="text-gray-600 text-lg mb-4">SKU: {product.pn}</p>
            <br />
            <p className="text-lg mb-4">{product.descripcionCorta}</p>
            <p className="text-lg mb-4">{product.descripcionLarga}</p>
            <a
              href={product.datasheet}
              className="btn-download"
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar Ficha Técnica
            </a>
          </div>
        </div>
      </div>
      {/* Componente para productos relacionados */}
      <RelatedProducts currentSku={sku} />
      
      {/* Bloque HTML adicional */}
      <div id="ccs-feature-icons"></div>
      <div id="ccs-logos"></div>
      <div id="ccs-inline-content"></div>
      <div id="ccs-explore-product"></div>
    </>
  );
};

export default ProductDetail;