import React from "react";

import bgHero from "../assets/img/banner-principal.png";
import iconExperience from "../assets/img/20-años-de-experiencia-icon.png";
import iconBranches from "../assets/img/6-sucursales-mexico-icon.png";
import iconTraining from "../assets/img/capacitacion-icon.png";
import iconTech from "../assets/img/tecnologia-icon.png";

const cards = [
    { icon: iconExperience, title: "+20 años de experiencia" },
    { icon: iconBranches, title: "6 sucursales en México" },
    { icon: iconTraining, title: "Capacitación incluida" },
    { icon: iconTech, title: "Tecnología de punta" },
];

const HeroSection = () => (
    <>
        <section className="relative w-full min-h-[600px] md:min-h-[800px] flex flex-col justify-start overflow-hidden">
            <img
                src={bgHero}
                alt="Banner principal"
                className="absolute inset-0 w-full h-full object-fill"
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
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-6 md:mb-9 drop-shadow-lg text-blue-900">
                        DONDE LA CREATIVIDAD SE ENCUENTRA CON LA{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                TECNOLOGÍA
                            </span>
                            <span
                                className="absolute left-0 right-0 -bottom-1 h-2 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600 opacity-80"
                                aria-hidden="true"
                            />
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-2xl font-medium drop-shadow mb-8 md:mb-10 max-w-2xl">
                        Soluciones de impresión para todo tipo de materiales: papel, textil, etiquetas y más.
                    </p>
                    <a
                        href="/productos"
                        className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 md:px-8 md:py-3 rounded-full shadow transition-colors duration-200 text-base md:text-lg"
                    >
                        Ver Catálogo completo &gt;&gt;
                    </a>
                </div>
            </div>
        </section>

        {/* Divisor con 4 tarjetas flotando */}
        <div className="relative z-30 flex justify-center" style={{ marginTop: "-150px" }}>
            <div className="w-full max-w-6xl px-4 flex justify-center">
                <div className="relative w-full sm:w-[90%] md:w-[85%] bg-sky-500/30 rounded-2xl shadow-lg p-6 md:p-8 flex justify-center overflow-hidden">
                    <div className="relative z-30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full justify-items-center">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center bg-white rounded-xl shadow-md p-5 md:p-6 w-full hover:shadow-lg transition-shadow duration-200"
                            >
                                <img src={card.icon} alt="" className="w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4" />
                                <span className="text-base md:text-lg font-bold text-gray-700 text-center leading-tight">
                                    {card.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Div blanco para dar efecto de flotante */}
        <div className="w-full bg-white" style={{ minHeight: "50px", paddingTop: "120px" }}></div>
    </>
);

export default HeroSection;