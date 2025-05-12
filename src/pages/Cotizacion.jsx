import { useLocation } from "react-router-dom";
import { useState } from "react";

const Cotizacion = () => {
  const query = new URLSearchParams(useLocation().search);
  const sku = query.get("sku");
  const productName = query.get("nombre");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    // Imprime en consola lo que se va a enviar
    console.log("Datos enviados:", { ...formData, sku, productName });

    try {
      const res = await fetch("https://hook.us2.make.com/6uoxld9q525vw77fl3079952qjtwn1lz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sku, productName }),
      });
      // Make suele responder con texto plano
      await res.text();
      setMensaje("¡Cotización enviada correctamente! Pronto nos pondremos en contacto.");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
    setEnviando(false);
  };

  return (
    <div className="container mx-auto max-w-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Solicitar Cotización</h1>
      <p className="mb-4">Producto SKU: <strong>{sku}</strong></p>
      <p className="mb-4">Producto Name: <strong>{productName}</strong></p>
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
            placeholder="¿Qué necesitas cotizar?"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={enviando}
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