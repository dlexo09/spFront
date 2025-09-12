import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Cotizacion = () => {
  const query = new URLSearchParams(useLocation().search);
  const sku = query.get("sku");
  const productName = query.get("nombre");
  const productosCarrito = query.get("productos");
  
  // Parsear productos del carrito si existen
  let productos = [];
  if (productosCarrito) {
    try {
      productos = JSON.parse(decodeURIComponent(productosCarrito));
    } catch (error) {
      console.error("Error parseando productos del carrito:", error);
    }
  }

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    // Validación simple
    if (!formData.nombre || !formData.email || !formData.telefono) {
      setMensaje("Por favor, completa todos los campos obligatorios.");
      setEnviando(false);
      return;
    }

    if (!captchaToken) {
      setMensaje("Por favor, completa el reCAPTCHA.");
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch("https://hook.us2.make.com/6uoxld9q525vw77fl3079952qjtwn1lz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sku,
          productName,
          productos: productos.length > 0 ? productos : null,
          captchaToken,
        }),
      });
      await res.text();
      setMensaje("¡Cotización enviada correctamente! Pronto nos pondremos en contacto.");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
      setCaptchaToken(null);
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
    setEnviando(false);
  };

  return (
    <div className="container container-mrg mx-auto max-w-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Solicitar Cotización</h1>
      
      {/* Mostrar producto individual */}
      {sku && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="mb-2">Producto SKU: <strong>{sku}</strong></p>
          <p className="mb-2">Producto: <strong>{productName}</strong></p>
        </div>
      )}

      {/* Mostrar productos del carrito */}
      {productos.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h3 className="font-bold mb-2">Productos del carrito ({productos.length}):</h3>
          {productos.map((producto, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <img src={producto.image} alt={producto.name} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-semibold">{producto.name}</p>
                <p className="text-sm text-gray-600">SKU: {producto.sku} | Cantidad: {producto.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow">
        <div className="mb-3">
          <label className="block mb-1 font-bold">Nombre*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-bold">Correo electrónico*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-bold">Teléfono*</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-bold">Mensaje</label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Información adicional sobre tu cotización..."
          />
        </div>
        <div className="mb-4 flex justify-center">
          <ReCAPTCHA
            sitekey="6Le0OyErAAAAAOAVaYfWOqug_RQrtcXVj6TUm9Ue"
            onChange={handleCaptchaChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={!captchaToken || enviando}
        >
          {enviando ? "Enviando..." : "Enviar Cotización"}
        </button>
        {mensaje && (
          <div className="mt-3 text-center text-red-600">{mensaje}</div>
        )}
      </form>
    </div>
  );
};

export default Cotizacion;