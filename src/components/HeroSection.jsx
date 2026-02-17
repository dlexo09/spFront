import React from "react";

import bgHero from "../assets/img/banner-principal.png";
import iconExperience from "../assets/img/20-años-de-experiencia-icon.png";
import iconBranches from "../assets/img/6-sucursales-mexico-icon.png";
import iconTraining from "../assets/img/capacitacion-icon.png";
import iconTech from "../assets/img/tecnologia-icon.png";

const cards = [
    { icon: iconExperience, title: ["+20 años de", "experiencia"] },
    { icon: iconBranches, title: ["6 sucursales", "en México"] },
    { icon: iconTraining, title: ["Capacitación", "incluida"] },
    { icon: iconTech, title: ["Tecnología", "de punta"] },
];

const HeroSection = () => (
    <>
        <section className="relative w-full min-h-[600px] md:min-h-[700px] flex flex-col justify-start overflow-hidden">
            <img
                src={bgHero}
                alt="Banner principal"
                className="absolute inset-0 w-full h-full object-cover object-bottom"
                style={{ zIndex: 0 }}
            />
            <div
                className="
                    relative z-5
                    flex flex-col items-center justify-start
                    px-4 py-10 md:px-6
                    pt-[120px] md:pt-[180px]
                    text-center text-white
                    min-h-[500px] md:min-h-[600px]
                "
            >
                <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
                    <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold mb-6 md:mb-9 text-strong-blue leading-8 sm:leading-10 md:leading-[50px]">
                        DONDE LA CREATIVIDAD SE ENCUENTRA CON LA{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-yellow-sp via-pink-sp to-light-blue bg-clip-text text-transparent">
                                TECNOLOGÍA
                            </span>
                            <span
                                className="absolute left-0 right-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-yellow-sp via-pink-sp to-light-blue opacity-80"
                                aria-hidden="true"
                            />
                        </span>
                    </h1>
                    <p className="text-base md:text-lg font-light mb-3 md:mb-4 max-w-2xl text-black leading-[1.2]">
                        Soluciones de impresión para todo tipo de materiales: papel, textil, etiquetas y más.
                    </p>
                    
                    {/* Familias de productos */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                        {["Sublimación", "DTG", "Eco-solvente", "UV"].map((familia) => (
                            <a
                                key={familia}
                                href={`/productos?familia=${encodeURIComponent(familia)}`}
                                className="px-4 py-2 md:px-5 md:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm md:text-base font-medium text-gray-700 hover:bg-strong-blue hover:text-white hover:border-strong-blue transition-all duration-300 shadow-sm"
                            >
                                {familia}
                            </a>
                        ))}
                    </div>

                    <a
                        href="/productos"
                        className="inline-block bg-sky-500 hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
                    >
                        Ver Catálogo completo
                        <span
                            className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
                            aria-hidden="true"
                        ></span>
                    </a>
                </div>
            </div>
        </section>

        {/* Divisor con 4 tarjetas flotando */}
        <div className="relative z-30 flex justify-center mt-[-100px] md:mt-[-130px]">
            <div className="w-full max-w-6xl px-4 flex justify-center">
                <div className="relative w-full h-full sm:w-[95%] md:w-[90%] bg-white rounded-[2.3rem] md:rounded-[1.8rem] shadow-lg p-6 md:p-8 flex justify-center overflow-hidden bg-[url('/img/bg-beneficios-sp-mov.png')] md:bg-[url('/img/bg-beneficios-sp.png')] bg-[length:100%_100%] bg-center">
                    <div className="relative z-30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full justify-items-center">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                className={
                                    "flex flex-col items-center p-5 md:p-6 w-full" +
                                    (idx < 3 ? " border-b border-strong-blue md:border-b-0 md:border-r md:border-strong-blue" : "")
                                }
                            >
                                <img src={card.icon} alt="" className="w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4" />
                                <div className="flex flex-col text-base md:text-sm lg:text-lg font-medium text-gray-700 text-center gap-0 leading-none uppercase">
                                    {card.title.map((line, i) => (
                                        <span key={i} className="leading-tight">{line}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default HeroSection;