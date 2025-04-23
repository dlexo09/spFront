import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReCAPTCHA from "react-google-recaptcha";

const QuotationForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar el correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Validar el CAPTCHA
    if (!captchaToken) {
      alert("Por favor, completa el CAPTCHA.");
      return;
    }

    // Enviar los datos al servidor PHP
    fetch("https://www.siscoprint.com/send_email.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        productName: product.nombre,
        productSku: product.sku,
        captchaToken: captchaToken,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al enviar el correo.");
        }
        return res.text();
      })
      .then((data) => {
        console.log(data);
        alert("Solicitud de cotización enviada con éxito.");
        onClose(); // Cerrar el formulario después de enviarlo
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.");
      });
  };

  return ReactDOM.createPortal(
    <div className="quotation-form-overlay">
      <div className="quotation-form-container">
        <h2 className="text-2xl font-bold mb-4">Solicitar Cotización</h2>
        <p className="mb-4">Producto: {product.nombre} (SKU: {product.sku})</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="phone">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="message">
              Mensaje (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border rounded"
              rows="4"
            ></textarea>
          </div>
          <ReCAPTCHA
            sitekey="6Le0OyErAAAAAOAVaYfWOqug_RQrtcXVj6TUm9Ue" // Reemplaza con tu clave de sitio
            onChange={handleCaptchaChange}
          />
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="p-2 border rounded bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="p-2 border rounded bg-blue-500 text-white"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // Renderiza el modal al final del body
  );
};

export default QuotationForm;