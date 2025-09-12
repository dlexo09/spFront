import React from 'react';
const SectionHero = ({ title, buttonText, buttonLink = '#', backgroundImg }) => {
  const bgStyle = backgroundImg
    ? { backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <section className="w-full overflow-hidden rounded-b-3xl mb-0" style={bgStyle}>
  <div className="w-full bg-gradient-to-r from-light-blue/30 to-pink-sp/30 px-4 py-10 md:py-20">
        <div className="container container-mrg mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold mb-6 text-strong-blue">{title}</h1>
          <a
            href={buttonLink}
            className="inline-block text-sm bg-sky-500 hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
          >
            {buttonText}
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

export default SectionHero;
