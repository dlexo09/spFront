import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "./Swiper2.css";

const BannerStreamingHome = () => {
  const [banners, setBanners] = useState(Array(6).fill(null)); // 6 vacíos

  useEffect(() => {
    fetch("/banners.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el archivo banners.json");
        }
        return res.json();
      })
      .then((data) => {
        const now = new Date();
        const activos = data
          .filter((b) => {
            if (b.status !== 1) return false;
            const inicio = new Date(b.fhInicio);
            const fin = new Date(b.fhFin);
            return now >= inicio && now <= fin;
          });

        let finalBanners = [];

        if (activos.length > 0) {
          // Si hay banners activos, repetirlos hasta llenar 6 espacios
          while (finalBanners.length < 6) {
            finalBanners = [...finalBanners, ...activos];
          }
          // Cortar a exactamente 6
          finalBanners = finalBanners.slice(0, 6);
        } else {
          // Si no hay banners activos, llenar con null
          finalBanners = Array(6).fill(null);
        }

        setBanners(finalBanners);
      })
      .catch((error) => {
        console.error("Error al cargar los banners:", error);
        setBanners(Array(6).fill(null));
      });
  }, []);

  return (
    <section className="productHome-section mx-auto mt-[60px] md:mt-[150px]">
      <div className="productHome-content">
        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-6 md:mb-9 text-strong-blue leading-8 sm:leading-10 md:leading-[40px]">Productos destacados</h1>
        {/* <p className="productHome-text">
          Conoce todo el catálogo disponible, y descubre por qué Siscoprint es tu mejor aliado.
        </p> */}
      </div>

      <div className="container swiper-container streamings-home">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={6}
          spaceBetween={-60}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
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
            0: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 3, spaceBetween: -200 },
            1024: { slidesPerView: 4, spaceBetween: -200 },
            1440: { slidesPerView: 5, spaceBetween: -60 },
          }}
        >
          {banners.map((banner, idx) => (
            <SwiperSlide key={idx}>
              {banner ? (
                <div className="swiper-img-container">
                  <img src={banner.imgUrl} alt={banner.title} className="w-full object-cover" />
                  <div className="swiper-content d-flex align-items-center flex-column justify-content-center">
                    <a href={`/product/${banner.sku}`} className="swiper-button">Conocer más</a>
                  </div>
                </div>
              ) : (
                <div className="swiper-img-container flex items-center justify-center bg-gray-200 h-64">
                  <span className="text-gray-400">Próximamente</span>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>


      <a
        href="/productos"
        className="inline-block mt-[50px] text-sm bg-sky-500 hover:bg-strong-blue text-white font-semibold uppercase px-6 py-3 md:px-8 md:py-3 rounded-full transition-colors duration-500 text-base md:text-lg"
      >
        Ver todos los productos
        <span
          className="inline-block align-middle mb-1 w-6 h-6 ml-2 bg-[url('/img/arrow-inpage.png')] bg-contain bg-no-repeat bg-center"
          aria-hidden="true"
        ></span>
      </a>
    </section>
  );
};

export default BannerStreamingHome;