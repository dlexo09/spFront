import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    contactType: "soporte", // Por defecto, soporte
  });
  const [captchaToken, setCaptchaToken] = useState(null); // Estado para el token de reCAPTCHA

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Guardar el token del reCAPTCHA
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar los datos del formulario
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validar el correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Validar el reCAPTCHA
    if (!captchaToken) {
      alert("Por favor, completa el reCAPTCHA.");
      return;
    }

    // Enviar los datos al servidor
    fetch("https://www.vite.siscoprint.com/api/contacto.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, captchaToken }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al enviar el formulario.");
        }
        return res.json();
      })
      .then((data) => {
        alert("Gracias por contactarnos. Nos pondremos en contacto contigo pronto.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          contactType: "soporte",
        });
        setCaptchaToken(null); // Reiniciar el token de reCAPTCHA
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
      });
  };

  const sucursales = [
    {
      nombre: "Sucursal CDMX",
      direccion: "Av. 5 de mayo #20 TequisistlánTezoyuca Edo. Mex.",
      telefono: "",
      correo: "cdmx@siscoprint.com",
    },
    {
      nombre: "Sucursal Guadalajara",
      direccion: "JJ Martínez Aguirre 4488 Col. Ciudad de los niños C.P. 45030",
      telefono: "(33) 3335-2216 | (33) 3335-2854",
      correo: "ventasgdl@siscoprint.com",
    },
    {
      nombre: "Sucursal Monterrey",
      direccion: "Mirto #2623, Col. Moderna, Monterrey, N.L.",
      telefono: "(81) 8040-7221 | (81) 8040-7322",
      correo: "ventas@siscoprint.com",
    },
    {
      nombre: "Sucursal Puebla",
      direccion: "Calle 25 #502 Local C, Col. Chulavista, Puebla, Pue.",
      telefono: "(222) 640-1425 | (222) 640-1431",
      correo: "ventaspue@siscoprint.com",
    },
    {
      nombre: "Sucursal Mérida",
      direccion: "Calle 13 #804 Residencial Pensiones V Etapa, CP. 97217",
      telefono: "(999) 931-0783",
      correo: "sureste@siscoprint.com",
    },
    {
      nombre: "Sucursal Leon GTO",
      direccion: "Margarita #210, Col. Loma Bonita, Leon, Gto.",
      telefono: "(477) 391-0491 | (477) 391-0492 ",
      correo: "bajio@siscoprint.com",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Imagen del mapa */}
      <div className="mb-8">
        <img
          src="/img/mapa.png" // Cambia esta ruta según la ubicación de tu imagen
          alt="Mapa de sucursales"
          className="w-full h-auto object-cover"
        />
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">Contáctanos</h1>

      {/* Mapa de sucursales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sucursales.map((sucursal, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{sucursal.nombre}</h2>
            <p className="text-gray-600">{sucursal.direccion}</p>
            <p className="text-gray-600">Teléfono: {sucursal.telefono}</p>
            <p className="text-gray-600">
              Correo:{" "}
              <a href={`mailto:${sucursal.correo}`} className="text-blue-500">
                {sucursal.correo}
              </a>
            </p>
          </div>
        ))}
      </div>

      {/* Formulario de contacto */}
      <div className="bg-gray-100 p-6 rounded shadow mx-auto max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Formulario de Contacto</h2>
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
            <label className="block text-sm font-bold mb-2" htmlFor="contactType">
              Tipo de Contacto
            </label>
            <select
              id="contactType"
              name="contactType"
              value={formData.contactType}
              onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="soporte">Soporte</option>
              <option value="ventas">Ventas</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="message">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border rounded"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6Le0OyErAAAAAOAVaYfWOqug_RQrtcXVj6TUm9Ue" // Reemplaza con tu clave de sitio de reCAPTCHA
              onChange={handleCaptchaChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contacto;