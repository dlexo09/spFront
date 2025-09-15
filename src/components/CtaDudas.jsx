import React from "react";
import ctaBg from "../assets/img/cta-dudas-bg.png";
import ctaImg from "../assets/img/cta-dudas-img.png";

const CtaDudas = () => (
    <section className="w-full flex justify-center items-center mt-[60px] mb-[100px] md:mt-[120px] md:mb-[170px] relative overflow-visible">
        <div
            className="
    relative z-10
    flex flex-col justify-center
    px-0 py-10 xl:pl-56 xl:pr-20
    w-full md:w-3/4 max-w-5xl mx-auto
    bg-cover bg-center
    rounded-[30px] xl:rounded-r-[300px]
    shadow-lg
    min-h-[340px] md:min-h-[350px]
    overflow-visible
  "
            style={{
                backgroundImage: `url(${ctaBg})`,
            }}
        >
            {/* Imagen flotante visible solo en xl+ */}
            <img
                src={ctaImg}
                alt="Asesor experto"
                className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 w-40 md:w-64 lg:w-80 drop-shadow-xl z-20"
                style={{ transform: "translate(-30%, -50%)" }}
            />
            {/* Bloque de texto con padding extra a la izquierda */}
            <div className="pl-4 md:pl-8">
                <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-9 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">
                    ¿Tienes dudas sobre qué Producto necesitas?
                </h2>
                <p className="text-blue-900 text-base mb-6">
                    Nuestros expertos están listos para ayudarte a tomar la mejor decisión.
                </p>
                <p className="text-blue-900 text-base mb-6">
                    En Siscoprint entendemos que cada negocio es único, por eso ofrecemos asesoría personalizada basada en tus necesidades, tipo de aplicación y presupuesto.
                </p>
                <a
                    href="/contacto"
                    className="inline-block text-sm bg-pink-sp hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
                >
                    Ver más sobre nosotros
                    <span
                        className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
                        aria-hidden="true"
                    ></span>
                </a>
            </div>
        </div>
    </section>
);

export default CtaDudas;