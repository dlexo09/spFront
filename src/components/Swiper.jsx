import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Importa las imágenes de tus productos (ajusta las rutas según tu proyecto)
import Producto1 from '/src/assets/img/Swiper/2250P.jpg';
import Producto2 from '/src/assets/img/Swiper/FOTON30.png';
import Producto3 from '/src/assets/img/Swiper/T7770DM.jpg';

const ProductosDestacados = () => {
  return (
    <div className="my-12">
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
        <SwiperSlide>
          <img src={Producto1} alt="SureColor S80600" className="w-full h-96 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h3 className="text-xl font-bold">SureColor S80600</h3>
            <p>Impresora de gran formato para profesionales.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <img src={Producto2} alt="SureColor 9000" className="w-full h-96 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h3 className="text-xl font-bold">SureColor 9000</h3>
            <p>La elección perfecta para impresiones de alta calidad.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <img src={Producto3} alt="SureColor F570" className="w-full h-96 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h3 className="text-xl font-bold">SureColor F570</h3>
            <p>Ideal para sublimación y proyectos creativos.</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProductosDestacados;