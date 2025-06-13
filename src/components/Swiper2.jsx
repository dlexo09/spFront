import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import './Swiper2.css';

const BannerStreamingHome = () => {
  return (
    <>
      <section className="productHome-section">
        <div className="productHome-content">
          <h1 className="productHome-title">Productos destacados</h1>
          <p className="productHome-text">
            Conoce todo el catálogo disponible, y descubre por qué Siscoprint es tu mejor aliado.
          </p>
        </div>

        <div className="container swiper-container streamings-home">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={5}
            spaceBetween={-60}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 3000, // Cambiar cada 3 segundos
              disableOnInteraction: false, // Continuar después de la interacción
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 100,
              depth: 200,
              modifier: 1.5,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="swiper_container"
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: -200,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: -200,
              },
              1440: {
                slidesPerView: 5,
                spaceBetween: -60,
              },
            }}
          >
            {/* Diapositivas manuales */}
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/01_CARRUSEL_EPSON F2270.png" alt="Surecolor F2270" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/SCF2270SE" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/02_CARRUSEL_EPSON G6070.png" alt="Surecolor G6070" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/SCG6070SE" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/03_CARRUSEL_LSINC PERIONE.png" alt="LSINC PeriOne" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/PeriOne" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/04_CARRUSEL_GBC FOTON 30.png" alt="Foton 30" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/56-072" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/05_CARRUSEL_STRATOJET FALCON 3300.png" alt="Stratojet Falcon XL 3300" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/Falcon-XL-3300" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/06_CARRUSEL_GRAPHTEC CE7000.png" alt="Graphtec CE7000" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/69-035" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Botones de navegación */}
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>

        {/* Botón para ver el catálogo completo */}
        <a href="/productos" className="catalog-button">Ver catálogo completo</a>
      </section>
    </>
  );
};

export default BannerStreamingHome;