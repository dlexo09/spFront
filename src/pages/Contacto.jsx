import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import SectionHero from "../components/SectionHero";
import pinBlue from "../assets/img/pin-blue.png";
import pinBlack from "../assets/img/pin-black.png";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    contactType: "soporte",
  });
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
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

    // Enviar los datos al webhook de Make
    fetch("https://hook.us2.make.com/6uoxld9q525vw77fl3079952qjtwn1lz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, captchaToken }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al enviar el formulario.");
        }
        return res.text(); // Make responde con texto plano
      })
      .then(() => {
        alert("Gracias por contactarnos. Nos pondremos en contacto contigo pronto.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          contactType: "soporte",
        });
        setCaptchaToken(null);
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
      direccion: "Martin Gonzales 3967 Col. Rancho nueva, CP: 44240 Guadalajara, Jalisco.",
      telefono: "(33) 3335-2216 | (33) 3335-2854",
      correo: "ventasgdl@siscoprint.com",
    },
    {
      nombre: "Sucursal Monterrey",
      direccion: "Mirto #2623, Col. Moderna, Monterrey, N.L.",
      telefono: "(81) 8040-7321 | (81) 8040-7322",
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
    <div className="w-full">
      <SectionHero title={"CONTACTO"} buttonText={"VER TODOS LOS PRODUCTOS"} buttonLink={"/productos"} backgroundImg={"../assets/img/bg-hero-general.png"} />

      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestras Sucursales</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {sucursales.map((sucursal, index) => {
            const isEven = index % 2 === 0;
            const bgClass = isEven ? 'bg-[rgba(0,173,238,0.08)]' : 'bg-white';
            const borderClass = 'border-none';
            const radiusClass = 'rounded-none sm:rounded-none lg:rounded-none';

            const iconSrc = isEven ? pinBlack : pinBlue;

            return (
              <div key={index} className={`${bgClass} ${borderClass} p-5 ${radiusClass} flex items-start gap-4`}>
                <img
                  src={iconSrc}
                  alt={`icon ${sucursal.nombre}`}
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/logoSiscom.png'; }}
                />
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1 text-strong-blue">{sucursal.nombre}</h3>
                  <p className="text-xs text-strong-blue/70 mb-2">{sucursal.direccion}</p>
                  <p className="text-sm text-strong-blue/80">Tel: {sucursal.telefono || 'N/A'}</p>
                  <p className="text-sm text-strong-blue/80">Correo: <a href={`mailto:${sucursal.correo}`} className="text-light-blue underline">{sucursal.correo}</a></p>
                </div>
              </div>
            );
          })}
        </div>


        <div className="mb-12 lg:col-span- gap-6 items-start mt-[60px] md:mt-[150px]">
          <img src="/img/mapa.png" alt="Mapa de sucursales" className="w-full h-auto object-cover" />
        </div>


        <div className=" bg-gradient-to-r from-light-blue/20 to-pink-sp/20 rounded-2xl px-4 py-16 mt-[60px] md:mt-[150px] mb-[60px]">
          <div className="max-w-4xl mx-auto">

            <h3 className="text-center text-2xl sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">¿Tienes Alguna Duda? Escríbenos</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <input
                type="text"
                placeholder="Escribe tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-3 rounded-md border border-white bg-white shadow-sm"
                required
              />
              <input
                type="email"
                placeholder="Escribe tu correo"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="p-3 rounded-md border border-white bg-white shadow-sm"
                required
              />
              <input
                type="tel"
                placeholder="Escribe tu teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="p-3 rounded-md border border-white bg-white shadow-sm"
                required
              />
              <select
                value={formData.contactType}
                onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                className="p-3 rounded-md border border-white bg-white shadow-sm"
                required
              >
                <option value="soporte">Soporte</option>
                <option value="ventas">Ventas</option>
              </select>

              <textarea
                placeholder="Escribe tu mensaje"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="p-3 rounded-md border border-white bg-white md:col-span-2 shadow-sm"
                rows={5}
                required
              />

              <div className="md:col-span-2 flex items-center justify-center flex-col gap-4">
                <div>
                  <ReCAPTCHA
                    sitekey="6Le0OyErAAAAAOAVaYfWOqug_RQrtcXVj6TUm9Ue"
                    onChange={handleCaptchaChange}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!captchaToken}
                  className="bg-light-blue text-white px-6 py-2 rounded-full hover:brightness-95 disabled:opacity-60"
                >
                  ENVIAR FORMULARIO
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;