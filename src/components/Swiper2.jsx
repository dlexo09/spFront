import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation'; // Importar estilos de navegación
import './Swiper2.css';

// Importa las imágenes de tus productos (ajusta las rutas según tu proyecto)
import Producto1 from '/src/assets/img/Swiper/sureColorS80600l.png';
import Producto2 from '/src/assets/img/Swiper/sureColor9000.png';
import Producto3 from '/src/assets/img/Swiper/sureColorF570.png';

const BannerStreamingHome = () => {
  const [cards, setCards] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    // Simular la obtención de datos de la API
    const fetchedCards = [
      { id: 1, image: Producto1, title: 'SureColor S80600', description: 'Impresora de gran formato para profesionales.', link: '/productos/sureColorS80600' },
      { id: 2, image: Producto2, title: 'SureColor 9000', description: 'La elección perfecta para impresiones de alta calidad.', link: '/productos/sureColor9000' },
      { id: 3, image: Producto3, title: 'SureColor F570', description: 'Ideal para sublimación y proyectos creativos.', link: '/productos/sureColorF570' },
      { id: 4, image: Producto1, title: 'SureColor S80600', description: 'Impresora de gran formato para profesionales.', link: '/productos/sureColorS80600' },
      { id: 5, image: Producto2, title: 'SureColor 9000', description: 'La elección perfecta para impresiones de alta calidad.', link: '/productos/sureColor9000' },
    ];

    setCards(fetchedCards);
    setSlidesPerView(fetchedCards.length < 3 ? fetchedCards.length : 3);
    setLoop(fetchedCards.length >= 3);
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
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={loop}
            slidesPerView={slidesPerView}
            spaceBetween={cards.length < 3 ? 0 : -60}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: cards.length < 3 ? 0 : 100,
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
                slidesPerView: 2,
                spaceBetween: cards.length < 3 ? 0 : -200,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: cards.length < 3 ? 0 : -200,
              },
              1440: {
                slidesPerView: 3,
                spaceBetween: cards.length < 3 ? 0 : -60,
              },
            }}
          >
            {cards.map(card => (
              <SwiperSlide key={card.id}>
                <div className="swiper-img-container">
                  <img src={card.image} alt={card.title} className="w-full h-96 object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    <p>{card.description}</p>
                    <a href={card.link} className="swiper-button">Ver más</a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
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