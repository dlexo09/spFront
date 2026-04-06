import React, { useEffect, useRef } from "react";

import iconExperience from "../assets/img/20-años-de-experiencia-icon.png";
import iconBranches from "../assets/img/6-sucursales-mexico-icon.png";
import iconTraining from "../assets/img/capacitacion-icon.png";
import iconTech from "../assets/img/tecnologia-icon.png";
import { gsap, allowsMotion } from "../lib/gsap";

const cards = [
    { icon: iconExperience, title: ["+20 años de", "experiencia"] },
    { icon: iconBranches, title: ["6 sucursales", "en México"] },
    { icon: iconTraining, title: ["Capacitación", "incluida"] },
    { icon: iconTech, title: ["Tecnología", "de punta"] },
];

const families = ["Sublimación", "DTG", "Eco-solvente", "UV"];
const trustPoints = ["Asesoría comercial", "Envío nacional", "Soporte técnico"]; 

const HeroSection = () => {
    const rootRef = useRef(null);
    const backgroundRef = useRef(null);
    const titleRef = useRef(null);
    const copyRef = useRef(null);
    const chipsRef = useRef([]);
    const ctaRef = useRef(null);
    const panelRef = useRef(null);
    const cardsRef = useRef([]);

    chipsRef.current = [];
    cardsRef.current = [];

    const setChipRef = (element) => {
        if (element && !chipsRef.current.includes(element)) {
            chipsRef.current.push(element);
        }
    };

    const setCardRef = (element) => {
        if (element && !cardsRef.current.includes(element)) {
            cardsRef.current.push(element);
        }
    };

    useEffect(() => {
        if (!allowsMotion() || !rootRef.current) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

            timeline
                .from(titleRef.current, { y: 42, opacity: 0, duration: 0.9 })
                .from(copyRef.current, { y: 26, opacity: 0, duration: 0.65 }, "-=0.55")
                .fromTo(
                    chipsRef.current,
                    { y: 18, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.45, clearProps: "opacity,visibility,transform" },
                    "-=0.35"
                )
                .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.55 }, "-=0.2")
                .from(panelRef.current, { y: 55, opacity: 0, duration: 0.8 }, "-=0.25")
                .from(cardsRef.current, { y: 28, opacity: 0, stagger: 0.1, duration: 0.55 }, "-=0.5");

            gsap.to(backgroundRef.current, {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
    <div ref={rootRef}>
        <section className="relative w-full min-h-[650px] md:min-h-[780px] flex flex-col justify-start overflow-hidden isolate bg-[#f7f4ee]">
            <div
                ref={backgroundRef}
                className="absolute inset-0 z-0"
                aria-hidden="true"
            >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7f2e8_0%,#f7e2e1_23%,#ffe8c3_50%,#fff9d6_74%,#eef9ff_100%)]" />
                <div className="absolute -left-[18%] top-[6%] h-[420px] w-[420px] rounded-full bg-[#31b5ee]/35 blur-3xl md:h-[520px] md:w-[520px]" />
                <div className="absolute right-[-8%] top-[3%] h-[340px] w-[340px] rounded-full bg-[#ffd44d]/45 blur-3xl md:h-[460px] md:w-[460px]" />
                <div className="absolute left-[20%] top-[18%] h-[260px] w-[260px] rounded-full bg-[#f36ab2]/18 blur-3xl md:h-[340px] md:w-[340px]" />
                <div className="absolute inset-x-[6%] top-[24%] h-[1px] rotate-[-10deg] bg-gradient-to-r from-transparent via-white/90 to-transparent shadow-[0_0_28px_rgba(255,255,255,0.95)] md:top-[38%]" />
                <div className="absolute inset-x-[18%] top-[46%] h-[1px] rotate-[7deg] bg-gradient-to-r from-transparent via-white/70 to-transparent shadow-[0_0_22px_rgba(255,255,255,0.75)]" />
                <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:84px_84px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
                <div className="absolute left-[18%] top-[20%] h-5 w-5 rounded-full border border-white/80 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
                <div className="absolute right-[17%] top-[24%] h-4 w-4 rounded-full border border-white/70 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="absolute left-[12%] bottom-[20%] h-4 w-4 rounded-full border border-white/70 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="absolute right-[10%] bottom-[16%] h-3.5 w-3.5 rounded-full border border-white/70 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-t from-white/70 via-white/20 to-transparent" />
            </div>
            <div
                className="
                    relative z-5
                    flex flex-col items-center justify-start
                    px-4 py-10 md:px-6
                    pt-[130px] md:pt-[190px]
                    text-center text-white
                    min-h-[560px] md:min-h-[680px]
                "
            >
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    <h1 ref={titleRef} className="text-2xl sm:text-3xl md:text-[42px] font-semibold mb-7 md:mb-10 text-strong-blue leading-8 sm:leading-10 md:leading-[50px] max-w-4xl drop-shadow-[0_10px_28px_rgba(255,255,255,0.26)]">
                        SOLUCIONES DE IMPRESIÓN PARA TU NEGOCIO: VENTA, SERVICIO Y{" "}
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
                    <p ref={copyRef} className="text-base md:text-lg font-light mb-5 md:mb-6 max-w-2xl text-slate-900 leading-7">
                        Encuentra equipos, consumibles y acompañamiento experto para producir mejor, vender más y operar con respaldo técnico real.
                    </p>
                    
                    {/* Familias de productos */}
                    <div className="relative z-20 flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 rounded-[28px] bg-white/58 px-2.5 py-2.5 backdrop-blur-md shadow-[0_24px_55px_rgba(15,23,42,0.08)] border border-white/70 max-w-fit mx-auto">
                        {families.map((familia) => (
                            <a
                                key={familia}
                                href={`/productos?familia=${encodeURIComponent(familia)}`}
                                ref={setChipRef}
                                className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 min-w-[108px] bg-white/95 text-slate-700 border border-white rounded-full text-sm md:text-base font-medium hover:bg-strong-blue hover:text-white hover:border-strong-blue transition-all duration-300 shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
                            >
                                {familia}
                            </a>
                        ))}
                    </div>

                    <a
                        href="/productos"
                        ref={ctaRef}
                        className="inline-block bg-sky-500 hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
                    >
                        Ver Catálogo completo
                        <span
                            className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
                            aria-hidden="true"
                        ></span>
                    </a>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-medium text-slate-600 max-w-2xl">
                        {trustPoints.map((point) => (
                            <span key={point} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 border border-white/80 shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
                                <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                                {point}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Divisor con 4 tarjetas flotando */}
        <div className="relative z-30 flex justify-center mt-[-40px] md:mt-[-70px]">
            <div className="w-full max-w-6xl px-4 flex justify-center">
                <div ref={panelRef} className="relative w-full h-full sm:w-[95%] md:w-[90%] bg-white rounded-[2.3rem] md:rounded-[1.8rem] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.10)] p-6 md:p-8 flex justify-center overflow-hidden bg-[url('/img/bg-beneficios-sp-mov.png')] md:bg-[url('/img/bg-beneficios-sp.png')] bg-[length:100%_100%] bg-center">
                    <div className="relative z-30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full justify-items-center">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                ref={setCardRef}
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
    </div>
    );
};

export default HeroSection;