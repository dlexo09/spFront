import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail.css'; // Importar el archivo CSS personalizado

const ProductDetail = () => {
  const { sku } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetch("/products.json") // Asegúrate de que esta ruta sea correcta
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.sku === sku);
        setProduct(foundProduct);
        setSelectedImage(foundProduct?.image || "");
      })
      .catch((error) => console.error("Error fetching the product:", error));
  }, [sku]);

  useEffect(() => {
    if (product) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        var ccs_cc_args = ccs_cc_args || [];
        ccs_cc_args.push(['cpn', '${product.sku}']);
        ccs_cc_args.push(['mf', '${product.brand}']);
        ccs_cc_args.push(['pn', '${product.pn}']);
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4 product-detail">
        <div className="product-detail-content grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="product-detail-image">
            <img src={selectedImage} alt={product.name} className="w-full h-auto object-contain" />
            <div className="product-gallery mt-4 grid grid-cols-4 gap-2">
              {product.galeria.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-24 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
          <div className="product-detail-info">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{product.category}</p>
            <p className="text-green-500 font-bold text-2xl mb-4">${product.price || "Cotización"}</p>
            <p className="text-lg mb-4">{product.descripcionCorta}</p>
            <a href={product.datasheet} className="btn-download" target="_blank" rel="noopener noreferrer">Descargar Ficha Técnica</a>
          </div>
        </div>
      </div>
      <div id="ccs-feature-icons" className="my-8"></div>
      <div id="ccs-logos" className="my-8"></div>
      <div id="ccs-inline-content" className="my-8"></div>
      <div id="ccs-explore-product" className="my-8"></div>
    </>
  );
};

export default ProductDetail;