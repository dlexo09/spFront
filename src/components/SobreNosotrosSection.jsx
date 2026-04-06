import React, { useEffect, useRef } from "react";
import imgSobreNosotros from "../assets/img/nosotros-img.png";
import { gsap, allowsMotion } from "../lib/gsap";

const highlights = [
  "Soporte técnico especializado",
  "Capacitación práctica incluida",
  "Cobertura nacional",
];

const stats = [
  {
    value: "+20",
    label: "años impulsando negocios",
    cardClass: "bg-[linear-gradient(180deg,#ffffff,#eef8ff)] border-sky-100",
    valueClass: "text-sky-600",
  },
  {
    value: "6",
    label: "sucursales en México",
    cardClass: "bg-[linear-gradient(180deg,#ffffff,#fff5e8)] border-amber-100",
    valueClass: "text-amber-500",
  },
  {
    value: "1:1",
    label: "acompañamiento comercial",
    cardClass: "bg-[linear-gradient(180deg,#ffffff,#fff0f7)] border-pink-100",
    valueClass: "text-pink-500",
  },
];

const SobreNosotrosSection = () => {
  const sectionRef = useRef(null);
  const desktopImageRef = useRef(null);

  useEffect(() => {
    if (!allowsMotion() || !sectionRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 74%",
        },
      })
        .from("[data-about-copy]", { y: 36, opacity: 0, stagger: 0.12, duration: 0.7 })
        .from("[data-about-cta]", { y: 18, opacity: 0, duration: 0.5 }, "-=0.28")
        .from("[data-about-image-mobile]", { y: 24, opacity: 0, scale: 0.96, duration: 0.65 }, "-=0.45")
        .from(desktopImageRef.current, { x: 40, opacity: 0, scale: 0.95, duration: 0.8 }, "<");

      gsap.to(desktopImageRef.current, {
        yPercent: -8,
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
  <section
    ref={sectionRef}
    className="relative w-full mt-[60px] md:mt-[150px] overflow-hidden"
  >
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="absolute inset-x-6 top-10 bottom-10 rounded-[40px] bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(244,114,182,0.12),rgba(250,204,21,0.12))] blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.88))]" aria-hidden="true" />
        <div className="relative w-full flex flex-col md:flex-row px-5 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 gap-8 md:gap-10 items-center">
          <div className="flex-1 flex flex-col justify-center items-start md:items-start items-center z-10 text-center md:text-left">
            <span data-about-copy className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Siscoprint
            </span>
            <h2 data-about-copy className="mt-4 text-2xl sm:text-3xl md:text-[38px] font-semibold mb-4 text-strong-blue leading-8 sm:leading-10 md:leading-[44px] max-w-xl">Un aliado comercial y técnico para tomar mejores decisiones de impresión</h2>

            <div data-about-image-mobile className="block md:hidden mb-6 mt-2">
              <div className="rounded-[28px] border border-white bg-white/80 p-4 shadow-[0_24px_45px_rgba(15,23,42,0.12)]">
                <img
                  src={imgSobreNosotros}
                  alt="Sobre nosotros"
                  className="w-64 h-auto object-contain mx-auto"
                />
              </div>
            </div>

            <p data-about-copy className="text-slate-700 text-base md:text-[17px] mb-4 max-w-xl leading-7">
              Ayudamos a empresas, talleres y marcas a elegir la tecnología adecuada para producir con confianza, reducir fricción operativa y crecer con respaldo experto.
            </p>
            <p data-about-copy className="text-slate-600 text-base md:text-[17px] mb-6 max-w-xl leading-7">
              No se trata solo de vender equipos: se trata de acompañarte antes, durante y después de la compra para que la inversión sí te funcione en el día a día.
            </p>

            <div data-about-copy className="flex flex-wrap justify-center md:justify-start gap-2.5 mb-6 max-w-xl">
              {highlights.map((item) => (
                <span key={item} className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] border border-slate-100">
                  {item}
                </span>
              ))}
            </div>

            <div data-about-copy className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className={`rounded-[24px] px-4 py-4 border shadow-[0_14px_28px_rgba(15,23,42,0.06)] ${stat.cardClass}`}>
                  <p className={`text-2xl md:text-3xl font-semibold leading-none ${stat.valueClass}`}>{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-600 leading-5">{stat.label}</p>
                </div>
              ))}
            </div>

            <a
              href="/about"
              data-about-cta
              className="inline-block text-sm bg-pink-sp hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
            >
              Conocer por qué Siscoprint
              <span
                className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
                aria-hidden="true"
              ></span>
            </a>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center z-10">
            <div className="relative w-full max-w-[520px]">
              <div className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_52%)] blur-2xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(241,245,249,0.78))] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
                <div className="absolute inset-0 bg-[linear-gradient(140deg,transparent_0%,rgba(255,255,255,0.55)_40%,transparent_70%)]" aria-hidden="true" />
                <img
                  ref={desktopImageRef}
                  src={imgSobreNosotros}
                  alt="Sobre nosotros"
                  className="relative z-10 w-full max-w-sm mx-auto object-contain"
                  style={{ minHeight: "220px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default SobreNosotrosSection;