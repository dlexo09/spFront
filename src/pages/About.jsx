import React from "react";
import AboutContent from "../components/AboutContent";

const About = () => {
  return (
    <>
      <AboutContent />
      <div className="bg-gray-100 text-gray-800 py-12 px-6">
        {/* Sección de Encabezado */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-bold text-blue-epson">Siscoprint</h2>
          <p className="text-xl mt-3">Donde la creatividad se encuentra con la tecnología</p>
        </div>

        {/* Sección de Historia */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-5xl font-semibold text-blue-epson">Nuestra Historia</h3>
            <p className="text-xl mt-4 text-gray-700 py-6 text-justify">
              Desde 2002, Siscoprint ha sido pionero en impresión digital, expandiéndose a lo largo de México con 8 sucursales y miles de clientes satisfechos.
            </p>
          </div>
          <img src="/img/History.png" alt="Historia Siscoprint" className="rounded-lg shadow-lg" />
        </div>

        {/* Sección de Misión y Visión */}
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-8 items-center">
          <img src="/img/Vision.png" alt="Misión y Visión" className="rounded-lg shadow-lg" />
          <div>
            <h3 className="text-4xl font-semibold text-blue-epson">Nuestra Misión</h3>
            <p className="text-xl mt-4 text-gray-700 py-6 text-justify">
              Satisfacer las necesidades y expectativas de nuestros socios de negocio, al ofrecer respaldo con productos y servicios diferenciados de alta calidad.
            </p>
            <h3 className="text-4xl font-semibold text-blue-epson mt-6">Nuestra Visión</h3>
            <p className="text-xl mt-4 text-gray-700 py-6 text-justify">
              Convertirnos en un socio de negocios integral, comprometidos a ofrecer un servicio rápido y confiable, en la búsqueda de generar una relación de valor y largo plazo para nuestros socios de negocio y colaboradores. Sustentada en nuestros valores, siempre buscando superar sus expectativas.
            </p>
          </div>
        </div>

        {/* Sección de Valores */}
        <div className="max-w-4xl mx-auto text-center mt-16 py-12">
          <h3 className="text-4xl font-semibold text-blue-epson">Nuestros Valores</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 py-6 sm:grid-cols-1">
            {[
              "Honestidad",
              "Compromiso",
              "Pasión",
              "Trabajo en equipo",
              "Innovación",
              "Excelencia"
            ].map((value, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg text-xl font-semibold"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;