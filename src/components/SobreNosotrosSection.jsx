import React from "react";
import bgSobreNosotros from "../assets/img/nosotros-home-bg.jpg";
import imgSobreNosotros from "../assets/img/nosotros-img.png";

const SobreNosotrosSection = () => (
  <section
    className="relative w-full mt-[60px] md:mt-[150px] rounded-3xl overflow-hidden flex items-center"
    style={{
      minHeight: "400px",
      backgroundImage: `url(${bgSobreNosotros})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row pl-4 px-4 pt-[40px] pb-[40px] md:pt-8 md:pb-8">
      {/* Lado izquierdo: texto */}
      <div className="flex-1 flex flex-col justify-center items-start md:items-start items-center z-10 text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-2 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Sobre Nosotros</h2>

        {/* Imagen solo en móvil */}
        <div className="block md:hidden mb-5 mt-5">
          <img
            src={imgSobreNosotros}
            alt="Sobre nosotros"
            className="w-64 h-auto object-contain mx-auto"
          />
        </div>

        <p className="text-blue-900 text-base mb-6 max-w-lg">
          Desde hace más de 20 años impulsamos la creatividad y productividad de cientos de negocios en México a través de tecnología de impresión de alto nivel.
        </p>
        <p className="text-blue-900 text-base mb-6 max-w-lg">
          Estamos presentes en 6 ciudades y nos enfocamos en ofrecer no solo equipos, sino respaldo, capacitación y servicio técnico confiable.
        </p>
        <a
          href="/about"
          className="inline-block text-sm bg-pink-sp hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
        >
          Ver más sobre nosotros
          <span
            className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
            aria-hidden="true"
          ></span>
        </a>
      </div>
      {/* Lado derecho: imagen (solo en desktop) */}
      <div className="hidden md:flex flex-1 items-end justify-center p-4 md:p-8">
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