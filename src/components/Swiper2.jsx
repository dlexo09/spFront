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
                <img src="/img/Swiper/1.png" alt="Colorado Serie M" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/Colorado-Serie-M" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/2.png" alt="SureColor F6470" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/Surecolor-F6470" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/3.png" alt="SureColor F9570H" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/Surecolor-F9570H" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/4.png" alt="AcuarioPrint C4065" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/AccurioPrint-C4065" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/5.png" alt="Jaguar" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/Jaguar" className="swiper-button">Conocer más</a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-img-container">
                <img src="/img/Swiper/6.png" alt="SureColor V7000" className="w-full object-cover" />
                <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                  <a href="/product/Surecolor-V7000" className="swiper-button">Conocer más</a>
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