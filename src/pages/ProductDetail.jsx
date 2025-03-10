import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { sku } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/src/data/products.json") // Asegúrate de que esta ruta sea correcta
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.sku === sku);
        setProduct(foundProduct);
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
        ccs_cc_args.push(['pn', '${product.name}']);
        ccs_cc_args.push(['upcean', 'UPC_EAN_CODE']);
        ccs_cc_args.push(['ccid', 'CATALOG_CODE']);
        ccs_cc_args.push(['lang', 'MX']);
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
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <img src={product.image} alt={product.name} className="h-40 object-contain" />
        <p className="text-gray-600">{product.category}</p>
        <p className="text-green-500 font-bold">${product.price || "Cotización"}</p>
        <p>{product.description}</p>
      </div>
      <div id="ccs-feature-icons"></div>
      <div id="ccs-logos"></div>
      <div id="ccs-inline-content"></div>
      <div id="ccs-explore-product"></div>
    </>
  );
};

export default ProductDetail;