import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation'; // Importar estilos de navegación
import './Swiper2.css';

// Importa las imágenes de tus productos (ajusta las rutas según tu proyecto)
import Producto1 from '/img/Swiper/1.png';
import Producto2 from '/img/Swiper/2.png';
import Producto3 from '/img/Swiper/3.png';
import Producto4 from '/img/Swiper/4.png';
import Producto5 from '/img/Swiper/5.png';
import Producto6 from '/img/Swiper/6.png';

const BannerStreamingHome = () => {
  const [cards, setCards] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    // Simular la obtención de datos de la API
    const fetchedCards = [
      { id: 1, image: Producto1, title: 'Colorado Serie M', description: 'Impresora de gran formato para profesionales.', link: '/product/Colorado-Serie-M' },
      { id: 2, image: Producto2, title: 'SureColor F6470', description: 'La elección perfecta para impresiones de alta calidad.', link: '/product/Surecolor-F6470' },
      { id: 3, image: Producto3, title: 'SureColor F9570H', description: 'Ideal para sublimación y proyectos creativos.', link: '/product/Surecolor-F9570H' },
      { id: 4, image: Producto4, title: 'AcuarioPrint C4065', description: 'Impresora de gran formato para profesionales.', link: '/product/AccurioPrint-C4065' },
      { id: 5, image: Producto5, title: 'Jaguar', description: 'La elección perfecta para impresiones de alta calidad.', link: '/product/Jaguar' },
      { id: 6, image: Producto6, title: 'SureColor V7000', description: 'Cama plana UV', link: '/product/Surecolor-V7000' },
     
    ];

    setCards(fetchedCards);

    // Forzar la actualización del Swiper después de que las tarjetas se hayan cargado
    if (swiperRef.current) {
      swiperRef.current.swiper.update();
    }
  }, []);

  return (
    <>
      <section className="productHome-section">
        <div className="productHome-content">
          <h1 className="productHome-title">Productos destacados</h1>
          <p className="productHome-text">
            Conoce todo el catalogo disponible, y descubre por que siscoprint es tu mejor aliado.
          </p>
        </div>

        <div className="container swiper-container streamings-home">
          <Swiper
            ref={swiperRef}
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
            coverflowEffect={{
              rotate: 0,
              stretch: 100,
              depth: 200,
              modifier: 1.5,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Navigation]}
            className="swiper_container"
            breakpoints={{
              0: { // responsive 
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
                spaceBetween: -80,
              },
            }}
          >
             <SwiperSlide >
                <div className="swiper-img-container">
                  <img src="/img/Swiper/1.png" alt="Colorado Serie M" className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                   
                    <a href="/product/Colorado-Serie-M" className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide >
                <div className="swiper-img-container">
                  <img src="/img/Swiper/2.png" alt="SureColor F6470" className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                   
                    <a href="/product/Surecolor-F6470" className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide >
                <div className="swiper-img-container">
                  <img src="/img/Swiper/3.png" alt="SureColor F9570H" className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                   
                    <a href="/product/Surecolor-F9570H" className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide >
                <div className="swiper-img-container">
                  <img src="/img/Swiper/4.png" alt="AcuarioPrint C4065" className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                   
                    <a href="/product/AccurioPrint-C4065" className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide >
                <div className="swiper-img-container">
                  <img src="/img/Swiper/5.png" alt="Jaguar" className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                   
                    <a href="/product/Jaguar" className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide >
                <div className="swiper-img-container">
                  <img src="/img/Swiper/6.png" alt="SureColor V7000" className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                    
                    <a href="/product/Surecolor-V7000" className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>

              


            {/* {cards.map(card => (
              <SwiperSlide key={card.id}>
                <div className="swiper-img-container">
                  <img src={card.image} alt={card.title} className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                    
                    <a href={card.link} className="swiper-button">Conocer más</a>
                  </div>
                </div>
              </SwiperSlide>
            ))} */}

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