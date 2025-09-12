import React from "react";
import AboutContent from "../components/AboutContent";
import SectionHero from "../components/SectionHero";

import sucursalesImg from "../assets/img/sucursales.png";

const About = () => {
  return (
    <>
      <SectionHero title={"SOBRE NOSOTROS"} buttonText={"Descubre todo lo que tenemos"} buttonLink={"/productos"} backgroundImg={"../assets/img/bg-hero-general.png"} />


      <div className="container mx-auto max-w-7xl px-4 container-mrg">
        {/* Sección About*/}
        <div className="grid lg:grid-cols-2 lg:gap-24  xl:gap-32 items-center">
          <div className="">
            <h2 className="text-2xl text-center lg:text-left sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestras Sucursales</h2>
            <img src="/img/about-section-img.png" alt="Sobre Nosotros" className="lg:hidden mt-8 mb-4 md:w-[500px] mx-auto" />
            <p className="text-base">En Siscoprint, creemos que la creatividad merece las mejores herramientas para materializarse. </p><br />
            <p className="text-base">Por eso, desde hace más de dos décadas, conectamos ideas con soluciones de impresión avanzadas. Ya sea en papel, textil, etiquetas o superficies especializadas, ofrecemos equipos de alta calidad que transforman tu visión en resultados concretos, eficientes y profesionales.</p>
          </div>
          <img src="/img/about-section-img.png" alt="Sobre Nosotros" className="hidden lg:block" />
        </div>
      </div>

      {/* Imagen de sucursales */}
      <div className="container-fluid">

        <div className="w-full hidden md:block md:mt-[50px]">
          <img
            src={sucursalesImg}
            alt="Sucursales Siscoprint"
            className="w-full h-auto object-cover object-center block max-w-[1200px] mx-auto xl:max-w-none xl:mx-0"
            style={{ maxHeight: 400 }}
          />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4">

        {/* Sección Nuestra Historia*/}
        <div className="grid lg:grid-cols-2 lg:gap-24  xl:gap-32 items-center mt-[80px]">
          <img src="/img/nuestra-historia-img.png" alt="Sobre Nosotros" className="hidden lg:block" />
          <div className="">
            <h2 className="text-2xl text-center lg:text-left sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestra Historia</h2>
            <img src="/img/nuestra-historia-img.png" alt="Sobre Nosotros" className="lg:hidden mt-[-40px] mb-[-30px] md:w-[500px] mx-auto" />
            <p className="text-base">Desde 2002, Siscoprint ha sido un referente en la industria de impresión digital en México. Nacimos con la misión de brindar tecnología accesible y confiable a empresas de todos los tamaños. Con el paso del tiempo, hemos evolucionado, expandido nuestras operaciones y establecido 8 sucursales estratégicas en todo el país, manteniendo siempre el enfoque en el cliente.</p><br />
            <p className="text-base">Miles de negocios han confiado en nosotros no solo por la calidad de nuestros productos, sino por el compromiso humano y técnico que nos distingue. Nuestra trayectoria está marcada por la innovación, la cercanía y la búsqueda constante de soluciones que agreguen valor.</p>
          </div>
        </div>
      </div>

      {/* Sección Lo que nos mueve */}
      <div className="container-fluid  mt-[80px] bg-[url('/img/lo-que-nos-mueve-bg.png')] bg-cover bg-center bg-no-repeat h-[250px] ">
        <h2 className="text-2xl text-center sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px] pt-11">Lo Que Nos Mueve</h2>
      </div>

      <div className="container px-4 mx-auto max-w-6xl grid md:grid-cols-2 gap-8 md:gap-6 xl:gap-16 items-center mt-[-100px]">
        <div className="mx-auto border-2 border-yellow-sp rounded-tl-[50px] rounded-br-[50px] p-6 bg-white h-auto md:h-[350px] xl:h-auto">
          <h2 className="text-xl text-center lg:text-left sm:text-2xl md:text-[28px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestra Misión</h2>
          <p className="text-base">Satisfacer plenamente las necesidades y expectativas de nuestros socios de negocio mediante soluciones integrales en impresión digital. Nos comprometemos a ofrecer equipos de alto rendimiento, asesoría especializada, capacitación constante y soporte técnico, creando una experiencia diferenciada basada en calidad, confianza y resultados sostenibles.</p>
        </div>
        <div className="mx-auto px-4 border-2 border-yellow-sp rounded-bl-[50px] rounded-tr-[50px] p-6 bg-white h-auto md:h-[350px] xl:h-auto">
          <h2 className="text-xl text-center lg:text-left sm:text-2xl md:text-[28px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestra Visión</h2>
          <p className="text-base">Aspiramos a consolidarnos como un socio estratégico integral para cada cliente, siendo reconocidos por nuestra capacidad de respuesta, excelencia en el servicio y cercanía comercial. Trabajamos para construir relaciones duraderas basadas en el valor, la honestidad y la mejora continua, impulsando juntos el crecimiento de nuestros clientes y colaboradores.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mb-[80px] md:mb-[100px]">
        {/* Sección Nuestra Historia*/}
        <div className="mt-[150px]">
          <h2 className="text-2xl text-center sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Nuestros Valores</h2>
         <img src="/img/valores-section-img.png" alt="Nuestros Valores" className="mx-auto mt-16 hidden lg:block" />
         <img src="/img/valores-section-mov-img.png" alt="Nuestros Valores" className="mx-auto mt-16 lg:hidden md:w-[350px]" />

        </div>
      </div>

    </>
  );
};

export default About;