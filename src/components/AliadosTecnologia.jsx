import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./AliadosTecnologia.css";

// Reemplaza estos imports por los logos reales de tus marcas
import logo1 from "../assets/img/logos/epson-logo.png";
import logo2 from "../assets/img/logos/canon-logo.png";
import logo3 from "../assets/img/logos/gbc-logo.png";
import logo4 from "../assets/img/logos/graphtec-logo.png";
import logo5 from "../assets/img/logos/konica-minolta-logo.png";
import logo6 from "../assets/img/logos/lsinc-logo.png";
import logo7 from "../assets/img/logos/stratojet-logo.png";

const logos = [
  { src: logo1, alt: "Epson" },
  { src: logo2, alt: "Canon" },
  { src: logo3, alt: "gbc" },
  { src: logo4, alt: "Graphtec" },
  { src: logo5, alt: "konica" },
  { src: logo6, alt: "Lsinc" },
  { src: logo7, alt: "Stratojet" },
];

const AliadosTecnologia = () => (
  <section className="w-full bg-white mt-[60px] md:mt-[150px]">
    <h2 className="text-center text-2xl sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-7 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">
      Nuestros aliados de tecnología
    </h2>
    
    <div className="container swiper-container streamings-home">
      <Swiper
        grabCursor={true}
        centeredSlides={false}
        loop={true}
        slidesPerView={1}
        spaceBetween={20}
        navigation={{
          nextEl: ".swiper-button-next-logos",
          prevEl: ".swiper-button-prev-logos",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="logos-swiper"
        breakpoints={{
          768: { slidesPerView: 3, spaceBetween: 40 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
          1280: { slidesPerView: 6, spaceBetween: 60 },
        }}
      >
        {logos.map((logo, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex items-center justify-center h-20 p-2">
              <img
                src={logo.src}
                alt={logo.alt}
                className="object-contain grayscale hover:grayscale-0 transition duration-300"
                style={{ maxWidth: 160 }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botones de navegación con el mismo estilo que Swiper2 */}
      <div className="swiper-button-prev-logos"></div>
      <div className="swiper-button-next-logos"></div>
    </div>
  </section>
);


export default AliadosTecnologia;