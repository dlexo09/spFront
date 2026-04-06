import React, { useEffect, useRef } from "react";
import ctaBg from "../assets/img/cta-dudas-bg.png";
import ctaImg from "../assets/img/cta-dudas-img.png";
import { gsap, allowsMotion } from "../lib/gsap";

const CtaDudas = () => {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!allowsMotion() || !sectionRef.current) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 78%",
                },
            })
                .from("[data-cta-shell]", { y: 40, opacity: 0, duration: 0.85 })
                .from("[data-cta-copy]", { y: 24, opacity: 0, stagger: 0.1, duration: 0.55 }, "-=0.45")
                .from("[data-cta-action]", { y: 18, opacity: 0, duration: 0.5 }, "-=0.2")
                .from(imageRef.current, { x: -46, opacity: 0, scale: 0.94, duration: 0.8 }, "<");

            gsap.to(imageRef.current, {
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
    <section ref={sectionRef} className="w-full flex justify-center items-center mt-[60px] mb-[100px] md:mt-[120px] md:mb-[170px] relative overflow-visible">
        <div
            data-cta-shell
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
                ref={imageRef}
                src={ctaImg}
                alt="Asesor experto"
                className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 w-40 md:w-64 lg:w-80 drop-shadow-xl z-20"
                style={{ transform: "translate(-30%, -50%)" }}
            />
            {/* Bloque de texto con padding extra a la izquierda */}
            <div className="pl-4 md:pl-8">
                <h2 data-cta-copy className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-9 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">
                    ¿No sabes qué solución se adapta mejor a tu negocio?
                </h2>
                <p data-cta-copy className="text-blue-900 text-base mb-6">
                    Te ayudamos a comparar opciones, definir capacidad, resolver dudas técnicas y aterrizar una compra con más certeza.
                </p>
                <p data-cta-copy className="text-blue-900 text-base mb-6">
                    Cuéntanos qué quieres producir, tu volumen estimado y tu presupuesto. Nuestro equipo te orienta hacia la opción correcta sin adivinar.
                </p>
                <a
                    href="/contacto"
                    data-cta-action
                    className="inline-block text-sm bg-pink-sp hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
                >
                    Hablar con un asesor
                    <span
                        className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
                        aria-hidden="true"
                    ></span>
                </a>
            </div>
        </div>
    </section>
    );
};

export default CtaDudas;