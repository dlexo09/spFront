import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SwiperExample = () => {
  return (
    <div className="swiper-container">
      <Swiper
        autoplay={{
          delay: 2000, // Cambia cada 2 segundos
          disableOnInteraction: false, // Continúa después de la interacción
        }}
        pagination={{ clickable: true }}
        loop={true} // Habilitar loop
        modules={[Autoplay, Pagination]} // Agregar módulos necesarios
        className="mySwiper"
      >
        <SwiperSlide>
          <div style={{ backgroundColor: "#ff9999", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>Slide 1</h2>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div style={{ backgroundColor: "#99ccff", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>Slide 2</h2>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div style={{ backgroundColor: "#99ff99", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>Slide 3</h2>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwiperExample;