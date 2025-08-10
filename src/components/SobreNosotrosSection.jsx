import React from "react";
import bgSobreNosotros from "../assets/img/nosotros-home-bg.jpg";
import imgSobreNosotros from "../assets/img/nosotros-img.png";

const SobreNosotrosSection = () => (
  <section
    className="relative w-full mt-[100px] mb-[100px] rounded-3xl overflow-hidden flex items-center"
    style={{
      minHeight: "400px",
      backgroundImage: `url(${bgSobreNosotros})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row h-full">
      {/* Lado izquierdo: texto */}
      <div className="flex-1 flex flex-col justify-center items-start p-8 md:p-12 z-10">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">Sobre Nosotros</h2>
        <p className="text-blue-900 text-base md:text-lg mb-6 max-w-md">
          Desde hace más de 20 años impulsamos la creatividad y productividad de cientos de negocios en México a través de tecnología de impresión de alto nivel.
        </p>
        <p className="text-blue-900 text-base md:text-lg mb-6 max-w-md">
          Estamos presentes en 6 ciudades y nos enfocamos en ofrecer no solo equipos, sino respaldo, capacitación y servicio técnico confiable.
        </p>
        <a
          href="/about"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow transition-colors duration-200 text-base md:text-lg"
        >
          VER MÁS SOBRE NOSOTROS
        </a>
      </div>
      {/* Lado derecho: imagen */}
      <div className="flex-1 flex items-end justify-center p-4 md:p-8">
        <img
          src={imgSobreNosotros}
          alt="Sobre nosotros"
          className="w-full max-w-xs md:max-w-sm lg:max-w-md object-contain"
          style={{ minHeight: "220px" }}
        />
      </div>
    </div>
  </section>
);

export default SobreNosotrosSection;