import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Importa los estilos personalizados
import './Swiper.css';

// Importa las imágenes de tus productos (ajusta las rutas según tu proyecto)
import Producto1 from '/src/assets/img/Swiper/sureColorS80600l.png';
import Producto2 from '/src/assets/img/Swiper/sureColor9000.png';
import Producto3 from '/src/assets/img/Swiper/sureColorF570.png';

const ProductosDestacados = () => {
  return (
    <div className="my-12 streamings-home">
      <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide className="swiper-slide-custom">
          <img src={Producto1} alt="SureColor S80600" />
          <div className="slide-content">
            <h3 className="text-xl font-bold">SureColor S80600</h3>
            <p>Impresora de gran formato para profesionales.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide-custom">
          <img src={Producto2} alt="SureColor 9000" />
          <div className="slide-content">
            <h3 className="text-xl font-bold">SureColor 9000</h3>
            <p>La elección perfecta para impresiones de alta calidad.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide-custom">
          <img src={Producto3} alt="SureColor F570" />
          <div className="slide-content">
            <h3 className="text-xl font-bold">SureColor F570</h3>
            <p>Ideal para sublimación y proyectos creativos.</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProductosDestacados;