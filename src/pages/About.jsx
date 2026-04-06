import React, { useEffect, useRef } from "react";
import SectionHero from "../components/SectionHero";
import { gsap, allowsMotion } from "../lib/gsap";

import sucursalesImg from "../assets/img/sucursales.png";

const stats = [
  { value: "+20", label: "años en impresión digital" },
  { value: "6", label: "sucursales con cobertura nacional" },
  { value: "2002", label: "año desde el que impulsamos negocios" },
];

const pillars = [
  {
    title: "Asesoría real",
    description: "Aterrizamos la mejor solución según aplicación, volumen, presupuesto y etapa de crecimiento.",
  },
  {
    title: "Respaldo técnico",
    description: "Acompañamos con capacitación, soporte y seguimiento para que la inversión sí funcione en operación.",
  },
  {
    title: "Cobertura nacional",
    description: "Estamos cerca para atender ventas y servicio con una estructura comercial y técnica distribuida en México.",
  },
];

const values = [
  "Innovación",
  "Cercanía",
  "Confianza",
  "Servicio",
  "Honestidad",
  "Mejora continua",
];

const About = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    if (!allowsMotion() || !pageRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-about-block]").forEach((block, index) => {
        gsap.from(block, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          delay: index === 0 ? 0.08 : 0,
          scrollTrigger: {
            trigger: block,
            start: "top 78%",
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <SectionHero
        title={"SOBRE NOSOTROS"}
        eyebrow={"Nuestra historia"}
        description={"Conoce la trayectoria, visión y estructura con la que acompañamos a negocios de todo México en sus decisiones de impresión."}
        buttonText={"EXPLORAR SOLUCIONES"}
        buttonLink={"/productos"}
        backgroundImg={"../assets/img/bg-hero-general.png"}
      />

      <section className="container mx-auto max-w-7xl px-4 container-mrg">
        <div data-about-block className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.10),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.88))]" aria-hidden="true" />
          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-16">
            <div>
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                Siscoprint
              </span>
              <h2 className="mt-4 text-3xl md:text-[42px] font-semibold text-strong-blue leading-[1.1] max-w-3xl">
                Tecnología de impresión con visión comercial, soporte técnico y acompañamiento real.
              </h2>
              <p className="mt-5 text-slate-700 text-base md:text-[17px] leading-8 max-w-3xl">
                En Siscoprint conectamos marcas, talleres, industrias y emprendedores con soluciones de impresión que sí responden a sus necesidades operativas. No solo vendemos equipos: ayudamos a tomar mejores decisiones para producir, crecer y mantener continuidad.
              </p>
              <p className="mt-4 text-slate-600 text-base md:text-[17px] leading-8 max-w-3xl">
                Desde 2002 hemos construido una operación centrada en el cliente, combinando tecnología, experiencia comercial y servicio técnico para convertir cada inversión en una herramienta de trabajo rentable y confiable.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mt-8 max-w-3xl">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`rounded-[24px] px-4 py-5 border shadow-[0_14px_28px_rgba(15,23,42,0.06)] ${
                      index === 0
                        ? "bg-[linear-gradient(180deg,#ffffff,#eef8ff)] border-sky-100"
                        : index === 1
                          ? "bg-[linear-gradient(180deg,#ffffff,#fff4e8)] border-amber-100"
                          : "bg-[linear-gradient(180deg,#ffffff,#fff0f7)] border-pink-100"
                    }`}
                  >
                    <p className={`text-3xl font-semibold leading-none ${index === 0 ? "text-sky-600" : index === 1 ? "text-amber-500" : "text-pink-500"}`}>
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 leading-5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_52%)] blur-2xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,245,249,0.82))] p-5 shadow-[0_30px_60px_rgba(15,23,42,0.14)]">
                <div className="grid grid-cols-2 gap-4">
                  <img src="/img/about-section-img.png" alt="Tecnología de impresión" className="col-span-2 rounded-[22px] object-cover w-full h-[220px]" />
                  <img src="/img/nuestra-historia-img.png" alt="Historia Siscoprint" className="rounded-[22px] object-cover w-full h-[180px]" />
                  <div className="rounded-[22px] bg-slate-900 p-5 text-white flex flex-col justify-between min-h-[180px]">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Nuestra promesa</p>
                    <p className="text-xl font-semibold leading-8">Que tu inversión imprima con respaldo, continuidad y resultado.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 mt-[70px] md:mt-[110px]">
        <div data-about-block className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center">
          <div className="rounded-[32px] overflow-hidden border border-white shadow-[0_24px_60px_rgba(15,23,42,0.10)] bg-white">
            <img
              src={sucursalesImg}
              alt="Sucursales Siscoprint"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="rounded-[32px] bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(255,255,255,0.98),rgba(244,114,182,0.08))] border border-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-8 md:p-10">
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Cobertura
            </span>
            <h3 className="mt-4 text-2xl md:text-[34px] font-semibold text-strong-blue leading-tight">
              Una estructura nacional para atender ventas, soporte y crecimiento.
            </h3>
            <p className="mt-4 text-slate-700 text-base md:text-[17px] leading-8">
              Nuestra presencia en distintas ciudades permite responder con mayor cercanía, velocidad y seguimiento comercial. Esto se traduce en una experiencia más sólida antes, durante y después de cada compra.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-7">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-[24px] bg-white/90 border border-white px-4 py-5 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
                  <h4 className="text-base font-semibold text-strong-blue">{pillar.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 mt-[70px] md:mt-[110px]">
        <div data-about-block className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-[32px] border border-white bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-8 md:p-10">
            <span className="inline-flex items-center rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-pink-600">
              Nuestra historia
            </span>
            <h3 className="mt-4 text-2xl md:text-[34px] font-semibold text-strong-blue leading-tight">
              Más de dos décadas conectando ideas con tecnología de impresión.
            </h3>
            <p className="mt-4 text-slate-700 text-base md:text-[17px] leading-8">
              Desde 2002 evolucionamos junto con las necesidades del mercado, integrando nuevas categorías, marcas, soluciones y formas de acompañar a nuestros clientes. Nuestro crecimiento ha estado impulsado por una convicción simple: vender bien implica responder mejor.
            </p>
            <p className="mt-4 text-slate-600 text-base md:text-[17px] leading-8">
              Miles de negocios confían en Siscoprint no solo por la calidad del portafolio, sino por la cercanía de nuestro equipo, la honestidad en la recomendación y la capacidad de sostener la operación con servicio confiable.
            </p>
          </div>

          <div className="rounded-[32px] bg-[linear-gradient(135deg,#1e3a8a,#0ea5e9)] text-white shadow-[0_24px_60px_rgba(30,58,138,0.24)] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Lo que nos mueve
              </span>
              <h3 className="mt-4 text-2xl md:text-[34px] font-semibold leading-tight">
                Misión y visión con foco en valor duradero.
              </h3>
            </div>

            <div className="grid gap-4 mt-8">
              <div className="rounded-[26px] bg-white/10 border border-white/12 p-5">
                <h4 className="text-xl font-semibold">Nuestra misión</h4>
                <p className="mt-3 text-white/78 leading-7 text-sm md:text-base">
                  Ofrecer soluciones integrales en impresión digital con equipos de alto rendimiento, asesoría especializada, capacitación constante y soporte técnico que generen resultados sostenibles para cada cliente.
                </p>
              </div>
              <div className="rounded-[26px] bg-white/10 border border-white/12 p-5">
                <h4 className="text-xl font-semibold">Nuestra visión</h4>
                <p className="mt-3 text-white/78 leading-7 text-sm md:text-base">
                  Consolidarnos como un socio estratégico reconocido por su capacidad de respuesta, cercanía comercial y excelencia en el servicio, construyendo relaciones duraderas basadas en valor y confianza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 mt-[70px] md:mt-[110px] mb-[90px] md:mb-[120px]">
        <div data-about-block className="rounded-[36px] overflow-hidden border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,248,255,0.88),rgba(255,240,247,0.88))] shadow-[0_30px_90px_rgba(15,23,42,0.08)] px-6 py-10 md:px-10 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-amber-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">
              Nuestros valores
            </span>
            <h3 className="mt-4 text-2xl md:text-[34px] font-semibold text-strong-blue leading-tight">
              Principios que sostienen cada relación comercial.
            </h3>
            <p className="mt-4 text-slate-600 text-base md:text-[17px] leading-8">
              Nuestra forma de trabajar está construida sobre consistencia, cercanía y compromiso real con los resultados de cada cliente.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value}
                className={`rounded-[24px] px-5 py-5 border shadow-[0_14px_28px_rgba(15,23,42,0.05)] ${
                  index % 3 === 0
                    ? "bg-white border-sky-100"
                    : index % 3 === 1
                      ? "bg-white border-pink-100"
                      : "bg-white border-amber-100"
                }`}
              >
                <p className="text-lg font-semibold text-strong-blue">{value}</p>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  {value === "Innovación" && "Nos mantenemos cerca de la tecnología para responder con soluciones actuales y útiles."}
                  {value === "Cercanía" && "Escuchamos, acompañamos y atendemos con trato humano y seguimiento real."}
                  {value === "Confianza" && "Recomendamos con honestidad, cuidando la inversión y el objetivo del cliente."}
                  {value === "Servicio" && "Entendemos que una venta bien hecha se completa con soporte y continuidad."}
                  {value === "Honestidad" && "Preferimos orientar con claridad antes que vender algo que no corresponde."}
                  {value === "Mejora continua" && "Buscamos optimizar procesos, atención y respuesta para entregar más valor."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;