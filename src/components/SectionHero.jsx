import React, { useEffect, useRef } from 'react';
import { gsap, allowsMotion } from '../lib/gsap';

const SectionHero = ({
  title,
  description,
  eyebrow = 'Siscoprint',
  buttonText,
  buttonLink = '#',
  backgroundImg,
}) => {
  const rootRef = useRef(null);
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!allowsMotion() || !rootRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-section-hero-eyebrow]', { y: 20, opacity: 0, duration: 0.55 })
        .from('[data-section-hero-title]', { y: 32, opacity: 0, duration: 0.75 }, '-=0.28')
        .from('[data-section-hero-copy]', { y: 22, opacity: 0, duration: 0.6 }, '-=0.35')
        .from('[data-section-hero-action]', { y: 18, opacity: 0, duration: 0.5 }, '-=0.28');

      gsap.to(backgroundRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const bgStyle = backgroundImg
    ? { backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden isolate pt-[98px] md:pt-[112px] mb-0">
      <div ref={backgroundRef} className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7f2e8_0%,#f6e8f0_24%,#fdeec6_52%,#eef9ff_100%)]" />
        {backgroundImg ? <div className="absolute inset-0 opacity-[0.08]" style={bgStyle} /> : null}
        <div className="absolute -left-[10%] top-[4%] h-[340px] w-[340px] rounded-full bg-[#31b5ee]/28 blur-3xl md:h-[420px] md:w-[420px]" />
        <div className="absolute right-[-6%] top-[2%] h-[300px] w-[300px] rounded-full bg-[#ffd44d]/35 blur-3xl md:h-[380px] md:w-[380px]" />
        <div className="absolute inset-x-[10%] top-[42%] h-[1px] rotate-[-8deg] bg-gradient-to-r from-transparent via-white/90 to-transparent shadow-[0_0_28px_rgba(255,255,255,0.8)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.38)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:82px_82px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 px-4 pb-12 md:pb-16">
        <div className="container container-mrg mx-auto">
          <div className="overflow-hidden rounded-b-[36px] md:rounded-b-[44px] border border-white/70 bg-white/45 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div ref={contentRef} className="px-6 py-10 md:px-10 md:py-16 text-center max-w-4xl mx-auto">
              <span data-section-hero-eyebrow className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                {eyebrow}
              </span>
              <h1 data-section-hero-title className="mt-4 text-3xl sm:text-4xl md:text-[46px] font-semibold mb-4 text-strong-blue leading-[1.08]">
                {title}
              </h1>
              {description ? (
                <p data-section-hero-copy className="mx-auto max-w-3xl text-slate-600 text-base md:text-lg leading-8 mb-8">
                  {description}
                </p>
              ) : null}
              <a
                href={buttonLink}
                data-section-hero-action
                className="inline-block text-sm bg-sky-500 hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg shadow-[0_18px_35px_rgba(14,165,233,0.20)]"
              >
                {buttonText}
                <span
                  className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
                  aria-hidden="true"
                ></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionHero;
