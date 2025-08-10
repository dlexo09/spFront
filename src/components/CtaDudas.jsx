import React from "react";
import ctaBg from "../assets/img/cta-dudas-bg.jpg";
import ctaImg from "../assets/img/cta-dudas-img.png";

const CtaDudas = () => (
    <section className="w-full flex justify-center items-center my-20 relative overflow-visible">
        <div
            className="
    relative z-10
    flex flex-col justify-center
    pl-24 md:pl-56 pr-6 py-10
    w-full md:w-3/4
    bg-cover bg-center
    rounded-r-[120px] md:rounded-r-[200px] lg:rounded-r-[300px]
    shadow-lg
    min-h-[340px] md:min-h-[400px]
    overflow-visible
  "
            style={{
                backgroundImage: `url(${ctaBg})`,
            }}
        >
            {/* Imagen flotante al inicio del div */}
            <img
                src={ctaImg}
                alt="Asesor experto"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-40 md:w-64 lg:w-80 drop-shadow-xl z-20"
                style={{ transform: "translate(-30%, -50%)" }}
            />
            {/* Bloque de texto con padding extra a la izquierda */}
            <div className="pl-4 md:pl-8">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                    ¿Tienes dudas sobre qué Producto necesitas?
                </h2>
                <p className="text-blue-900 text-base md:text-lg mb-2 max-w-2xl">
                    Nuestros expertos están listos para ayudarte a tomar la mejor decisión.
                </p>
                <p className="text-blue-900 text-base md:text-lg mb-6 max-w-2xl">
                    En Siscoprint entendemos que cada negocio es único, por eso ofrecemos asesoría personalizada basada en tus necesidades, tipo de aplicación y presupuesto.
                </p>
                <a
                    href="/contacto"
                    className="w-auto inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 md:px-8 md:py-3 rounded-full shadow transition-colors duration-200 text-base"
                >
                    ¡Quiero asesoría!
                </a>
            </div>
        </div>
    </section>
);

export default CtaDudas;