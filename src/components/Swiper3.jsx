import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Swiper3.css"; // Archivo CSS para estilos personalizados

const Swiper3 = ({  }) => {

  const slides = [
    {
      image: "/img/Swiper/1.png",
      title: "Producto 1",
      description: "Descripción del producto 1",
      link: "/product/1",
    },
    {
      image: "/img/Swiper/2.png",
      title: "Producto 2",
      description: "Descripción del producto 2",
      link: "/product/2",
    },
    {
      image: "/img/Swiper/3.png",
      title: "Producto 3",
      description: "Descripción del producto 3",
      link: "/product/3",
    },
    {
      image: "/img/Swiper/4.png",
      title: "Producto 4",
      description: "Descripción del producto 4",
      link: "/product/4",
    },
    {
      image: "/img/Swiper/5.png",
      title: "Producto 5",
      description: "Descripción del producto 5",
      link: "/product/5",
    },
    {
      image: "/img/Swiper/6.png",
      title: "Producto 6",
      description: "Descripción del producto 6",
      link: "/product/6",
    },
  ];

  return (
    <div className="swiper3-container">
      <Swiper
        loop={slides.length > 6} // Habilitar loop solo si hay más de 6 diapositivas
        slidesPerView={6}
        spaceBetween={20}
        navigation={{
          nextEl: ".swiper3-button-next",
          prevEl: ".swiper3-button-prev",
        }}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1440: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        }}
        className="swiper3"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="swiper3-slide">
              <img
                src={slide.image}
                alt={slide.title}
                className="swiper3-image"
              />
              <div className="swiper3-content">
                <h3 className="swiper3-title">{slide.title}</h3>
                <p className="swiper3-description">{slide.description}</p>
                <a href={slide.link} className="swiper3-button">
                  Ver más
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botones de navegación */}
      <div className="swiper3-button-prev"></div>
      <div className="swiper3-button-next"></div>
    </div>
  );
};

export default Swiper3;