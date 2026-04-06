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
    <div className="w-full mb-[80px] md:mb-[130px]">
      <SectionHero title={"CONTACTO"} buttonText={"VER TODOS LOS PRODUCTOS"} buttonLink={"/productos"} backgroundImg={"../assets/img/bg-hero-general.png"} />

      <div className="container mx-auto max-w-7xl px-4 container-mrg">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Cobertura nacional</span>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl md:text-[32px] font-semibold mb-4 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestras sucursales</h2>
          <p className="text-slate-600 text-base md:text-lg leading-7">Estamos cerca para acompañarte en ventas, soporte y asesoría técnica especializada en cada etapa de tu operación.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14 md:mb-20">
          {sucursales.map((sucursal, index) => {
            const isEven = index % 2 === 0;
            const bgClass = isEven ? 'bg-[linear-gradient(180deg,rgba(0,173,238,0.10),rgba(255,255,255,0.96))]' : 'bg-white';

            const iconSrc = isEven ? pinBlack : pinBlue;

            return (
              <div key={index} className={`${bgClass} p-6 rounded-[28px] border border-slate-100 shadow-[0_18px_36px_rgba(15,23,42,0.08)] flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1`}>
                <img
                  src={iconSrc}
                  alt={`icon ${sucursal.nombre}`}
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/logoSiscom.png'; }}
                />
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-2 text-strong-blue">{sucursal.nombre}</h3>
                  <p className="text-sm text-slate-500 mb-3 leading-6">{sucursal.direccion}</p>
                  <p className="text-sm text-slate-700">Tel: {sucursal.telefono || 'N/A'}</p>
                  <p className="text-sm text-slate-700 mt-1">Correo: <a href={`mailto:${sucursal.correo}`} className="text-light-blue underline">{sucursal.correo}</a></p>
                </div>
              </div>
            );
          })}
        </div>


        <div className="mb-12 gap-6 items-start mt-[60px] md:mt-[150px] rounded-[36px] overflow-hidden border border-white shadow-[0_24px_60px_rgba(15,23,42,0.10)] bg-white">
          <img src="/img/mapa.png" alt="Mapa de sucursales" className="w-full h-auto object-cover" />
        </div>


        <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(244,114,182,0.10),rgba(250,204,21,0.12))] rounded-[36px] px-4 py-16 md:px-8 mt-[60px] md:mt-[150px] mb-[60px] shadow-[0_28px_70px_rgba(15,23,42,0.08)] border border-white/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.7),transparent_24%)]" aria-hidden="true" />
          <div className="max-w-4xl mx-auto">

            <div className="relative text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-white/80 border border-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Contacto directo</span>
              <h3 className="mt-4 text-center text-2xl sm:text-3xl md:text-[32px] font-semibold mb-4 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">¿Tienes alguna duda? Escríbenos</h3>
              <p className="text-slate-600 leading-7">Cuéntanos qué necesitas y te respondemos con asesoría comercial o soporte especializado según tu caso.</p>
            </div>
            <form onSubmit={handleSubmit} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <input
                type="text"
                placeholder="Escribe tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-4 rounded-2xl border border-white bg-white/95 shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
              <input
                type="email"
                placeholder="Escribe tu correo"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="p-4 rounded-2xl border border-white bg-white/95 shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
              <input
                type="tel"
                placeholder="Escribe tu teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="p-4 rounded-2xl border border-white bg-white/95 shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
              <select
                value={formData.contactType}
                onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                className="p-4 rounded-2xl border border-white bg-white/95 shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                required
              >
                <option value="soporte">Soporte</option>
                <option value="ventas">Ventas</option>
              </select>

              <textarea
                placeholder="Escribe tu mensaje"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="p-4 rounded-[24px] border border-white bg-white/95 md:col-span-2 shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
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
                  className="bg-light-blue text-white px-8 py-3 rounded-full hover:brightness-95 disabled:opacity-60 font-semibold shadow-[0_16px_30px_rgba(14,165,233,0.22)]"
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